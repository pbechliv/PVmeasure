# Generated by Django 2.2.1 on 2019-06-09 10:15

from django.db import migrations, models
import notes.models


class Migration(migrations.Migration):

    dependencies = [
        ('notes', '0002_auto_20190519_0921'),
    ]

    operations = [
        migrations.AddField(
            model_name='note',
            name='image',
            field=models.ImageField(blank=True, null=True, upload_to=notes.models.image_filepath),
        ),
    ]