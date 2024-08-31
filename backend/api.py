# main.py
import datetime
from fastapi import FastAPI, HTTPException
from pyrebase import pyrebase
import logging
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from datetime import date
from models import User, LoggedInUser, Item  # Import models
import os
import json

logger = logging.getLogger('uvicorn.error')
logger.setLevel(logging.DEBUG)

loggedIn = LoggedInUser(None)

router = FastAPI()

# Firebase configuration
config_path = os.path.join(os.path.dirname(__file__), 'pyrebaseconfig.json')
with open(config_path, 'r') as f:
    config = json.load(f)

# Initialize Firebase with the loaded config
pyrebase = pyrebase.initialize_app(config)
auth = pyrebase.auth()

# db = firebase.database()

cred = credentials.Certificate('/Users/prasanthdendukuri/Desktop/fridgefriend2/backend/FridgeHaulFirebaseAdmin.json')

firebase = firebase_admin.initialize_app(cred)
db = firestore.client()



@router.get("/")
async def root():
    return {"message": "Hello World"}

def sanitize_email(email):
    return email.replace('.', ',').replace('#', ',').replace('$', ',').replace('[', ',').replace(']', ',')

@router.post("/register/")
async def register(user: User):
    email = user.email
    password = user.password

    if not email or not password:
        raise HTTPException(status_code=400, detail="Email and password are required")
    
    try:
        logger.debug('its going to registr')

        user_to_register = auth.create_user_with_email_and_password(
            email=email,
            password=password)
    
        data = {'s':1}
        sanitized_email = sanitize_email(user.email)

        db.collection("users").document(email).set({
            "user_data": data,
            "items": {}          
        })
        loggedIn.email = email
        print('x')

        return {"message": f"Successfully created new user: {user_to_register['email']}"}
    except Exception as e:
        return HTTPException(status_code=400, detail=str(e))

@router.post("/login/")
async def login(user: User):
    email = user.email
    password = user.password

    logger.debug(email)
    logger.debug(password)
    if not email or not password:
        raise HTTPException(status_code=400, detail="Email and password are required")
    
    try:
        # Your authentication logic here
        userx = auth.sign_in_with_email_and_password(user.email, user.password)
        loggedIn.email = email
        
        # loggedInUser.email = email
        logger.debug("hi")
        return {"message": f"Successfully logged in {email}"}
    except Exception as e:
        logger.debug("hi123")
        raise HTTPException(status_code=400, detail=str(e))



@router.post("/add")
async def add(item: Item):
    logger.debug(item)

    if not item.name or not item.quantity or not item.expiryDate:
        raise HTTPException(status_code = 400, detail = "please fill out the item, quantity, and expiry date fields")
    
    try:
        username = item.username
        logger.debug(username)
        
        if isinstance(item.expiryDate, datetime.date):
                expiry_date_str = item.expiryDate.isoformat()
        else:
            expiry_date_str = str(item.expiryDate)
        item_data = {
            "name": item.name,
            "quantity": item.quantity,
            "expiryDate": expiry_date_str
        }
        user_doc_ref = db.collection("users").document(username)
        
    
        items_ref = user_doc_ref.collection("items").add(item_data)
        
        return {"message": "Item added successfully"}
    
    except Exception as e:
        logger.debug(str(e))
        raise HTTPException(status_code=500, detail="Failed to add item")
    

@router.get("/getItems")
async def getItems(username: str):
    user_doc_ref = db.collection("users").document(username)
    items_ref = user_doc_ref.collection("items").stream()

    items = [item.to_dict() for item in items_ref]

    return items

    
    