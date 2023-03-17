## Setup with Docker

### Build image and migrate database schema 
At the root directory of the project
```
sudo docker-compose run web python manage.py migrate
```

### Create admin
```
docker-compose run web python manage.py createadmin 1
```
Integer 1 is specified in order to create the admin automatically with 'admin' as username and password. If you want to create an admin manually, give 0 as an argument and execute with interactive shell.

### Run the server
```
docker-compose up
```
Open your browser at `http://0.0.0.0:8000` or any other IP of your local network and login as an admin that you have created. Then you can register new users from SignIn page and approve them from MyAdmin page.

Once you are done run
```
docker-compose down
```

### Delete database
```
sudo rm -rf data
```

### Remove image
```
docker container prune
docker image rm auctions:latest
docker image prune
```
