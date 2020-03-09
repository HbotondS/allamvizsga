from django.db import models
from django_resized import ResizedImageField


def upload_path(instance, filename):
    return '/'.join(['images', str(instance.folder) , filename])


class ImageData(models.Model):
    folder = models.CharField(max_length=32, blank=False)
    image = ResizedImageField(blank=False, null=False, upload_to=upload_path, size=[50, 50])


from django.db.models.signals import pre_delete
from django.dispatch.dispatcher import receiver

@receiver(pre_delete, sender=ImageData)
def mymodel_delete(sender, instance, **kwargs):
    # Pass false so FileField doesn't save the model.
    instance.image.delete(False)