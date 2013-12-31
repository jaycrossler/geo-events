from django.contrib.gis import admin
from geoevents.notes.models import Note
from datetime import datetime


class NoteAdmin(admin.ModelAdmin):
    model = Note
    date_hierarchy = 'last_updated'
    list_display = ['title', 'owner', 'last_updated', 'public']
    list_filter = ['owner', 'last_updated', 'public']


admin.site.register(Note, NoteAdmin)
