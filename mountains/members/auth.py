import datetime
from rest_framework.authtoken.models import Token

def create_authentication_token(user):
    """
    Custom token handling for drfpasswordless, allows us to expire tokens
    """
    token, newly_created = Token.objects.get_or_create(user=user)

    if not newly_created:
        # Check for expiry
        now = datetime.datetime.now(datetime.timezone.utc)
        if (now - token.created).days > 90:
            print('Expiring token!')
            token.delete()
            return Token.objects.get_or_create(user=user)
        else:
            return token, newly_created
    else:
        return token, newly_created
