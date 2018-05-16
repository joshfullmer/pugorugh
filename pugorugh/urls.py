from django.urls import path, re_path
from django.views.generic import TemplateView
from django.views.generic.base import RedirectView
from rest_framework.urlpatterns import format_suffix_patterns
from rest_framework.authtoken.views import obtain_auth_token

from . import views

app_name = 'pugorugh'

# API endpoints
urlpatterns = format_suffix_patterns([
    path('api/user/preferences/',
         views.RetrieveUpdateUserPref.as_view(),
         name='user_preferences'),
    path('api/user/login/',
         obtain_auth_token,
         name='login_user'),
    path('api/dog/create/',
         views.CreateDog.as_view(),
         name='create_dog'),
    re_path(r'api/dog/(?P<pk>-?\d+)/'
            '(?P<status>liked|disliked|undecided)/next/',
            views.RetrieveUpdateDog.as_view(),
            name='next'),
    re_path(r'api/dog/(?P<pk>-?\d+)/'
            '(?P<status>liked|disliked|undecided)/',
            views.RetrieveUpdateDog.as_view(),
            name='update'),
    path('api/dog/<int:pk>/delete/',
         views.DeleteDog.as_view(),
         name='delete_dog'),
    path('file/upload/', views.FileView.as_view(), name='file_upload'),
    path('favicon.ico',
         RedirectView.as_view(
            url='/static/icons/favicon.ico',
            permanent=True
         )),
    path('', TemplateView.as_view(template_name='index.html'))
])
