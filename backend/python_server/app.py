from flask import Flask, request, jsonify
from functools import reduce
import os
from psycopg2 import pool
from dotenv import load_dotenv
from psycopg2.extras import Json, DictCursor
import requests
import re
import time
# from tasks import update_data_task

from flask_cors import CORS
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*", "allow_headers": "*", "methods": ["GET", "POST", "PUT", "OPTIONS"]}})


# define constants
api_key = os.getenv('API_KEY')

def build_dicts_from_cdragon():
    try:
        r = requests.get(
            "https://raw.communitydragon.org/latest/cdragon/tft/en_us.json",
            timeout=10
        ).json()
        sets = r["sets"]
        current_set_num = str(max(int(k) for k in sets.keys()))
        current_set = sets[current_set_num]

        synergy_dict = {}
        for trait in current_set["traits"]:
            api_name = trait["apiName"]
            display_name = trait["name"]
            for i, effect in enumerate(trait["effects"], start=1):
                min_units = effect["minUnits"]
                synergy_dict[f"{api_name}{i}"] = f"{min_units} {display_name}"

        unit_dict = {}
        champion_icons = {}
        for champ in current_set["champions"]:
            unit_dict[champ["apiName"]] = champ["name"]
            if "tileIcon" in champ and champ["tileIcon"]:
                path = champ["tileIcon"].lower().replace(".tex", ".png")
                champion_icons[champ["apiName"]] = {
                    "icon": f"https://raw.communitydragon.org/latest/game/{path}",
                    "cost": champ.get("cost", 0)
                }

        print(f"Loaded Set {current_set_num}: {len(unit_dict)} champions, {len(synergy_dict)} trait tiers")
        return synergy_dict, unit_dict, current_set_num, champion_icons
    except Exception as e:
        print(f"Failed to load CDragon data: {e}")
        return {}, {}, "14", {}

synergy_dict, unit_dict, current_set_num, champion_icons = build_dicts_from_cdragon()

# Update these each patch with the current set's carry units (TFT{N}_ChampName format)
# level_carries: 4/5-cost units played at level 8-9
# reroll_carries: 1/2/3-cost units 3-starred at low levels
level_carries = set([])
reroll_carries = set([])

def getStats(username):
    # first get their puuid from username
    load_dotenv()

    # Get the connection string from the environment variable
    connection_string = os.environ.get('DATABASE_URL')

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

    cur.execute("SELECT puuid FROM players WHERE usertag = %s", (username, ))
    row = cur.fetchone()
    if not row:
        return {}
    puuid = row[0]

    response = requests.get(f"https://na1.api.riotgames.com/tft/league/v1/by-puuid/{puuid}?api_key={api_key}").json()
    res = {}
    response = [entry for entry in response if entry.get("queueType") == "RANKED_TFT"]
    res["lp"] = response[0]["leaguePoints"]
    res["tier"] = response[0]["tier"]
    res["rank"] = response[0]["rank"]

    cur.execute("SELECT num_games, sum_placements, wins, top_four FROM stats WHERE usertag = %s", (username, ))

    stats_row = cur.fetchone()
    if stats_row:
        res["num_games"], res["sum_placements"], res["wins"], res["top_four"] = stats_row
    else:
        res["num_games"], res["sum_placements"], res["wins"], res["top_four"] = 0, 0, 0, 0

    cur.close()
    connection_pool.putconn(conn)

    # Close all connections in the pool
    connection_pool.closeall()
    return res


def findComp(units, synergies, level_carries, reroll_carries, synergy_dict, unit_dict):
    ## if there is a silver/gold synergy, add it to name, otherwise flex
    ## if there is 4 cost carry with 3 items, add it to comp name
    ## if lots of 2 star 5 cost add "+ legendaries"
    ## returns a list of comps for easy filtering
    ## if 3 star unit with 3 items, add reroll
    comp = []

    for synergy in synergies:
        if synergy["tier_current"] >= 2:
            if synergy["name"] + str(synergy["tier_current"]) in synergy_dict:
                comp.append(synergy_dict[synergy["name"] + str(synergy["tier_current"])])
            else:
                comp.append(synergy["name"] + str(synergy["tier_current"]))
            # comp.append(synergy["name"] + str(synergy["tier_current"]))

    comp.sort(reverse=True)
    
    reroll = False
    for unit in units:
        if unit["character_id"] in reroll_carries and unit["tier"] == 3 and len(unit["itemNames"]) == 3:
            reroll = True
    for unit in units:
        if reroll and unit["tier"] >= 3 and len(unit["itemNames"]) == 3:
            comp.append(unit_dict[unit["character_id"]])
            # comp.append(unit["character_id"])
        elif not reroll and unit["character_id"] in level_carries and len(unit["itemNames"]) == 3:
            comp.append(unit_dict[unit["character_id"]])
            # comp.append(unit["character_id"])
    
    if reroll:
        comp.append("Reroll")
    return comp

