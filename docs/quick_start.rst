Quick Start Guide
=================

Develop a system that enables us to track issues with our products.
First idea is to combine a wiki with a map on which users can draw their problem areas.
 
 
Download GeoITS Project
-----------------------
 
First, you need to download the GeoITS from GitHub. 
 
 
Secret Django Key
-----------------
 
This boilerplate has the **DJANGO_KEY** setting variable hidden. 
 
You can generate your DJANGO_KEY |django_key|.
 
.. |django_key| raw:: html
    
    <a href="http://www.miniwebtool.com/django-secret-key-generator"
    target="_blank">here</a>
 
 
Project Name
------------
 
This project is named *GeoITS*, so if you are using this 
Boilerplate to create your own project, you'll have to change 
the name in a few places:
 
 - *geoits_project* **folder** (your top project container)
 - *geoits_project/geoits* **folder** (your project name)
 - virtual environment names: **geoits_dev** and **geoits_test** (name them whatever you want)
 - in virtual environments **postactivate** files (see section below), you have to change **geoits.settings.development** for your **projectname.settings.development**. Same works for the testing environment.
 
 
Virtual environments and Settings Files
---------------------------------------
 
First, you must know your Python path::
 
    $ which python
 
which is something similar to /usr/local/bin/python3.
 
Next, create a Development virtual environment with Python installed::
 
    $ mkvirtualenv --python=/usr/local/bin/python geoits_dev
 
where you might need to change it with your python path.
 
Go to the virtual enviornment folder with::
 
    $ cd $VIRTUAL_ENV/bin
 
and edit the postactivate file.:
 
    $ vi postactivate
 
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