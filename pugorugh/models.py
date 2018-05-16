from django.contrib.auth.models import User
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver


class UserPref(models.Model):
    user = models.OneToOneField(
        User,
        related_name='preferences',
        on_delete=models.CASCADE)
    age = models.TextField(max_length=100, blank=True)
    gender = models.CharField(max_length=10, blank=True)
    size = models.TextField(max_length=100, blank=True)


@receiver(post_save, sender=User)
def create_user_preferences(sender, instance, created, **kwargs):
    if created:
        UserPref.objects.create(user=instance)


@receiver(post_save, sender=User)
def save_user_preferences(sender, instance, **kwargs):
    instance.preferences.save()


class Dog(models.Model):
    name = models.CharField(max_length=30)
    image_filename = models.TextField(max_length=100)
    breed = models.CharField(max_length=30, blank=True)
    age = models.IntegerField()
    age_range = models.CharField(max_length=20, default=None)
    gender = models.CharField(max_length=20)
    size = models.CharField(max_length=20)
    user = models.ManyToManyField(User, through='UserDog')

    def save(self, *args, **kwargs):
        if self.age < 25:
            self.age_range = "b"
        elif self.age < 50:
            self.age_range = "y"
        elif self.age < 75:
            self.age_range = "a"
        else:
            self.age_range = "s"
        super(Dog, self).save(*args, **kwargs)


class UserDog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    dog = models.ForeignKey(Dog, on_delete=models.CASCADE)
    status = models.CharField(max_length=10)


class File(models.Model):
    file = models.FileField(blank=False, null=False)
