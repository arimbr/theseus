# -*- coding: utf-8 -*-

# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: http://doc.scrapy.org/en/latest/topics/item-pipeline.html
import json


IFILE = "output.jl"


class JsonWriterPipeline(object):

    def __init__(self):
        self.ifile = open(IFILE, 'w')

    def process_item(self, item, spider):
        item = dict(item)
        iline = json.dumps(item) + "\n"
        self.ifile.write(iline)
        return item
