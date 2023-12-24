from app import db, Customer_segment, Target_audience, User, Campaign
import csv
from random import randint
from datetime import datetime, timedelta



# Create seed file that will be used to populate the database


db.session.rollback()
db.drop_all()
db.create_all()

# Populate Customer_segment table with "Fashionistas", "Foodies", "Outdoor Adventurers", "Tech Enthusiasts", "Healt & Wellness "
customer_segments = ["Fashionistas", 
                     "Foodies", 
                     "Health & Wellness",
                     "Outdoor Adventurers", 
                     "Tech Enthusiasts"
                     ]
for customer_segment in customer_segments:
    customer_segment = Customer_segment(name=customer_segment)
    db.session.add(customer_segment)
    db.session.commit()

# Populate target_audience table with "All Ages", "Men 18-24", "Men 25-34", "Women 25-34", "Women 35-44"
target_audiences = ["All Ages", 
                    "Men 18-24", 
                    "Men 25-34", 
                    "Women 25-34", 
                    "Women 35-44"]
for target_audience in target_audiences:
    target_audience = Target_audience(name=target_audience)
    db.session.add(target_audience)
    db.session.commit()

# Populate user table with a test user
user = User.signup(email="harper@human.com", password="harper123", first_name="Harper", last_name="Chung", role="admin")    


# Populate campaign table with data from csv file

# def seed_campaign_database(csv_file_path):
#     with open(csv_file_path, 'r') as csv_file:
#         csv_reader = csv.DictReader(csv_file)  # Assuming your CSV has headers

#         # Iterate over the CSV rows
#         for row in csv_reader:
#             # Create an instance of the Campaign Model and pass in each row's data
#             campaign = Campaign(
#                 id=int(row['id']),
#                 name=row['name'],
#                 start_date=datetime.strptime(row['start_date']),
#                 duration=int(row['duration']),
#                 status=row['status'],
#                 customer_segment_id=int(row['customer_segment_id']),
#                 target_audience_id=int(row['target_audience_id']),
#                 spend_email=int(row['spend_email']),
#                 spend_facebook=int(row['spend_facebook']),
#                 spend_google_ads=int(row['spend_google_ads']),
#                 spend_instagram=int(row['spend_instagram']),
#                 spend_website=int(row['spend_website']),
#                 spend_youtube=int(row['spend_youtube']),
#                 spend_total=int(row['spend_total']),
#                 projected_revenue_email=int(row['projected_revenue_email']),
#                 projected_revenue_facebook=int(row['projected_revenue_facebook']),
#                 projected_revenue_google_ads=int(row['projected_revenue_google_ads']),
#                 projected_revenue_instagram=int(row['projected_revenue_instagram']),
#                 projected_revenue_website=int(row['projected_revenue_website']),
#                 projected_revenue_youtube=int(row['projected_revenue_youtube']),
#                 projected_revenue_total=int(row['projected_revenue_total']),
#                 actual_revenue_email=int(row['actual_revenue_email']),
#                 actual_revenue_facebook=int(row['actual_revenue_facebook']),
#                 actual_revenue_google_ads=int(row['actual_revenue_google_ads']),
#                 actual_revenue_instagram=int(row['actual_revenue_instagram']),
#                 actual_revenue_website=int(row['actual_revenue_website']),
#                 actual_revenue_youtube=int(row['actual_revenue_youtube']),
#                 actual_revenue_total=int(row['actual_revenue_total']),
#                 impressions = int(row['impressions']),
#                 clicks = int(row['clicks'])
#             )
#             db.session.add(campaign)  # Add the instance to the session

#         # Commit the session to the database
#         try:
#             db.session.commit()
#         except Exception as e:
#             print(f"An error occurred: {e}")
#             db.session.rollback()
#         finally:
#             db.session.close()  # Close the session

# Call the function with the path to your CSV file
# seed_campaign_database('campaign_seed_data.csv')

# Seed campaigns table with 200 campaigns

for i in range(200):
    
    random_start_date = datetime.strptime("2022-01-01", "%Y-%m-%d") + timedelta(days=randint(0, 800))
    duration = randint(0, 60)
    today = datetime.today()
    
    customer_segment_id = randint(1, 5)
    target_audience_id = randint(1, 5)
    spend_email = randint(1000, 2000)
    spend_facebook = randint(1000, 2000)
    spend_google_ads = randint(1000, 2000)
    spend_instagram = randint(1000, 2000)
    spend_website = randint(1000, 2000)
    spend_youtube = randint(1000, 2000)

    projected_revenue_email = randint(3000, 5000)
    projected_revenue_facebook = randint(3000, 5000)
    projected_revenue_google_ads = randint(3000, 5000)
    projected_revenue_instagram = randint(3000, 5000)
    projected_revenue_website = randint(3000, 5000)
    projected_revenue_youtube = randint(3000, 5000)

    campaign = Campaign(
        # make campaign name "Campaign: start_date" with start_date in format "YYYY-MM-DD"
        name=f"Campaign: {random_start_date.strftime('%Y-%m-%d')}",
        start_date=random_start_date,
        duration=duration,
        customer_segment_id=customer_segment_id,
        target_audience_id=target_audience_id,
        spend_email=spend_email,
        spend_facebook=spend_facebook,
        spend_google_ads=spend_google_ads,
        spend_instagram=spend_instagram,
        spend_website=spend_website,
        spend_youtube=spend_youtube,
        projected_revenue_email=projected_revenue_email,
        projected_revenue_facebook=projected_revenue_facebook,
        projected_revenue_google_ads=projected_revenue_google_ads,
        projected_revenue_instagram=projected_revenue_instagram,
        projected_revenue_website=projected_revenue_website,
        projected_revenue_youtube=projected_revenue_youtube,
        actual_revenue_email=0,
        actual_revenue_facebook=0,
        actual_revenue_google_ads=0,
        actual_revenue_instagram=0,
        actual_revenue_website=0,
        actual_revenue_youtube=0,
        impressions=0,
        clicks=0
    )
    db.session.add(campaign)
    db.session.commit()

    # Populate campaign with actual revenue, impressions, and clicks if status is "Completed"
    if campaign.status == "Completed":
        actual_revenue_email = randint(3000, 5000)
        actual_revenue_facebook = randint(3000, 5000)
        actual_revenue_google_ads = randint(3000, 5000)
        actual_revenue_instagram = randint(3000, 5000)
        actual_revenue_website = randint(3000, 5000)
        actual_revenue_youtube = randint(3000, 5000)
        impressions = randint(1000, 2000)
        clicks = randint(1000, 2000)

        campaign.actual_revenue_email=actual_revenue_email
        campaign.actual_revenue_facebook=actual_revenue_facebook
        campaign.actual_revenue_google_ads=actual_revenue_google_ads
        campaign.actual_revenue_instagram=actual_revenue_instagram
        campaign.actual_revenue_website=actual_revenue_website
        campaign.actual_revenue_youtube=actual_revenue_youtube
        campaign.impressions=impressions
        campaign.clicks=clicks

        db.session.commit()

    