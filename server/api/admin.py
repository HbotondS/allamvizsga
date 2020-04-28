from django.contrib import admin

from .models import ImageData, BigImageData

admin.site.register(ImageData)
admin.site.register(BigImageData)