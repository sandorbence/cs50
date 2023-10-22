# Generated by Django 4.2.6 on 2023-10-22 20:20

from django.conf import settings
import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('recipes', '0012_alter_category_recipes'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='allergen',
            name='recipes',
        ),
        migrations.AddField(
            model_name='recipe',
            name='allergens',
            field=models.ManyToManyField(blank=True, related_name='recipes', to='recipes.allergen'),
        ),
        migrations.AddField(
            model_name='recipe',
            name='category',
            field=models.CharField(choices=[('breakfast', 'Breakfast'), ('lunch', 'Lunch'), ('dinner', 'Dinner'), ('dessert', 'Dessert'), ('drinks', 'Drinks'), ('snacks', 'Snacks and Appetizers'), ('vegetarian', 'Vegetarian'), ('vegan', 'Vegan'), ('glutenfree', 'Gluten-free'), ('dairyfree', 'Dairy-free'), ('keto', 'Keto'), ('paleo', 'Paleo')], default='snacks', max_length=30),
        ),
        migrations.AlterField(
            model_name='ingredient',
            name='name',
            field=models.CharField(max_length=100, validators=[django.core.validators.MaxLengthValidator(100)]),
        ),
        migrations.AlterField(
            model_name='ingredient',
            name='quantity',
            field=models.CharField(max_length=20),
        ),
        migrations.AlterField(
            model_name='recipe',
            name='favorites',
            field=models.ManyToManyField(blank=True, related_name='favorite_recipes', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='recipe',
            name='preparation',
            field=models.CharField(max_length=5000, validators=[django.core.validators.MaxLengthValidator(5000)]),
        ),
        migrations.AlterField(
            model_name='recipe',
            name='title',
            field=models.CharField(max_length=100, validators=[django.core.validators.MaxLengthValidator(100)]),
        ),
        migrations.DeleteModel(
            name='Category',
        ),
    ]
