
from datetime import datetime
from tasks import dataCollector
from config import COLLECTION_NAME, DEFAULT_PROJECTION
import sys


# Handles access to the top_songs collection
class TopSongsDAO:

    def __init__(self, database):
        self.db = database
        self.top_songs = database[COLLECTION_NAME]

    # returns array of all songs, ordered by year
    def get_songs(self):
        cursor = self.top_songs.find(projection=DEFAULT_PROJECTION).sort('year', direction=1)
        return self.get_list(cursor);


    # returns array of songs filtered by year, ordered by title
    def get_songs_by_year(self, year):
        cursor = self.top_songs.find({'year':year}).sort('title', direction=1)
        return self.get_list(cursor);

    # returns array of songs filtered by artist, ordered by title
    def get_songs_by_artist(self, artist):
        cursor = self.top_songs.find({'artist':artist}).sort('title', direction=1)
        return self.get_list(cursor);

    #flattens record structure and manages empty fields
    def get_list(self, cursor):
        song_list = []
        for song in cursor:
            if 'spotify_url' in song:
                song['url'] = song['spotify_url']['url']
            else:
                song['url'] = ""

            song_list.append({  'title' : song['title'], 
                                'theme' : song['theme'], 
                                'year' : song['year'], 
                                'artist' : song['artist'], 
                                'url': song['url'],
                                'playcount': song['playcount'],
                                'listeners': song['listeners'],
                                'last_update': song['last_update']
                            })

        return song_list

    #retrieves updates for songs in the database
    def update_all_song_stats(self):
        cursor = self.top_songs.find()
        collector = dataCollector.DataCollector()
        counter = 0

        for song in cursor:
            stats = collector.get_track_stats(song['artist'], song['title']);
            try:
                updates = self.top_songs.update({'_id': song['_id']}, 
                                                {'$set':
                                                {
                                                    'listeners': int(stats['listeners']),
                                                    'playcount': int(stats['playcount']),
                                                    "last_update" : datetime.now()
                                                }
                                            })

                counter += updates["nModified"]

            except:
                print "Could not update the collection, error"
                print "Unexpected error:", sys.exc_info()[0]
                return False

        print "Updates complete!%d"%counter        
        return True
