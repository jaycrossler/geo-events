from django.db import models
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes import generic
from django.contrib.auth.models import User
from django.core.urlresolvers import reverse
from tinymce.models import HTMLField
import json


class Note(models.Model):
    """ 
    This is the model for a Note. Notes have a required Title, Content, 
    and owner (which is a django.contrib.auth.models.User)

    """
    title = models.CharField(max_length=255)
    content = HTMLField(blank=True)
    public = models.BooleanField(default=True, help_text="Allow everyone to read this?", blank=True)
    owner = models.ForeignKey(User)
    created = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)
    content_type = models.ForeignKey(ContentType)
    object_id = models.PositiveIntegerField()
    content_object = generic.GenericForeignKey('content_type', 'object_id')

    def __unicode__(self):
        return u'[{0}] {1}'.format(self.owner.username, self.title)

    class Meta:
        ordering = ['-last_updated', ]

    def get_absolute_url(self):
        return reverse('notes-view-note', args=[self.id])

    def note_info(self):
        return {
            "title": self.title,
            "url": str(self.get_absolute_url()),
            "edit_url": str(self.get_edit_url()),
            "content": self.content,
            "posted_date": str(self.last_updated),
            "posted_by": str(self.owner),
        }

    def note_json(self):
        return json.dumps(self.note_info(), skipkeys=True, default={})

    def get_edit_url(self):
        return reverse('notes-manage-note-id', args=[self.id])