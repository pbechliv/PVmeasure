from rest_framework.viewsets import ModelViewSet
from .serializers import FailureSerializer, PlantSerializer
from .models import Failure, Plant


class PlantViewSet(ModelViewSet):
    serializer_class = PlantSerializer

    def get_queryset(self):
        if self.request.user.is_anonymous:
            queryset = Plant.objects.all().order_by("-created")
        else:
            queryset = Plant.objects.filter(user=self.request.user).order_by("-created")
        return queryset


class FailureViewSet(ModelViewSet):
    serializer_class = FailureSerializer

    def get_queryset(self):
        plant = self.request.query_params.get("plant", None)
        if plant:
            queryset = Failure.objects.filter(plant=plant).order_by("-created")
        else:
            queryset = Failure.objects.all().order_by("-created")

        return queryset
