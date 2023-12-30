from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from sqlalchemy.orm import validates
from sqlalchemy.ext.hybrid import hybrid_property
from datetime import datetime, timedelta
from flask_bcrypt import Bcrypt


db = SQLAlchemy()
bcrypt = Bcrypt()

DEFAULT_URL = 'https://hips.hearstapps.com/hmg-prod/images/gettyimages-1226623221.jpg'


def connect_db(app):
    db.app = app
    db.init_app(app)

# User model
class User(db.Model):
    """ User model """

    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    email = db.Column(db.String, nullable=False, unique=True)
    first_name = db.Column(db.String, nullable=False)
    last_name = db.Column(db.String, nullable=False)
    role = db.Column(db.String, nullable=False)
    password = db.Column(db.String, nullable=False)

    def __repr__(self):
        return f'<User {self.id} {self.first_name} {self.last_name}>'

    def serialize(self):
        """ Serialize to dictionary """
        return {
            'id': self.id,
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'role': self.role        
        }
    
    @classmethod
    def signup(cls, email, first_name, last_name, role, password):
        """Sign up a new user with password hashing"""

        hashed = bcrypt.generate_password_hash(password)
        hashed_utf8 = hashed.decode("utf8")

        user = User( 
            email=email,
            password=hashed_utf8,
            first_name=first_name,
            last_name=last_name,
            role=role
        )
                
        db.session.add(user)
        db.session.commit()
        return user
    
    @classmethod
    def authenticate(cls, email, password):
        """Authenticate user"""

        user = User.query.filter_by(email=email).first()

        if user and bcrypt.check_password_hash(user.password, password):
            return user
        else:
            return False

class Customer_segment(db.Model):
    """ Customer segment """

    __tablename__ = 'customer_segments'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String, nullable=False)

    def __repr__(self):
        return f'<Customer_segment {self.id} {self.name}>'

    def serialize(self):
        """ Serialize to dictionary """
        return {
            'id': self.id,
            'name': self.name,
        }

class Channel(db.Model):
    """Channel class"""
    
    __tablename__ = 'channels'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String, nullable=False)

    def __repr__(self):
        return f'<Channel {self.id} {self.name}>'

    def serialize(self):
        """ Serialize to dictionary """
        return {
            'id': self.id,
            'name': self.name,
        }

class Target_audience(db.Model):
    """Target audience model"""
    
    __tablename__ = 'target_audiences'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String, nullable=False)

    def __repr__(self):
        return f'<Target_audience {self.id} {self.name}>'

    def serialize(self):
        """ Serialize to dictionary """
        return {
            'id': self.id,
            'name': self.name,
        }

