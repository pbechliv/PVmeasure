from rest_framework.viewsets import ModelViewSet
from .serializers import NoteSerializer
from .models import Note


class NoteViewSet(ModelViewSet):
    """
    This viewset automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions.

    Additionally we also provide an extra `highlight` action.
    """

    serializer_class = NoteSerializer

    def get_queryset(self):
        user = self.request.GET.get("user", None)
        queryset = Note.objects.filter(user=user).order_by("-created")
        return queryset
