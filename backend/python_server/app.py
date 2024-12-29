from flask import Flask, request, jsonify
from functools import reduce
import os
from psycopg2 import pool
from dotenv import load_dotenv
from psycopg2.extras import Json, DictCursor
import requests
import time

from flask_cors import CORS, cross_origin
app = Flask(__name__)
cors = CORS(app) 
app.config['CORS_HEADERS'] = 'Content-Type'


# define constants
api_key = 'RGAPI-f82e1f7e-c046-45f0-82c5-5506cc01b483'

level_carries = set(["TFT13_Silco", "TFT13_Vi", "TFT13_Caitlyn", "TFT13_Ekko", "TFT13_Malzahar", "TFT13_Twitch", "TFT13_LeBlanc",
                    "TFT13_Heimerdinger", "TFT13_Jayce", "TFT13_Lieutenant", "TFT13_Jinx", "TFT13_Corki", "TFT13_Ambessa", "TFT13_Mordekaiser", "TFT13_Zoe"])
reroll_carries = set(["TFT13_Camille", "TFT13_RenataGlasc", "TFT13_Akali", "TFT13_Ezreal", "TFT13_Draven", "TFT13_Cassiopeia", "TFT13_Ziggs", "TFT13_Gremlin", "TFT13_Shooter",   "TFT13_Blue", "TFT13_Zeri", "TFT13_Red", "TFT13_Nami", "TFT13_Vex", "TFT13_Nocturne", "TFT13_Darius", "TFT13_Irelia", "TFT13_FlyGuy", "TFT13_NunuWillump",
                     "TFT13_Prime", "TFT13_Beardy", "TFT13_Chainsaw", "TFT13_Vladimir", "TFT13_Rell", "TFT13_Sett", "TFT13_Amumu", "TFT13_Blitzcrank", "TFT13_Singed", "TFT13_Zyra", "TFT13_Gangplank", "TFT13_Leona", "TFT13_KogMaw", "TFT13_TwistedFate", "TFT13_Lux", "TFT13_Morgana", "TFT13_Tristana", "tft13_swain", "TFT13_Urgot", "TFT13_Fish"])
