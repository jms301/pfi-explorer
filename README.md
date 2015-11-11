pfi-explorer
============
This project brings togther data from: 

* HM Treasury 
* The NAO 
* Opencorporates 
* academic research 

It allows the user to browse through all historical and current projects, looking at costs over the period of the project, connections (via opencorporates) to owning companies (allowing connections between directors to be made),  It has some reports on projects by the National Audit Office. 

November 2015 update
====================

Soon

Running locally
===============

To run this on a Mac

* Install mongodb - `$ brew install mongodb`
* Start mongodb (If you didn't set it to autostart) - `mongod --config /usr/local/etc/mongod.conf`

In a new terminal window/tab

* Install the latest meteor - `$ curl https://install.meteor.com/ | /bin/sh`
* Clone this repo
* Load the data into your local mongodb instance - `$ cd .data && ./dataload.sh && cd ..`
* Run meteor, specifying where to connect to your local mongodb - `$ MONGO_URL=mongodb://127.0.0.1:27017/meteor meteor`
* Visit [http://localhost:3000](http://localhost:3000) and wonder at the marvels of technology

