# Grocery_Store_App
Steps to run the application
1. Change directory to this code folder present in this project directory(cd ./code).
2. Run the command to install required packages (pip install -r requirements.txt )
3. Initailse the database (python initial_data.py)
4. Run the application in localhost(python main.py)
5. Run redis server .. Install redis server before.(redis-server)
5. Celery Tasks (celery -A main:celery_app worker -l INFO)
6. Celery beat (celery -A main:celery_app beat -l INFO)
7. Run Fake SMTP server .. Install MailHog prehand (~/go/bin/MailHog)