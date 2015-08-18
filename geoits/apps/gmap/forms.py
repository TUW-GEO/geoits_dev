from django.contrib.gis import forms
from geoits.apps.gmap.models import GMap


class GMapForm(forms.ModelForm):
    geom = forms.GeometryCollectionField(srid=4326, widget=forms.OSMWidget())

    class Meta:
        model = GMap
        fields = ['geom']
