from rest_framework import viewsets
from rest_framework.response import Response
from django.http import HttpRequest, HttpResponse, JsonResponse
from django.core.files import File
from .models import ImageData, BigImageData
from .serializers import ImageSerializer, BigImageSerializer
import random, json
from PIL import Image
from io import BytesIO


def index(request):
    return HttpResponse("Hello, world. You're at the polls index.")


def big(request):
    imglist = list(ImageData.objects.all())
    new_img = Image.new('RGB', (50*50, len(imglist) * 50))
    y_offset = 0
    img = Image.open(imglist[0].image)
    new_img.paste(img, (0, y_offset))
    for i in range(1, len(imglist)):
        img = Image.open(imglist[i].image)
        y_offset += img.size[1]
        new_img.paste(img, (0, y_offset))

    res = HttpResponse(content_type="image/jpeg")
    new_img.save(res, "JPEG")
    return res


def randomImages(request):
    imglist = list(ImageData.objects.all())
    random.shuffle(imglist)
    new_img = Image.new('RGB', (50*50, len(imglist) * 50))
    y_offset = 0
    img = Image.open(imglist[0].image)
    new_img.paste(img, (0, y_offset))
    for i in range(1, len(imglist)):
        img = Image.open(imglist[i].image)
        y_offset += img.size[1]
        new_img.paste(img, (0, y_offset))

    res = HttpResponse(content_type="image/jpeg")
    new_img.save(res, "JPEG")
    return res


def histogram(request):
    # todo: implement histogram generation after refactoring of the image store
    return None


class BigImageViewSet(viewsets.ModelViewSet):
    queryset = BigImageData.objects.all()
    serializer_class = BigImageSerializer


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
    ids = list(ImageData.objects.all().values_list('_id', flat=True))
    l = []
    for i in range(len(ids)):
        l = l + (ids[i].split(','))
    random.shuffle(l)
    return JsonResponse({'data': l})