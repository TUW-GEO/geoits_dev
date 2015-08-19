# -*- coding: utf-8 -*-
from django.contrib import admin
from django.contrib.gis import admin as gisadmin
from geoits.apps.gmap import models
from geoits.apps.gmap.forms import GMapForm

# Register your models here.


@admin.register(models.GMap)
class MapAdmin(gisadmin.OSMGeoAdmin):

    list_display = ("timestamp", "geom")
    form = GMapForm
