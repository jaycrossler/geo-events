from django.views.generic.detail import DetailView


class TimelineView(DetailView):
    pass
#    model = Timeline
#    queryset = Timeline.objects.all()
#    template_name = 'timeline-detail.html'
#    context_object_name = 'timeline'
#
#    def get_context_data(self, **kwargs):
#        cv = super(TimelineView, self).get_context_data(**kwargs)
#        cv['menu_items'] = menu('')
#        cv['team_on_call'] = team_on_call()
#        return cv