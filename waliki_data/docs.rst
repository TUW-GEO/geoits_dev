Welcome to GeoITS's documentation!
======================================

**Geo Issue Tracking System**!!

Django 1.8.3 and Python 2.7!


Requirements
============

The requirements necessary to use this Django Project Boilerplate are:

- **python** and **pip**
- **virtualenv and virtualenvwrapper**
- **Firefox** (to use Selenium's Webdriver in functional Tests)

You can download Firefox from the official web page: https://www.mozilla.org


Quick Start Guide
=================

Download GeoITS Django Project Boilerplate
----------------------------------------------

First, you need to download it from GitHub, as a zip file or using your terminal::

    $ git clone https://github.com/iMilad/geoits_dev.git

This will download the repository in your current direcotry.

Secret Django Key
-----------------

This boilerplate has the **DJANGO_KEY** setting variable hidden. 

You can generate your DJANGO_KEY http://www.miniwebtool.com/django-secret-key-generator

Keep reading to include your new Django key into your project.

Project Name
------------

This project is named *GeoITS*, so if you are using this 
Boilerplate to create your own project, you'll have to change 
the name in a few places:

 - *geoits_project* **folder** (your top project container)
 - *geoits_project/geoits* **folder** (your project name)
 - virtual environment names: **geoits_dev** and **geoits_test** (name them whatever you want)
 - in virtual environments **postactivate** files (see section below), you have to change **geoits.settings.development** for your **projectname.settings.development**. Same works for the testing environment.
 - in *geoits_project/geoits* edit the file **wsgi.py** and change **"geoits.settings"** accordingly.
 - in *geoits_project/geoits/settings* edit the **base.py** file and change the declarations of **ROOT_URLCONF** and **WSGI_APPLICATION**


Virtual environments and Settings Files
---------------------------------------

First, you must know your Python path::

    $ which python

which is something similar to /usr/local/bin/python.

Next, create a Development virtual environment with Python installed::

    $ mkvirtualenv --python=/usr/local/bin/python geoits_dev

where you might need to change it with your python path.

Go to the virtual environment folder with::

    $ cd $VIRTUAL_ENV/bin

and edit the postactivate file::

    $ emacs postactivate

You must add the lines: ::

    export DJANGO_SETTINGS_MODULE="geoits.settings.development"
    export SECRET_KEY="your_secret_django_key"

with your project name and your own secret key.

Next, edit the **predeactivate** file and add the line::

    unset SECRET_KEY

Repeat the last steps for your testing environment::

    $ mkvirtualenv --python=/usr/local/bin/python geoits_test
    $ cd $VIRTUAL_ENV/bin
    $ vi postactivate

where you have to add the lines::

    export DJANGO_SETTINGS_MODULE="geoits.settings.testing"
    export SECRET_KEY="your_secret_django_key"

and in the predeactivate file::

    unset SECRET_KEY

Next, install the packages in each environment::

    $ workon geoits_dev
    $ pip install -r requirements/development.txt
    $ workon geoits_test
    $ pip install -r requirements/testing.txt

Next, apply the basic migrations::

    $ python manage.py validate
    $ python manage.py migrate

And check that everything works by starting the server::

    $ python manage.py runserver