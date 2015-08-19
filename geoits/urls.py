# -*- coding: utf-8 -*-
from django.conf.urls import include, url
from django.contrib.gis import admin
from .views import home, home_files

urlpatterns = [
    url(r'^admin/', include(admin.site.urls)),
    url(r'^$', home, name='home'),
    url(r'^gmap/test/$', 'geoits.apps.gmap.views.ajax'),
    url(r'^gmap/', 'geoits.apps.gmap.views.map', name='map'),
    url(r'^wiki/', include('waliki.urls')),
    url(r'^(?P<filename>(robots.txt)|(humans.txt))$',
        home_files, name='home_files'),
    url(r'^accounts/', include('allauth.urls')),
]


# from django.conf import settings
# from django.conf.urls.static import static

# if settings.DEBUG:
#     urlpatterns += static(settings.STATIC_URL,
#                           document_root=settings.STATIC_ROOT)
