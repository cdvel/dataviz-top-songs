import requests, re
from config import LASTFM_API

BASE_URL = "http://ws.audioscrobbler.com/2.0/?method=track.getInfo"
API_KEY = "1f25dd6f5bd821261580e89974d7c246"

# Collects song stats from an external API
class DataCollector:

	# Returns listeners and playcount for artist-song pair
	def  getTrackStats(self, artist_name, song_name):
		
		artist_name = self.normalizer(artist_name)
		song_name = self.normalizer(song_name)

		payload = {'api_key': LASTFM_API['key'], 'artist': artist_name,'track': song_name, 'format': 'json'}
		response = requests.get(LASTFM_API['track_url'],  params=payload)

		assert response.status_code == 200
		payload = response.json()

		stats = {'listeners': 0,'playcount': 0}

		# a match wasn't found; default to 0
		if 'message' in payload:
			print  "%r - %r : %r"%(artist_name, song_name, payload['message'])

		else:
			stats['listeners'] = payload['track']['listeners']
			stats['playcount'] = payload['track']['playcount']

		return stats

	# Improves remote calls matches
	def normalizer(self, s):
		normal = ""
		blist = ["I", "We"]
		for w in s.split():
			if len(w) < 3 and w not in blist:
				normal+=" "+w.lower()
			else:
				normal+=" "+w.title()

		return  re.sub(r'[^\x20-\x7e]', '', normal)
