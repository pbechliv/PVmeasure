from rest_framework.viewsets import ModelViewSet
from .serializers import FailureSerializer
from .models import Failure


class FailureViewSet(ModelViewSet):
    """
    This viewset automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions.

    Additionally we also provide an extra `highlight` action.
    """

    serializer_class = FailureSerializer

    def get_queryset(self):
        if self.request.user.is_anonymous:
            queryset = Failure.objects.all().order_by("-created")
        else:
            queryset = Failure.objects.filter(user=self.request.user).order_by(
                "-created"
            )
        return queryset
