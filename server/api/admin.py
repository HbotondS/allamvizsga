from django.contrib import admin

from .models import ImageData, MergedImageData

admin.site.register(ImageData)
admin.site.register(MergedImageData)