
from flask import jsonify
from flask_restful import Resource,Api, marshal,reqparse,fields,marshal_with,inputs
from flask_security import auth_required,roles_required,current_user
from werkzeug.security import generate_password_hash
from .models import User,db,grocery_categories,category_items,user_cart
from sqlalchemy import and_, or_,update,select,distinct,func
from .sec import datastore
from datetime import datetime

api=Api(prefix='/api')

parser=reqparse.RequestParser()
parser1=reqparse.RequestParser()
parser2=reqparse.RequestParser()
item_parser=reqparse.RequestParser()
user_parser=reqparse.RequestParser()
edit_category=reqparse.RequestParser()
edit_item=reqparse.RequestParser()

parser.add_argument('name',type=str,help='Category name should be string',required=True)
parser.add_argument('description',type=str,help='String must be',required=True)


parser1.add_argument('username',type=str,help='Topic should be a string',required=True)
parser1.add_argument('email',type=str,help='String must be',required=True)
parser1.add_argument('password',type=str,help='String should be',required=True)

parser2.add_argument('username',type=str,help='Topic should be a string')
parser2.add_argument('email',type=str,help='String must be',required=True)
parser2.add_argument('password',type=str,help='String should be',required=True)


item_parser.add_argument('name',type=str,required=True)
item_parser.add_argument('quantity_type',type=str,required=True)
item_parser.add_argument('rate_per_unit',type=int,required=True)
item_parser.add_argument('quantity',type=int,required=True)
item_parser.add_argument('image_url',type=str)
item_parser.add_argument('expiry_date',type=inputs.date,required=True)


user_parser.add_argument('item_quantity',type=int,required=True)

edit_category.add_argument('name',type=str,help='Category name should be string',required=True)
edit_category.add_argument('description',type=str,help='Describe about the category in two words',required=True)

edit_item.add_argument('name',type=str,required=True)
edit_item.add_argument('quantity_type',type=str,required=True)
edit_item.add_argument('rate_per_unit',type=int,required=True)
edit_item.add_argument('quantity',type=int,required=True)
edit_item.add_argument('image_url',type=str)
edit_item.add_argument('expiry_date',type=inputs.date,required=True)


class Creator(fields.Raw):
    def format(self,user):
        return user.email

class Date(fields.Raw):
    def format(self,value):
        return value.strftime('%Y/%m/%d')
    
user_fields={
    "id":fields.Integer,
    "email":fields.String,
    "roles":fields.List(fields.String),
    "active":fields.Boolean
}

category_fields={
    "id":fields.Integer,
    "name":fields.String,
    "description":fields.String,
    "creator":Creator,
    "is_approved":fields.Boolean
}

user_transaction_fields={
    "transaction_id":fields.Integer,
    "item_name":fields.String,
    "item_quantity":fields.Integer,
    "item_quantity_type":fields.String,  
    "status":fields.Boolean,
    "amount":fields.Integer,
    "user_id":fields.Integer,
    "item_id":fields.Integer
}

item_fields={
    "id":fields.Integer,
    "name":fields.String,
    "quantity_type":fields.String,
    "rate_per_unit":fields.Integer,
    "quantity":fields.Integer,
    "expiry_date":Date,
    "image_url":fields.String,
    "category_id":fields.Integer
}



class Category(Resource):
    @auth_required("token")
    def get(self):
       
        category=grocery_categories.query.all()
           
        if len(category)>0:
            return {"data":marshal(category,category_fields),"message":"Categories Found"}
        else:
            return jsonify({"message":"No categories found"})


       
        
    @auth_required("token")
    @roles_required("store_manager")
    def post(self):
        args=parser.parse_args()
        category=grocery_categories(name=args.get("name"),description=args.get("description"))
        db.session.add(category)
        db.session.commit()
        return{"message":"Category Created!"}

api.add_resource(Category,'/category_creation')

class User_Registration(Resource):
    def post(self):
        args=parser1.parse_args()
        datastore.create_user(username=args.get("username"),email=args.get("email"),password=generate_password_hash(args.get("password")),roles=["user"])
        db.session.commit()
        return{"message":"User Created!"}
    
    @auth_required("token")
    @roles_required("admin")
    def get(self):
        users=User.query.filter(User.id!=1).all()
        if len(users)>0:
            return marshal(users,user_fields)
        else:
            return jsonify({"message":"No users found"})



api.add_resource(User_Registration,'/user_register')

class StoreManager_Registration(Resource):
    def post(self):
        args=parser2.parse_args()
        datastore.create_user(username=args.get("username"),email=args.get("email"),password=generate_password_hash(args.get("password")),roles=["store_manager"],active=False)
        db.session.commit()
        return{"message":"StoreManager Created!Wait for activation from admin!"}

api.add_resource(StoreManager_Registration,'/storemanager_register')

