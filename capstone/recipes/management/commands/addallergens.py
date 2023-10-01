from django.core.management.base import BaseCommand
from recipes.models import Allergen
from recipes.choices import ALLERGENS


class Command(BaseCommand):
    help = "Create predefined allergens"

    def handle(self, *args, **options):
        for allergen_value, allergen_name in ALLERGENS:
            allergen, created = Allergen.objects.get_or_create(
                name=allergen_value)
            
            if created:
                self.stdout.write(self.style.SUCCESS(
                    f'Successfully created Allergen: {allergen}'))
            else:
                self.stdout.write(self.style.SUCCESS(
                    f'Allergen already exists: {allergen}'))
