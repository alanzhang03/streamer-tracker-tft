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
cors = CORS(app) 
app.config['CORS_HEADERS'] = 'Content-Type'


# define constants
api_key = os.getenv('API_KEY')
# api_key = "RGAPI-f0e0f91a-35de-4446-9ccb-75f1ac3a2087"

level_carries = set(["TFT14_Brand", "TFT14_MissFortune", "TFT14_Vex", "TFT14_Zed", "TFT14_Zeri", "TFT14_Xayah", "TFT14_Ziggs", "TFT14_Aphelios", "TFT14_Renekton", "TFT14_Samira", "TFT14_Urgot",
                     "TFT14_Aurora", "TFT14_Viego", "TFT14_Annie", "TFT14_Garen"])
reroll_carries = set(["TFT14_Darius", "TFT14_DrMundo", "TFT14_Elise", "TFT14_Fiddlesticks", "TFT14_Galio", "TFT14_LeBlanc", "TFT14_Morgana", "TFT14_Rengar", "TFT14_Senna", "TFT14_Shaco",
                      "TFT14_TwistedFate", "TFT14_Varus", "TFT14_Veigar","TFT14_Yuumi", "TFT14_Zyra", "TFT14_Braum","TFT14_NidaleeCougar","TFT14_Shyvana","TFT14_Kindred","TFT14_Kindred",
                      "TFT14_Illaoi","TFT14_Seraphine","TFT14_Jhin","TFT14_Naafiri","TFT14_Gragas","TFT14_KogMaw","TFT14_Skarner","TFT14_Jax","TFT14_Poppy","TFT14_Sylas","TFT14_Vayne","TFT14_Vi",
                      "TFT14_Alistar","TFT14_Graves","TFT14_Rhaast","TFT14_Draven","TFT14_Jinx","TFT14_Ekko"])

synergy_dict = {'TFT14_Immortal1': '2 Golden Ox', 'TFT14_Immortal2': '4 Golden Ox', 'TFT14_Immortal3': '6 Golden Ox', 'TFT14_Cutter1': '2 Executioner', 'TFT14_Cutter2': '3 Executioner', 
                'TFT14_Cutter3': '4 Executioner', 'TFT14_Cutter4': '5 Executioner', 'TFT14_Strong1': '2 Slayer', 'TFT14_Strong2': '4 Slayer', 'TFT14_Strong3': '6 Slayer', 
                'TFT14_Marksman1': '2 Marksman', 'TFT14_Marksman2': '4 Marksman', 'TFT14_Techie1': '2 Techie', 'TFT14_Techie2': '4 Techie', 'TFT14_Techie3': '6 Techie',
                'TFT14_Techie4': '8 Techie', 'TFT14_Controller1': '2 Strategist', 'TFT14_Controller2': '3 Strategist', 'TFT14_Controller3': '4 Strategist', 'TFT14_Controller4': '5 Strategist', 
                'TFT14_Armorclad1': '2 Bastion', 'TFT14_Armorclad2': '4 Bastion', 'TFT14_Armorclad3': '6 Bastion', 'TFT14_Armorclad4': '8 Bastion', 'TFT14_Supercharge1': '2 A.M.P.', 
                'TFT14_Supercharge2': '3 A.M.P.', 'TFT14_Supercharge3': '4 A.M.P.', 'TFT14_Supercharge4': '5 A.M.P.', 'TFT14_HotRod1': '3 Nitro', 'TFT14_HotRod2': '4 Nitro', 
                'TFT14_Cyberboss1': '2 Cyberboss', 'TFT14_Cyberboss1': '2 Cyberboss', 'TFT14_Cyberboss1': '2 Cyberboss', 'TFT14_Cyberboss2': '3 Cyberboss', 'TFT14_Cyberboss3': '4 Cyberboss', 
                'TFT14_Divinicorp1': '1 Divinicorp', 'TFT14_Divinicorp2': '2 Divinicorp', 'TFT14_Divinicorp3': '3 Divinicorp', 'TFT14_Divinicorp4': '4 Divinicorp', 'TFT14_Divinicorp5': '5 Divinicorp', 
                'TFT14_Divinicorp6': '6 Divinicorp', 'TFT14_Divinicorp7': '7 Divinicorp', 'TFT14_EdgeRunner1': '3 Exotech', 'TFT14_EdgeRunner2': '5 Exotech', 'TFT14_EdgeRunner3': '7 Exotech', 
                'TFT14_EdgeRunner4': '10 Exotech', 'TFT14_Bruiser1': '2 Bruiser', 'TFT14_Bruiser2': '4 Bruiser', 'TFT14_Bruiser3': '6 Bruiser', 'TFT14_Thirsty1': '2 Dynamo', 'TFT14_Thirsty2': '3 Dynamo', 
                'TFT14_Thirsty3': '4 Dynamo', 'TFT14_Mob1': '3 Syndicate', 'TFT14_Mob2': '5 Syndicate', 'TFT14_Mob3': '7 Syndicate', 'TFT14_Netgod': 'God of the Net', 'TFT14_Swift1': '2 Rapidfire', 
                'TFT14_Swift2': '4 Rapidfire', 'TFT14_Swift3': '6 Rapidfire', 'TFT14_StreetDemon1': '3 Street Demon', 'TFT14_StreetDemon2': '5 Street Demon', 'TFT14_StreetDemon3': '7 Street Demon', 
                'TFT14_StreetDemon4': '10 Street Demon', 'TFT14_AnimaSquad1': '3 Anima Squad', 'TFT14_AnimaSquad2': '5 Anima Squad', 'TFT14_AnimaSquad3': '7 Anima Squad', 'TFT14_AnimaSquad4': '10 Anima Squad', 
                'TFT14_Suits1': '3 Cypher', 'TFT14_Suits2': '4 Cypher', 'TFT14_Suits3': '5 Cypher', 'TFT14_BallisTek1': '2 BoomBot', 'TFT14_BallisTek2': '4 BoomBot', 'TFT14_BallisTek3': '6 BoomBot', 
                'TFT14_Vanguard1': '2 Vanguard', 'TFT14_Vanguard2': '4 Vanguard', 'TFT14_Vanguard3': '6 Vanguard', 'TFT14_ViegoUniqueTrait': 'Soul Killer', 'TFT14_Overlord': 'Overlord', 'TFT14_Virus': 'Virus'}

