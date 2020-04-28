from rest_framework import serializers
from .models import ImageData, BigImageData


class ImageSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = ImageData
        fields = ['_id', 'date', 'image']


class BigImageSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = BigImageData
        fields = ['image']
