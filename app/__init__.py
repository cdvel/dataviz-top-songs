from flask import Flask
from pymongo import MongoClient
from config import basedir, MONGODB_HOST, MONGODB_PORT, DATABASE
import topSongsDAO

app = Flask(__name__)
app.config.from_object('config')

connection = MongoClient(MONGODB_HOST, MONGODB_PORT)
database = connection[DATABASE]

dao = topSongsDAO.TopSongsDAO(database)

# uncomment to trigger updates
# dao.update_all_song_stats()

from views import endpoints