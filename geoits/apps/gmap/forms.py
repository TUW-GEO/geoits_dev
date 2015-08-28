from django.contrib.gis import forms
from geoits.apps.gmap.models import GMap


class GMapForm(forms.ModelForm):
    geom = forms.PolygonField(widget=forms.OSMWidget())

    class Meta:
        model = GMap
        fields = ['geom']
