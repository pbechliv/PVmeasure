from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MaxValueValidator, MinValueValidator


def image_filepath(self, filename):
    url = "failures/{}_{}/".format(self.pk, filename)
    return url


class Plant(models.Model):
    user = models.ForeignKey(User, related_name="plants")
    name = models.CharField(max_length=100)
    nominal_power = models.FloatField(validators=[MinValueValidator(0.0)])
    commissioning_date = models.DateField()
    feed_in_tariff = models.FloatField(
        validators=[MinValueValidator(0.0), MaxValueValidator(1.0)]
    )
    inverter_type = models.CharField(max_length=100, default="Unknown")
    pv_technology = models.CharField(max_length=100, default="Unknown")
    system_losses = models.FloatField(default=14.0)
    mounting = models.CharField(max_length=100, default="Fixed")
    longitude = models.DecimalField(
        max_digits=8,
        decimal_places=3,
        validators=[MinValueValidator(-15.00), MaxValueValidator(40.00)],
    )
    latitude = models.DecimalField(
        max_digits=8,
        decimal_places=3,
        validators=[MinValueValidator(26.00), MaxValueValidator(72.00)],
    )
    annual_energy_yield = models.FloatField(default=0)


class Failure(models.Model):
    user = models.ForeignKey(User, related_name="failures", on_delete=models.CASCADE)
    title = models.CharField(max_length=250, blank=True, null=True)
    image = models.ImageField(upload_to=image_filepath, blank=True, null=True)
    comment = models.TextField(blank=True)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
