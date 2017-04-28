from app import db

class Users(db.Model):
    id = db.Column('user_id', db.Integer, primary_key = True)
    email = db.Column(db.String(100), unique=True)
    access_token = db.Column(db.String(100))
    refresh_token = db.Column(db.String(50))

    def __init__(self, email, access_token, refresh_token):
        self.email = email
        self.access_token = access_token
        self.refresh_token = refresh_token

    def __repr__(self):
        return '<User %r>' % (self.email)
