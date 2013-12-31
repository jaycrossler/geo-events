from django import template

register = template.Library()


@register.filter('field_class')
def field_class(ob):
    """
    Returns the class of the field
    """
    return ob.__class__.__name__