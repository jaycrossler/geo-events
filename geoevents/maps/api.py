from django.contrib.auth.models import User
from geoevents.maps.models import Layer, Map, MapLayer
from tastypie import fields
from tastypie.authorization import Authorization, DjangoAuthorization
from tastypie.resources import ALL
from tastypie.contrib.gis.resources import ModelResource


class LayerResource(ModelResource):
    """
    Read only layer resource
    """

    class Meta:
        queryset = Layer.objects.filter()
        resource_name = 'layer'
        authorization = Authorization()
        allowed_methods = ['get']
        always_return_data = True
        filtering = {
            'id': ALL,
            'extent': ALL,
        }


class MapLayerResource(ModelResource):
    """
    Read-only map_layer m2m resource
    """
    layer = fields.ToOneField(LayerResource, 'layer', full=True)

    class Meta:
        queryset = MapLayer.objects.all()
        resource_name = 'map_layer'
        authorization = Authorization()
        allowed_methods = ['get']
        always_return_data = True


class MapResource(ModelResource):
    """
    Read-only map resource
    """
    map_layers = fields.ToManyField(MapLayerResource,
                                    attribute=lambda bundle: MapLayer.objects.filter(map=bundle.obj),
                                    full=True)

    class Meta:
        queryset = Map.objects.filter()
        resource_name = 'map'
        authorization = Authorization()
        allowed_methods = ['get']
        always_return_data = True
        filtering = {
            'id': ALL
        }
