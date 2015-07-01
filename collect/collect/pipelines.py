# -*- coding: utf-8 -*-

# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: http://doc.scrapy.org/en/latest/topics/item-pipeline.html
import json


OUT = "output.jl"


class JsonWriterPipeline(object):

    def __init__(self):
        self.out = open(OUT, 'w')

    def process_item(self, item, spider):
        item = dict(item)
        line = json.dumps(item) + "\n"
        self.out.write(line)
        return item
