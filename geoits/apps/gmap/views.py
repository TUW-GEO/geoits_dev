from django.shortcuts import render
from django.http import HttpResponse
from geoits.apps.gmap.forms import GMapForm
from geoits.apps.gmap.models import GMap
import json


def load(request):
    objects = GMap.objects.all()

    polys = {}
    for obj in objects:
        polys[obj.id] = {'geom': obj.geom.coords,
                         'id': obj.id,
                         'srid': obj.geom.srid}
    return HttpResponse(json.dumps(polys),
                        content_type='application/javascript')


def map(request):
    return render(request, 'geoits/gmap.html', {})


def ajax(request):
    if request.POST.has_key('geom'):
        form = GMapForm(request.POST or None)
        if form.is_valid():
            instance = form.save(commit=False)
            instance.save()
        return HttpResponse(json.dumps({'success': True,
                                        'id': instance.id,
                                        'server_response': "Thank You!"}),
                            content_type='application/javascript')
    else:
        return HttpResponse('Not Working!')
