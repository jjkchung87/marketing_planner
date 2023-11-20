import os
from openai import OpenAI
import json
from datetime import datetime
from sqlalchemy import create_engine, MetaData, Table
from sqlalchemy.orm import sessionmaker
import csv
import time
import pickle
import pandas as pd


# *******************************************************************************************************************************
# Process input data

def process_input_data(df):
    """Process input data"""

    # Parse 'Date' and decompose it into 'year', 'month', and 'day'
    df['Date'] = pd.to_datetime(df['Date'])
    df['year'] = df['Date'].dt.year
    df['month'] = df['Date'].dt.month
    df['day'] = df['Date'].dt.day
    df.drop('Date', axis=1, inplace=True)

    # One-hot encode categorical variables
    categorical_columns = ['Company', 'Campaign_Type', 'Target_Audience',
                        'Channel_Used', 'Location', 'Language', 'Customer_Segment']
    processed_df = pd.get_dummies(df, columns=categorical_columns)

    # Add missing columns (if any)
    expected_columns = ['Duration', 'Acquisition_Cost', 'year', 'month', 'day',
       'Company_NexGen Systems', 'Campaign_Type_Display',
       'Campaign_Type_Email', 'Campaign_Type_Influencer',
       'Campaign_Type_Search', 'Campaign_Type_Social Media',
       'Target_Audience_All Ages', 'Target_Audience_Men 18-24',
       'Target_Audience_Men 25-34', 'Target_Audience_Women 25-34',
       'Target_Audience_Women 35-44', 'Channel_Used_Email',
       'Channel_Used_Facebook', 'Channel_Used_Google Ads',
       'Channel_Used_Instagram', 'Channel_Used_Website',
       'Channel_Used_YouTube', 'Location_Chicago', 'Location_Houston',
       'Location_Los Angeles', 'Location_Miami', 'Location_New York',
       'Language_English', 'Language_French', 'Language_German',
       'Language_Mandarin', 'Language_Spanish',
       'Customer_Segment_Fashionistas', 'Customer_Segment_Foodies',
       'Customer_Segment_Health & Wellness',
       'Customer_Segment_Outdoor Adventurers',
       'Customer_Segment_Tech Enthusiasts']

    # Ensure all expected columns are present, adding missing ones as needed
    for col in expected_columns:
        if col not in df.columns:
            df[col] = False  # Add missing columns with default value (e.g., 0)

    # Reorder columns to match expected format
    processed_df = df[expected_columns]

    return processed_df




# *******************************************************************************************************************************
# Load models

# Path to the linear regression model
lr_model_path = 'prediction_models/marketing_planner_linear_regression_model.sav'
with open(lr_model_path, 'rb') as file:
    model_lr = pickle.load(file)

# Path to the random forest model
rf_model_path = 'prediction_models/marketing_planner_random_forest_model.sav'
with open(rf_model_path, 'rb') as file:
    model_rf = pickle.load(file)

def make_predictions(data):
    """Make predictions on data"""

    # Make predictions
    prediction_lr = model_lr.predict(data).tolist()[0]
    prediction_rf = model_rf.predict(data).tolist()[0]
    prediction_mean = (prediction_lr + prediction_rf) / 2

    # calculate ROI
    investment = data['Acquisition_Cost'].tolist()[0]
    roi = prediction_mean / investment

    # Return predictions and ROI
    return {'prediction': prediction_mean, 'roi': roi}