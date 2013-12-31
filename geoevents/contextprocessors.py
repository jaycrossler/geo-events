from django.conf import settings
from django.contrib.sites.models import Site
from geoevents.version import get_git_changeset, get_version


def resource_urls(request):
    """Global values to pass to templates"""

    site = Site.objects.get_current()

    return dict(
        CURRENT_API_VERSION = settings.CURRENT_API_VERSION,
        RFI_GENERATOR_URL = settings.RFI_GENERATOR_URL,
        SITE_NAME = site.name,
        SITE_DOMAIN = site.domain,
        SITE_TITLE = settings.SITE_TITLE,
        SITE_BRANDING_LOGO = settings.BRANDING_LOGO_URL,
        VERSION = get_version(),
    )