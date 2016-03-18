


inp = '"group=subjects&limit=100&where={"language":"en"}"'
out = [{'$unwind': 'subjects'},
	   {'$match': {'language': 'en'}}
	   {'$group': {'_id': 'subjects', 'count': {'$sum': 1}}},
	   {'$limit': 100}]



"""
CASES
group by subject, count
group by department, count

filter by subject, group by faculty, count
filter by faculty, group by subject, count



"""