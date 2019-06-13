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
    fixed_value = 0
    optimalangles_value = 0
    inclined_axis_value = 0
    inclined_optimum_value = 0
    vertical_axis_value = 0
    vertical_optimum_value = 0
    twoaxis_value = 0
    skiprows_value = 7
    if self.mounting == "fixed":
        fixed_value = 1
        optimalangles_value = 1
    elif self.mounting == "inclined_axis":
        inclined_axis_value = 1
        inclined_optimum_value = 1
    elif self.mounting == "vertical_axis":
        vertical_axis_value = 1
        vertical_optimum_value = 1
    else:
        twoaxis_value = 1
        skiprows_value = 6
    url = "http://re.jrc.ec.europa.eu/pvgis5/PVcalc.php"
    params = {
        "lat": self.latitude,
        "lon": self.longitude,
        "usehorizon": 1,
        "raddatabase": "PVGIS-SARAH",
        "peakpower": self.nominal_power,
        "pvtechchoice": self.pv_technology,
        "loss": self.system_losses,
        "fixed": fixed_value,
        "optimalangles": optimalangles_value,
        "inclined_axis": inclined_axis_value,
        "inclined_optimum": inclined_optimum_value,
        "vertical_axis": vertical_axis_value,
        "vertical_optimum": vertical_optimum_value,
        "twoaxis": twoaxis_value,
    }

    r = requests.get(url, params=params).text
    df = pd.read_csv(
        io.StringIO(r),
        error_bad_lines=False,
        usecols=[0, 2, 4, 6, 8, 10],
        engine="python",
        sep="\t",
        header=1,
        skiprows=skiprows_value,
        skipfooter=11,
    )

    annual_energy_yield = (df.iloc[12]["Em"] * 12) / self.nominal_power

    return annual_energy_yield


class Plant(models.Model):
    user = models.ForeignKey(User, related_name="plants")
    name = models.CharField(max_length=100)
    nominal_power = models.FloatField(validators=[MinValueValidator(0.0)])
    commissioning_date = models.DateField()
    feed_in_tariff = models.FloatField(
        validators=[MinValueValidator(0.0), MaxValueValidator(1.0)]
    )
    inverter_type = models.CharField(max_length=100, default="unknown")
    pv_technology = models.CharField(max_length=100, default="unknown")
    system_losses = models.FloatField(default=14.0)
    mounting = models.CharField(max_length=100, default="fixed")
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
    ecfl = 0

    # ecfr: the estimated cost to replace the module
    component_cost = 0
    if self.component == 1:
        if self.plant.pv_technology == "crystSi":
            component_cost = 0
        elif self.plant.pv_technology == "CIS":
            component_cost = 0
        elif self.plant.pv_technology == "CdTe":
            component_cost = 0
        else:
            component_cost = 0
    elif self.component == 4:
        if self.plant.inverter_type == "Unknown":
            component_cost = 0
        elif self.plant.inverter_type == "string_inverter":
            component_cost = 0
        elif self.plant.inverter_type == "central_inverter":
            component_cost = 0
    else:
        component_cost = 0

    ecfr = (
        self.plant.nominal_power * self.percentage * 10 ** -2 * (component_cost * 1000)
    )

    time_before_detect = 0
    return ecfl, ecfl_y, ecfr, performance_losses, time_before_detect


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
    ecfl = models.FloatField(default=0, editable=False)
    ecfl_y = models.FloatField(default=0, editable=False)
    ecfr = models.FloatField(default=0, editable=False)
    time_before_detect = models.FloatField(default=0.99999, editable=False)
    performance_losses = models.FloatField(default=0.00001, editable=False)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        self.ecfl, self.ecfl_y, self.ecfr, self.performance_losses, self.time_before_detect = ecfl_method(
            self
        )
        super(Failure, self).save()
