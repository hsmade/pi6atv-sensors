# sensor scripts for pi6atv

## Installation
Install the latest debian package from the releases page.

## Development
* React sources [here](react-web/src/App.js)
* Sensor readers [here](sensors/)

## Testing
### SNMP integration
Configure snmpd with the following:

    pass_persist .1.3.6.1.4.1.8072.2.255 /opt/repeater-sensors/venv/bin/python -u /opt/repeater-sensors/snmp-passthrough.py
    
### scraper
This script reads out all the sensors and writes the result into a json file

    ./venv/bin/python scraper.py
    
### Website
Install nginx and configure (`/etc/nginx/sites-enabled/default`):

    server {
    	listen 80 default_server;
    	listen [::]:80 default_server;
    	root /opt/repeater-sensors/web/;
    	index index.html index.htm index.nginx-debian.html;
    	server_name _;
    	location / {
    		try_files $uri $uri/ =404;
    	}
    }

#### building the website
When changes have been done, they need to be compiled:

    cd react-web
    yarn build
    
Copy the build directory to /opt/repeater-sensors/web

# TODO
* ~~test fans~~
* test/fix flow sensor
* ~~test PA power sensor + mapping~~
* ~~cache value for PA power~~

* ~~implement fancontrol for cpu on gpio 8 + show on page~~
* find max and min values for fans
* ~~configure and implement min/max for values. Out of spec = yellow~~

* add prometheus metric for error state of sensors
* ~~make voltages 2.1 digits~~
* fix redraw on resize for dial
* allow to locally override the config
* ~~configure fancontrol, GPI-7~~
* ~~fix pass_persist in snmpd~~
* ~~cabinet open/closed +red/green on previous pa gpio, below PA power txt~~
* ~~make sorting for fans, 60-50-40~~
* ~~water cooling -> liquid pump~~
* ~~air cooling -> liquid cooling~~
* fix font on iphone
* check scaling / placement on phones