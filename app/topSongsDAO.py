
TOP_SONGS_COLLECTION = 'guardiantop'
PROJECTION = {'title' : True, 'theme' : True, 'year' : True, 'artist' : True, 'spotify_url' : True, '_id': False}


#TODO: add exception handling

# Handles access to the top_songs collection
class TopSongsDAO:

    def __init__(self, database):
        self.db = database
        self.top_songs = database[TOP_SONGS_COLLECTION]

    # returns array of all songs, ordered by year
    def get_songs(self):
        cursor = self.top_songs.find(projection=PROJECTION).sort('year', direction=1)
        return self.get_list(cursor);


    # returns array of songs filtered by year, ordered by title
    def get_songs_by_year(self, year):
        cursor = self.top_songs.find({'year':year}).sort('title', direction=1)
        return self.get_list(cursor);

    # returns array of songs filtered by artist, ordered by title
    def get_songs_by_artist(self, artist):
        cursor = self.top_songs.find({'artist':artist}).sort('title', direction=1)
        return self.get_list(cursor);


    def get_list(self, cursor):
        song_list = []
        for song in cursor:
            if 'spotify_url' in song:
                song['url'] = song['spotify_url']['url']
            else:
                song['url'] = ""

            song_list.append({'title' : song['title'], 
                     'theme' : song['theme'], 
                     'year' : song['year'], 
                     'artist' : song['artist'], 
                     'url': song['url']})

        
        return song_list

