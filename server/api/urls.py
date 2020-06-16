from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('import_images', views.load_images),
    path('big/', views.big),
    path('random/', views.randomImages),
    path('reverse/', views.reverseImages),
    path('grid_data/', views.grid_data),
    path('histogram/', views.histogram),
]