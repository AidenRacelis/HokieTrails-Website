"""WSGI entrypoint used by gunicorn in production.

The ``SERVICE`` environment variable selects which blueprint(s) to mount:
``auth``, ``trails``, ``housing`` or ``all`` (default).

    gunicorn -w 2 -b 0.0.0.0:5000 wsgi:app
"""

from hokietrails import create_app

app = create_app()
