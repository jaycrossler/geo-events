from django.conf.urls import patterns, url
from geoevents.heartbeat.views import StatusView


urlpatterns = patterns('',
                       url(r'^$', StatusView.as_view(), name='heartbeat-view-status'),
)
