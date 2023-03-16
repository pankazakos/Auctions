# Auctions

## Description
Auctions is a web app that allows users to create their own auctions for their items and place bids on other items published by other users. Only registered users can create auctions and place bids. Users of the app that do not have an account can still browse and search the available auctions. Search is based on text, categories, price limits and location. Registered users also get recommendations by displaying the recommended items at the top of their search and browse page. [Matrix factorization](https://developers.google.com/machine-learning/recommendation/collaborative/matrix) is used as a recommendation algorithm and has been implemented from scratch (More at Readme.pdf).

## Setup

### PostgreSQL
First you need to create a database named 'auction' in PostgreSQL. Make sure you have installed [PostgreSQL](https://www.postgresql.org/).
```
sudo -u postgres psql     // open psql as postgres user
create database auction;  // create database
```
Make sure `django/auction/auction/settings.py` has correct configuration at DATABASES dictionary to connect to your database (including your credentials).

### Django
At the root directory of the project run the following to install django dependencies.
``` 
pip install -r requirements.txt
```

### Certificate (Skip if you do not need HTTPS)
It is recommended to use mkcert. After installing it you should run the following under `django/auction`.

Install a local certificate authority (CA) in the system trust store
```
mkcert -install 
```
Generate a certificate for the localhost domain
```
mkcert -cert-file cert.pem -key-file key.pem localhost 127.0.0.1
```

### Create at least one admin user
Under `django/auction/` run the below script and follow the prompts
```
python3 manage.py createadmin
```

### Fill database with data from datasets (`ebay-data/items-0.xml` seems to be working)
Instead of manually creating users from register page you can use the below script to fill the database with the datasets given.
```
// fill database from 0 until 10 items of the dataset items-0.xml
python3 manage.py db 0 0 0 10
```
Please refer to source code and Readme.pdf for more information about the parameters of the script.

### Approve users (IMPORTANT)
Every user that registers must wait for admin approval. [Run](#run-back-end-server) the server, login as an admin user and under MyAdmin route, approve registered users.

## Run back-end server
In order to run the server with HTTPS run
```
python3 manage.py runsslserver --certificate cert.pem --key key.pem
```
If you don't need HTTPS simply run
```
python3 manage.py runserver
```
Finally, you can open your browser at localhost:8000 to interact with the web page.

## Calculate and apply recommendations
To calculate the recommendations for each user you will need to stop the server, since it is not configured to run as a job on Django server. Run the below python script and then run again the server to see the changes. The top 3 items in the browse page should be the recommended items.
```
python3 manage.py calc_recom
```
Note that the recommendations may take a while. Testing in small datasets is recommended.

## Front-end Development
If you want to make changes at the front-end it is highly recommended to use the development server of React instead of building the project each time.
```
cd react/auction
npm install
npm start
```
At the same time the back-end server must be running on another port. The CORS policy is enabled on the django server.
