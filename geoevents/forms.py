from django import forms
from django.contrib.auth.models import User

class UserForm(forms.ModelForm):

    class Meta:
        fields = ('first_name', 'last_name', 'email')
        model = User