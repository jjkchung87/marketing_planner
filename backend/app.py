import os
from flask import Flask, render_template, request, flash, redirect, session,jsonify
from sqlalchemy import func, and_, case
from datetime import datetime, timedelta
from controller import make_predictions, process_input_data
from flask_cors import CORS
import pickle
import pandas as pd

from models import db, connect_db, User, Customer_segment, Channel, Campaign, Target_audience

from flask_debugtoolbar import DebugToolbarExtension



app = Flask(__name__)


app.config['SQLALCHEMY_DATABASE_URI'] = (
    os.environ.get('DATABASE_URL', 'postgresql:///marketingplanner'))

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = False

app.config['EXPLAIN_TEMPLATE_LOADING'] = True
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', "it's a secret")
# app.config['JWT_SECRET_KEY'] = 'SECRET KEY FOR JWT'  # Replace with your own secret key
# app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)  # Set expiration to 24 hours

app.debug=True
if app.config['ENV'] == 'development':
    toolbar = DebugToolbarExtension(app)
app.app_context().push()
connect_db(app)
# CORS(app, resources={r"/prioritypilot/api/*": {"origins": "http://localhost:3000"}})
# jwt = JWTManager(app)



# *******************************************************************************************************************************
# END POINTS

# #*******************************************************************************************************************************
# NEW CAMPAIGN

@app.route('/campaign', methods=['POST'])
def new_campaign():
    
    # Extract data from request
    data = request.json

    # Process data
    df = pd.DataFrame(data, index=[0])
    df = process_input_data(df)

    # Make predictions
    prediction = make_predictions(df)

    # create new data object combining response data and prediction
    data = {**data, **prediction}

    # add campaign to campaigns table
    campaign = Campaign.add_new_campaign(data)

    # Return predictions
    return jsonify({"campaign": campaign.serialize()}), 200


# #*******************************************************************************************************************************
# GET ALL CAMPAIGNS

@app.route('/campaigns', methods=['GET'])
def get_campaigns():
    """Get all campaigns"""

    # Get all campaigns
    campaigns = Campaign.query.all()

    # Return campaigns
    return jsonify(campaigns=[c.serialize() for c in campaigns]), 200


# #*******************************************************************************************************************************
# GET CAMPAIGN BY ID

@app.route('/campaign/<int:id>', methods=['GET'])
def get_campaign_by_id(id):
    """Get campaign by id"""

    # Get campaign by id
    campaign = Campaign.query.get_or_404(id)

    # Return campaign
    return jsonify(campaign=campaign.serialize()), 200

# #*******************************************************************************************************************************
# GET ROI BY CHANNEL

@app.route('/roi-by-channel', methods=['GET'])
def get_roi_by_channel():
    """Get ROI by channel"""

    # Get ROI by channel
    roi_by_channel = db.session.query(Campaign.channel_id, Channel.name, func.avg(Campaign.roi).label('roi')) \
        .join(Channel, Campaign.channel_id == Channel.id) \
        .group_by(Campaign.channel_id, Channel.name) \
        .order_by(func.avg(Campaign.roi).desc()) \
        .all()

    # Return ROI by channel
    return jsonify(roi_by_channel=[dict(zip(result.keys(), result)) for result in roi_by_channel]), 200

# #*******************************************************************************************************************************
# GET ACTUAL AND PROJECTED REVENUE BY MONTH FILTERED BY YEAR
def get_actual_and_projected_revenue_by_month(year):
    """Get actual and projected revenue by mont filtered by year"""
    
    #actual revenue by month
    actual_revenue_by_month = db.session.query(Campaign.start_date, func.sum(Campaign.actual_revenue_total).label('actual_revenue')) \
        .filter(func.year(Campaign.start_date) == year) \
        .group_by(Campaign.start_date) \
        .order_by(Campaign.start_date) \
        .all()
    
    #projected revenue by month
    projected_revenue_by_month = db.session.query(Campaign.start_date, func.sum(Campaign.projected_revenue_total).label('projected_revenue')) \
        .filter(func.year(Campaign.start_date) == year) \
        .group_by(Campaign.start_date) \
        .order_by(Campaign.start_date) \
        .all()
    
    # Return actual and projected revenue by month
    return jsonify(actual_revenue_by_month=[dict(zip(result.keys(), result)) for result in actual_revenue_by_month],
                     projected_revenue_by_month=[dict(zip(result.keys(), result)) for result in projected_revenue_by_month]), 200

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