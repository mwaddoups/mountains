from .base import *

DEBUG = True

# Database
# https://docs.djangoproject.com/en/3.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# We include session authentication
REST_FRAMEWORK['DEFAULT_AUTHENTICATION_CLASSES'] = tuple(
    ['rest_framework.authentication.SessionAuthentication'] +
    list(REST_FRAMEWORK['DEFAULT_AUTHENTICATION_CLASSES'])
)