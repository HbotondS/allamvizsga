from rest_framework import serializers
from .models import ImageData


class ImageSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = ImageData
        fields = ['folder', 'image']
