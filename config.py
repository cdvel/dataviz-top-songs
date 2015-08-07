# -*- coding: utf8 -*-
import os
basedir = os.path.abspath(os.path.dirname(__file__))


LASTFM_API = {
    'track_url': "http://ws.audioscrobbler.com/2.0/?method=track.getInfo",
    'key': "1f25dd6f5bd821261580e89974d7c246"
}


if os.environ.get('MONGODB_HOST') is None:
    MONGODB_HOST = 'ds031213.mongolab.com'
else:
    MONGODB_HOST = os.environ['MONGODB_HOST']

if os.environ.get('MONGODB_PORT') is None:
    MONGODB_PORT = 31213
else:
    MONGODB_PORT = os.environ['MONGODB_PORT']

MONGODB_USER = "bob"
MONGODB_PASSWORD = "dyl4ndyl4n"
DATABASE = 'songstohear'

if os.environ.get("PORT") is None:
    PORT = 5000
else:
    PORT = int(os.environ.get("PORT"))

# CONNECTION_STRING = 'mongodb://localhost:27017/'

CONNECTION_STRING = 'mongodb://' + MONGODB_USER + ':' + MONGODB_PASSWORD \
    + '@' + MONGODB_HOST + ':' + str(MONGODB_PORT) + '/' + DATABASE + ''


COLLECTION_NAME = 'guardiantop'
DEFAULT_PROJECTION = {'title': True,
                      'theme': True,
                      'year': True,
                      'artist': True,
                      'spotify_url.url': True,
                      'playcount': True,
                      'listeners': True,
                      'last_update': True,
                      '_id': False}
