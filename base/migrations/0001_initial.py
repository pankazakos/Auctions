# Generated by Django 4.1 on 2022-10-17 17:10

from django.conf import settings
import django.contrib.auth.models
import django.contrib.auth.validators
import django.core.validators
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='CustomUser',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('username', models.CharField(error_messages={'unique': 'A user with that username already exists.'}, help_text='Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.', max_length=150, unique=True, validators=[django.contrib.auth.validators.UnicodeUsernameValidator()], verbose_name='username')),
                ('first_name', models.CharField(blank=True, max_length=150, verbose_name='first name')),
                ('last_name', models.CharField(blank=True, max_length=150, verbose_name='last name')),
                ('is_staff', models.BooleanField(default=False, help_text='Designates whether the user can log into this admin site.', verbose_name='staff status')),
                ('is_active', models.BooleanField(default=True, help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.', verbose_name='active')),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined')),
                ('UserId', models.CharField(max_length=150, unique=True)),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('is_approved', models.BooleanField(default=False)),
                ('Phone_Number', models.CharField(max_length=12, unique=True, validators=[django.core.validators.MinLengthValidator(12)])),
                ('TIN', models.CharField(max_length=9, unique=True, validators=[django.core.validators.MinLengthValidator(9)])),
                ('Country', models.CharField(max_length=50)),
                ('Location', models.CharField(max_length=100)),
                ('Latitude', models.FloatField(null=True)),
                ('Longitude', models.FloatField(null=True)),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.permission', verbose_name='user permissions')),
            ],
            options={
                'verbose_name': 'user',
                'verbose_name_plural': 'users',
                'abstract': False,
            },
            managers=[
                ('objects', django.contrib.auth.models.UserManager()),
            ],
        ),
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('Name', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='Item',
            fields=[
                ('ItemID', models.BigAutoField(primary_key=True, serialize=False)),
                ('Name', models.CharField(max_length=100)),
                ('Currently', models.FloatField()),
                ('Buy_Price', models.FloatField(null=True)),
                ('First_Bid', models.FloatField()),
                ('Number_Of_Bids', models.IntegerField()),
                ('Started', models.DateTimeField(null=True)),
                ('Ends', models.DateTimeField(null=True)),
                ('Active', models.BooleanField(default=False)),
                ('Description', models.TextField(null=True)),
                ('Seller', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('categories', models.ManyToManyField(to='base.category')),
            ],
        ),
        migrations.CreateModel(
            name='VisitsAndRecom',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('visits', models.IntegerField()),
                ('score', models.FloatField(default=0.0)),
                ('ItemID', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='base.item')),
                ('UserId', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Bid',
            fields=[
                ('BidID', models.BigAutoField(primary_key=True, serialize=False)),
                ('Time', models.DateTimeField(auto_now=True)),
                ('Amount', models.FloatField()),
                ('Bidder', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('ItemID', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='base.item')),
            ],
        ),
    ]
