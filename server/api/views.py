from rest_framework import viewsets
from rest_framework.response import Response
from django.http import HttpRequest, HttpResponse
from .models import ImageData, MergedImageData
from .serializers import ImageSerializer, MergedImageSerializer


class ImageViewSet(viewsets.ModelViewSet):
    queryset = ImageData.objects.all()
    serializer_class = ImageSerializer

    def post(self, request, *args, **kwargs):
        image = request.data['image']
        folder = request.data['folder']
        ImageData.objects.create(name=name, image=image)
        return HttpRequest({'message': 'Image created'}, status=200)

    def delete(self, request):
        ImageData.objects.all().delete()
        return HttpResponse(content='Images deleted', status=200)

    def list(self, request, pk=None):
        queryset = ImageData.objects.all()
        serializer = ImageSerializer(queryset, many=True)
        # todo: merge images into rows
        return Response(serializer.data)


class MergedImageViewSet(viewsets.ModelViewSet):
    queryset = MergedImageData.objects.all()
    serializer_class = MergedImageSerializer

    def list(self, request, pk=None):
        queryset = MergedImageData.objects.all()
        serializer = MergedImageSerializer(queryset, many=True)
        return Response(serializer.data)
