from flask_sqlalchemy import SQLAlchemy
from flask_security import UserMixin,RoleMixin

db=SQLAlchemy()

class RolesUsers(db.Model):
    __tablename__ = 'roles_users'
    id = db.Column(db.Integer(), primary_key=True)
    user_id = db.Column('user_id', db.Integer(), db.ForeignKey('user.id'))
    role_id = db.Column('role_id', db.Integer(), db.ForeignKey('role.id'))


class User(db.Model, UserMixin):
    id=db.Column(db.Integer,primary_key=True)
    username=db.Column(db.String,unique=False)
    email=db.Column(db.String,unique=True)
    password=db.Column(db.String(255)) 
    active=db.Column(db.Boolean())#default=True
    fs_uniquifier=db.Column(db.String(255),unique=True,nullable=False)
    role_id=db.Column(db.String,db.ForeignKey('role.id'))
    login_time=db.Column(db.String)
    roles = db.relationship('Role', secondary='roles_users',backref=db.backref('users', lazy='dynamic'))
    items=db.relationship('category_items',back_populates='storemanager',cascade="all, delete-orphan")
    user_transactions=db.relationship('user_cart',back_populates='user',cascade="all, delete-orphan")

class Role(db.Model, RoleMixin):
    id=db.Column(db.Integer(),primary_key=True)
    name=db.Column(db.String(80),unique=True)
    description=db.Column(db.String(255))

class grocery_categories(db.Model):
    id=db.Column(db.Integer,primary_key=True)
    name=db.Column(db.String,nullable=False)
    description=db.Column(db.String)
    is_approved=db.Column(db.Boolean(),default=False)
    item=db.relationship('category_items',back_populates='category',cascade="all, delete-orphan")

class category_items(db.Model):
    id=db.Column(db.Integer,primary_key=True)
    name=db.Column(db.String,nullable=False)
    quantity_type=db.Column(db.String,nullable=False)
    rate_per_unit=db.Column(db.Integer,nullable=False)
    image_url=db.Column(db.String)
    quantity=db.Column(db.Integer,nullable=False)
    expiry_date=db.Column(db.Date,nullable=False)
    category_id=db.Column(db.Integer,db.ForeignKey('grocery_categories.id'),nullable=False)
    creator_id=db.Column(db.Integer,db.ForeignKey('user.id'),nullable=False)
    storemanager=db.relationship('User',back_populates='items')
    category=db.relationship('grocery_categories',back_populates='item')
    transactions=db.relationship('user_cart',back_populates='item')

class user_cart(db.Model):
    transaction_id=db.Column(db.Integer,primary_key=True)
    item_name=db.Column(db.String,nullable=False)
    item_quantity=db.Column(db.Integer,nullable=False)
    item_quantity_type=db.Column(db.String,nullable=False)
    status=db.Column(db.Boolean(),default=False)
    purchase_time=db.Column(db.String())
    amount=db.Column(db.Integer,nullable=False)
    user_id=db.Column(db.Integer,db.ForeignKey('user.id'))
    item_id=db.Column(db.Integer,db.ForeignKey('category_items.id'),nullable=False)
    user=db.relationship('User',back_populates='user_transactions')
    item=db.relationship('category_items',back_populates='transactions')

