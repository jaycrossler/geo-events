from django.core.management.base import BaseCommand, CommandError
from django.core.management import call_command

class Command(BaseCommand):
    #args = ''
    help = 'Runs a standard dumpdata process'

    def handle(self, *args, **options):
        models_to_exclude = ['auth.permission', 'contenttypes']

        options['exclude'] = [] if not options.get('exclude') else options.get('exclude')
        map(options['exclude'].append, models_to_exclude)
        options['natural']= True
        options['indent']= options.get('indent') or 4

        call_command('dumpdata',*args, **options)
        self.stdout.write('Successfully dumped the data.\n')
