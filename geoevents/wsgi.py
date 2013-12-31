import os
import sys
# used as starting points for various other paths
SITE_ROOT = os.path.dirname(os.path.realpath(__file__))

sys.path.append(SITE_ROOT)
os.environ['DJANGO_SETTINGS_MODULE'] = 'geoevents.settings'
import django.core.handlers.wsgi

application = django.core.handlers.wsgi.WSGIHandler()
