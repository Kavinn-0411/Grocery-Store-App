from flask import current_app as app,render_template,request,jsonify,send_file
from flask_security import auth_required,roles_required,current_user
from flask_restful import fields,marshal
from sqlalchemy import or_,delete,and_,update
from sqlalchemy.orm import joinedload
from werkzeug.security import check_password_hash
from .sec import datastore
from .models import User,db,grocery_categories,user_cart,category_items
from datetime import datetime
from .tasks import say_hello,create_report_csv
import flask_excel as excel
from celery.result import AsyncResult
from time import perf_counter_ns
from .instances import cache
from .data_return import user_email
from .instances import cache
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



@app.get('/')
def home():
    return(render_template('index.html'))


@app.post('/user_login')
def user_login():
    data=request.get_json()
    email_username=data.get("email_username")
    start=perf_counter_ns()
    email=user_email(email=email_username)
    username=datastore.find_user(username=email_username,active=True)
    stop=perf_counter_ns()
    print("Time Taken: ",start-stop)
    if not email_username:
        return jsonify({"message":"Provide email or password"}),400
    if not email and not username:  
        return jsonify({"message":"User not found"}),404
    elif email:
        user=email
    else:
        user=username
        
    
    if check_password_hash(user.password,data.get("password")):
        user.login_time=datetime.now()
        db.session.commit()
        cache.set(f"auth-token-{user.id}",user.get_auth_token(),timeout=300)
        return jsonify({"role":user.roles[0].name,"email":user.email,"id":user.id})
    else:
        return jsonify({"message":"Incorrect Password"}),400
    

@app.post('/get/token/<int:id>')
def token(id):
    token=cache.get(f"auth-token-{id}")
    if(token):
        return jsonify({"token":cache.get(f"auth-token-{id}"),"message":"Successful"})
    else:
        return jsonify({"message":"Session Expired!"})
    
@app.post('/user_logout/<int:user_id>')
@auth_required("token")
def logout(user_id):
    cache.delete(f"auth-token-{user_id}")
    return jsonify({"message":"Logout Successfull"})


    

    
@app.get('/activate/category/<int:category_id>')
@auth_required("token")
@roles_required("admin")
def activate_category(category_id):
    category=grocery_categories.query.get(category_id)
    if not category :
        return {"message":"Invalid Category!!!"},404
    category.is_approved=True
    db.session.commit()
    return jsonify({"message":"Category activated"})

@app.get('/activate/storemanager/<int:user_id>')
@auth_required("token")
@roles_required("admin")
def activate_storemanager(user_id):
    users=datastore.find_user(id=user_id)
    if not users :
        return {"message":"Invalid User!!!"},404
    users.active=True
    db.session.commit()
    return jsonify({"message":"User activated"})

@app.get('/remove/category/<int:category_id>')
@auth_required("token")
@roles_required("admin")
def deactivate_category(category_id):
    category=grocery_categories.query.get(category_id)
    if not category :
        return {"message":"Invalid Category!!!"},404
    delt= db.session.query(grocery_categories).where(grocery_categories.id==category_id).options(joinedload(grocery_categories.item)).first()
    db.session.delete(delt)
    db.session.commit()
    return jsonify({"message":"Category Deleted Successfully"})

@app.get('/remove/item/<int:item_id>')
@auth_required("token")
@roles_required("store_manager")
def remove_item(item_id):
    item=category_items.query.get(item_id)
    if not item :
        return {"message":"Invalid Item!!!"},404
    db.session.delete(item)
    db.session.commit()
    return jsonify({"message":"Item Deleted Successfully"})

@app.get('/remove/users/<int:id>')
@auth_required("token")
@roles_required("admin")
def deactivate_users(id):
    users=datastore.find_user(id=id)
    if not users :
        return {"message":"Invalid User!!!"},404
    if(users.roles[0].name=="store_manager"):
        delt= db.session.query(User).where(User.id==id).first()
        db.session.delete(delt)
    else:
        delt= db.session.query(User).where(User.id==id).options(joinedload(User.items)).first()
        db.session.delete(delt)
    
    db.session.commit()
    return jsonify({"message":"User Deleted Successfully"})

@app.get('/user_cart')
@auth_required("token")
@roles_required("user")
def cart():
    transactions=user_cart.query.where(and_(user_cart.user_id==current_user.id,user_cart.status==False)).all()
    sum=0
    for i in transactions:
        sum+=i.amount
    if(len(transactions)==0):
        return {"message":"Cart Empty"},404
    return {"data":marshal(transactions,user_transaction_fields),"total_amount":sum}

@app.post('/remove/cart/<int:t_id>')
@auth_required("token")
@roles_required("user")
def remove_item_cart(t_id):
    t=user_cart.query.get(t_id)
    if not t :
        return {"message":"Transaction Unavailable!!!"},404
    delt= user_cart.query.where(user_cart.transaction_id==t_id).first()
    db.session.delete(delt)
    db.session.commit()
    return jsonify({"message":"Item Removed from Cart!"})

@app.post('/user_cart/purchase')
@auth_required("token")
@roles_required("user")
def cart_purchase():
    transactions=user_cart.query.where(and_(user_cart.user_id==current_user.id,user_cart.status==False)).all()
    for i in transactions:
        i.purchase_time=datetime.now()
        i.status=True
    db.session.commit()
    return {"message":"Purchase Successful!!"}

@app.get('/say-hello')
def say_hello_view():
    t=say_hello.delay()
    return jsonify({"task-id":t.id})

@app.get("/download-csv")
@auth_required("token")
def export_records():
    task=create_report_csv.delay(current_user.id)
    return jsonify({"task-id":task.id})

@app.get("/get-csv/<task_id>")
def get_csv(task_id):
    res=AsyncResult(task_id)
    if res.ready():
        return send_file(res.result,as_attachment=True)
    else:
        return {"message":"Task pending"},404



