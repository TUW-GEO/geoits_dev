# -*- coding: utf-8 -*-
from django.conf.urls import include, url
from django.contrib.gis import admin
from .views import home, home_files
from geoits.apps.gmap.views import load

urlpatterns = [
    url(r'^admin/', include(admin.site.urls)),
    url(r'^$', home, name='home'),
    url(r'^gmap/test/$', 'geoits.apps.gmap.views.ajax'),
    url(r'^gmap/get_wiki/$', 'geoits.apps.gmap.views.get_wiki_content'),
    url(r'^gmap/load_polygons/', load),
    url(r'^gmap/', 'geoits.apps.gmap.views.map', name='map'),
    url(r'^wiki/', include('waliki.urls')),
    url(r'^(?P<filename>(robots.txt)|(humans.txt))$',
        home_files, name='home_files'),
    url(r'^accounts/', include('allauth.urls')),
]
