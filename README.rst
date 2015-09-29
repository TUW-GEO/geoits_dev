Welcome to GeoITS's documentation!
======================================

**Geo Issue Tracking System**!!

Django 1.8.3 and Python 2.7!


Requirements
============

The requirements necessary to use this Django Project Boilerplate are:

- **GeoDjango**
- **Miniconda**
- **python** and **pip**
- **Virtual Environmen**


Quick Start Guide
=================

Download GeoITS
----------------------------------------------

First, you need to download it from GitHub, as a zip file or using your terminal::

    $ git clone https://github.com/TUW-GEO/geoits_dev.git

This will download the repository in your current direcotry.

Secret Django Key
-----------------

This boilerplate has the **DJANGO_KEY** setting variable hidden. 

You can generate your DJANGO_KEY http://www.miniwebtool.com/django-secret-key-generator

Keep reading to include your new Django key into your project.


Virtual environments and Settings Files
---------------------------------------

First, you must know your Python path::

    $ which python

which is something similar to /usr/local/bin/python.
for Miniconda is /home/user/miniconda/bin/python

Next, create a Development virtual environment with Python installed::

    $ conda create -n geoits_dev 

Also, create a Test virtual environment with Python installed::

    $ conda create -n geoits_test Django==1.8.3

where you might need to change it with your python path.

You must add the lines to **activate** file:
- *activate path* ~/miniconda/envs/geoits_dev/bin
::
    export SECRET_KEY="your_secret_django_key"

with your own secret key.

Next, edit the **deactivate** file and add the line::

    unset SECRET_KEY

Do the same thing to geoits_test environment.

Next, install the packages in environment::

    $ source geoits_dev
    $ pip install -r requirements/development.txt
    $ source geoits_test
    $ pip install -r requirements/testing.txt

**!** If you got an error for *gdal* and *psycopg2*, install it with conda::

    $ conda install psycopg2=2.6
    $ conda install gdal=2.0.0

GeoDjango Installation 
-----------------------
Installing Geospatial libraries: (These are required for PostgreSQL database)::

    **GEOS** https://docs.djangoproject.com/en/1.8/ref/contrib/gis/install/geolibs/#geos
    **PROJ.4** https://docs.djangoproject.com/en/1.8/ref/contrib/gis/install/geolibs/#proj4
    **PostGIS** https://docs.djangoproject.com/en/1.8/ref/contrib/gis/install/postgis/

PostgreSQL Tools
----------------
Download pgAdmin here:
    http://www.pgadmin.org/download/index.php


Run Server
-----------
Next, apply the basic migrations::

    $ python manage.py validate
    $ python manage.py migrate

And check that everything works by starting the server::

    $ python manage.py runserver


Create a Twitter Application
-----------------------------

Create a new Twitter Application from https://apps.twitter.com/app/new with::

    Website: http://127.0.0.1:8000 (twitter doesn’t allow localhost as an url)
    Callback Url: http://127.0.0.1:8000/accounts/twitter/login/callback/
    Change this domain by your domain name in production, if applicable.

Next, create an Allauth social application in http://127.0.0.1:8000/admin/socialaccount/socialapp/add/ with::

    Provider: Twitter
    Name: Twitter (or something similar)
    Client ID: Your Twitter app Consumer Key (API Key)
    Secret Key: Your Twitter app Consumer Secret (API Secret)
    Sites: Select the corresponding site

Both Consumer Key and Secret will be found in the Keys and Access Tokens tab.
