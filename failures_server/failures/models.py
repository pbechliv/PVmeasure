from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MaxValueValidator, MinValueValidator
import requests
import pandas as pd
import io
import datetime
import numpy


def image_filepath(self, filename):
    url = "failures/{}_{}/".format(self.pk, filename)
    return url


# energy_yield
def pvgis_save(self):
    url = "http://re.jrc.ec.europa.eu/pvgis5/PVcalc.php"
    params = {
        "lat": self.latitude,
        "lon": self.longitude,
        "usehorizon": 1,
        "raddatabase": "PVGIS-SARAH",
        "peakpower": self.nominal_power,
        "pvtechchoice": "Unknown",
        "loss": 14,
        "fixed": 1,
        "optimalangles": 0,
        "inclined_axis": 0,
        "inclined_optimum": 0,
        "vertical_axis": 0,
        "vertical_optimum": 0,
        "twoaxis": 0,
    }

    r = requests.get(url, params=params).text
    df = pd.read_csv(
        io.StringIO(r),
        error_bad_lines=False,
        usecols=[0, 2, 4, 6, 8, 10],
        engine="python",
        sep="\t",
        header=1,
        skiprows=7,
        skipfooter=11,
    )

    annual_energy_yield = (df.iloc[12]["Em"] * 12) / self.nominal_power

    return annual_energy_yield


class Plant(models.Model):
    user = models.ForeignKey(User, related_name="plants", on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    nominal_power = models.FloatField(validators=[MinValueValidator(0.0)])
    commissioning_date = models.DateField()
    feed_in_tariff = models.FloatField(
        validators=[MinValueValidator(0.0), MaxValueValidator(1.0)]
    )
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
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        self.annual_energy_yield = pvgis_save(self)
        super(Plant, self).save(*args, **kwargs)


def ecfl_method(self):
    """
    calculates the time that we need to detect the failure
    """

    now = datetime.now()

    # number of operation years and months
    total_months = (
        (now.year - self.plant.commissioning_date.year) * 12
        + now.month
        - self.plant.commissioning_date.month
    )
    years = total_months // 12  # quotent
    performance_losses = numpy.random.normal(
        self.performance_losses_mean, self.performance_losses_sigma
    )
    if self.performance_losses_mean == 1:
        performance_losses = 1
    elif self.performance_losses_mean == 0:
        performance_losses = 0
    if performance_losses > 1:
        performance_losses = 0.999
    if performance_losses < 0:
        performance_losses = 0.001

    # ecfl: the estimated cost due to failure losses per year
    ecfl_y = (
        self.plant.nominal_power
        * self.plant.feed_in_tariff
        * self.plant.annual_energy_yield
        * 0.99 ** years
        * performance_losses
        * self.percentage
        * 10 ** -2
    )

    return ecfl_y


class Failure(models.Model):
    plant = models.ForeignKey(Plant, on_delete=models.CASCADE)
    spot = models.CharField(max_length=250, blank=True)
    component = models.IntegerField()
    sub_component = models.IntegerField()
    spot = models.CharField(max_length=250)
    performance_losses_mean = models.FloatField()
    performance_losses_sigma = models.FloatField()
    percentage = models.FloatField(
        validators=[MinValueValidator(0), MaxValueValidator(100)], default=0
    )
    ecfl_y = models.FloatField(default=0, editable=False)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        self.ecfl_y = ecfl_method(self)
        super(Failure, self).save()
