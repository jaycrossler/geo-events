Geo-Events
=======

Geo-Events is a geographic tool to enable tracking and organizing of geographic events through a web framework.

API
===

    JSON of geographic layers
    http://127.0.0.1:8000/api/v1/layer/?format=json&limit=100


Installation
============

Startup steps: (about 1 hour total)

    For older macs, Install XCode, update to latest, From Preferences->Downloads, install command line tools (or will get clang errors)

    (open terminal window)
    sudo easy_install pip
    Download Postgres.app (google it. After installing, run it - should see an Elephant icon on the toolbar)
    sudo pip install virtualenv
    virtualenv geoevents_dev
    add to: ~/.bash_login:
        export PATH=/Applications/Postgres93.app/Contents/MacOS/bin:/Library/Frameworks/Python.framework/Versions/Current/bin:$PATH
        export PGHOST=localhost
        export LDFLAGS="-L/usr/X11/lib"
        export CFLAGS="-I/usr/X11/include -I/usr/X11/include/freetype2 -I/usr/X11/include/libpng12"

        source geoevents_dev/bin/activate
    (close terminal, open new one)

    pip install psycopg2
    pip install numpy
    install homebrew (from terminal):
        ruby -e "$(curl -fsSL https://raw.github.com/mxcl/homebrew/go/install)"

    brew install postgis
    brew install gdal (probably already installed)
    brew install libgeoip

    pip install Paver

    paver install_dependencies
    paver create_db
    paver create_db_user
    paver sync
    python manage.py createsuperuser

    paver start
