from flask import Flask, request, jsonify
from functools import reduce
import os
from psycopg2 import pool
from dotenv import load_dotenv
from psycopg2.extras import Json, DictCursor

app = Flask(__name__)

api_key = 'RGAPI-5db6b275-4ebd-4b03-9b74-aa0b0d307e20'

# takes in a username and returns the most recent matches from page x, pages starting at 0
def getStreamerData(username, page):
    page = int(page)
    page_size = 5
    load_dotenv()

    # Get the connection string from the environment variable
    connection_string = os.getenv('DATABASE_URL')

    # Create a connection pool
    connection_pool = pool.SimpleConnectionPool(
        1,  # Minimum number of connections in the pool
        10,  # Maximum number of connections in the pool
        connection_string
    )

    # Check if the pool was created successfully
    if connection_pool:
        print("Connection pool created successfully")

    # Get a connection from the pool
    conn = connection_pool.getconn()
    conn.autocommit = True

    # Create a cursor object
    cur = conn.cursor(cursor_factory=DictCursor)

    cur.execute("SELECT match_data FROM matches WHERE '%s' = ANY(players) ORDER BY game_datetime DESC" % (username))
    res = cur.fetchall()
    cur.close()
    connection_pool.putconn(conn)

    # Close all connections in the pool
    connection_pool.closeall()

    start = page*5
    end = (page+1)*5
    if page > len(res) // page_size:
        return "error: invalid page number"
    return reduce(lambda x,y :x+y , res[start:end])


# get the match history and return a list of matches in json format
@app.route('/api/match-history', methods=['GET'])
def get_data():
    try:
        user = request.headers['username-tagline']
        pagenum = request.headers['page-number']
    except:
        return jsonify("problem with header one or both of username-tagline or page-number")

    return jsonify(getStreamerData(user, pagenum))

# Route to handle POST requests
@app.route('/api/data', methods=['POST'])
def add_data():
    data = request.get_json()  # Get JSON data from the request
    if data:
        data_store.append(data)  # Add new data to the data store
        return jsonify({'message': 'Data added successfully!'}), 201
    else:
        return jsonify({'error': 'Invalid data format'}), 400

# Home route to verify the server is running
@app.route('/')
def home():
    return "Welcome to the Flask REST API!"

if __name__ == '__main__':
    app.run(port=3002, debug=True)
