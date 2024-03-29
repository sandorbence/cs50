# Generated by Django 4.2.3 on 2023-09-09 15:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('recipes', '0007_category_allergen'),
    ]

    operations = [
        migrations.AlterField(
            model_name='allergen',
            name='name',
            field=models.CharField(blank=True, choices=[('celery', 'Celery'), ('gluten', 'Cereals containing gluten'), ('crustaceans', 'Crustaceans'), ('eggs', 'Eggs'), ('fish', 'Fish'), ('lupin', 'Lupin'), ('milk', 'Milk'), ('molluscs', 'Molluscs'), ('mustard', 'Mustard'), ('peanuts', 'Peanuts'), ('sesame', 'Sesame'), ('soybeans', 'Soybeans'), ('sulphur', 'Sulphur dioxide and sulphites'), ('tree nuts', 'Tree nuts')], default=None, max_length=30, null=True),
        ),
    ]
