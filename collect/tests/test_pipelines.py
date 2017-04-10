from unittest import TestCase

from collect.pipelines import get_topics


class PipelinesTest(TestCase):

    def test_get_topics(self):
        """It should remove duplicates, remove empty and normalize topics"""
        keywords = ["Java", "", "hibernate"]
        subjects = ["java", "sql"]
        topics = get_topics(keywords, subjects)
        self.assertCountEqual(topics, ["java", "sql", "hibernate"])