# takes in a username and returns the most recent matches from page x, pages starting at 0

def getStreamerData(username):
    load_dotenv()

    connection_string = os.getenv('DATABASE_URL')
    connection_pool = pool.SimpleConnectionPool(1, 10, connection_string)

    if connection_pool:
        print("Connection pool created successfully")

    conn = connection_pool.getconn()
    conn.autocommit = True
    cur = conn.cursor(cursor_factory=DictCursor)

    # Select both match_data and patch
    cur.execute("""
        SELECT match_data, patch 
        FROM matches 
        WHERE %s = ANY(players) 
        ORDER BY game_datetime DESC
    """, (username,))
    
    rows = cur.fetchall()
    cur.close()
    connection_pool.putconn(conn)
    connection_pool.closeall()

    # Add 'patch' to each match_data object
    result = []
    for row in rows:
        match = row['match_data']
        match['patch'] = row['patch']
        result.append(match)

    return result

# update the database for a given user (username #tagline)


def updateData(username):
    # load in the three streamers for to track lp
    streamers = ["VIT k3soju #000", "VIT setsuko #NA2", "ACAD Dishsoap #NA3", "ACAD Frodan #FRO", "CTG robinsongz #888"]
    lps = {}
    for streamer in streamers:
        split_username = streamer.rpartition(" ")
        split_username = list(filter(lambda a: a != " ", split_username))

        # load in tactools dict
        nospaces = split_username[0].replace(" ", "").lower()
        tagline = split_username[1][1:]
        url = f"https://ap.tft.tools/player/stats2/na1/{nospaces}/{tagline}/140/50"
        print(f"TacTools URL: {url}")
        tactools = requests.get(url)
        print(f"TacTools {streamer}: status={tactools.status_code}")
        if tactools.ok:
            data = tactools.json()
            print(f"  keys={list(data.keys())}")
            if "matches" in data:
                print(f"  match count={len(data['matches'])}")
                if data["matches"]:
                    print(f"  first match keys={list(data['matches'][0].keys())}")
            lps[streamer] = data
        else:
            print(f"  error body={tactools.text[:200]}")
            lps[streamer] = {}




    # Connect to the DB
    # Load .env file
    load_dotenv()

    # Get the connection string from the environment variable
    connection_string = os.environ.get('DATABASE_URL')

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
    split_username = username.rpartition(" ")
    split_username = list(filter(lambda a: a != " ", split_username))

    cur.execute("SELECT puuid FROM players WHERE usertag=%s", (username, ))
    print(username)
    current_puuid = ""

    # also update last updated timestamp
    row = cur.fetchone()
    if row:
        current_puuid = row[0]
        cur.execute("UPDATE players SET last_updated = EXTRACT(EPOCH FROM NOW()) WHERE usertag = %s", (username, ))
    else:
        r = requests.get('https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/%s/%s?api_key=%s' % (split_username[0], split_username[1][1:], api_key)).json()
        if 'puuid' not in r:
            print(f"Failed to fetch puuid for {username}: {r}")
            return
        current_puuid = r['puuid']
        cur.execute("INSERT into players (puuid, usertag, last_updated) values (%s, %s, EXTRACT(EPOCH FROM NOW()))", (current_puuid, username))

    matches = requests.get('https://americas.api.riotgames.com/tft/match/v1/matches/by-puuid/' + current_puuid + '/ids?start=0&count=20&api_key=' + api_key).json()
    print(matches)
    
    # Add this code to get stored match IDs
    cur.execute("SELECT match_id FROM matches WHERE %s = ANY(players) ORDER BY game_datetime DESC LIMIT 20", (username,))
    stored_matches = cur.fetchall()
    stored_match_ids = [row[0] for row in stored_matches]
    
    # Check if we have new matches to process
    if stored_match_ids and matches and stored_match_ids[0] == matches[0]:
        print("No new matches to process")
        cur.close()
        connection_pool.putconn(conn)
        connection_pool.closeall()
        return
    
    # add each match to the db
    for match in matches:
        # first check not in the db
        
        cur.execute('SELECT 1 FROM matches WHERE match_id=%s', (match, ))
        if cur.fetchall():
            continue

        match_dict = {}
        match_data = requests.get(
            'https://americas.api.riotgames.com/tft/match/v1/matches/' + match + '?api_key=' + api_key)
        
        # get the match data
        if match_data.ok:
            match_data = match_data.json()
        else:
            print("sleeping 120s (match request)")
            time.sleep(120)
            match_data = requests.get(
                'https://americas.api.riotgames.com/tft/match/v1/matches/' + match + '?api_key=' + api_key).json()

        # get metadata
        if match_data["info"]["queue_id"] != 1100:
            continue
        print("adding match", match)

        patch = match_data['info']['game_version'][-6:-1]
        game_datetime = match_data['info']['game_datetime']
        

        game_information = match_data['info']['participants']
        players = []
        # print(game_information[0])
        c = 0
        for board in game_information:
            curr_dict = {}

            # no more augments saj
            # curr_dict['augments'] = board['augments']
            
            curr_dict['level'] = board['level']
            curr_dict['placement'] = board['placement']
            curr_dict['traits'] = board['traits']
            curr_dict['units'] = [unit for unit in board['units'] if not unit['character_id'].startswith(f'TFT{current_set_num}_Summon')]
            # curr_dict['units'] = board['units']
            curr_dict['puuid'] = board['puuid']
            curr_dict['gold_left'] = board['gold_left']
            curr_dict['game_datetime'] = game_datetime
                


            ## get the comp they are playing
            curr_dict["comp"] = findComp(curr_dict['units'], curr_dict['traits'], level_carries, reroll_carries, synergy_dict, unit_dict)

            # get their username and add it to dict
            cur.execute("SELECT usertag FROM players WHERE puuid=%s", (curr_dict['puuid'], ))
            username = ""
            username_row = cur.fetchone()
            if username_row:
                username = username_row[0]
            else:
                r = requests.get('https://americas.api.riotgames.com/riot/account/v1/accounts/by-puuid/' +
                                 curr_dict['puuid'] + '?api_key=' + api_key)
                if r.ok:
                    r = r.json()
                else:
                    print("sleeping 120s")
                    time.sleep(120)
                    r = requests.get('https://americas.api.riotgames.com/riot/account/v1/accounts/by-puuid/' +
                                 curr_dict['puuid'] + '?api_key=' + api_key).json()
                username = r['gameName'] + ' #' + r["tagLine"]
                cur.execute("INSERT into players (puuid, usertag, last_updated) values (%s, %s, EXTRACT(EPOCH FROM NOW())) ON CONFLICT (puuid) DO NOTHING", (curr_dict['puuid'], username))


            curr_dict['username_tagline'] = username
            curr_dict['lp_gain'] = 0

            if username in lps:
                tactools_ids = [m["id"] for m in lps[username]["matches"]]
                print(f"  LP lookup for {username}: riot_match={match}, tactools has {len(tactools_ids)} matches, match_found={match in tactools_ids}")
                print(f"  First 3 TacTools IDs: {tactools_ids[:3]}")
                for m in lps[username]["matches"]:
                    if m["id"] == match:
                        if "lpDiff" in m:
                            curr_dict['lp_gain'] = m["lpDiff"]
                        elif "rankAfter" in m and "rankBefore" in m:
                            curr_dict['lp_gain'] = m["rankAfter"][1] - m["rankBefore"][1]
                        print(f"  -> lp_gain set to {curr_dict['lp_gain']}")
            else:
                print(f"  LP lookup: '{username}' not in lps keys: {list(lps.keys())}")


            curr_player = "Player " + str(c)
            match_dict[curr_player] = curr_dict.copy()
            players.append(username)
            c += 1


            # add stats for each player
            cur.execute("SELECT num_games, sum_placements, wins, top_four FROM stats WHERE usertag = %s", (username, ))
            # if first game in db, initiate values
            num_games, sum_placements, wins, top_four = 0, 0, 0, 0
            stats_row = cur.fetchone()
            if stats_row:
                num_games, sum_placements, wins, top_four = stats_row

            num_games += 1
            sum_placements += curr_dict['placement']
            if curr_dict['placement'] == 1:
                wins += 1
            if curr_dict['placement'] <= 4:
                top_four += 1
            
            cur.execute("""
                INSERT INTO stats (usertag, num_games, sum_placements, wins, top_four)
                VALUES (%s, %s, %s, %s, %s)
                ON CONFLICT (usertag)
                DO UPDATE SET
                    num_games = %s,
                    sum_placements = %s,
                    wins = %s,
                    top_four = %s;
            """, (username, num_games, sum_placements, wins, top_four, num_games, sum_placements, wins, top_four))

            cur.execute("""
                INSERT INTO comps (usertag, match_id, comp)
                VALUES (%s, %s, %s)
            """, (username, match, [re.sub(r'^\s*\d+\s*', '', s) for s in curr_dict["comp"]]))

            
        # add it into the db
        print(match)
        cur.execute('INSERT into matches (match_id, patch, game_datetime, match_data, players) values (%s, %s, %s, %s, %s) ON CONFLICT(match_id) DO NOTHING;',
                    (match, patch, game_datetime, Json(match_dict), players))
        print('inserted', match)

    # Commit changes to the db

    cur.close()
    connection_pool.putconn(conn)

    # Close all connections in the pool
    connection_pool.closeall()

