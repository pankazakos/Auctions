## Setup with Docker

### Build with dockerfile
At the root directory of the project
```
docker build .
```

### Migrate database schema
```
docker run web python3 manage.py migrate
```

### Create admin
```
docker run web python3 manage.py createadmin 1
```
Integer 1 is specified in order to create the admin automatically with 'admin' as username and password. If you want to create an admin manually give 0 as an argument.

### Run the server
```
docker-compose up
```
Open your browser at `0.0.0.0:8000` and you can login as an admin that you have created.


