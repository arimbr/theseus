import json
import ast

from flask import Flask, request, render_template
from pymongo import MongoClient
from bson import json_util
from bson.objectid import ObjectId

# static_url_path sets the default url for static files to be in a static folder
# TOOD: refactor access to db
app = Flask(__name__, static_url_path='')
client = MongoClient()
db = client["theseus"]


def get_pipeline(where=None, group=None, limit=None, unwind=False):
    """ Gets a pipeline to filter and aggregate documents

    Arguments:
        where: dictionary
        group: string
        limit: should be able to parse an integer
        unwind: boolean

    Returns:
        dictionary
     """
    pipeline = []

    if '$' not in group:
        group = '$' + group

    # Filter options
    # Match aggregation should always go first for performance reasons
    if where:
        pipeline.append({'$match': where})

    # Grouping options
    if group:
        if unwind:
            pipeline.append({'$unwind': group})
        pipeline.extend([{'$group': {'_id': group, 'count': {'$sum': 1}}},
                        {'$sort': {'count': -1}}])
    # Limiting options
    if limit:
        limit = int(limit)
        pipeline.append({'$limit': limit})

    return pipeline

def jsonify(data):
    """ Transforms a dictionary from a Mongo request in BSON
    into a JSON string ready to be sent as a Response

        data: dictionary
    """
    return json_util.dumps(data, indent=4, separators=(',', ': '))


@app.route("/")
def hello():
    return render_template('index.html')

@app.route("/count")
def count():
    return json.dumps(db.theses.count())

@app.route("/thesis/<id>")
def thesis(id):
    thesis = db.theses.find_one({"_id": ObjectId(id)})
    return jsonify(thesis)

@app.route("/keywords")
def keywords():
    query_string = request.args.get("query")
    query = ast.literal_eval(query_string)
    cursor = db.theses.find(query)
    response = jsonify([document for document in cursor[:5]])
    return response

# /counts?group=subject&limit=100
# /counts?group=programme&limit=100
# /counts?group=subjects&limit=100&where={"language":"en"}
# /counts?group=subjects&limit=100&where={"collections":"com_10024_14"}
# /counts?group=collections&limit=100&where={"keywords":"Python"}
@app.route("/counts")
def counts():
    #import ipdb; ipdb.set_trace()
    group = request.args.get('group')
    limit = request.args.get('limit')
    where = ast.literal_eval(request.args.get('where', '{}'))
    pipeline = get_pipeline(where=where, group=group, limit=limit, unwind=True)
    cursor = db.theses.aggregate(pipeline=pipeline)
    counts = [d for d in cursor]
    return jsonify(counts)


if __name__ == "__main__":
    app.run(debug=True)
