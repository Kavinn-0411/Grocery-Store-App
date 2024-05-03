from celery import shared_task
from .models import User,user_cart,grocery_categories,category_items
from datetime import datetime
from .mailservice import send_mail
from jinja2 import Template
from sqlalchemy import and_
import flask_excel as excel
from flask_security import current_user


@shared_task(ignore_result=True)
def say_hello():
    return "Say hello"

@shared_task(ignore_result=True)
def daily_reminder(subject):
    user=User.query.filter(User.roles.any(name='user')).all()
    
    for user in user:
        with open('templates/daily_reminder.html','r') as f:
                template=Template(f.read())
                rendered_content=template.render(username=user.username)
        if (user.login_time==None):
            send_mail(user.email,subject,rendered_content)
          

        else:
            if (datetime.strptime(user.login_time, "%Y-%m-%d %H:%M:%S.%f").strftime("%Y-%m-%d")!=datetime.now().strftime("%Y-%m-%d")):
                send_mail(user.email,subject,rendered_content)
            else:
                transactions=user_cart.query.where(user_cart.user_id==user.id).all()
                count=0
                for t in transactions:
                    if (t.purchase_time!=None):
                        if(datetime.strptime(t.purchase_time, "%Y-%m-%d %H:%M:%S.%f").strftime("%Y-%m-%d")==datetime.now().strftime("%Y-%m-%d")):
                            count+=1
                if(count==0):
                    send_mail(user.email,subject,rendered_content)

@shared_task(ignore_result=True)
def monthly_activity_report(subject):
    user=User.query.filter(User.roles.any(name='user')).all()
    for user in user:
        tlist=[]
        total_amount=0
        transactions=user_cart.query.filter(user_cart.user_id==user.id,user_cart.status==True).all()
        for t in transactions:
            if(datetime.strptime(t.purchase_time, "%Y-%m-%d %H:%M:%S.%f").strftime("%Y-%m")==datetime.now().strftime("%Y-%m")):
                tlist.append(t)
                total_amount+=t.amount
        with open('templates/monthly_activity_report.html','r') as f:
                template=Template(f.read())
                rendered_content=template.render(transactions=tlist,total=total_amount)
        send_mail(user.email,subject,rendered_content)
        
@shared_task(ignore_result=False)
def create_report_csv(userid):
    filename="export.csv"
    category=grocery_categories.query.with_entities(grocery_categories.id,grocery_categories.name)
    csv_list=[]
    for i in category:
        items=category_items.query.where(category_items.category_id==i.id,category_items.creator_id==userid).all()
        for j in items:
            amount=0
            quantity_sold=0
            items_sold=user_cart.query.filter(user_cart.item_name==j.name,user_cart.status==True).all()
            for z in items_sold:
                amount+=z.amount
                quantity_sold+=z.item_quantity
            csv_list.append([i.name,j.name,j.quantity,j.quantity_type,j.rate_per_unit,quantity_sold,amount])
    csv_list.insert(0,["Category","Item","Stock Remaining","Quantity Type","Cost/Unit","Stocks Sold","Total Amount Sold"])
    a=excel.make_response_from_array(csv_list, "csv")
    with open(filename,"wb") as f:
        f.write(a.data)
    return filename
   
                   

                    
                    