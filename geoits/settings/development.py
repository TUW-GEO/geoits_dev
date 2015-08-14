# -*- coding: utf-8 -*-
from .base import *

DEBUG = True

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'geoits_db',
        'USER': 'geouser',
        'PASSWORD': 'geouser',
        'HOST': 'localhost',
        'PORT': '',
    }
}