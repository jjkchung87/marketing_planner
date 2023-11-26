from app import db, Customer_segment, Target_audience

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
