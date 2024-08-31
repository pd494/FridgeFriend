from pydantic import BaseModel
from datetime import date


class User(BaseModel):
    email: str
    password: str

class LoggedInUser:
    def __init__(self, email: str):
        self.email = email


class Item(BaseModel):
    name: str
    quantity: int
    expiryDate: date
    username: str