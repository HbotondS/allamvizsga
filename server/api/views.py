from rest_framework import viewsets
from rest_framework.response import Response
from django.http import HttpRequest, HttpResponse, JsonResponse
from .models import ImageData, BigImageData
from .serializers import ImageSerializer, BigImageSerializer
import random
from PIL import Image
from math import ceil, sqrt
import timeit
import cv2
import os
import numpy as np
import threading


IMAGE_SIZE = 50


def index(request):
    return HttpResponse("Hello, world. You're at the polls index.")


def multithread_imggen(big_img, index, row_length, imglist_len, imglist):
    images = []
    for i in range(1, row_length):
        if index < imglist_len:
            images.append(cv2.imread(imglist[index].image.path))
            index += 1
        else:
            break

    big_img.append(cv2.hconcat(images))


def gen_img(imglist, start):
    imglist_len = len(imglist)
    # calculate how many image can fit in a row
    # to display the images in a square
    row_len = ceil(sqrt(imglist_len))

    big_img = []
    index = 0
    # creating thread 
    threads = []
    for i in range(row_len-1):
        threads.append(threading.Thread(target=multithread_imggen, args=(big_img, i*row_len, row_len, imglist_len, imglist)))

    for i in range(row_len-1):
        threads[i].start()

    for i in range(row_len-1):
        # waiting the threads to finish
        threads[i].join()

    multithread_imggen(big_img, (row_len-1) * row_len, row_len, imglist_len, imglist)

    blank = np.zeros(shape=[50, big_img[0].shape[1] - big_img[row_len-1].shape[1], 3], dtype=np.uint8)
    big_img[row_len-1] = cv2.hconcat([big_img[row_len-1], blank])
    output = cv2.vconcat(big_img)
    cv2.imwrite('big.jpg', output)
    res = HttpResponse(content_type="image/jpeg")
    big = Image.open('big.jpg')
    big.save(res, 'JPEG')
    os.remove('big.jpg')
    # -------
    stop = timeit.default_timer()
    print('Time: ', stop - start)
    # -------
    return res


def big(request):
    start = timeit.default_timer()
    imglist = list(ImageData.objects.all())
    print(len(imglist))
    return gen_img(imglist, start)


def reverseImages(request):
    start = timeit.default_timer()
    imglist = list(ImageData.objects.all())
    imglist = imglist[::-1]
    return gen_img(imglist, start)


def randomImages(request):    
    start = timeit.default_timer()
    imglist = list(ImageData.objects.all())
    random.shuffle(imglist)
    return gen_img(imglist, start)


# return the length of the longest element from the dictionary
def GetMaxFlow(dict):        
    pos=max(dict, key=lambda k: len(dict[k]))
    return len(dict[pos])


def histogram(request):
    # print('test logging')
    # group images by date
    start = timeit.default_timer()
    img_dict = {}
    imglist = list(ImageData.objects.all())
    for img_data in imglist:
        if img_data.date in img_dict:
            img_dict[img_data.date].append(img_data.image)
        else:
            img_dict[img_data.date] = [img_data.image]
    
    height = GetMaxFlow(img_dict)
    big_img = Image.new('RGB', (IMAGE_SIZE*len(img_dict), IMAGE_SIZE*height))
    x_offset = 0
    for i in img_dict:
        y_offset = 0
        column_img = Image.new('RGB', (IMAGE_SIZE, IMAGE_SIZE*height))
        for j in img_dict[i]:
            img = Image.open(j)
            column_img.paste(img, (0, y_offset))
            y_offset += img.size[1]
        
        big_img.paste(column_img, (x_offset, IMAGE_SIZE*(height - len(img_dict[i]))))
        x_offset += column_img.size[0]

    res = HttpResponse(content_type="image/jpeg")
    big_img.save(res, "JPEG")
    # -------
    stop = timeit.default_timer()
    print('Time: ', stop - start)
    # -------
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