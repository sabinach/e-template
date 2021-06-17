#!/bin/bash

heroku config:get DB_DATABASE -s >> .env
heroku config:get DB_HOST -s >> .env
heroku config:get DB_PASSWORD -s >> .env
heroku config:get DB_PORT -s >> .env
heroku config:get DB_USER -s >> .env
