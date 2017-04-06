# -*- coding: utf-8 -*-

# Define here the models for your scraped items
#
# See documentation in:
# http://doc.scrapy.org/en/latest/topics/items.html

import scrapy


class Thesis(scrapy.Item):
    _id = scrapy.Field()
    dates = scrapy.Field()
    collections = scrapy.Field()
    urls = scrapy.Field()
    authors = scrapy.Field()
    organizations = scrapy.Field()
    programmes = scrapy.Field()
    orientations = scrapy.Field()
    abstracts_fi = scrapy.Field()
    abstracts_en = scrapy.Field()
    abstracts_sv = scrapy.Field()
    languages = scrapy.Field()
    subjects = scrapy.Field()  # added by the librarian
    keywords = scrapy.Field()  # added by the author
    titles = scrapy.Field()
    document_urls = scrapy.Field()
    years = scrapy.Field()  # academic year when thesis was issued
    # Cleaned fields added by loader
    topics = scrapy.Field()
    university = scrapy.Field()
    degree = scrapy.Field()
    language = scrapy.Field()
    year = scrapy.Field()
    # Added time
    updatedat = scrapy.Field()


class Collection(scrapy.Item):
    _id = scrapy.Field()
    name = scrapy.Field()
