# Oswald
A slack bot for Stevens Ultimate

## Installation
1. `$ npm install`
2. Get Slack API token and add it to the credentials folder in a file called
slackToken.json formatted as {"token":"[token]"}
3. Get Google calendar client secret and add it to the credentials folder as a
file called client_secret.json
4. `$ npm start`

## Notes
For google calendar client secret, follow these steps: https://developers.google.com/calendar/quickstart/nodejs
For slack api, create the app and then navigate to OAuth and permissions. Then use Bot User OAuth access token
Then it should work.
For AWS setup with nodejs, follow this: https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-up-node-on-ec2-instance.html
please use ubuntu server for AWS - it is so much easier to work with for node and npm

`screen ./startup.sh`
use that to start the script when entering terminal (I tried using cronjob but it just didn't work for some reason)
[see this for more details](https://askubuntu.com/questions/8653/how-to-keep-processes-running-after-ending-ssh-session)
---
### cronjobs (automatic updates):
* install postfix: `sudo apt-get install postfix`
* edit: `crontab -e`
* (run as sudo su)
* edit permissions: `sudo chmod 777 .git`
* service: `sudo service cron start | status | restart`
* cronjob for updating git repo every hour:
* `0 * * * * su -s /bin/sh root -c 'cd /home/joshuatorwebsite/torwebsite && git pull origin master'`
* every minute:
* `*/1 * * * *`
* `0 * * * * su -s /bin/sh root -c 'cd /home/stevensultimateducks/Oswald && git pull origin master && node app.js'`
