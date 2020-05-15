# ssensor scripts for pi6atv

## SNMP integration
Configure snmpd with the following:

    pass_persist .1.3.6.1.4.1.8072.2.255 /home/pi/wim/venv/bin/python -u /home/pi/wim/snmp-passthrough.py
    
## scraper
This script reads out all the sensors and writes the result into a json file

    ./venv/bin/python scraper.py
    
## Website
Install nginx and configure (`/etc/nginx/sites-enabled/default`):

    server {
    	listen 80 default_server;
    	listen [::]:80 default_server;
    	root /home/pi/wim/web/;
    	index index.html index.htm index.nginx-debian.html;
    	server_name _;
    	location / {
    		try_files $uri $uri/ =404;
    	}
    }

### building the website
When changes have been done, they need to be compiled:

    cd react-web
    yarn build
    
Copy the build directory to /home/pi/wim/web

# TODO
 * create a script to wrap everything into a debian package
 * create some CI code to build the react project, and the debian package