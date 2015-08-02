# Top Songs to Hear Before you Die 

![alt tag](https://cloud.githubusercontent.com/assets/10421005/9026152/f7b203cc-3956-11e5-928a-96eca51482d4.png)
![alt tag](https://cloud.githubusercontent.com/assets/10421005/9026154/fde20364-3956-11e5-88a8-ec53a3403760.png)
![alt tag](https://cloud.githubusercontent.com/assets/10421005/9026156/01cfb426-3957-11e5-9335-74c4870041d7.png)

##Overview

An interactive visualization of songs including playcount and listener statistics



###The data sources

The data sources for this visualization are [The Guardian's top 1000 songs to hear before you die](https://opendata.socrata.com/Fun/Top-1-000-Songs-To-Hear-Before-You-Die/ed74-c6ni) dataset for the track listing and the [last.fm Open API](http://last.fm/api) for the play statistics. Play counts and listener statistics were retrieved programatically with code included in this project.
    
###  Technologies used

The frontend was built using [dc.js](https://github.com/dc-js/dc.js) (charting), [crossfilter.js](https://square.github.io/crossfilter/) , [d3.js](http://d3js.org), and others. The backend was built in [Python](http://python.org), using the [Flask](http://flask.pocoo.org) microframework and [MongoDB](http://mongodb.com)</a>.
    

## Requisites

    Python 2.7+
    MongoDB
    Tested on Linux, Windows

## Installation

A database dump is included in this project and can be imported with `mongoimport`:

	mongoimport --db songstohear --collection guardiantop --type json --file topsongs.json --jsonArray

Python prequisites could be installed via pip with

	pip install -r prerequisites

### Running

	
	python run.py


## Todo

-	Implement a celery-based task runner to schedule statistic updates