unit_dict = {'TFT14_Brand': 'Brand', 'TFT14_Darius': 'Darius', 'TFT14_DrMundo': 'Dr. Mundo', 'TFT14_Elise': 'Elise', 'TFT14_Fiddlesticks': 'Fiddlesticks',
            'TFT14_Galio': 'Galio', 'TFT14_Garen': 'Garen', 'TFT14_LeBlanc': 'LeBlanc', 'TFT14_MissFortune': 'Miss Fortune', 'TFT14_Morgana': 'Morgana',
            'TFT14_Neeko': 'Neeko', 'TFT14_Renekton': 'Renekton', 'TFT14_Rengar': 'Rengar', 'TFT14_Samira': 'Samira', 'TFT14_Senna': 'Senna', 'TFT14_Shaco': 'Shaco',
            'TFT14_TwistedFate': 'Twisted Fate', 'TFT14_Varus': 'Varus', 'TFT14_Veigar': 'Veigar', 'TFT14_Vex': 'Vex', 'TFT14_Zed': 'Zed', 'TFT14_Zeri': 'Zeri',
            'TFT14_Zyra': 'Zyra', 'TFT14_Braum': 'Braum', 'TFT14_NidaleeCougar': 'Nidalee', 'TFT14_Shyvana': 'Shyvana', 'TFT14_Kindred': 'Kindred',
            'TFT14_Yuumi': 'Yuumi', 'TFT14_Illaoi': 'Illaoi', 'TFT14_Seraphine': 'Seraphine', 'TFT14_Xayah': 'Xayah', 'TFT14_Jhin': 'Jhin',
            'TFT14_Naafiri': 'Naafiri', 'TFT14_Gragas': 'Gragas', 'TFT14_KogMaw': "Kog'Maw", 'TFT14_Skarner': 'Skarner', 'TFT14_Jax': 'Jax',
            'TFT14_Kobuko': 'Kobuko', 'TFT14_Sejuani': 'Sejuani', 'TFT14_Poppy': 'Poppy', 'TFT14_Ziggs': 'Ziggs', 'TFT14_Chogath': "Cho'Gath",
            'TFT14_Urgot': 'Urgot', 'TFT14_Sylas': 'Sylas', 'TFT14_Aurora': 'Aurora', 'TFT14_Vayne': 'Vayne', 'TFT14_Leona': 'Leona',
            'TFT14_Vi': 'Vi', 'TFT14_Mordekaiser': 'Mordekaiser', 'TFT14_Alistar': 'Alistar', 'TFT14_Viego': 'Viego', 'TFT14_Jarvan': 'Jarvan IV',
            'TFT14_Graves': 'Graves', 'TFT14_Annie': 'Annie', 'TFT14_Rhaast': 'Rhaast', 'TFT14_SummonLevel2': 'R-080T', 'TFT14_SummonLevel4': 'T-43X',
            'TFT14_Draven': 'Draven', 'TFT14_Zac': 'Zac', 'TFT14_Jinx': 'Jinx', 'TFT14_Ekko': 'Ekko', 'TFT14_NPC_Drone': 'Mechadrone',
            'TFT14_NPC_AzirSoldier': 'Mechasoldier', 'TFT14_NPC_Super': 'Mechaminion', 'TFT14_NPC_AurelionSol': 'Mechaurelion', 'TFT14_Aphelios': 'Aphelios'}

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
    puuid = cur.fetchone()
    
    response = requests.get(f"https://na1.api.riotgames.com/tft/league/v1/by-puuid/{puuid}?api_key={api_key}").json()
    res = {}
    response = [entry for entry in response if entry.get("queueType") == "RANKED_TFT"]
    res["lp"] = response[0]["leaguePoints"]
    res["tier"] = response[0]["tier"]
    res["rank"] = response[0]["rank"]

    cur.execute("SELECT num_games, sum_placements, wins, top_four FROM stats WHERE usertag = %s", (username, ))

    res["num_games"], res["sum_placements"], res["wins"], res["top_four"] = cur.fetchone()

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
    streamers = ["VIT k3soju #000", "VIT setsuko #NA2", "100T Dishsoap #NA2", "Riot Mortdog #Mort"]
    lps = {}
    for streamer in streamers:
        split_username = streamer.rpartition(" ")
        split_username = list(filter(lambda a: a != " ", split_username))

        # load in tactools dict
        nospaces = split_username[0].replace(" ", "").lower()
        tactools = requests.get(f"https://ap.tft.tools/player/stats2/na1/{nospaces}/{split_username[1][1:]}/140/50")
        lps[streamer] = tactools.json()




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
    if cur.rowcount > 0:
        current_puuid = cur.fetchone()[0]
        cur.execute("UPDATE players SET last_updated = EXTRACT(EPOCH FROM NOW()) WHERE usertag = %s", (username, ))
    else:
        current_puuid = requests.get('https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/%s/%s?api_key=%s' % (split_username[0], split_username[1][1:], api_key)).json()['puuid']
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
            curr_dict['units'] = [unit for unit in board['units'] if not unit['character_id'].startswith('TFT14_Summon')]
            # curr_dict['units'] = board['units']
            curr_dict['puuid'] = board['puuid']
            curr_dict['gold_left'] = board['gold_left']
            curr_dict['game_datetime'] = game_datetime
                


            ## get the comp they are playing
            curr_dict["comp"] = findComp(curr_dict['units'], curr_dict['traits'], level_carries, reroll_carries, synergy_dict, unit_dict)

            # get their username and add it to dict
            cur.execute("SELECT usertag FROM players WHERE puuid=%s", (curr_dict['puuid'], ))
            username = ""
            if cur.rowcount > 0:
                username = cur.fetchone()[0]
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

            if username in lps:
                for m in lps[username]["matches"]:
                    if m["id"] == match:
                        curr_dict['lp_gain'] = m["rankAfter"][1] - m["rankBefore"][1]


            curr_player = "Player " + str(c)
            match_dict[curr_player] = curr_dict.copy()
            players.append(username)
            c += 1


            # add stats for each player
            cur.execute("SELECT num_games, sum_placements, wins, top_four FROM stats WHERE usertag = %s", (username, ))
            # if first game in db, initiate values
            num_games, sum_placements, wins, top_four = 0, 0, 0, 0
            if cur.rowcount > 0:
                num_games, sum_placements, wins, top_four = cur.fetchone()

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


@app.route('/')
def home():
    return "hello"



if __name__ == '__main__':
    app.run(debug=True)
