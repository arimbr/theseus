import scrapy

from collect.items import Thesis


class ThesisSpider(scrapy.Spider):
    name = "thesis"
    allowed_domains = ["publications.theseus.fi"]
    start_urls = ["http://publications.theseus.fi/oai/request?verb=ListRecords&metadataPrefix=kk"]

    def parse(self, response):
        response.selector.remove_namespaces()
        records = response.xpath('//OAI-PMH/ListRecords/record')

        for record in records:
            thesis = Thesis()
            thesis['_id'] = record.xpath('.//header/identifier/text()').extract_first()
            thesis['dates'] = record.xpath('.//header/datestamp/text()').extract()
            thesis['collections'] = record.xpath('.//header/setSpec/text()').extract()
            thesis['urls'] = record.xpath('.//metadata/link/@href').extract()
            thesis['authors'] = record.xpath('.//metadata/field[contains(@qualifier, "author")]/@value').extract()
            thesis['organizations'] = record.xpath('.//metadata/field[contains(@element, "organization")]/@value').extract()
            thesis['programmes'] = record.xpath('.//metadata/field[contains(@element, "programme")]/@value').extract()
            thesis['orientations'] = record.xpath('.//metadata/field[contains(@element, "orientation")]/@value').extract()
            thesis['abstracts_fi'] = record.xpath('.//metadata/field[contains(@qualifier, "abstract")][contains(@language, "fi")]/@value').extract()
            thesis['abstracts_en'] = record.xpath('.//metadata/field[contains(@qualifier, "abstract")][contains(@language, "en")]/@value').extract()
            thesis['abstracts_sv'] = record.xpath('.//metadata/field[contains(@qualifier, "abstract")][contains(@language, "sv")]/@value').extract()
            thesis['languages'] = record.xpath('.//metadata/field[contains(@element, "language")]/@value').extract()
            thesis['subjects'] = record.xpath('.//metadata/field[contains(@element, "subject")]/@value').extract()
            thesis['keywords'] = record.xpath('.//metadata/field[contains(@element, "keyword")]/@value').extract()
            thesis['titles'] = record.xpath('.//metadata/field[contains(@element, "title")]/@value').extract()
            thesis['document_urls'] = record.xpath('.//metadata/file/@href').extract()
            thesis['years'] = record.xpath('.//metadata/field[contains(@element, "date")][contains(@qualifier, "issued")]/@value').extract()
            yield thesis

        # Crawl next page if resumptionTokens is not empty
        resumptionTokens = response.xpath('//OAI-PMH/ListRecords/resumptionToken/text()').extract()
        if resumptionTokens:
            yield scrapy.Request("http://publications.theseus.fi/oai/request?verb=ListRecords&resumptionToken=" + resumptionTokens[0], callback=self.parse)
