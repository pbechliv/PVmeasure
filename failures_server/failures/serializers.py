from .models import Failure, Plant
from rest_framework import serializers


class PlantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plant
        fields = "__all__"


class FailureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Failure
        fields = "__all__"
