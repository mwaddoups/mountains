#!/bin/bash
set -x
set -e

ssh -t mountains "cd mountains/mountains && DJANGO_APP_STAGE=prod /root/.local/bin/poetry run python manage.py dumpdata --natural-foreign --natural-primary -e contenttypes -e auth.Permission --indent 2 > datadump.json"
scp mountains:~/mountains/mountains/datadump.json datadump.json
rm db.sqlite3
poetry run python manage.py migrate
poetry run python manage.py loaddata datadump.json