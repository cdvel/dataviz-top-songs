from app import app
from os import environ
from config import PORT

app.run(debug=False, host='0.0.0.0', port=PORT, processes=1)