class Campaign(db.Model):
    """Campaign class"""

    __tablename__ = 'campaigns'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String, nullable=False)
    start_date = db.Column(db.DateTime, nullable=False)
    duration = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String, nullable=False)
    customer_segment_id = db.Column(db.Integer, db.ForeignKey('customer_segments.id'), nullable=False)
    customer_segment = db.relationship('Customer_segment', backref='campaigns')
    target_audience_id = db.Column(db.Integer, db.ForeignKey('target_audiences.id'), nullable=False)
    target_audience = db.relationship('Target_audience', backref='campaigns')
    spend_email = db.Column(db.Float, nullable=False)
    spend_facebook = db.Column(db.Float, nullable=False)
    spend_google_ads = db.Column(db.Float, nullable=False)
    spend_instagram = db.Column(db.Float, nullable=False)
    spend_website = db.Column(db.Float, nullable=False)
    spend_youtube = db.Column(db.Float, nullable=False)
    spend_total = db.Column(db.Float, nullable=False)
    projected_revenue_email = db.Column(db.Float, nullable=False)
    projected_revenue_facebook = db.Column(db.Float, nullable=False)
    projected_revenue_google_ads = db.Column(db.Float, nullable=False)
    projected_revenue_instagram = db.Column(db.Float, nullable=False)
    projected_revenue_website = db.Column(db.Float, nullable=False)
    projected_revenue_youtube = db.Column(db.Float, nullable=False)
    projected_revenue_total = db.Column(db.Float, nullable=False)
    actual_revenue_email = db.Column(db.Float, nullable=False)
    actual_revenue_facebook = db.Column(db.Float, nullable=False)
    actual_revenue_google_ads = db.Column(db.Float, nullable=False)
    actual_revenue_instagram = db.Column(db.Float, nullable=False)
    actual_revenue_website = db.Column(db.Float, nullable=False)
    actual_revenue_youtube = db.Column(db.Float, nullable=False)
    actual_total_revenue = db.Column(db.Float, nullable=False)
    impressions = db.Column(db.Integer, nullable=False)
    clicks = db.Column(db.Integer, nullable=False)

    @hybrid_property
    def spend_total(self):
        return (self.spend_email + self.spend_facebook + self.spend_google_ads +
                self.spend_instagram + self.spend_website + self.spend_youtube)

    @hybrid_property
    def projected_revenue_total(self):
        return (self.projected_revenue_email + self.projected_revenue_facebook +
                self.projected_revenue_google_ads + self.projected_revenue_instagram +
                self.projected_revenue_website + self.projected_revenue_youtube)

    @hybrid_property
    def actual_total_revenue(self):
        return (self.actual_revenue_email + self.actual_revenue_facebook +
                self.actual_revenue_google_ads + self.actual_revenue_instagram +
                self.actual_revenue_website + self.actual_revenue_youtube)

    @hybrid_property
    def status(self):
        if datetime.now() < self.start_date:
            return 'Not started'
        elif datetime.now() > self.start_date and datetime.now() < self.start_date + timedelta(days=self.duration):
            return 'In progress'
        else:
            return 'Completed'

    def __repr__(self):
        return f'<Campaign {self.id} {self.name}>'
    

    def serialize(self):
        """ Serialize to dictionary """
        return {
            'id': self.id,
            'name': self.name,
            'start_date': self.start_date.strftime('%Y-%m-%d'),
            'duration': self.duration,
            'status': self.status,
            'target_audience_id': self.target_audience_id,
            'target_audience': self.target_audience.name,
            'customer_segment_id': self.customer_segment_id,
            'customer_segment': self.customer_segment.name,
            'spend_email': self.spend_email,
            'spend_facebook': self.spend_facebook,
            'spend_google_ads': self.spend_google_ads,
            'spend_instagram': self.spend_instagram,
            'spend_website': self.spend_website,
            'spend_youtube': self.spend_youtube,
            'spend_total': self.spend_total,
            'projected_revenue_email': self.projected_revenue_email,
            'projected_revenue_facebook': self.projected_revenue_facebook,
            'projected_revenue_google_ads': self.projected_revenue_google_ads,
            'projected_revenue_instagram': self.projected_revenue_instagram,
            'projected_revenue_website': self.projected_revenue_website,
            'projected_revenue_youtube': self.projected_revenue_youtube,
            'projected_revenue_total': self.projected_revenue_total,
            'actual_revenue_email': self.actual_revenue_email,
            'actual_revenue_facebook': self.actual_revenue_facebook,
            'actual_revenue_google_ads': self.actual_revenue_google_ads,
            'actual_revenue_instagram': self.actual_revenue_instagram,
            'actual_revenue_website': self.actual_revenue_website,
            'actual_revenue_youtube': self.actual_revenue_youtube,
            'actual_total_revenue': self.actual_total_revenue,
            'impressions': self.impressions,
            'clicks': self.clicks
        }
    
    def add_new_campaign(data):
        """add a new campaign. If no data for a field is provided, set it to 0 """

        customer_segment_id = Customer_segment.query.filter_by(name=data['customer_segment']).first().id
        target_audience_id = Target_audience.query.filter_by(name=data['target_audience']).first().id


        new_campaign = Campaign(
            name=data['name'],
            start_date=data['start_date'],
            duration=data['duration'],
            customer_segment_id=customer_segment_id,
            target_audience_id=target_audience_id,
            spend_email = data.get('spend_email', 0),
            spend_facebook = data.get('spend_facebook', 0),
            spend_google_ads = data.get('spend_google_ads', 0),
            spend_instagram = data.get('spend_instagram', 0),
            spend_website = data.get('spend_website', 0),
            spend_youtube = data.get('spend_youtube', 0),
            projected_revenue_email = data.get('projected_revenue_email', 0),
            projected_revenue_facebook = data.get('projected_revenue_facebook', 0),
            projected_revenue_google_ads = data.get('projected_revenue_google_ads', 0),
            projected_revenue_instagram = data.get('projected_revenue_instagram', 0),
            projected_revenue_website = data.get('projected_revenue_website', 0),
            projected_revenue_youtube = data.get('projected_revenue_youtube', 0),
            actual_revenue_email = data.get('actual_revenue_email', 0),
            actual_revenue_facebook = data.get('actual_revenue_facebook', 0),
            actual_revenue_google_ads = data.get('actual_revenue_google_ads', 0),
            actual_revenue_instagram = data.get('actual_revenue_instagram', 0),
            actual_revenue_website = data.get('actual_revenue_website', 0),
            actual_revenue_youtube = data.get('actual_revenue_youtube', 0),
            impressions = data.get('impressions', 0),
            clicks = data.get('clicks', 0)
        )

        db.session.add(new_campaign)
        db.session.commit()
        return new_campaign

    def modify_campaign(self, data):
        """modify a campaign"""
            
        customer_segment_id = Customer_segment.query.filter_by(name=data['customer_segment']).first().id
        target_audience_id = Target_audience.query.filter_by(name=data['target_audience']).first().id

        self.name = data['name']
        self.start_date = data['start_date']
        self.duration = data['duration']
        self.customer_segment_id = customer_segment_id
        self.target_audience_id = target_audience_id
        self.spend_email = data.get('spend_email', 0)
        self.spend_facebook = data.get('spend_facebook', 0)
        self.spend_google_ads = data.get('spend_google_ads', 0)
        self.spend_instagram = data.get('spend_instagram', 0)
        self.spend_website = data.get('spend_website', 0)
        self.spend_youtube = data.get('spend_youtube', 0)
        self.projected_revenue_email = data.get('projected_revenue_email', 0)
        self.projected_revenue_facebook = data.get('projected_revenue_facebook', 0)
        self.projected_revenue_google_ads = data.get('projected_revenue_google_ads', 0)
        self.projected_revenue_instagram = data.get('projected_revenue_instagram', 0)
        self.projected_revenue_website = data.get('projected_revenue_website', 0)
        self.projected_revenue_youtube = data.get('projected_revenue_youtube', 0)
        self.actual_revenue_email = data.get('actual_revenue_email', 0)
        self.actual_revenue_facebook = data.get('actual_revenue_facebook', 0)
        self.actual_revenue_google_ads = data.get('actual_revenue_google_ads', 0)
        self.actual_revenue_instagram = data.get('actual_revenue_instagram', 0)
        self.actual_revenue_website = data.get('actual_revenue_website', 0)
        self.actual_revenue_youtube = data.get('actual_revenue_youtube', 0)
        self.impressions = data.get('impressions', 0)
        self.clicks = data.get('clicks', 0)
    
        db.session.commit()





