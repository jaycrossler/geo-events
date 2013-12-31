from geoevents.core.models import Setting
import json


def app_settings(request):
    """Global values to pass to templates"""
    settings_dict = dict()
    settings = list()
    for obj in Setting.objects.all():
        settings_dict[obj.name.upper()] = obj.value
        settings += [
            {
                'name': obj.name,
                'value': obj.value
            }
        ]
    settings_dict['settings'] = json.dumps(settings)
    return dict(settings_dict)