class Category_Item(Resource):
    @auth_required("token")
    def get(self,cat_id):
       
        item=category_items.query.where(category_items.category_id==cat_id,category_items.creator_id==current_user.id).all()
           
        if len(item)>0:
            return marshal(item,item_fields)
        else:
            return jsonify({"message":"No such item found"})
        
    @auth_required("token")
    @roles_required("store_manager")
    def post(self,cat_id):
        args=item_parser.parse_args()
        item=category_items(name=args.get("name"),quantity_type=args.get("quantity_type"),rate_per_unit=args.get("rate_per_unit"),quantity=args.get("quantity"),expiry_date=args.get("expiry_date"),image_url=args.get("image_url"),category_id=cat_id,creator_id=current_user.id)
        db.session.add(item)
        db.session.commit()
        return{"message":"Item Created!"}
    
api.add_resource(Category_Item,'/create_item/<int:cat_id>')


class User_Item(Resource):
    @auth_required("token")
    def get(self,cat_id):
        item=category_items.query.where(category_items.category_id==cat_id).with_entities( category_items.name,func.avg(category_items.rate_per_unit).label('rate_per_unit'),func.sum(category_items.quantity).label('quantity'),category_items.quantity_type,category_items.category_id,category_items.image_url).group_by(category_items.name).all()
        if(len(item)>0):
            return marshal(item,item_fields)
        else:
            return{"message":"No items added!"},404
    
api.add_resource(User_Item,'/get_item/<int:cat_id>')

class User_Cart(Resource):
    @auth_required("token")
    @roles_required("user")
    def post(self,itemname):
        quantity=user_parser.parse_args().get("item_quantity")
        item=category_items.query.where(category_items.name==itemname).with_entities( category_items.name,func.avg(category_items.rate_per_unit).label('rate_per_unit'),func.sum(category_items.quantity).label('quantity'),category_items.quantity_type,category_items.category_id,category_items.image_url).group_by(category_items.name).first()
        if(item.quantity>=quantity):
            t=user_cart(item_name=itemname,item_quantity=quantity,item_quantity_type=item.quantity_type,amount=quantity*item.rate_per_unit,user_id=current_user.id,item_id=item.category_id,purchase_time=datetime.now())
            db.session.add(t)
            db.session.commit()
            return {"message":"Added to cart!!"}
        else:
            return{"message":"Quantity not available!"}
    
api.add_resource(User_Cart,'/user_cart/<itemname>')

class User_Transaction(Resource):
    @auth_required("token")
    @roles_required("user")
    def post(self):
        transactions=user_cart.query.filter(and_(user_cart.user_id==current_user.id,user_cart.status==False)).all()
        for t in transactions:
            items=category_items.query.filter(category_items.name==t.item_name).order_by(category_items.expiry_date.asc())
            req_quantity=t.item_quantity
            for item in items:
                if (req_quantity<=item.quantity):
                    new_quanity=item.quantity-req_quantity
                    item_update=update(category_items).where(category_items.id==item.id).values(quantity=new_quanity)
                    db.session.execute(item_update)
                    t.status=True
                    db.session.commit()
                elif(item.quantity>0):
                    req_quantity=req_quantity-item.quantity
                    db.session.delete(item)
                    db.session.commit()
            if(req_quantity!=0):
                return {"message":f"Required quantity for item {t.item_name} not available!!"}
            else:
                return{"message":"Purchase Successfull!!"}
                
            
api.add_resource(User_Transaction,'/user_purchase')

class Edit_Category(Resource):
    def post(self,id):
        args=edit_category.parse_args()
        update1=update(grocery_categories).where(grocery_categories.id==id).values(name=args.name,description=args.description)
        db.session.execute(update1)
        db.session.commit()
        return{"message":"Updated!"}

api.add_resource(Edit_Category,'/edit_category/<int:id>')

class Edit_Item(Resource):
    def post(self,id):
        args=edit_item.parse_args()
        update1=update(category_items).where(category_items.id==id).values(name=args.name,quantity_type=args.quantity_type,rate_per_unit=args.rate_per_unit,quantity=args.quantity,image_url=args.image_url,expiry_date=args.expiry_date)
        db.session.execute(update1)
        db.session.commit()
        return{"message":"Updated!"}

api.add_resource(Edit_Item,'/edit_item/<int:id>')

class Filter_item(Resource):
    @auth_required("token")
    @roles_required("user")
    def post(self,id,cat_id):
        
        if(id==1):
            item=category_items.query.where(category_items.category_id==cat_id).with_entities( category_items.name,func.avg(category_items.rate_per_unit).label('rate_per_unit'),func.sum(category_items.quantity).label('quantity'),category_items.quantity_type,category_items.category_id,category_items.image_url).group_by(category_items.name).order_by(category_items.rate_per_unit.desc()).all()
            if(len(item)>0):
                return marshal(item,item_fields)
            else:
                return{"message":"No items added!"},404
        elif(id==2):
            item=category_items.query.where(category_items.category_id==cat_id).with_entities( category_items.name,func.avg(category_items.rate_per_unit).label('rate_per_unit'),func.sum(category_items.quantity).label('quantity'),category_items.quantity_type,category_items.category_id,category_items.image_url).group_by(category_items.name).order_by(category_items.rate_per_unit).all()
            if(len(item)>0):
                return marshal(item,item_fields)
            else:
                return{"message":"No items added!"},404
        
    
api.add_resource(Filter_item,'/filter_item/<int:cat_id>/<int:id>')        
