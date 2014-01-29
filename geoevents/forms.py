# This technical data was produced for the U. S. Government under Contract No. W15P7T-13-C-F600, and
# is subject to the Rights in Technical Data-Noncommercial Items clause at DFARS 252.227-7013 (FEB 2012)

from django import forms
from django.contrib.auth.models import User

class UserForm(forms.ModelForm):

    class Meta:
        fields = ('first_name', 'last_name', 'email')
        model = User