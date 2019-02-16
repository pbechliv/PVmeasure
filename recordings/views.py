from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from .serializers import MeasurementGroupSerializer, MeasurementRecordingSerializer
from .serializers import MeasurementGroup, MeasurementRecording


class MeasurementGroupViewSet(ModelViewSet):
    """
    This viewset automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions.

    Additionally we also provide an extra `highlight` action.
    """

    queryset = MeasurementGroup.objects.all()
    serializer_class = MeasurementGroupSerializer


class MeasurementRecordingViewSet(ModelViewSet):
    """
    This viewset automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions.

    Additionally we also provide an extra `highlight` action.
    """

    queryset = MeasurementRecording.objects.all()
    serializer_class = MeasurementRecordingSerializer

