from django.contrib.auth.models import User
from core.models import Profile

username = 'employee'
password = 'employee123'
email = 'employee@example.com'

if not User.objects.filter(username=username).exists():
    employee = User.objects.create_user(username=username, password=password, email=email)
    Profile.objects.create(user=employee, role='employee')
    print(f"Employee user created: username='{username}', password='{password}'")
else:
    print(f"User '{username}' already exists.") 