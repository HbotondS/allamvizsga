from rest_framework import viewsets
from rest_framework.response import Response
from django.http import HttpRequest, HttpResponse, JsonResponse
from .models import ImageData, BigImageData
from .serializers import ImageSerializer, BigImageSerializer
from .utils import logging as log
from .utils import util
from .classes.histogram import Histogram
from .classes.grid import Grid
from os import listdir


grid = Grid([])


def index(request):
    return HttpResponse("Hello, world. You're at the polls index.")


def grid_response(start):
    big_img_data = BigImageData.objects.first()
    # -------
    stop = util.get_time()
    print('Load time: {0:.3}s'.format(stop - start))
    # -------
    return HttpResponse(big_img_data.image.url)


def big(request):
    log.info('big images')
    start = util.get_time()
    image_datas = list(ImageData.objects.all())
    # get request parameter named size
    # default value is the length of the list
    size = int(request.GET.get('size', len(image_datas)))
    image_datas = image_datas[:size]

    grid.image_datas = image_datas
    grid.gen_img()

    return grid_response(start)


def reverseImages(request):
    log.info('reverse images')
    start = util.get_time()
    grid.reverse()
    grid.gen_img()
    return grid_response(start)


def randomImages(request):
    log.info('random images') 
    start = util.get_time()
    grid.shuffle()
    grid.gen_img()
    return grid_response(start)


def histogram(request):
    log.info('histogram')
    # group images by date
    start = util.get_time()
    imglist = list(ImageData.objects.all())

    histogram = Histogram(imglist[:100])
    histogram.gen_img()    

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
    for filename in listdir(folder):
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
        size = int(request.GET.get('size', len(queryset)))
        queryset = queryset[:size]
        serializer = ImageSerializer(queryset, many=True)
        # todo: merge images into rows
        return Response(serializer.data)
