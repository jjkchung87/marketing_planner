from flask_sqlalchemy import SQLAlchemy
from enum import Enum as EnumBase
from sqlalchemy import Enum
from datetime import datetime
from sqlalchemy import ForeignKey, ForeignKeyConstraint, event, func
from sqlalchemy.orm import validates
import random
import string
import json

db = SQLAlchemy()

def connect_db(app):
    db.app = app
    db.init_app(app)



