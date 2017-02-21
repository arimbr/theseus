# -*- coding: utf-8 -*-

# Scrapy settings for collect project
#
# For simplicity, this file contains only the most important settings by
# default. All the other settings are documented here:
#
#     http://doc.scrapy.org/en/latest/topics/settings.html
#

BOT_NAME = 'collect'

SPIDER_MODULES = ['collect.spiders']
NEWSPIDER_MODULE = 'collect.spiders'
DOWNLOAD_DELAY = 5

ITEM_PIPELINES = {
    'collect.pipelines.MongoDBPipeline': 100,
}

# Crawl responsibly by identifying yourself (and your website) on the user-agent
USER_AGENT = 'collect (+http://users.metropolia.fi/~ariba)'

# MongoDB settings for pipelines
MONGODB_HOST = "localhost"
MONGODB_PORT = 27017
MONGODB_DB = "theseus"
MONGODB_THESES_COLLECTION = "theses"
MONGODB_COLLECTIONS_COLLECTION = "collection"

