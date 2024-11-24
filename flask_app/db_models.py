from datetime import datetime, timedelta
from flask_app import db, login_manager, app
from flask_login import UserMixin
import jwt

@login_manager.user_loader
def load_user(id):
    return User.query.get(int(id))

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(60), nullable=False)
    orders = db.relationship('Order', backref='orderer', lazy=True)

    # @staticmethod
    def get_reset_token(self):
        secret_key = app.config['SECRET_KEY']
        payload = {
                "user_id": self.id,
                "exp": datetime.now() + timedelta(seconds=3600),
                }
        token = jwt.encode(payload, secret_key, algorithm="HS256")
        return token

    @staticmethod
    def verify_reset_token(token):
        secret_key = app.config['SECRET_KEY']
        try:
            decoded_payload = jwt.decode(token, secret_key, algorithms=["HS256"])
            user_id = decoded_payload.get("user_id")
        except:
            None
        return User.query.get(user_id)
    
    def __repr__(self):
        return f"User('{self.username}', '{self.email}')"

class Order(db.Model):
    order_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    order_timestamp = db.Column(db.DateTime, nullable=False, default=datetime.now)
    order_item = db.Column(db.String(100), nullable=False)
    order_item_price = db.Column(db.Integer, nullable=False)
    order_quantity = db.Column(db.Integer, nullable=False)
    order_amnt = db.Column(db.Integer)

    @property
    def order_amnt(self):
        return self.order_item_price * self.order_quantity

    def __repr__(self):
        return f"Order('{self.order_id}', '{self.order_amnt}','{self.order_timestamp}')"
