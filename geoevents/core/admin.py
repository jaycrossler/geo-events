from django.contrib.gis import admin
from geoevents.core.models import Setting


class SettingAdmin(admin.ModelAdmin):
    list_display = ['name', 'value']


admin.site.register(Setting, SettingAdmin)

