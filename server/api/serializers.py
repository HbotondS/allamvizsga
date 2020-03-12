from rest_framework import serializers
from .models import ImageData, MergedImageData


class ImageSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = ImageData
        fields = ['_id', 'date', 'image']


class MergedImageSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = MergedImageData
        fields = ['ids', 'image']
