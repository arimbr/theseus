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
Run:
```
scrapy crawl theseus
```
