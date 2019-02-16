from .models import MeasurementRecording, MeasurementGroup
from rest_framework import serializers


class MeasurementGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = MeasurementGroup
        fields = "__all__"


class MeasurementRecordingSerializer(serializers.ModelSerializer):
    class Meta:
        model = MeasurementRecording
        fields = "__all__"
