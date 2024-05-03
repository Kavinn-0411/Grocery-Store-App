from flask_security import SQLAlchemyUserDatastore
from .models import db,Role,User
datastore=SQLAlchemyUserDatastore(db,User,Role)