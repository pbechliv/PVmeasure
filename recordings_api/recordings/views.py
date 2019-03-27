from rest_framework.viewsets import ModelViewSet
from .serializers import MeasurementGroupSerializer, MeasurementRecordingSerializer
from .serializers import MeasurementGroup, MeasurementRecording


class MeasurementGroupViewSet(ModelViewSet):
    """
    This viewset automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions.

    Additionally we also provide an extra `highlight` action.
    """

    serializer_class = MeasurementGroupSerializer

    def get_queryset(self):
        if self.request.user.is_anonymous:
            queryset = MeasurementGroup.objects.all().order_by("-created")
        else:
            queryset = MeasurementGroup.objects.filter(user=self.request.user).order_by(
                "-created"
            )
        return queryset


class MeasurementRecordingViewSet(ModelViewSet):
    """
    This viewset automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions.

    Additionally we also provide an extra `highlight` action.
    """

    serializer_class = MeasurementRecordingSerializer

    def get_queryset(self):

        group = self.request.GET.get("group", None)

        if self.request.user.is_anonymous:
            queryset = MeasurementRecording.objects.all().order_by("-created")
        else:
            queryset = MeasurementRecording.objects.filter(group=group).order_by(
                "-created"
            )
        return queryset
