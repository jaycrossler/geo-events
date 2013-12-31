from django.contrib.auth.backends import RemoteUserBackend
from django.contrib.auth.middleware import RemoteUserMiddleware


class CaseInsensitiveRemoteUserBackend(RemoteUserBackend):
    def clean_username(self, username):
        """
        Takes the first 30 characters of the username and converts to lowercase.
        """
        return username[:30].lower()


class GeoAxisRemoteUserMiddleware(RemoteUserMiddleware):
    """
    Stores the custom HTTP header for GeoAxis.
    """
    header = 'HTTP_OAM_REMOTE_USER'
