from django.views.generic.base import TemplateView
from geoevents.common import menu
from geoevents.heartbeat.models import TestRun
from itertools import groupby, izip_longest


def grouper(n, iterable, padvalue=None):
    return izip_longest(*[iter(iterable)] * n, fillvalue=padvalue)


class StatusView(TemplateView):
    template_name = 'status.html'

    def get_context_data(self, **kwargs):
        context = super(StatusView, self).get_context_data(**kwargs)

        context['menu_items'] = menu('Status')

        queryset = []

        try:
            queryset = TestRun.objects.all().order_by('-created')[0]#.testrunresult_set.all().order_by('test__group')
            #queryset = izip_longest(groupby(queryset, lambda x:x.test.group))

        except IndexError:
            pass

        context['latest_test'] = queryset

        return context
