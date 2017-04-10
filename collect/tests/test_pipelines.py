from unittest import TestCase
import datetime

from collect.pipelines import get_topics, get_date, get_year


class PipelinesTest(TestCase):

    def test_get_topics(self):
        """It should remove duplicates, remove empty and normalize topics"""
        keywords = ["Java", "", "hibernate"]
        subjects = ["java", "sql"]
        topics = get_topics(keywords, subjects)
        self.assertCountEqual(topics, ["java", "sql", "hibernate"])

    def test_get_date(self):
        """It should get a DateTime object from a list of strings"""
        date = get_date(["2013-08-19T10:18:05Z"])
        self.assertIsInstance(date, datetime.datetime)

    def test_get_year(self):
        """It should get the year form a list of string"""
        self.assertEqual(get_year(["2004"]), 2004)
        self.assertEqual(get_year(["2004-05-05"]), 2004)
        self.assertEqual(get_year(["[2006]"]), 2006)
        self.assertEqual(get_year(["2010-09-24T08:29:36Z"]), 2010)
        self.assertEqual(get_year(["2009,2010"]), 2009)
