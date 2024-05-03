from .models import User,grocery_categories,category_items,user_cart
from .sec import datastore
from .instances import cache

@cache.memoize(timeout=1800)
def user_email(email):
    return datastore.find_user(email=email,active=True)