def getFavoriteComp(usertag):
    # first get their puuid from username
    load_dotenv()

    # Get the connection string from the environment variable
    connection_string = os.environ.get('DATABASE_URL')

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

    cur.execute("""
                    SELECT comp AS item, COUNT(*) AS count
                    FROM comps
                    WHERE usertag = %s
                    GROUP BY comp
                    ORDER BY count DESC
                    LIMIT 5
                    """, (usertag,))
    
    rows = cur.fetchall()
    
    res = [x for x, _ in rows]
    cur.close()
    connection_pool.putconn(conn)

    # Close all connections in the pool
    connection_pool.closeall()

    return res

def getlastUpdated(usertag):
    # first get their puuid from username
    load_dotenv()

    # Get the connection string from the environment variable
    connection_string = os.environ.get('DATABASE_URL')

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

    cur.execute("""
                    SELECT last_updated 
                    FROM players
                    WHERE usertag = %s
                    """, (usertag,))
    
    res = cur.fetchone()
    if not res:
        cur.close()
        connection_pool.putconn(conn)
        connection_pool.closeall()
        return None
    res = res[0] * 1000

    cur.close()
    connection_pool.putconn(conn)

    # Close all connections in the pool
    connection_pool.closeall()

    return res







# get the match history and return a list of matches in json format
@app.route('/api/match-history', methods=['GET'])
def get_match_history():
    user = request.headers['username-tagline']
    # pagenum = request.headers['page-number']
    res = getStreamerData(user)
    return jsonify(res)

@app.route('/api/last-updated', methods=['GET'])
def get_last_updated():
    user = request.headers['username-tagline']
    # pagenum = request.headers['page-number']
    res = getlastUpdated(user)
    return jsonify(res)

# get the stats and return it in json format
@app.route('/api/stats', methods=['GET'])
def get_stats():
    user = request.headers['username-tagline']
    res = getStats(user)
    return jsonify(res)

@app.route('/api/favorite-comps', methods=['GET'])
def get_favorite_comp():
    user = request.headers['username-tagline']
    res = getFavoriteComp(user)
    return jsonify(res)


@app.route('/api/update-data', methods=['PUT'])
def update_user_data():
    print("updating data")
    user = request.headers['username-tagline']
    updateData(user)
    print("done updating")
    return jsonify({'status': 'update finished'})


@app.route('/api/synergy-dict', methods=['GET'])
def get_synergy_dict():
    return jsonify(synergy_dict)

@app.route('/api/champion-icons', methods=['GET'])
def get_champion_icons():
    return jsonify(champion_icons)

@app.route('/')
def home():
    return "hello"



if __name__ == '__main__':
    app.run(debug=True)
