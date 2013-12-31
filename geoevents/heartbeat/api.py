from tastypie import fields
from tastypie.authorization import Authorization
from tastypie.resources import ModelResource, Resource, ALL, ALL_WITH_RELATIONS
from geoevents.heartbeat.models import TestRunResult, TestRun


class TestRunResultsResource(Resource):
    class Meta:
        queryset = TestRunResult.objects.all()
        resource_name = 'test-run-result'


class TestRunResource(ModelResource):
    testrunresults = fields.ToOneField(TestRunResultsResource, 'testrun')

    class Meta:
        try:
            queryset = TestRun.objects.all().order_by('-created')[0]
        except IndexError:
            queryset = []

        resource_name = 'test-run-result'
        authorization = Authorization()
        allowed_methods = ['get']
