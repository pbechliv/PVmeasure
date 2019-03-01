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

    # def get_queryset(self):
    #     if self.queryset:
    #         queryset = self.queryset
    #     else:
    #         queryset = MeasurementGroup.objects.filter(user=self.request.user)
    #     # if isinstance(queryset, QuerySet):
    #     #     # Ensure queryset is re-evaluated on each request.
    #     #     queryset = queryset
    #     return queryset


class MeasurementRecordingViewSet(ModelViewSet):
    """
    This viewset automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions.

    Additionally we also provide an extra `highlight` action.
    """

    serializer_class = MeasurementRecordingSerializer

    def get_queryset(self):

        group = request.GET.get("group", None)

        if self.queryset:
            queryset = self.queryset
        else:
            queryset = MeasurementRecording.objects.filter(group=group)
        # if isinstance(queryset, QuerySet):
        #     # Ensure queryset is re-evaluated on each request.
        #     queryset = queryset
        return queryset
