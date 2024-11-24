from flask import render_template, flash, redirect, url_for, request
from flask_app import app, db, bcrypt, mail
from flask_app.forms import RegistrationForm, LoginForm, UpdateAccountForm, CartForm, RequestResetForm,ResetPasswordForm
from flask_app.db_models import User, Order 
from flask_login import login_user, current_user, logout_user, login_required
from flask_mail import Message

@app.route('/')
def home():
    logout_user() # existing user logged out after restarting the server
    return render_template('home.html')

@app.route('/menu')
def menu():
    return render_template('menu.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('home'))
    form = RegistrationForm()
    if form.validate_on_submit():
        hashed_password = bcrypt.generate_password_hash(form.password.data).decode('utf-8')
        user = User(username=form.username.data, email=form.email.data, password=hashed_password)
        db.session.add(user)
        db.session.commit()
        flash(f'Account created for {form.username.data}!', 'success')
        return redirect(url_for('login'))
    return render_template('register.html', title='Register', form=form)

@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('home'))
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(email=form.email.data).first()
        if user and bcrypt.check_password_hash(user.password, form.password.data):
            login_user(user, remember=form.remember.data)
            flash('You have successfully logged in.', 'success')
            return redirect(url_for('account'))
        else:
            flash('Login unsuccessful. Please check your email and password.', 'danger')
    return render_template('login.html', title='Login', form=form)

@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('home'))

@app.route('/account', methods=['GET', 'POST'])
@login_required
def account():
    # Count the number of items in the user's cart
    cart_item_count = Order.query.filter_by(user_id=current_user.id).count()

    return render_template('account.html', cart_item_count=cart_item_count)

@app.route('/update', methods=['GET', 'POST'])
@login_required
def update():
    form = UpdateAccountForm()
    if form.validate_on_submit():
        current_user.username = form.username.data
        current_user.email = form.email.data
        db.session.commit()
        flash('Yourt account has been updated !', 'success')
        return redirect(url_for('account'))
    elif request.method == 'GET':
        form.username.data = current_user.username 
        form.email.data = current_user.email
    return render_template('update.html', title='update', form=form)

@app.route('/place_order/<string:item>/<int:price>', methods=['POST'])
@login_required
def place_order(item, price):
    quantity = 1  # Default quantity
    new_order = Order(
        user_id=current_user.id,
        order_item=item,
        order_item_price=price,
        order_quantity=quantity
    )
    db.session.add(new_order)
    db.session.commit()
    flash(f"{item} has been added to your cart!", "success")
    return redirect(url_for('menu'))

@app.route('/cart')
@login_required
def view_cart():
    orders = Order.query.filter_by(user_id=current_user.id).all()
    cart_item_count = len(orders)  # Get the updated cart item count
    total_amount = sum(order.order_amnt for order in orders)  # Calculate total amount in the cart

    return render_template('cart.html', orders=orders, cart_item_count=cart_item_count, total_amount=total_amount)


@app.route('/remove_from_cart/<int:order_id>', methods=['POST'])
@login_required
def remove_from_cart(order_id):
    # Find the order item in the cart based on the order_id
    order = Order.query.filter_by(order_id=order_id, user_id=current_user.id).first()

    if order:
        db.session.delete(order)  # Remove the order from the cart
        db.session.commit()  # Commit the change to the database

    return redirect(url_for('view_cart'))  # Redirect back to the cart page


@app.route('/checkout', methods=['GET', 'POST'])
@login_required
def checkout():
    if request.method == 'POST':
        # Retrieve the user's orders
        orders = Order.query.filter_by(user_id=current_user.id).all()
        
        # Process payment or order confirmation logic
        for order in orders:
            db.session.delete(order)  # Assuming orders are cleared after checkout
        db.session.commit()
        
        # Redirect to Thank You page
        return redirect(url_for('thank_you'))
    
    # For GET requests, show the checkout page
    orders = Order.query.filter_by(user_id=current_user.id).all()
    total_amount = sum(order.order_amnt for order in orders)
    return render_template('checkout.html', orders=orders, total_amount=total_amount)

@app.route('/thank_you')
@login_required
def thank_you():
    return render_template('thank_you.html')

def send_reset_email(user):
    token = user.get_reset_token()
    msg = Message('Password Reset Request', sender='noreply@demo.com', recipients=[user.email])
    msg.body = f''' To reset your password, visit the following link
{url_for('reset_token', token=token, _external=True)}
If you did not make this request then please ignore this email.
'''
    mail.send(msg)

@app.route('/reset_request', methods=['GET', 'POST'])
def reset_request():
    if current_user.is_authenticated:
        return redirect(url_for('home'))
    form = RequestResetForm()
    if form.validate_on_submit():
        user = User.query.filter_by(email=form.email.data).first()
        send_reset_email(user)
        flash('An email has been sent to your email with instructions to set your password', 'info')
        return redirect(url_for('login'))
    return render_template('reset_request.html', title = 'Reset Password', form=form)

@app.route('/reset_request/<token>', methods=['GET', 'POST'])
def reset_token(token):
    if current_user.is_authenticated:
        return redirect(url_for('home'))
    user = User.verify_reset_token(token)
    if user is None:
        flash('That is an invalid or expired token', 'warning')
        return redirect(url_for('reset_request'))
    form = ResetPasswordForm()
    if form.validate_on_submit():
        hashed_password = bcrypt.generate_password_hash(form.password.data).decode('utf-8')
        user.password = hashed_password
        db.session.commit()
        flash(f'Your password has been updated!', 'success')
        return redirect(url_for('login'))
    return render_template('reset_password.html', title = 'Reset Password', form=form)