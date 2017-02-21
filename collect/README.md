theseus.fi Scraper
===========

Scraping thesis data from publications.theseus.fi

Requried packages:
```
sudo apt-get install python-dev libxml2-dev libxslt-dev libffi-dev build-essential libssl-dev libffi-dev
```
Set up:
```
virtualenv env

source env/bin/activate

pip install -r requirements.txt

```
Run scraper and save output to file:
```
scrapy crawl collection --logfile="collections.log"
scrapy crawl thesis --logfile="theses.log"

```
Load data from file to MongoDB:
```
mongoimport -d theseus -c collections --drop --file  collections.jl
mongoimport -d theseus -c theses --drop --file  theses.jl
```
