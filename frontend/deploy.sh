#!/bin/sh
npm run build && scp -r build/* mountains:/var/www/html