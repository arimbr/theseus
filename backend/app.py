import json
import ast

from flask import Flask, request, render_template, jsonify
from pymongo import MongoClient
from bson import json_util

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


def build_pipeline(where=None, group=None, limit=None, unwind=False, fields=None):
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

    if group and '$' not in group:
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

    if fields:
        project = dict(zip(fields, [1]*len(fields)))
        pipeline.append({'$project': project})

    return pipeline

@app.route("/theses")
def theses():
    where = ast.literal_eval(request.args.get('where', '{}'))
    limit = request.args.get('limit')
    fields = ast.literal_eval(request.args.get('fields', '[]'))
    pipeline = build_pipeline(where=where, limit=limit, fields=fields)
    cursor = db.theses.aggregate(pipeline=pipeline)
    theses = [t for t in cursor]
    return jsonify(theses)


@app.route("/counts")
def counts():
    where = ast.literal_eval(request.args.get('where', '{}'))
    universities_count = db.universities.find(where).count()
    degrees_count = db.degrees.find(where).count()
    # TODO: get value from database
    topics_count = 22241
    thesis_count = db.theses.find(where).count()
    counts = {
        'universities': universities_count,
        'degrees': degrees_count,
        'topics': topics_count,
        'thesis': thesis_count,
    }
    return jsonify(counts)


# /counts?group=subject&limit=100
# /counts?group=programme&limit=100
# /counts?group=subjects&limit=100&where={"language":"en"}
# /counts?group=subjects&limit=100&where={"collections":"com_10024_14"}
# /counts?group=collections&limit=100&where={"keywords":"Python"}
@app.route("/topics")
def topics():
    group = request.args.get('group')
    limit = request.args.get('limit')
    where = ast.literal_eval(request.args.get('where', '{}'))
    pipeline = build_pipeline(where=where, group=group, limit=limit, unwind=True)
    # TODO: should get theses variable from settings
    cursor = db.theses.aggregate(pipeline=pipeline)
    topics = [d for d in cursor]
    return jsonify(topics)


@app.route("/universities")
def universities():
    cursor = db.universities.find()
    universities = [t for t in cursor]
    return jsonify(universities)

@app.route("/degrees")
@app.route("/degrees/<degree_id>")
def degrees(degree_id=None):
    if degree_id:
        # Return degree
        degree = db.degrees.find_one({"_id": degree_id})
        return jsonify(degree)
    else:
        # Return degree counts
        where = ast.literal_eval(request.args.get('where', '{}'))
        pipeline = []
        if where:
            pipeline.append(
                {'$match': where}
            )
        pipeline.append(
            {'$group': {'_id': '$degree._id', 'count': {'$sum': 1}}}
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
        pipeline.append(
            {'$sort': {'count': -1}}
        )
        cursor = db.theses.aggregate(pipeline)
        degrees = [d for d in cursor]
        return jsonify(degrees)


if __name__ == "__main__":
    # Running threaded in local because of
    # https://github.com/pallets/flask/issues/2169
    app.run(debug=True, threaded=True)
