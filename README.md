# mountains
Mountaineering club site

# Deployment
## Frontend

To deploy the frontend, go to the frontend directory and

```
npm run build
scp -r build*/ <ssh host>:/var/www/html
```