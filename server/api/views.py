from rest_framework import viewsets
from rest_framework.response import Response
from django.http import HttpRequest, HttpResponse, JsonResponse
from .models import ImageData, BigImageData
from .serializers import ImageSerializer, BigImageSerializer
import random
from PIL import Image
from math import ceil, sqrt


def index(request):
    return HttpResponse("Hello, world. You're at the polls index.")


def gen_img(imglist):
    imglist_len = len(imglist)
    # calculate how many image can fit in a row
    # to display the images in a square
    row_len = ceil(sqrt(imglist_len))

    big_img = Image.new('RGB', (50*row_len, 50*row_len))
    index = 0
    # used to merge images verticaly
    y_offset = 0
    for i in range(row_len):
        row_img = Image.new('RGB', (50*row_len, 50))
        # used to merge images verticaly
        x_offset = 0
        for j in range(row_len):
            # if we iterated through the images
            # we can send back the generated image
            if index == imglist_len:
                res = HttpResponse(content_type="image/jpeg")
                big_img.save(res, "JPEG")
                return res
            img = Image.open(imglist[index].image)
            row_img.paste(img, (x_offset, 0))
            x_offset += img.size[0]
            index += 1
        
        big_img.paste(row_img, (0, y_offset))
        y_offset += row_img.size[1]


def big(request):
    imglist = list(ImageData.objects.all())
    return gen_img(imglist)


def randomImages(request):
    imglist = list(ImageData.objects.all())
    random.shuffle(imglist)
    return gen_img(imglist)


# return the length of the longest element from the dictionary
def GetMaxFlow(dict):        
    pos=max(dict, key=lambda k: len(dict[k]))
    return len(dict[pos])


def histogram(request):
    # print('test logging')
    # group images by date
    img_dict = {}
    imglist = list(ImageData.objects.all())
    for img_data in imglist:
        if img_data.date in img_dict:
            img_dict[img_data.date].append(img_data.image)
        else:
            img_dict[img_data.date] = [img_data.image]
    
    height = GetMaxFlow(img_dict)
    big_img = Image.new('RGB', (50*len(img_dict), 50*height))
    x_offset = 0
    for i in img_dict:
        y_offset = 0
        column_img = Image.new('RGB', (50, 50*height))
        for j in img_dict[i]:
            img = Image.open(j)
            column_img.paste(img, (0, y_offset))
            y_offset += img.size[1]
        
        big_img.paste(column_img, (x_offset, 50*(height - len(img_dict[i]))))
        x_offset += column_img.size[0]

    res = HttpResponse(content_type="image/jpeg")
    big_img.save(res, "JPEG")
    return res


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