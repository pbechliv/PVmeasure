from django.db import models
from django.contrib.postgres.fields import JSONField
from django.contrib.auth.models import User

# Create your models here.


def measurement_filepath(self, filename):
    url = "measurement_recording/{}_{}".format(self.pk, filename)
    return url


class MeasurementGroup(models.Model):
    user = models.ForeignKey(
        User, related_name="measurements", on_delete=models.CASCADE
    )
    name = models.CharField(max_length=250, blank=True, null=True)
    date = models.CharField(max_length=250, blank=True, null=True)
    comment = models.TextField(blank=True)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)


class MeasurementRecording(models.Model):
    group = models.ForeignKey(
        MeasurementGroup, related_name="recordings", on_delete=models.CASCADE
    )
    measuring_point = models.CharField(max_length=250)
    number = models.PositiveIntegerField(default=1)
    measurements = JSONField(default=list)
    polarity_test = models.BooleanField(default=False)
    image = models.ImageField(upload_to=measurement_filepath, blank=True)
    comment = models.TextField(blank=True)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