synergy_dict = {"TFT13_Academy1": "3 Academy", "TFT13_Academy2": "4 Academy",   "TFT13_Academy3": "5 Academy", "TFT13_Academy4": "6 Academy", "TFT13_Ambassador1": "1 Emissary", "TFT13_Ambassador2": "4 Emissary", "TFT13_Ambusher1": "2 Ambusher", "TFT13_Ambusher2": "3 Ambusher", "TFT13_Ambusher3": "4 Ambusher", "TFT13_Ambusher4": "5 Ambusher",
                "TFT13_Bruiser1": "2 Bruiser", "TFT13_Bruiser2": "4 Bruiser", "TFT13_Bruiser3": "6 Bruiser", "TFT13_Cabal1": "3 Black Rose", "TFT13_Cabal2": "4 Black Rose", "TFT13_Cabal3": "5 Black Rose", "TFT13_Cabal4": "7 Black Rose", "TFT13_Challenger1": "2 Quickstriker", "TFT13_Challenger2": "3 Quickstriker", "TFT13_Challenger3": "4 Quickstriker", 
                "TFT13_Crime1": "3 Chem-Baron", "TFT13_Crime2": "4 Chem-Baron", "TFT13_Crime3": "5 Chem-Baron", "TFT13_Crime4": "6 Chem-Baron", "TFT13_Crime5": "7 Chem-Baron", "TFT13_Experiment1": "3 Experiment", "TFT13_Experiment2": "5 Experiment", "TFT13_Experiment3": "7 Experiment", "TFT13_Family1": "3 Family", "TFT13_Family2": "4 Family", 
                "TFT13_Family3": "5 Family", "TFT13_FormSwapper1": "2 Form Swapper", "TFT13_FormSwapper2": "4 Form Swapper", "TFT13_FormSwapper3": "6 Form Swapper", "TFT13_Hextech1": "2 Automata", "TFT13_Hextech2": "4 Automata", "TFT13_Hextech3": "6 Automata", "TFT13_Hoverboard1": "2 Firelight", "TFT13_Hoverboard2": "3 Firelight", 
                "TFT13_Hoverboard3": "4 Firelight", "TFT13_Invoker1": "2 Visionary", "TFT13_Invoker2": "4 Visionary", "TFT13_Invoker3": "6 Visionary", "TFT13_Invoker4": "8 Visionary", "TFT13_Martialist1": "2 Artillerist", "TFT13_Martialist2": "4 Artillerist", "TFT13_Martialist3": "6 Artillerist", "TFT13_Pugilist1": "2 Pit Fighter", 
                "TFT13_Pugilist2": "4 Pit Fighter", "TFT13_Pugilist3": "6 Pit Fighter", "TFT13_Pugilist4": "8 Pit Fighter", "TFT13_Rebel1": "3 Rebel", "TFT13_Rebel2": "5 Rebel", "TFT13_Rebel3": "7 Rebel", "TFT13_Rebel4": "10 Rebel", "TFT13_Scrap1": "2 Scrap", "TFT13_Scrap2": "4 Scrap", "TFT13_Scrap3": "6 Scrap", "TFT13_Scrap4": "9 Scrap", 
                "TFT13_Sniper1": "2 Sniper", "TFT13_Sniper2": "4 Sniper", "TFT13_Sniper3": "6 Sniper", "TFT13_Squad1": "2 Enforcer", "TFT13_Squad2": "4 Enforcer", "TFT13_Squad2": "4 Enforcer", "TFT13_Squad3": "6 Enforcer", "TFT13_Squad4": "8 Enforcer", "TFT13_Squad5": "10 Enforcer", "TFT13_Titan1": "2 Sentinel", "TFT13_Titan2": "4 Sentinel", "TFT13_Titan3": "6 Sentinel",
                "TFT13_Titan4": "8 Sentinel", "TFT13_Warband1": "2 Conqueror", "TFT13_Warband2": "4 Conqueror", "TFT13_Warband3": "6 Conqueror", "TFT13_Warband4": "9 Conqueror", "TFT13_Watcher1": "2 Watcher", "TFT13_Watcher2": "4 Watcher", "TFT13_Watcher3": "6 Watcher", "TFT13_Sorcerer1": "2 Sorcerer", "TFT13_Sorcerer2": "4 Sorcerer", "TFT13_Sorcerer3": "6 Sorcerer", 
                "TFT13_Sorcerer4": "8 Sorcerer", "TFT13_Infused1": "2 Dominator", "TFT13_Infused2": "4 Dominator", "TFT13_Infused3": "6 Dominator", }
unit_dict = {"TFT13_Silco": "Silco", "TFT13_Caitlyn": "Caitlyn", "TFT13_Ekko": "Ekko", "TFT13_Malzahar": "Malzahar", "TFT13_Twitch": "Twitch", "TFT13_Cassiopeia": "Cassiopeia","TFT13_LeBlanc": "LeBlanc", "TFT13_Heimerdinger": "Heimerdinger", "TFT13_Jayce": "Jayce", "TFT13_Lieutenant": "Sevika",
             "TFT13_Vi": "Vi", "TFT13_Jinx": "Jinx", "TFT13_Nami": "Nami", "TFT13_Corki": "Corki", "TFT13_Ambessa": "Ambessa", "TFT13_Mordekaiser": "Mordekaiser", "TFT13_Zoe": "Zoe", "TFT13_Camille": "Camille", "TFT13_RenataGlasc": "Renata", "TFT13_Akali": "Akali", "TFT13_Ezreal": "Ezreal",
             "TFT13_Draven": "Draven", "TFT13_Ziggs": "Ziggs", "TFT13_Gremlin": "Smeech", "TFT13_Shooter": "Maddie", "TFT13_Blue": "Powder", "TFT13_Zeri": "Zeri", "TFT13_Red": "Violet", "TFT13_Nami": "Nami", "TFT13_Vex": "Vex", "TFT13_Nocturne": "Nocturne", "TFT13_Darius": "Darius", "TFT13_Irelia": "Irelia",
             "TFT13_FlyGuy": "Scar", "TFT13_NunuWillump": "Nunu", "TFT13_Prime": "Vander", "TFT13_Beardy": "Loris", "TFT13_Chainsaw": "Renni", "TFT13_Vladimir": "Vladimir", "TFT13_Rell": "Rell", "TFT13_Sett": "Sett", "TFT13_Amumu": "Amumu", "TFT13_Blitzcrank": "Blitzcrank", "TFT13_Singed": "Singed",
             "TFT13_Zyra": "Zyra", "TFT13_Gangplank": "Gangplank", "TFT13_Leona": "Leona", "TFT13_KogMaw": "KogMaw", "TFT13_TwistedFate": "Twisted Fate", "TFT13_Lux": "Lux", "TFT13_Morgana": "Morgana", "TFT13_Tristana": "Tristana", "tft13_swain": "Swain", "TFT13_Urgot": "Urgot", "TFT13_Trundle": "Trundle",
             "TFT13_Fish": "Steb"
             }
