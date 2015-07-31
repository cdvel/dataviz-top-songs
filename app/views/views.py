from flask import render_template
from pymongo import MongoClient
import json
from bson import json_util
from bson.json_util import dumps

from app import app 


#TODO: Move connection details
MONGODB_HOST = 'localhost'
MONGODB_PORT = 27017
DATABASE = 'songstohear'
GUARDIAN_COLLECTION =  'guardiantop'
PROJECTION = {'title' : True, 'theme' : True, 'year' : True, 'artist' : True, 'spotify_url.url' : True, '_id': False}

@app.route('/', methods=['GET'])
def hello_world():
    return 'Hello World!'

@app.route('/guardian/topsongs')
def guardian_top_songs():
	connection = MongoClient(MONGODB_HOST, MONGODB_PORT);
	top_songs_collection = connection[DATABASE][GUARDIAN_COLLECTION];
	top_songs = top_songs_collection.find(projection=PROJECTION)

	json_top_songs = []
	for song in top_songs:
		json_top_songs.append(song)

	json_top_songs = json.dumps(json_top_songs, default=json_util.default)	

	connection.close()
	return json_top_songs;

def guardian_top_songs_count():
	connection = MongoClient(MONGODB_HOST, MONGODB_PORT);
	top_songs_collection = connection[DATABASE][GUARDIAN_COLLECTION];
	top_songs_count = top_songs_collection.count()

	return top_songs_count;



# connection = MongoClient(MONGODB_HOST, MONGODB_PORT);
# database = connection[DATABASE];

# top_songs = topSongsDAO.topSongsDAO(database);


# if __name__ == '__main__':
#     app.run()
