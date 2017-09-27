# SignEasy API Platform 

SignEasy APIs offers a seamless way to manage your account and request signatures on your documents. The API follows the REST protocol and is available on HTTPS only.

The API enables you to - 
 * Request signatures on your documents
 * Import new documents into your account
 * Fetch your original, signed and pending signature requests 
 * Download your original and signed documents
 * Take actions on your pending signature requests 
 * Check status of your pending signature requests 

## Getting Started
The API platform is currently in beta. If you are interested in using the APIs for your application on production, please reach out to us [here](http://lp.getsigneasy.com/api-request/) and you will receive priority technical assistance for your integrations. 

This document contains details on how to get started with integrating the APIs before you take it to production. 

**Next:** [API Endpoints](https://github.com/signeasy/Himalaya-Doc-Writer/wiki/API-Endpoints)

## Contact 

1. API Access: http://lp.getsigneasy.com/api-request/
2. Technical Assistance: support@getsigneasy.com
3. Sales Enquiries: sales@getsigneasy.com

## Sample App (Himalaya Doc Writer) 

Himalaya Doc Writer is a simple app to showcase the capabilities of SignEasy API platform. The app displays a document and allows a user to sign or request signatures using the SignEasy API.

The app showcases document import and document signing capability via the SignEasy web platform. 

## Usage 
You can find the app available at https://himalaya.getsigneasy.com


## Build Instructions 
**Install HomeBrew**

```/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)```

**Install Python**

```brew install python```

**Insall VirtualEnv**

```pip install virtualenv```

**Create a VirtualEnv for the webapp**

```
cd path/to/sample/app/folder
virtualenv hwd_env
source hwd_env/bin/activate
```

**Install requirements**

```pip install requirements.txt```

**Set-up DB**

Initialize the db
```
python init_db.py
```

Make your first db migration
```
python db_migrate.py
```


## Run the web app

``` gunicorn --config=gunicorn.py --reload app:app ```
