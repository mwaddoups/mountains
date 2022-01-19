# mountains
Mountaineering club site

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