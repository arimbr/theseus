import scrapy

from collect.items import Collection


class CollectionSpider(scrapy.Spider):
    name = "collection"
    allowed_domains = ["publications.theseus.fi"]
    start_urls = ["http://publications.theseus.fi/oai/request?verb=ListSets"]

    def parse(self, response):
        response.selector.remove_namespaces()
        records = response.xpath('//OAI-PMH/ListSets/set')

        for record in records:
            collection = Collection()
            collection['id'] = record.xpath('setSpec/text()').extract_first()
            collection['name'] = record.xpath('setName/text()').extract_first()
            yield collection

        # Crawl next page if resumptionTokens is not empty
        resumptionTokens = response.xpath('//OAI-PMH/ListSets/resumptionToken/text()').extract()
        if resumptionTokens:
            yield scrapy.Request("http://publications.theseus.fi/oai/request?verb=ListSets&resumptionToken=" + resumptionTokens[0], callback=self.parse)
