## Synopsis

Himalaya Doc Writer app is a simple app that displays a document and allows the user to sign using SignEasy API.

## Motivation

Creating a client web app would help build the API platform keeping the customer in focus. This would enable our team at SignEasy to visualize the product and gauge the progress. Alternatively, this would also be an example to our clients willing to try out our API platforms

## Installation

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
