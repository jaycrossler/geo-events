from django.forms import ModelForm
from geoevents.notes.models import Note


class NoteForm(ModelForm):
    class Meta:
        model = Note
        exclude = ('owner')


class NoteFormMinimal(ModelForm):
    class Meta:
        model = Note
        exclude = ('owner', 'content_type', 'object_id')
