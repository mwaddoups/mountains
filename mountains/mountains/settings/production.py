from .base import *

DEBUG = False
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True

CORS_ALLOWED_ORIGINS = []

ALLOWED_HOSTS = ["clydemc.org", "www.clydemc.org", "localhost"]

SECRET_KEY = os.environ["SECRET_KEY"]

# Database
# https://docs.djangoproject.com/en/3.2/ref/settings/#databases

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "HOST": "localhost",
        "PORT": 5432,
        "NAME": "mountains",
        "USER": os.environ["PG_USER"],
        "PASSWORD": os.environ["PG_PASS"],
    }
}

EMAIL_BACKEND = "anymail.backends.mailgun.EmailBackend"

ANYMAIL = {
    "MAILGUN_API_KEY": os.environ["MAILGUN_API_KEY"],
    "MAILGUN_API_URL": "https://api.eu.mailgun.net/v3",
    "MAILGUN_SENDER_DOMAIN": "mg.clydemc.org",
}

USE_X_FORWARDED_HOST = True
FORCE_SCRIPT_NAME = "/api"
DEFAULT_FROM_EMAIL = "noreply@clydemc.org"
SERVER_EMAIL = "noreply-server@clydemc.org"

MEDIA_ROOT = "/var/www/html/media"
