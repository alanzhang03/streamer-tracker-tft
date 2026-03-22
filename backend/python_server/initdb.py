from dotenv import load_dotenv
from psycopg2.extras import Json, DictCursor
from psycopg2 import pool
import os

load_dotenv()

connection_string = os.getenv('DATABASE_URL')

connection_pool = pool.SimpleConnectionPool(
    1, 
    10,  
    connection_string
)

if connection_pool:
    print("Connection pool created successfully")

conn = connection_pool.getconn()
conn.autocommit = True

cur = conn.cursor(cursor_factory=DictCursor)

cur.execute("DROP TABLE IF EXISTS matches")
cur.execute("CREATE TABLE matches (match_id TEXT UNIQUE, patch TEXT, game_datetime TEXT, match_data JSONB, players TEXT[])")
cur.execute("DROP TABLE IF EXISTS players")
cur.execute("CREATE TABLE players (puuid TEXT UNIQUE, usertag TEXT UNIQUE, last_updated FLOAT)")
cur.execute("DROP TABLE IF EXISTS stats")
cur.execute("CREATE TABLE stats (usertag TEXT UNIQUE, num_games INTEGER, sum_placements INTEGER, wins INTEGER, top_four INTEGER)")
cur.execute("DROP TABLE IF EXISTS comps")
cur.execute("CREATE TABLE comps (usertag TEXT, match_id TEXT, comp TEXT[])")


cur.close()
connection_pool.putconn(conn)

connection_pool.closeall()