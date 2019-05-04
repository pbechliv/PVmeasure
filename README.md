# First time setup

### 1. Install Requirements
  * [python](https://www.python.org/downloads/)
  * [node](https://nodejs.org/en/download/)
  * [git](https://git-scm.com/downloads)
  * [docker desktop](https://www.docker.com/get-started)

### 2. Clone repository
  1. Open a terminal and type <b>git clone https://.github.com/pbechliv/PVmeasure.git</b>
  2. Open the directory with the terminal

### 3. Create python environment
  1. python -m venv venv
  2. venv/bin/activate
  3. pip install -r requirements.txt

### 4. Start development databases
  docker-compose -f postgres-dev up -d

### 5. Start backend servers
  1. cd recordings_api
  2. python manage.py migrate
  3. python manage.py createsuperuser (enter username and password)
  4. python manage.py runserver
  5. cd ../notes_api
  6. python manage.py migrate
  7. python manage.py runserver

### 6. Start web client
  1. cd client
  2. npm install
  3. npm start