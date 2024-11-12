from flask import Flask, request, jsonify

# import requests
# import os
# from psycopg2 import pool
# from dotenv import load_dotenv
# from psycopg2.extras import Json, DictCursor
# import time

app = Flask(__name__)

# api_key = 'RGAPI-314e77e7-1963-4196-96b5-cf8c8d0777b9'
# streamers = ['e62ZthNQBc1bjVfXrjDvNIQV-0Bd7GUeaRv_fiZqx5nc5OXaY6OAmM4wav043AJgxKQShtA1s9IIOg', 'hVi-4fc19ymaRf4HvUmHNkZCoALJPUXgGKcKGgBlLZTqYZRVtQwglGQCIBj0jou0wA35CcH8sdeEgw', 'NUnja2Bl0CPRiimqr1PesnOnDsxXa6eAg5xRhNVBdxgAzBopnpcWNTZZ9r9YjNhEtf5tx2DkvXdJ9Q']


# def getStreamerData():
#     load_dotenv()

#     # Get the connection string from the environment variable
#     connection_string = os.getenv('DATABASE_URL')

#     # Create a connection pool
#     connection_pool = pool.SimpleConnectionPool(
#         1,  # Minimum number of connections in the pool
#         10,  # Maximum number of connections in the pool
#         connection_string
#     )

#     # Check if the pool was created successfully
#     if connection_pool:
#         print("Connection pool created successfully")

#     # Get a connection from the pool
#     conn = connection_pool.getconn()
#     conn.autocommit = True

#     # Create a cursor object
#     cur = conn.cursor(cursor_factory=DictCursor)

#     cur.execute('SELECT 5 FROM matches WHERE match_id=%s', (match, ))

#     cur.close()
#     connection_pool.putconn(conn)

#     # Close all connections in the pool
#     connection_pool.closeall()



data_store = []
# 
@app.route('/api/data', methods=['GET'])
def get_data():
    return jsonify(data_store)

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
