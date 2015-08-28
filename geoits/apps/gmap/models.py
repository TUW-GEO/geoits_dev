from django.contrib.gis.db import models


class GMap(models.Model):
    name = models.CharField(max_length=50, blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True, auto_now=False)
    updated = models.DateTimeField(
        auto_now_add=False, auto_now=True, null=True)
    geom = models.PolygonField(null=True)
    objects = models.GeoManager()

    def __unicode__(self):
        return '%s' % (self.name)
