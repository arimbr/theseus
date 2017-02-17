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
scrapy crawl thesis -o thesis.jl -t jsonlines
scrapy crawl collection -o collection.jl -t jsonlines
```
Load data from file to MongoDB:
```
mongoimport -d theseus -c thesis --drop --file  thesis.jl
mongoimport -d theseus -c collection --drop --file  collection.jl
```
