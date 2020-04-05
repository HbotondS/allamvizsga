from django.db import models
from django_resized import ResizedImageField
import random
import string


def upload_path(instance, filename):
    return '/'.join(['images', filename])


def random_id():
    return ','.join([''.join(random.choices(string.ascii_uppercase + string.digits, k=10)) for _ in range(50)])


class ImageData(models.Model):
    _id = models.CharField(max_length=256, default=random_id)
    date = models.CharField(null=False, max_length=600)
    image = models.ImageField(blank=False, null=False, upload_to=upload_path)


class MergedImageData(models.Model):
    ids = models.CharField(blank=False, max_length=1500)
    size = models.IntegerField()
    image = models.ImageField(upload_to='images/merged')


from django.db.models.signals import pre_delete
from django.dispatch.dispatcher import receiver

@receiver(pre_delete, sender=ImageData)
@receiver(pre_delete, sender=MergedImageData)
def mymodel_delete(sender, instance, **kwargs):
    # Pass false so FileField doesn't save the model.
    instance.image.delete(False)