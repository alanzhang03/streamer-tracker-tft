from dotenv import load_dotenv
from psycopg2.extras import Json, DictCursor
from psycopg2 import pool
import os

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

cur.execute("DROP TABLE IF exists matches")
cur.execute("CREATE TABLE matches (match_id TEXT UNIQUE, patch TEXT, game_datetime TEXT, match_data JSONB, players TEXT[])")
cur.execute("DROP TABLE IF exists players")
cur.execute("CREATE TABLE players (puuid TEXT UNIQUE, usertag TEXT UNIQUE)")


cur.close()
connection_pool.putconn(conn)

# Close all connections in the pool
connection_pool.closeall()