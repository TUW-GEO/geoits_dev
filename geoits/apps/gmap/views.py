import json
from django.shortcuts import render
from django.http import HttpResponse
from django.contrib import messages
from django.utils.translation import ugettext_lazy as _
from geoits.apps.gmap.forms import GMapForm
from geoits.apps.gmap.models import GMap
from waliki.views import edit
from waliki.models import Page
from waliki.forms import PageForm
from waliki.signals import page_saved, page_moved, page_preedit
from waliki._markups import get_all_markups
import waliki.settings as settings


def load(request):
    objects = GMap.objects.all()

    polys = {}
    for obj in objects:
        polys[obj.id] = {'geom': obj.geom.coords,
                         'id': obj.id,
                         'srid': obj.geom.srid}
    return HttpResponse(json.dumps(polys),
                        content_type='application/javascript')


def get_wiki_content(request):
    slug = request.GET['id']
    page = Page.objects.get(slug=slug)
    return HttpResponse(json.dumps({'success': True,
                                    'title': page.title,
                                    'id': page.id,
                                    'raw': page.raw}),
                        content_type='application/javascript')


def map(request):
    return render(request, 'geoits/gmap.html', {})


def ajax(request):
    if request.POST.has_key('geom'):
        req_gmap = {'geom': request.POST['geom'],
                    'csrfmiddlewaretoken': request.POST['csrfmiddlewaretoken']}
        form = GMapForm(req_gmap or None)
        if form.is_valid():
            instance = form.save(commit=False)

        instance.save()
        create_waliki_page(request, slug=str(instance.id))
        return HttpResponse(json.dumps({'success': True,
                                        'id': instance.id,
                                        'server_response': "Thank You!"}),
                            content_type='application/javascript')
    else:
        create_waliki_page(request, slug=str(request.polygon_id))
        return HttpResponse(json.dumps({'success': True,
                                        'server_response': "Thank You!"}),
                            content_type='application/javascript')


def create_waliki_page(request, slug):
    slug = slug.strip('/')
    just_created = False
    try:
        page = Page.objects.get(slug=slug)
    except Page.DoesNotExist:
        page = Page.objects.create(markup=request.POST['markup'], slug=slug)
        page.raw = ""
        page_saved.send(sender=edit,
                        page=page,
                        author=request.user,
                        message=_("Page created"),
                        form_extra_data={})
        just_created = True

    original_markup = page.markup
    data = request.POST
    form_extra_data = {}
    receivers_responses = page_preedit.send(sender=edit, page=page)
    for r in receivers_responses:
        if isinstance(r[1], dict) and 'form_extra_data' in r[1]:
            form_extra_data.update(r[1]['form_extra_data'])

    form = PageForm(data, instance=page,
                    initial={'extra_data': json.dumps(form_extra_data)})
    if form.is_valid():
        page = form.save(commit=False)
        if page.markup != original_markup:
            old_path = page.path
            page.update_extension()
            msg = _("The markup was changed from {original} to {new}").format(
                original=original_markup, new=page.markup)
            page_moved.send(sender=edit,
                            page=page,
                            old_path=old_path,
                            author=request.user,
                            message=msg,
                            commit=False
                            )
            was_moved = True
        else:
            was_moved = False
        page.raw = form.cleaned_data['raw']
        page.save()
        try:
            receivers_responses = page_saved.send(sender=edit,
                                                  page=page,
                                                  author=request.user,
                                                  message=form.cleaned_data[
                                                      "message"],
                                                  form_extra_data=json.loads(
                                                      form.cleaned_data[
                                                          "extra_data"] or "{}"
                                                  ),
                                                  was_moved=was_moved)
        except Page.EditionConflict as e:
            messages.warning(request, e)
            return None

        for r in receivers_responses:
            if isinstance(r[1], dict) and 'messages' in r[1]:
                for key, value in r[1]['messages'].items():
                    getattr(messages, key)(request, value)

    cm_modes = [(m.name, m.codemirror_mode_name) for m in get_all_markups()]

    cm_settings = settings.WALIKI_CODEMIRROR_SETTINGS
    cm_settings.update({'mode': dict(cm_modes)[page.markup]})
    return None
