## Setup with Docker

### Build image and migrate database schema 
At the root directory of the project
```
docker-compose run web python manage.py migrate
```

### Create admin
```
docker-compose run web python manage.py createadmin 1
```
Integer 1 is specified in order to create the admin automatically with 'admin' as username and password. If you want to create an admin manually, give 0 as an argument and execute with interactive shell.

### Fill database
```
docker-compose run web python manage.py db 0 0 0 10
```

### Run the server
```
docker-compose up
```
Open your browser at `http://localhost:8000` and login as an admin that you have created. Then, you can register new users from SignIn page and approve them from MyAdmin page.

Once you are done run
```
docker-compose down
```

### Delete database
```
docker volume rm autions_postgres_data
```

### Remove image
```
docker container prune
docker image rm auctions_web:latest
docker image prune
```
