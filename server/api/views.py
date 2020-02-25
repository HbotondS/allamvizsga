from rest_framework import viewsets
from django.http import HttpRequest
from .models import Image
from .serializers import ImageSerializer


class ImageViewSet(viewsets.ModelViewSet):
    queryset = Image.objects.all()
    serializer_class = ImageSerializer

    def post(self, request, *args, **kwargs):
        image = request.data['image']
        folder = request.data['folder']
        Image.objects.create(name=name, image=image)
        return HttpRequest({'message': 'Image created'}, status=200)