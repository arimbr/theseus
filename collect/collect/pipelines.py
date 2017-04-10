# -*- coding: utf-8 -*-

# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: http://doc.scrapy.org/en/latest/topics/item-pipeline.html
import re
import logging
from datetime import datetime

import pymongo

from .items import Thesis, Collection


logger = logging.getLogger(__name__)


def get_topics(subjects, keywords):
    """Joins subjects and keywords and removes duplicates"""
    topics = set(subjects).union(keywords)
    return list(set(
        [topic.lower().strip() for topic in topics if topic.strip()]
    ))


def get_university(collections):
    """Gets the first university id"""
    university_ids = [_id for _id in collections if _id.startswith('com')]
    if len(university_ids) > 0:
        return {
            '_id': university_ids[0]
        }
    return None


def get_degree(collections):
    """Gets the first degree id"""
    degree_ids = [_id for _id in collections if _id.startswith('col')]
    if len(degree_ids) > 0:
        return {
            '_id': degree_ids[0]
        }
    return None


def get_year(years):
    """Parses the year"""
    try:
        # Take the first 4 digits as the year
        return int(re.findall(r'\d{4}', years[0])[0])
    except Exception:
        logger.exception("Couldn't get year from: {}".format(years))
        return None

def get_language(languages):
    """Parses the language"""
    if len(languages) > 0 and languages[0]:
        return languages[0].lower().strip()
    return None


class MongoDBPipeline(object):

    def __init__(self, mongo_host, mongo_port, mongo_db):
        self.mongo_host = mongo_host
        self.mongo_port = mongo_port
        self.mongo_db = mongo_db

    @classmethod
    def from_crawler(cls, crawler):
        return cls(
            mongo_host=crawler.settings.get('MONGODB_HOST'),
            mongo_port=crawler.settings.get('MONGODB_PORT'),
            mongo_db=crawler.settings.get('MONGODB_DB')
        )

    def open_spider(self, spider):
        self.client = pymongo.MongoClient(self.mongo_host, self.mongo_port)
        self.db = self.client[self.mongo_db]

    def transform_collection(self, item):
        return item

    def transform_thesis(self, item):
        item['topics'] = get_topics(item['subjects'], item['keywords'])
        item['university'] = get_university(item['collections'])
        item['degree'] = get_degree(item['collections'])
        item['year'] = get_year(item['years'])
        item['language'] = get_language(item['languages'])
        return item

    def add_time(self, item):
        item['updatedat'] = datetime.now()
        return item

    def load_collection(self, item):
        item = self.add_time(item)
        result = self.db.collections.replace_one(
            {'_id': item['_id']},
            item,
            upsert=True
        )

    def load_thesis(self, item):
        item = self.add_time(item)
        try:
            result = self.db.theses.replace_one(
                {'_id': item['_id']},
                item,
                upsert=True
            )
        except Exception:
            logger.exception("Couldn't load item: {}".format(item))

    def process_item(self, item, spider):
        if isinstance(item, Thesis):
            item = self.transform_thesis(item)
            self.load_thesis(item)
            return item
        elif isinstance(item, Collection):
            item = self.transform_collection(item)
            self.load_collection(item)
            return item
