# -*- coding: utf-8 -*-

# Define here the models for your scraped items
#
# See documentation in:
# http://doc.scrapy.org/en/latest/topics/items.html

import scrapy


class Thesis(scrapy.Item):
    _id = scrapy.Field()
    date = scrapy.Field()
    collections = scrapy.Field()
    url = scrapy.Field()
    authors = scrapy.Field()
    organization = scrapy.Field()
    programme = scrapy.Field()
    orientation = scrapy.Field()
    abstract_fi = scrapy.Field()
    abstract_en = scrapy.Field()
    abstract_sv = scrapy.Field()
    language = scrapy.Field()
    subjects = scrapy.Field()  # by the librarian
    keywords = scrapy.Field()  # by the author
    titles = scrapy.Field()
    documents_url = scrapy.Field()
    year = scrapy.Field()  # academic year when thesis was issued
    # Added by loader
    topics = scrapy.Field()
    universities = scrapy.Field()
    degrees = scrapy.Field()


class Collection(scrapy.Item):
    _id = scrapy.Field()
    name = scrapy.Field()
