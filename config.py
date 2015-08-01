# -*- coding: utf8 -*-
import os
basedir = os.path.abspath(os.path.dirname(__file__))


LASTFM_API = {
        'track_url': "http://ws.audioscrobbler.com/2.0/?method=track.getInfo",
        'key': "1f25dd6f5bd821261580e89974d7c246"
}


if os.environ.get('MONGODB_HOST') is None:
    MONGODB_HOST = 'localhost'
else:
    MONGODB_HOST = os.environ['MONGODB_HOST']

if os.environ.get('MONGODB_PORT') is None:
    MONGODB_PORT = 27017
else:
    MONGODB_PORT = os.environ['MONGODB_PORT']


DATABASE = 'songstohear'
COLLECTION_NAME =  'guardiantop'
DEFAULT_PROJECTION = {'title' : True, 'theme' : True, 'year' : True, 'artist' : True, 'spotify_url.url' : True, '_id': False}