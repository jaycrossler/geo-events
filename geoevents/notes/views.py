from django.views.generic.edit import CreateView
from django.contrib.contenttypes.models import ContentType
from django.core.urlresolvers import reverse_lazy
from geoevents.notes.forms import NoteForm, NoteFormMinimal
from geoevents.notes.models import Note


class NoteCreateView(CreateView):
    '''Displays and processes a view to create new notes without requiring the user to set the content_type or object_id.'''

    model = Note
    form_class = NoteForm

    def form_valid(self, form):
        form.instance.owner = self.request.user

        if self.kwargs.get('pk'):
            form.instance.object_id = self.kwargs['pk']

        if self.kwargs.get('model'):
            form.instance.content_type = ContentType.objects.get(model=self.kwargs['model'])

        return super(NoteCreateView, self).form_valid(form)

    def get(self, request, *args, **kwargs):
        self.object = None

        if self.kwargs.get('pk') and self.kwargs.get('model'):
            self.form_class = NoteFormMinimal
        else:
            self.form_class = NoteForm

        return super(NoteCreateView, self).get(request, *args, **kwargs)

    def get_success_url(self):
        if 'source_url' in self.kwargs:
            success_url = self.kwargs['source_url'] or reverse_lazy('home')
        else:
            success_url = reverse_lazy('home')
        success_url = "/" + str(success_url)
        return success_url