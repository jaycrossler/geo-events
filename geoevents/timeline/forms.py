from django import forms
from geoevents.timeline.models import TimelineItem


class TimelineItemForm(forms.ModelForm):
    class Meta:
        model = TimelineItem
        fields = ('start', 'end', 'content', 'visible')