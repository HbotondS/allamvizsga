from django.db import models


def upload_path(instance, filename):
    return '/'.join(['images', str(instance.folder) , filename])


class Image(models.Model):
    folder = models.CharField(max_length=32, blank=False)
    image = models.ImageField(blank=False, null=False, upload_to=upload_path)


from django.db.models.signals import pre_delete
from django.dispatch.dispatcher import receiver

@receiver(pre_delete, sender=Image)
def mymodel_delete(sender, instance, **kwargs):
    # Pass false so FileField doesn't save the model.
    instance.image.delete(False)