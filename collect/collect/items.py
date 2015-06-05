# -*- coding: utf-8 -*-

# Define here the models for your scraped items
#
# See documentation in:
# http://doc.scrapy.org/en/latest/topics/items.html

import scrapy


class Thesis(scrapy.Item):
    identifier = scrapy.Field()
    date = scrapy.Field()
    collections = scrapy.Field()
    url = scrapy.Field()
    authors = scrapy.Field()
    abstract_fi = scrapy.Field()
    abstract_en = scrapy.Field()
    language = scrapy.Field()
    subjects = scrapy.Field()
    title = scrapy.Field()
    document = scrapy.Field()
