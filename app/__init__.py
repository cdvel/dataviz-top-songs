from flask import Flask
from pymongo import MongoClient
import topSongsDAO

app = Flask(__name__)

#TODO: Move connection details
MONGODB_HOST = 'localhost'
MONGODB_PORT = 27017
DATABASE = 'songstohear'
GUARDIAN_COLLECTION =  'guardiantop'
PROJECTION = {'title' : True, 'theme' : True, 'year' : True, 'artist' : True, 'spotify_url.url' : True, '_id': False}

connection = MongoClient(MONGODB_HOST, MONGODB_PORT)
database = connection[DATABASE]

topSongsDAO = topSongsDAO.TopSongsDAO(database);

from views import endpoints