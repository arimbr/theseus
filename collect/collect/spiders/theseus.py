import scrapy

from collect.items import Thesis


class TheseusSpider(scrapy.Spider):
    name = "theseus"
    allowed_domains = ["http://publications.theseus.fi"]
    start_urls = ["http://publications.theseus.fi/oai/request?verb=ListRecords&metadataPrefix=kk"]

    def parse(self, response):
        response.selector.remove_namespaces()
        records = response.xpath('//OAI-PMH/ListRecords/record')

        for record in records:
            thesis = Thesis()
            thesis['identifier'] = record.xpath('.//header/identifier/text()').extract()
            thesis['date'] = record.xpath('.//header/datestamp/text()').extract()
            thesis['collections'] = record.xpath('.//header/setSpec/text()').extract()
            thesis['url'] = record.xpath('.//metadata/link/@href').extract()
            thesis['authors'] = record.xpath('.//metadata/field[contains(@qualifier, "author")]/@value').extract()
            thesis['abstract_fi'] = record.xpath('.//metadata/field[contains(@qualifier, "abstract")][contains(@language, "fi")]/@value').extract()
            thesis['abstract_en'] = record.xpath('.//metadata/field[contains(@qualifier, "abstract")][contains(@language, "en")]/@value').extract()
            thesis['language'] = record.xpath('.//metadata/field[contains(@element, "language")]/@value').extract()
            thesis['subjects'] = record.xpath('.//metadata/field[contains(@element, "subject")]/@value').extract()
            thesis['title'] = record.xpath('.//metadata/field[contains(@element, "title")]/@value').extract()
            thesis['document'] = record.xpath('.//metadata/file/@href').extract()
            yield thesis
