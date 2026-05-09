from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ('Custom Fields', {'fields': ('is_farmer', 'is_customer', 'phone_number', 'address')}),
    )

admin.site.register(User, CustomUserAdmin)
