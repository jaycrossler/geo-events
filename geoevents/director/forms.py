from django.forms import ModelForm
from .models import Report, Actions, Billet

class ReportForm(ModelForm):
    class Meta:
        model = Report
        exclude = ('owner','rating_count')

class ReportFormMinimal(ModelForm):
    class Meta:
        model = Report
        exclude = ('owner', 'content_type', 'object_id')

class ActionForm(ModelForm):
    class Meta:
        model = Actions
        exclude = ('owner','rating_count')

class BilletForm(ModelForm):
    class Meta:
        model = Billet
