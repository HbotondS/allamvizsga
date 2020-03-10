from rest_framework import serializers
from .models import ImageData, MergedImageData


class ImageSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = ImageData
        fields = ['folder', '_id', 'image']


class MergedImageSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = MergedImageData
        fields = ['ids', 'image']
