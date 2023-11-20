import os
from flask import Flask, render_template, request, flash, redirect, session,jsonify
# from sqlalchemy import func, and_, case
from datetime import datetime, timedelta
from controller import make_predictions, process_input_data
from flask_cors import CORS
import pickle
import pandas as pd

from models import db, connect_db

# from flask_debugtoolbar import DebugToolbarExtension



app = Flask(__name__)


# app.config['SQLALCHEMY_DATABASE_URI'] = (
#     os.environ.get('DATABASE_URL', 'marketingplannerapp'))

# app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# app.config['SQLALCHEMY_ECHO'] = False

app.config['EXPLAIN_TEMPLATE_LOADING'] = True
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', "it's a secret")
# app.config['JWT_SECRET_KEY'] = 'SECRET KEY FOR JWT'  # Replace with your own secret key
# app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)  # Set expiration to 24 hours

app.debug=True
# if app.config['ENV'] == 'development':
#     toolbar = DebugToolbarExtension(app)
app.app_context().push()
# connect_db(app)
# CORS(app, resources={r"/prioritypilot/api/*": {"origins": "http://localhost:3000"}})
# jwt = JWTManager(app)



# #*******************************************************************************************************************************
# NEW CAMPAIGN

@app.route('/predict', methods=['POST'])
def predict():
    
    # Extract data from request
    data = request.json

    # Process data
    df = pd.DataFrame(data, index=[0])
    df = process_input_data(df)

    # Make predictions
    prediction = make_predictions(df)

    # Return predictions
    return jsonify(prediction), 200

# *******************************************************************************************************************************
# JSON Format

# {
#     "Company": "NexGen Systems",
#     "Campaign_Type": "Email",
#     "Target_Audience": "Women 35-40",
#     "Duration": 60,
#     "Channel_Used": "Google Ads",
#     "Acquisition_Cost": 12000,
#     "Location": "New York",
#     "Language": "English",
#     "Customer_Segment": "Fashionistas",
#     "Date": "2021-01-01"
# }

# {
#     "Company": "NexGen Systems",
#     "Campaign_Type": "Email",
#     "Target_Audience": "Men 25-34",
#     "Duration": 15,
#     "Channel_Used": "YouTube",
#     "Acquisition_Cost": 16000,
#     "Location": "Los Angeles",
#     "Language": "Mandarin",
#     "Customer_Segment": "Health & Wellness",
#     "Date": "2021-01-01"
# }