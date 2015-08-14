# -*- coding: utf-8 -*-
from .base import *

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

# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.sqlite3',
#         'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
#     }
# }

FIXTURE_DIRS = (
    os.path.join(BASE_DIR, 'fixtures'),
    )