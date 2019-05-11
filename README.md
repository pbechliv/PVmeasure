# First time setup

### 1. Install Requirements
  * [git](https://git-scm.com/downloads)
  * [docker desktop](https://www.docker.com/get-started)

### 2. Clone repository
  1. Open a terminal and type <b>git clone https://.github.com/pbechliv/PVmeasure.git</b>
  2. Open the directory with the terminal

### 3. Start docker containers
  1. docker-compose up -d
  2. docker-compose exec notes_api python manage.py makemigrations
  3. docker-compose exec notes_api python manage.py migrate
  4. docker-compose exec recordings_api python manage.py makemigrations
  5. docker-compose exec recordings_api python manage.py migrate
  6. docker-compose exec recordings_api python manage.py createsuperuser
  7. docker-compose exec recordings_api python manage.py createsuperuser

### 4. Open app in browser
  1. go to localhost:4000 and enter your username and password

# After first time setup
Just open the directory of the application,
execute the command <b>docker-compose up</b> and go to <b>localhost:4000</b>