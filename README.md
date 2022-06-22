# mountains
Mountaineering club site

# Running Locally
## Back end
1. Install the Python package manager poetry on your machine
2. `cd` into the mountains directory (the back end project)
3. Run `poetry install` to install python packages
4. Run database migrations to ensure the database is up to date with `poetry run python manage.py migrate`
5. Run the command `poetry run python manage.py runserver` to start the server locally

## Database access
1. Install sqlite 3 and add it to your PATH environment variable 
2. `cd` into the mountains directory and run 'poetry run python manage.py dbshell`

## front end
1. Install nodeJs and the bundled npm package manager on your machine
2. `cd` into the frontend directory
3. Run `npm install` to install all packages
4. Run `npm start` to run locally

# Deployment
## Frontend

To deploy the frontend, go to the frontend directory and

```
npm run build
scp -r build*/ <ssh host>:/var/www/html
```

## Backend

This is deployed via gunicorn, which is serving django out of the downloaded git repository.

As such, if I want to update to a new version, it should be as simple as

1. Use git to pull in the new version of the repo.
2. Use poetry if needed to update any dependencies.
3. Do any migrations (ensuring `DJANGO_APP_STAGE=prod` when running commands).
4. Restart gunicorn and the socket (`systemctl restart gunicorn gunicorn.socket`).
