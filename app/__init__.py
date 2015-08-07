from flask import Flask
from pymongo import MongoClient
from config import CONNECTION_STRING, DATABASE
import topSongsDAO

app = Flask(__name__)
app.config.from_object('config')

try:
    connection = MongoClient(CONNECTION_STRING)
    database = connection[DATABASE]
    dao = topSongsDAO.TopSongsDAO(database)
except Exception, e:
    raise e

# uncomment to trigger updates
# dao.update_all_song_stats()

from views import endpoints
