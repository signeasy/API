from flask import Flask, request, flash, url_for, redirect, render_template
from flask_sqlalchemy import SQLAlchemy
import logging
import json
import requests
import os
from app.settings import APP_STATIC

app = Flask(__name__)
app.config.from_object('config')
db = SQLAlchemy(app)

from app.models.users import Users

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/redirect/')
def code():
    return render_template('code.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/login', methods = ['POST'])
def login():
    server_error = {'status_code':500};
    if request.method == 'POST':
      if not request.form['email']:
         flash('Please enter email', 'error')
      else:
         user = Users(request.form['email'], "","")
         exists = db.session.query(Users).filter_by(email=user.email).scalar() is not None
         if exists:
             query_user = db.session.query(Users).filter_by(email=user.email).first()
             app.logger.debug(query_user)
             resp_dict = {'status_code':200, 'email': query_user.email, 'access_token': query_user.access_token, 'refresh_token':query_user.refresh_token}
             return json.dumps(resp_dict)
         else:
             db.session.add(user)
             db.session.commit()
             flash('Record was successfully added')
             resp_dict = {'status_code':200, 'email': user.email, 'access_token': user.access_token, 'refresh_token':user.refresh_token}
             return json.dumps(resp_dict)
    return json.dumps(server_error)

@app.route('/token', methods = ['POST'])
def token():
    server_error = {'status_code':500};
    if request.method == 'POST':
      if not request.form['email']:
         flash('Please enter email', 'error')
      else:
         user = Users(request.form['email'], request.form["access_token"],request.form["refresh_token"])
         exists = db.session.query(Users).filter_by(email=user.email).scalar() is not None
         if exists:
             query_user = Users.query.filter_by(email=user.email).first()
             query_user.access_token = user.access_token
             query_user.refresh_token = user.refresh_token
             db.session.commit()
             resp_dict = {'status_code':200, 'email': user.email, 'access_token': user.access_token, 'refresh_token':user.refresh_token}
             return json.dumps(resp_dict)
         else:
             resp_dict = {'status_code':404, 'message': 'User not found'}
             return json.dumps(resp_dict)

    return json.dumps(server_error)


@app.route('/logout', methods = ['POST'])
def logout():
    server_error = {'status_code':500};
    if request.method == 'POST':
      if not request.form['email']:
         flash('Please enter email', 'error')
      else:
         user = Users(request.form['email'],"","")
         exists = db.session.query(Users).filter_by(email=user.email).scalar() is not None
         if exists:
             query_user = Users.query.filter_by(email=user.email).first()
             query_user.access_token = ""
             query_user.refresh_token = ""
             db.session.commit()
             resp_dict = {'status_code':200,
              'message': 'User logged out',
              'email': query_user.email,
              'access_token': query_user.access_token,
              'refresh_token':query_user.refresh_token}
             return json.dumps(resp_dict)
         else:
             resp_dict = {'status_code':404, 'message': 'User not found'}
             return json.dumps(resp_dict)

    return json.dumps(server_error)

@app.route('/upload', methods = ['POST'])
def upload():
    server_error = {'status_code':500};
    if request.method == 'POST':
        header_token = request.headers.get('Authorization')
        url = 'https://rest-beta.getsigneasy.com/v1/files/original/'
        headers = {'Authorization': header_token}
        data = request.form
        files = {'file': open(os.path.join(APP_STATIC, 'doc/form4.pdf'), 'rb')}
        r = requests.post(url,  headers=headers, files=files, data=data)
        return r.text, r.status_code

    return json.dumps(server_error)

if __name__ == '__main__':
    db.create_all()
    app.run(debug=True)
