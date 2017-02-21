# -*- coding: utf-8 -*-

# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: http://doc.scrapy.org/en/latest/topics/item-pipeline.html
import pymongo
from scrapy.conf import settings

from items import Thesis, Collection


class MongoDBPipeline(object):

    def __init__(self):
        connection = pymongo.MongoClient(
            settings['MONGODB_HOST'],
            settings['MONGODB_PORT']
        )
        db = connection[settings['MONGODB_DB']]
        self.theses = db[settings['MONGODB_THESES_COLLECTION']]
        self.collections = db[settings['MONGODB_COLLECTIONS_COLLECTION']]

    def transform_collection(self, item):
        return item

    def transform_thesis(self, item):
        # Add topics field
        topics = set(item['subjects']).union(item['keywords'])
        topics = [topic.lower() for topic in topics if topic]
        item['topics'] = topics

        # Add universities field
        university_ids = [
            _id for _id in item['collections'] if _id.startswith('com')
        ]
        universities = self.collections.find(
            {'_id': {'$in': university_ids}}
        )
        item['universities'] = [u['name'] for u in universities]

        # Add degree field
        degree_ids = [
            _id for _id in item['collections'] if _id.startswith('col')
            ]
        degrees = self.collections.find(
            {'_id': {'$in': degree_ids}},
        )
        item['degrees'] = [d['name'] for d in degrees]

        return item

    def load_collection(self, item):
        result = self.collections.replace_one(
            {'_id': item['_id']},
            item,
            upsert=True
        )

    def load_thesis(self, item):
        result = self.theses.replace_one(
            {'_id': item['_id']},
            item,
            upsert=True
        )

    def process_item(self, item, spider):
        if isinstance(item, Thesis):
            item = self.transform_thesis(item)
            self.load_thesis(item)
            return item
        elif isinstance(item, Collection):
            item = self.transform_collection(item)
            self.load_collection(item)
            return item
