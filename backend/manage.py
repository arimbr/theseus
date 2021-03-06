import settings

from pymongo import MongoClient

# MongoDB configuration
connection = MongoClient(
    settings.MONGODB_HOST,
    settings.MONGODB_PORT
)
db = connection[settings.MONGODB_DB]

def create_indexes():
    db.theses.drop_indexes()
    db.theses.create_index([('topics', 1)])
    db.theses.create_index([('university._id', 1)])
    db.theses.create_index([('degree._id', 1)])
    db.theses.create_index([('language', 1)])
    db.theses.create_index([('year', 1)])
    db.topics.create_index(['count', 1])

if __name__ == '__main__':
    create_indexes()