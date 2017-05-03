## Introduction

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
