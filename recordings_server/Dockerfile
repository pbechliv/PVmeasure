# Copyright 2013 Thatcher Peskens
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

FROM ubuntu:bionic

# Install required packages and remove the apt packages cache when done.

RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y \
    python3 \
    python3-dev \
    python3-setuptools \
    python3-pip \
    nginx \
    supervisor \
    sqlite3 && \
    pip3 install -U pip setuptools && \
    rm -rf /var/lib/apt/lists/*

# install the latest version of PIP
RUN pip3 install --upgrade pip

# install uwsgi now because it takes a little while
RUN pip3 install uwsgi

# setup all the configfiles
RUN echo "daemon off;" >> /etc/nginx/nginx.conf
COPY ./docker_configs/nginx_app.conf /etc/nginx/sites-available/default
COPY ./docker_configs/supervisor-app.conf /etc/supervisor/conf.d/

RUN pip3 install -r /home/docker/PVmeasure/recordings_server/requirements.txt

COPY . /home/docker/PVmeasure/recordings_server/
RUN mkdir /var/log/uwsgi/ && mkdir /home/docker/PVmeasure/recordings_server/assets/ && mkdir /home/docker/PVmeasure/recordings_server/logs/

EXPOSE 80
CMD ["supervisord", "-n"]
