from rest_framework import viewsets
from rest_framework.response import Response
from django.http import HttpRequest, HttpResponse, JsonResponse
from .models import ImageData, MergedImageData
from .serializers import ImageSerializer, MergedImageSerializer
import logging
import random, json


logger = logging.getLogger(__name__)


def index(request):
    return HttpResponse("Hello, world. You're at the polls index.")


def merge_images(imageData, img):
    inserted = False
    result = MergedImageData.objects.filter(size__lt=50)
    logger.log('create merged image')
    if (not result):
        logger.log('create merged image')
        MergedImageData.objects.create(ids=imageData._id, size=1, image=img)
    


class ImageViewSet(viewsets.ModelViewSet):
    queryset = ImageData.objects.all()
    serializer_class = ImageSerializer

    def post(self, request, *args, **kwargs):
        image = request.data['image']
        date = request.data['date']
        ImageData.objects.create(name=name, image=image, date=date)
        # merge_images(imageData, request.data['image'])
        return HttpRequest({'message': 'Image created'}, status=200)

    def delete(self, request):
        ImageData.objects.all().delete()
        return HttpResponse(content='Images deleted', status=200)

    def list(self, request, pk=None):
        queryset = ImageData.objects.all()
        serializer = ImageSerializer(queryset, many=True)
        # todo: merge images into rows
        return Response(serializer.data)


def RandomImages(request):
    l = list(ImageData.objects.all().values_list('_id'))
    random.shuffle(l)
    return JsonResponse({'data': l})
    

class MergedImageViewSet(viewsets.ModelViewSet):
    queryset = MergedImageData.objects.all()
    serializer_class = MergedImageSerializer

    def list(self, request, pk=None):
        queryset = MergedImageData.objects.all()
        serializer = MergedImageSerializer(queryset, many=True)
        return Response(serializer.data)

