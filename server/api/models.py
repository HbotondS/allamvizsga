from django.db import models

def upload_path(instance, filename):
    return '/'.join(['images', filename])

class Image(models.Model):
    name = models.CharField(max_length=32, blank=False)
    image = models.ImageField(blank=False, null=False, upload_to=upload_path)