from django.urls import path
from .views import LoginView, ProfileView, LeaveRequestViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('leave/', LeaveRequestViewSet.as_view({'get': 'list', 'post': 'create'}), name='leave'),
    path('leave/<int:pk>/', LeaveRequestViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='leave-detail'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
