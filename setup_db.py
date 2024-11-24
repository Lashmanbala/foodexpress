from flask_app import db, app
from flask_app.db_models import User, Order

with app.app_context():
    # db.create_all()
    # print("Database tables created.")

    # user1 = User(username='bala', email='bala@gmail.com', password='password')
    # db.session.add(user1)
    # db.session.commit()
    a = User.query.all()
    for i in a:
        print(i)
        print(i.password)
    # order = Order(user_id=1, order_item="Pizza", order_item_price=200, order_quantity=3)
    # db.session.add(order)
    # db.session.commit()
    # a = Order.query.all()
    # for i in a:
    #     print(i)
    #     print(i.orderer) 
    # print(order.order_amnt)  # Outputs: 600

# with app.app_context():
#     user1 = User(username='bala', email='bala@gmail.com', password='password')
#     db.session.add(user1)
#     db.session.commit()
#     a = User.query.all()
#     for i in a:
#         print(i)
    
# User.query.all()
# User.query.first()
# User.query.filter_by(username='Bala').all()
# User.query.filter_by(username='Bala').first()
# user = User.query.filter_by(username='Bala').first()
# user.id
# user = User.query.get(1)
# user.orders

# with app.app_context():
    # order1 = Order(order_item='Idly',user_id = 1, order_item_price = 40, order_quantity=2, order_amnt=80)
    # db.session.add(order1)
    # db.session.commit()
    # a = Order.query.all()
    # for i in a:
    #     print(i)
    #     print(i.orderer)     # note here. it gives entire user detail.
    # db.drop_all()
    # db.create_all()
    # print("Database tables created.")
    # user1 = User(username='bala', email='bala@gmail.com', password='password')
    # order = Order(user_id=1, order_item="Pizza", order_item_price=200, order_quantity=3)
    # db.session.add(order)
    # db.session.commit()
    # a = Order.query.all()
    # for i in a:
    #     print(i)
    #     print(i.orderer) 
    # print(order.order_amnt)  # Outputs: 600
