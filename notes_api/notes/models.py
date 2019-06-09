from django.db import models
from django.contrib.auth.models import User


def image_filepath(self, filename):
    url = "notes/{}_{}/".format(self.pk, filename)
    return url


class Note(models.Model):
    user = models.ForeignKey(User, related_name="notes", on_delete=models.CASCADE)
    title = models.CharField(max_length=250, blank=True, null=True)
    image = models.ImageField(upload_to=image_filepath, blank=True, null=True)
    comment = models.TextField(blank=True)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
