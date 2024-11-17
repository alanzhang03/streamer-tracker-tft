from flask import Flask, request, jsonify
from functools import reduce
import os
from psycopg2 import pool
from dotenv import load_dotenv
from psycopg2.extras import Json, DictCursor
import requests
import time

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

    cur.execute(
        "SELECT match_data FROM matches WHERE '%s' = ANY(players) ORDER BY game_datetime DESC" % (username))
    res = cur.fetchall()
    cur.close()
    connection_pool.putconn(conn)

    # Close all connections in the pool
    connection_pool.closeall()

    start = page*5
    end = (page+1)*5
    if page > len(res) // page_size:
        return "error: invalid page number"
    return reduce(lambda x, y: x+y, res[start:end])

# update the database for a given user (username #tagline)


def updateData(username):
    # Connect to the DB
    # Load .env file
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

    # get recent match data
    split_username = username.split(" ")
    current_puuid = requests.get('https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/%s/%s?api_key=%s', (split_username[0], split_username[1][1:], api_key))
    matches = requests.get('https://americas.api.riotgames.com/tft/match/v1/matches/by-puuid/' +
                           current_puuid + '/ids?start=0&count=20&api_key=' + api_key).json()

    # add each match to the db
    for match in matches:
        # first check not in the db

        cur.execute('SELECT 1 FROM matches WHERE match_id=%s', (match, ))
        if cur.fetchall():
            continue

        match_dict = {}
        match_data = requests.get(
            'https://americas.api.riotgames.com/tft/match/v1/matches/' + match + '?api_key=' + api_key)

        if match_data.ok:
            match_data = match_data.json()
        else:
            print("sleeping 120s")
            time.sleep(120)
            match_data = requests.get(
                'https://americas.api.riotgames.com/tft/match/v1/matches/' + match + '?api_key=' + api_key).json()

        # get metadata
        patch = match_data['info']['game_version'][-6:-1]
        game_datetime = match_data['info']['game_datetime']

        game_information = match_data['info']['participants']
        players = []
        # print(game_information[0])
        for board in game_information:
            curr_dict = {}
            curr_dict['augments'] = board['augments']
            curr_dict['level'] = board['level']
            curr_dict['placement'] = board['placement']
            curr_dict['traits'] = board['traits']
            curr_dict['units'] = board['units']
            curr_dict['puuid'] = board['puuid']
            curr_dict['gold_left'] = board['gold_left']

            r = requests.get('https://americas.api.riotgames.com/riot/account/v1/accounts/by-puuid/' +
                             curr_dict['puuid'] + '?api_key=' + api_key)
            if r.ok:
                r = r.json()
            else:
                print("sleeping 120s")
                time.sleep(120)
                r = requests.get('https://americas.api.riotgames.com/riot/account/v1/accounts/by-puuid/' +
                                 curr_dict['puuid'] + '?api_key=' + api_key).json()
            curr_dict['username_tagline'] = r['gameName'] + ' #' + r["tagLine"]

            match_dict[r['gameName'] + ' #' + r["tagLine"]] = curr_dict.copy()
            players.append(r['gameName'] + ' #' + r["tagLine"])

        # add it into the db

        cur.execute('INSERT into matches (match_id, patch, game_datetime, match_data, players) values (%s, %s, %s, %s, %s)',
                    (match, patch, game_datetime, Json(match_dict), players))
        print('inserted', match)

    # Commit changes to the db

    cur.close()
    connection_pool.putconn(conn)

    # Close all connections in the pool
    connection_pool.closeall()


# get the match history and return a list of matches in json format
@app.route('/api/match-history', methods=['GET'])
def get_data():
    try:
        updateData(user)
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
