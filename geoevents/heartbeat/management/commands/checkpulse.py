from django.core.management.base import BaseCommand
from geoevents.heartbeat.models import Test, TestRun, run_tests


class Command(BaseCommand):
    help = 'Run tests'
    #args = "Test [...]"

    def handle(self, *args, **options):
        n = run_tests(in_test_run=True)
        self.stdout.write('{0} tests ran\n'.format(len(n)))

