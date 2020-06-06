from rest_framework import viewsets
from rest_framework.response import Response
from django.http import HttpRequest, HttpResponse, JsonResponse
from .models import ImageData, BigImageData
from .serializers import ImageSerializer, BigImageSerializer
import random
from math import ceil, sqrt
from .utils import logging as log
from .utils import util
import cv2
import threading
import os


IMAGE_SIZE = 50


def index(request):
    return HttpResponse("Hello, world. You're at the polls index.")


def multithread_imggen(big_img, index, row_length, imglist_len, imglist):
    images = []
    for i in range(1, row_length):
        if index < imglist_len:
            images.append(cv2.imread(imglist[index].index))
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

    blank = util.blank_image(shape=[50, big_img[0].shape[1] - big_img[row_len-1].shape[1], 3])
    big_img[row_len-1] = cv2.hconcat([big_img[row_len-1], blank])
    output = cv2.vconcat(big_img)
    cv2.imwrite('media/big.jpg', output)

    big_img_data = BigImageData.objects.first()
    # -------
    stop = util.get_time()
    print('Load time: {0:.3}s'.format(stop - start))
    # -------
    return HttpResponse(big_img_data.image.url)


def big(request):
    log.info('big images')
    start = util.get_time()
    imglist = list(ImageData.objects.all())
    # get request parameter named size
    # default value is the length of the list
    size = int(request.GET.get('size', len(imglist)))
    imglist = imglist[:size]
    return gen_img(imglist, start)


def reverseImages(request):
    log.info('reverse images')
    start = util.get_time()
    imglist = list(ImageData.objects.all())
    imglist = imglist[::-1]
    return gen_img(imglist, start)


def randomImages(request):
    log.info('random images') 
    start = util.get_time()
    imglist = list(ImageData.objects.all())
    random.shuffle(imglist)
    return gen_img(imglist, start)


# return the length of the longest element from the dictionary
def GetMaxFlow(dict):        
    pos=max(dict, key=lambda k: len(dict[k]))
    return len(dict[pos])


def histogram(request):
    log.info('histogram')
    # group images by date
    start = util.get_time()
    img_dict = {}
    imglist = list(ImageData.objects.all())
    for img_data in imglist:
        if img_data.date in img_dict:
            img_dict[img_data.date].append(img_data.index)
        else:
            img_dict[img_data.date] = [img_data.index]
    
    height = GetMaxFlow(img_dict)
    big_img = []
    x_offset = 0
    for i in img_dict:
        y_offset = 0
        column_img = util.blank_image(shape=[height * 50, 50, 3])
        for img_path in img_dict[i]:
            img = cv2.imread(img_path)
            column_img[column_img.shape[0]-(y_offset+1)*img.shape[0] : column_img.shape[0] - y_offset * img.shape[0],
                        0:column_img.shape[1]] = img
            y_offset += 1
        
        big_img.append(column_img)

    output = cv2.hconcat(big_img)
    cv2.imwrite('media/hist.jpg', output)

    big_img_data = BigImageData.objects.last()
    # -------
    stop = util.get_time()
    print('Load time: {0:.3}s'.format(stop - start))
    # -------
    return HttpResponse(big_img_data.image.url)


# load images from folder into the database
def load_images(request):
    start = util.get_time()

    data = util.process_json('media/ImageDataset.TwitterFDL2015.json')
    error_counter = 0

    folder = 'media/images/Twitter_2015_Imgs/'
    for filename in os.listdir(folder):
        img_id = filename[0:len(filename)-6]

        img_data = ImageData()
        img_data._id = img_id
        img_data.image = folder + filename
        img_data.index = 'media/images/index/' + filename
        try:
            img_data.date = util.convert_timestamp2date(data[img_id]['timestamp_ms'])

            img_data.save()
        except Exception as e:
            log.error('{} now found in JSON'.format(img_id))
            error_counter += 1

    log.error('number of errors: {}'.format(error_counter))
    return HttpResponse("Import done!")


class BigImageViewSet(viewsets.ModelViewSet):
    queryset = BigImageData.objects.all()
    serializer_class = BigImageSerializer


class ImageViewSet(viewsets.ModelViewSet):
    queryset = ImageData.objects.all()
    serializer_class = ImageSerializer

    def post(self, request, *args, **kwargs):
        image = request.data['image']
        index = request.data['index']
        date = request.data['date']
        ImageData.objects.create(name=name, image=image, date=date, index=index)
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