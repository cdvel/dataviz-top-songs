# Songs to Head Before you Die



## Data sources

[Top 1,000 Songs To Hear Before You Die](https://opendata.socrata.com/Fun/Top-1-000-Songs-To-Hear-Before-You-Die/ed74-c6ni)
A list of the Guardian's "Top 1,000 Songs to Hear Before You Die"


## Step by step guide

Loading songs into the databases

	mongoimport --db songstohear --collection guardiantop --type json --file top1000.json --jsonArray

### Dependencies

*Python*

	pip install -r dependencies

- Flask
