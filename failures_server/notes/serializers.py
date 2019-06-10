from .models import Note
from rest_framework import serializers


class FailureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = "__all__"
