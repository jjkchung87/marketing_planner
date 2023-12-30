import os
from flask import Flask, render_template, request, flash, redirect, session,jsonify
from sqlalchemy import func, and_, case
from datetime import datetime, timedelta
from controller import make_predictions, process_input_data
from controller_llm import get_chat_response
from flask_cors import CORS
import pickle
import pandas as pd
from flask_jwt_extended import JWTManager, create_access_token, get_jwt_identity, jwt_required

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
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)  # Set expiration to 24 hours

app.debug=True
if app.config['ENV'] == 'development':
    toolbar = DebugToolbarExtension(app)
app.app_context().push()
connect_db(app)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
jwt = JWTManager(app)



# *******************************************************************************************************************************
# END POINTS

# #*******************************************************************************************************************************
# SIGNUP USER
# #*******************************************************************************************************************************

@app.route('/api/users/signup', methods=['POST'])
def signup_user():
    """Signup a user"""

    # Extract data from request
    email = request.json['email']
    password = request.json['password']
    first_name = request.json['firstName']
    last_name = request.json['lastName']
    role = request.json['role']

     # Check if a user with the provided email already exists
    existing_user = User.query.filter_by(email=email).first()

    if existing_user:
        # Return an error response if the user already exists
        return jsonify({"message": "User with this email already exists."}), 409

    if len(password) < 8 :
        return jsonify({"message": "Password must be at least 8 characters long."}), 409
    
    # Add user to users table
    user = User.signup(email=email, 
                       first_name=first_name, 
                       last_name=last_name, 
                       password=password, 
                       role=role)

    # Create an access token with the custom payload
    access_token = create_access_token(identity=user.id)

   # Return the serialized user data along with the token in the response
    return jsonify({"user": user.serialize(), "access_token": access_token, "message": "User signup successful!"}), 201
    

# #*******************************************************************************************************************************
# AUTHENTICATE USER
# #*******************************************************************************************************************************

@app.route('/api/users/authenticate', methods=['POST'])
def authenticate_user():
    """Authenticate a user"""

    # Extract data from request
    email = request.json['email']
    password = request.json['password']
    
    # Authenticate user
    user = User.authenticate(email, password)

    # Create an access token with the custom payload
    access_token = create_access_token(identity=user.id)

    print("ACCESS TOKEN:", access_token)

    if not user:
        # Check for incorrect email/password
        return jsonify({"message": "Incorrect email or password."}), 401
    
    

    # Return the serialized user data along with a success response
    return jsonify({"user": user.serialize(), "access_token": access_token, "message": "User login successful!"}), 200

# #*******************************************************************************************************************************
# GET USER
# #*******************************************************************************************************************************

@app.route('/api/users/<int:id>', methods=['GET'])
def get_user(id):
    """Get user by id"""

    # Get user by id
    user = User.query.get_or_404(id)

    # Return user
    return jsonify(user=user.serialize()), 200

# #*******************************************************************************************************************************
# ADD CAMPAIGN
# #*******************************************************************************************************************************

@app.route('/api/campaigns', methods=['POST'])
@jwt_required()
def new_campaign():
    """Create a new campaign"""
    
    # Get user id from access token
    token_id = get_jwt_identity()

    # Get user by id
    user = User.query.get_or_404(token_id)

    # Extract data from request
    data = request.json

    # Process data
    df = pd.DataFrame(data, index=[0])
    df = process_input_data(df)

    # Make predictions
    prediction = make_predictions(df)

    # create new data object combining response data and prediction
    data = {**data, **prediction}

    print('**************Data:',data)

    # add campaign to campaigns table
    campaign = Campaign.add_new_campaign(data)

    # Return predictions
    return jsonify(campaign=campaign.serialize()), 200


# #*******************************************************************************************************************************
# GET ALL CAMPAIGNS
# #*******************************************************************************************************************************

@app.route('/api/campaigns', methods=['GET'])
@jwt_required()
def get_campaigns():
    """Get all campaigns"""

    # Get user id from access token
    token_id = get_jwt_identity()

    print("TOKEN ID:", token_id)

    # Get user by id
    user = User.query.get(token_id)

    if not user:
        return jsonify({"message": "Not authorized."}), 401

    # Get all campaigns
    campaigns = Campaign.query.all()

    # Return campaigns
    return jsonify(campaigns=[c.serialize() for c in campaigns]), 200


# #*******************************************************************************************************************************
# GET CAMPAIGN BY ID
# #*******************************************************************************************************************************

@app.route('/api/campaigns/<int:id>', methods=['GET'])
@jwt_required()
def get_campaign_by_id(id):
    """Get campaign by id"""

    # Get user id from access token
    token_id = get_jwt_identity()

    # Get user by id
    user = User.query.get(token_id)

    if not user:
        return jsonify({"message": "Not authorized."}), 401

    # Get campaign by id
    campaign = Campaign.query.get_or_404(id)

    # Return campaign
    return jsonify(campaign=campaign.serialize()), 200

# #*******************************************************************************************************************************
# MODIFY A CAMPAIGN
# #*******************************************************************************************************************************

@app.route('/api/campaigns/<int:id>', methods=['PATCH'])
@jwt_required()
def modify_campaign(id):
    """Modify a campaign"""

    # Get user id from access token
    token_id = get_jwt_identity()

    # Get user by id
    user = User.query.get(token_id)

    if not user:
        return jsonify({"message": "Not authorized."}), 401
    
    # Get campaign by id
    campaign = Campaign.query.get_or_404(id)

    # Extract data from request
    data = request.json

    # Process data
    df = pd.DataFrame(data, index=[0])
    df = process_input_data(df)

    # Make predictions
    prediction = make_predictions(df)

    # create new data object combining response data and prediction
    data = {**data, **prediction}

    # Modify campaign
    campaign.modify_campaign(data)

    # Retrieve modified campaign
    campaign = Campaign.query.get_or_404(id)
    
    # Return campaign
    return jsonify(campaign=campaign.serialize()), 200

# #*******************************************************************************************************************************
# DELETE A CAMPAIGN
# #*******************************************************************************************************************************

@app.route('/api/campaigns/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_campaign(id):
    """Delete a campaign"""

    # Get user id from access token
    token_id = get_jwt_identity()

    # Get user by id
    user = User.query.get(token_id)

    if not user:
        return jsonify({"message": "Not authorized."}), 401
    
    #Delete by campaign ID
    Campaign.query.filter_by(id=id).delete() 

    # Return campaign
    return jsonify('Campaign deleted'), 200


# #*******************************************************************************************************************************
# GET ROI BY CHANNEL
# #*******************************************************************************************************************************
@app.route('/api/roi-by-channel', methods=['GET'])
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
# #*******************************************************************************************************************************
@app.route('/api/revenue-by-month/<int:year>', methods=['GET'])
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
# POST ROUTE FOR CHATBOT
# *******************************************************************************************************************************

@app.route('/api/chatbot', methods=['POST'])
def chatbot():
    """Chatbot"""

    # Extract data from request
    data = request.json

    # Get chat response
    response = get_chat_response(data['prompt'])

    # Return response
    return jsonify(response=response), 200



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