from django.contrib.auth.models import User
from core.models import Profile

admin_email = 'anvin12@gmail.com'

admin_user = User.objects.get(email=admin_email)
Profile.objects.update_or_create(user=admin_user, defaults={'role': 'admin'})
print("Admin profile set to role='admin'") 