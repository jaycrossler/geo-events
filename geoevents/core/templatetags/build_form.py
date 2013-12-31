from django import template

register = template.Library()


def build_form(form):
    return {'form': form}


register.inclusion_tag('form.html')(build_form)