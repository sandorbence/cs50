# Generated by Django 4.2.3 on 2023-09-08 16:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('recipes', '0006_recipe_favorites'),
    ]

    operations = [
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(choices=[('breakfast', 'Breakfast'), ('lunch', 'Lunch'), ('dinner', 'Dinner'), ('dessert', 'Dessert'), ('drinks', 'Drinks'), ('snacks', 'Snacks and Appetizers'), ('vegetarian', 'Vegetarian'), ('vegan', 'Vegan'), ('glutenfree', 'Gluten-free'), ('dairyfree', 'Dairy-free'), ('keto', 'Keto'), ('paleo', 'Paleo')], default='snacks', max_length=30)),
                ('recipe', models.ManyToManyField(related_name='categories', to='recipes.recipe')),
            ],
        ),
        migrations.CreateModel(
            name='Allergen',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, choices=[('celery', 'Celery'), ('gluten', 'Cereals containing gluten'), ('crustaceans', 'Crustaceans'), ('eggs', 'Eggs'), ('fish', 'Fish'), ('lupin', 'Lupin'), ('milk', 'Milk'), ('molluscs', 'Molluscs'), ('mustard', 'Mustard'), ('peanuts', 'Peanuts'), ('sesame', 'Sesame'), ('soybeans', 'Soybeans'), ('sulphur', 'Sulphur dioxide and sulphites'), ('tree nuts', 'Tree nuts')], max_length=30, null=True)),
                ('recipe', models.ManyToManyField(related_name='allergens', to='recipes.recipe')),
            ],
        ),
    ]
