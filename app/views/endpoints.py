from flask import render_template, jsonify
from app import app, dao


@app.route('/', methods=['GET'])
def hello_world():
	return render_template("index.html")


@app.route('/top-songs/api/v1.0/songs', methods=['GET'])
def get_top_songs():
	return jsonify({'songs': dao.get_songs()})


@app.route('/top-songs/api/v1.0/songs/year/<year>', methods=['GET'])
def get_top_songs_by_year(year):
	return jsonify({'songs': dao.get_songs_by_year(year)})


@app.route('/top-songs/api/v1.0/songs/artist/<artist>', methods=['GET'])
def get_top_songs_by_artist(artist):
	return jsonify({'songs': dao.get_songs_by_artist(artist)})


@app.errorhandler(404)
def manage_not_found_error(e):
	return "That page doesn't exists"


@app.errorhandler(500)
def manage_internal_error(e):
	return "Internal server error. Please try again later"