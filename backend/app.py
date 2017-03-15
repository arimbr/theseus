import json
import ast

from flask import Flask, request, render_template
from pymongo import MongoClient
from bson import json_util
from bson.objectid import ObjectId

from flask_cors import CORS

import settings

# static_url_path sets the default url for static files to be in a static folder
# TOOD: refactor access to db
app = Flask(__name__, static_url_path='')
CORS(app)

# MongoDB configuration
connection = MongoClient(
    settings.MONGODB_HOST,
    settings.MONGODB_PORT
)
db = connection[settings.MONGODB_DB]


def build_pipeline(where=None, group=None, limit=None, unwind=False):
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
    pipeline = build_pipeline(where=where, group=group, limit=limit, unwind=True)
    # TODO: should get theses variable from settings
    cursor = db.theses.aggregate(pipeline=pipeline)
    counts = [d for d in cursor]
    return jsonify(counts)


@app.route("/degrees")
def degrees():
    cursor = db.degrees.find()
    degrees = [d for d in cursor]
    return jsonify(degrees)


@app.route("/degrees/counts")
def degree_counts():
    where = ast.literal_eval(request.args.get('where', '{}'))
    pipeline = []
    if where:
        pipeline.append(
            {'$match': where}
        )
    pipeline.append(
        {'$group': {'_id': '$degree.id', 'count': {'$sum': 1}}}
    )
    pipeline.append(
        {'$lookup': {
            'from': 'degrees',
            'localField': '_id',
            'foreignField': '_id',
            'as': 'degrees'
        }}
    )
    pipeline.append(
        {'$match': {'degrees': {'$ne': []}}}
    )
    cursor = db.theses.aggregate(pipeline)
    degrees = [d for d in cursor]
    return jsonify(degrees)


if __name__ == "__main__":
    # Running threaded in local because of
    # https://github.com/pallets/flask/issues/2169
    app.run(debug=True, threaded=True)
