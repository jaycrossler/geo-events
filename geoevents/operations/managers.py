from django.contrib.gis.db import models

class ActiveObjects(models.GeoManager):
    def get_query_set(self):
        return super(ActiveObjects, self).get_query_set().filter(status=1)