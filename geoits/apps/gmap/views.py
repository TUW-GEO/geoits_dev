from django.shortcuts import render
from django.http import HttpResponse
from geoits.apps.gmap.forms import GMapForm
import json

# Create your views here.


def map(request):
    return render(request, 'geoits/gmap.html', {})


def ajax(request):
    if request.POST.has_key('geom'):
        form = GMapForm(request.POST or None)
        if form.is_valid():
            instance = form.save(commit=False)
            instance.save()
        return HttpResponse(json.dumps({'success': True,
                                        'server_response': "Thank You!"}),
                            content_type='application/javascript')
    else:
        return HttpResponse('Not Working!')