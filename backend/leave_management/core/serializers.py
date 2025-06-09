from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile, LeaveRequest

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    
    class Meta:
        model = Profile
        fields = ['user', 'role']

class LeaveRequestSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = LeaveRequest
        fields = ['id', 'username', 'leave_type', 'start_date', 'end_date', 'reason', 'status']
