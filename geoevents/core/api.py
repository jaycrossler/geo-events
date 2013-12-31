from django.contrib.auth.models import User
from tastypie.authorization import DjangoAuthorization
from tastypie.contrib.gis.resources import ModelResource


class UserResource(ModelResource):
    """
    Exposes user data in API.
    """
    class Meta:
        queryset = User.objects.all()
        resource_name = 'user'
        authorization = DjangoAuthorization()
        allowed_methods = []
        always_return_data = True
        fields = ['username']