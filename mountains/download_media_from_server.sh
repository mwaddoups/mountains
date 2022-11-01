#!/bin/bash
set -x
set -e

rm -r media
scp -r mountains:/var/www/html/media .