def getStats(username):
    # return a dict of all the stats
    res = {}
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

    cur.execute("SELECT num_games, sum_placements, wins, top_four FROM stats WHERE usertag = %s", (username, ))
    num_games, sum_placements, wins, top_four = cur.fetchone()
    res['games'] = num_games
    res['average_placement'] = round(sum_placements / num_games, 2)
    res['wins'] = wins
    res['top_four'] = top_four
    res['top_four_percentage'] = round(top_four / num_games, 2)

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
    
    comp.sort(reverse=True)
    if reroll:
        comp.append("Reroll")
    return comp

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
    return reduce(lambda x, y: x+y, res[start:end])

# update the database for a given user (username #tagline)


def updateData(username):
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
    if cur.rowcount > 0:
        current_puuid = cur.fetchone()[0]
    else:
        current_puuid = requests.get('https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/%s/%s?api_key=%s' % (split_username[0], split_username[1][1:], api_key)).json()['puuid']
        cur.execute("INSERT into players (puuid, usertag) values (%s, %s)", (current_puuid, username))

    matches = requests.get('https://americas.api.riotgames.com/tft/match/v1/matches/by-puuid/' + current_puuid + '/ids?start=0&count=20&api_key=' + api_key).json()
    print(matches)

    # add each match to the db
    for match in matches:
        print("adding match", match)
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
            curr_dict['units'] = board['units']
            curr_dict['puuid'] = board['puuid']
            curr_dict['gold_left'] = board['gold_left']

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
                cur.execute("INSERT into players (puuid, usertag) values (%s, %s) ON CONFLICT (puuid) DO NOTHING", (curr_dict['puuid'], username))

            curr_dict['username_tagline'] = username


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

            
        # add it into the db
        print(match)
        cur.execute('INSERT into matches (match_id, patch, game_datetime, match_data, players) values (%s, %s, %s, %s, %s);',
                    (match, patch, game_datetime, Json(match_dict), players))
        print('inserted', match)

    # Commit changes to the db

    cur.close()
    connection_pool.putconn(conn)

    # Close all connections in the pool
    connection_pool.closeall()


# get the match history and return a list of matches in json format
@app.route('/api/match-history', methods=['GET'])
def get_match_history():
    # try:
        user = request.headers['username-tagline']
        pagenum = request.headers['page-number']
        print('updating user data')
        updateData(user)
        res = getStreamerData(user, pagenum)
        return jsonify(res)
    # except Exception as e:
    #     print(e)
    #     return jsonify("problem with header one or both of username-tagline or page-number")
    
# get the stats and return it in json format
@app.route('/api/match-history', methods=['GET'])
def get_stats():
    user = request.headers['username-tagline']
    res = getStats(user)
    return jsonify(res)

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
    app.run(debug=True)
