# Generated by Django 5.1.1 on 2025-03-11 15:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("app", "0003_imageupload_predicted_label"),
    ]

    operations = [
        migrations.AddField(
            model_name="imageupload",
            name="onfidence",
            field=models.FloatField(blank=True, null=True),
        ),
    ]
