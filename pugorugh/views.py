from django.contrib.auth import get_user_model
from django.core.exceptions import ObjectDoesNotExist
from django.http import Http404
from rest_framework import generics, viewsets, status
from rest_framework.decorators import permission_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from . import models, serializers


@permission_classes((AllowAny, ))
class UserViewSet(viewsets.ModelViewSet):
    queryset = get_user_model().objects.all()
    serializer_class = serializers.UserSerializer


class RetrieveUpdateUserPref(generics.RetrieveUpdateAPIView):
    queryset = models.UserPref.objects.all()
    serializer_class = serializers.UserPrefSerializer

    def get_object(self):
        user = self.request.user
        return models.UserPref.objects.get(user=user)


class RetrieveUpdateDog(generics.RetrieveUpdateAPIView):
    queryset = models.Dog.objects.all()
    serializer_class = serializers.DogSerializer

    def get_object(self, *args, **kwargs):
        r = self.kwargs.get('status')[0]
        pk = int(self.kwargs.get('pk'))
        userpref = models.UserPref.objects.get(user=self.request.user)
        age = userpref.age.split(',')
        gender = userpref.gender.split(',')
        size = userpref.size.split(',')

        if pk < 0:
            status_exists = models.UserDog.objects.filter(
                user=self.request.user)
            if not status_exists:
                dog_list = models.Dog.objects.all()
                for dog in dog_list:
                    models.UserDog.objects.create(
                        user=self.request.user,
                        dog=dog,
                        status='u')
        dog_list = self.get_queryset().filter(
            userdog__status=r,
            age_range__in=age,
            gender__in=gender,
            size__in=size,
            user=self.request.user)

        if dog_list:
            try:
                dog = dog_list.filter(id__gt=pk)[:1].get()
            except ObjectDoesNotExist:
                dog = dog_list.first()
            return dog
        else:
            raise Http404

    def put(self, request, *args, **kwargs):
        r = self.kwargs.get('status')[0]
        pk = int(self.kwargs.get('pk'))
        dog = self.get_queryset().get(id=pk)
        userdog = models.UserDog.objects.get(user=self.request.user, dog=dog)
        userdog.status = r
        userdog.save()
        dog = serializers.DogSerializer(dog)
        return Response(dog.data)


class CreateDog(generics.CreateAPIView):
    queryset = models.Dog.objects.all()
    serializer_class = serializers.DogSerializer

    def perform_create(self, serializer):
        dog = serializer.save()
        models.UserDog.objects.create(
            user=self.request.user,
            dog=dog,
            status='u')


class DeleteDog(generics.DestroyAPIView):
    queryset = models.Dog.objects.all()


class FileView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        file_serializer = serializers.FileSerializer(data=request.data)
        if file_serializer.is_valid():
            file_serializer.save()
            return Response(
                file_serializer.data,
                status=status.HTTP_201_CREATED)
        else:
            return Response(
                file_serializer.errors,
                status=status.HTTP_400_BAD_REQUEST)
