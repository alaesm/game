import os
from flask import Flask, jsonify, request, g
import tictactoe as ttt
from flask_cors import CORS, cross_origin
import time
import json

app = Flask(__name__)
CORS(app)

# Middleware to measure execution time
@app.before_request
def start_timer():
    g.start_time = time.time()

@app.after_request
def log_execution_time(response):
    if hasattr(g, "start_time"):
        execution_time = time.time() - g.start_time
        print(f"Endpoint: {request.path}, Method: {request.method}, Execution Time: {execution_time:.4f} seconds")
    return response

@app.route("/minimax1", methods=["POST"])
def minimax1():
    data = request.json
    board = data["board"]
    #player = data["player"]
    player_x = data.get("playerX")  # Récupération des noms des joueurs
    #player_o = data.get("playerO")
    action = ttt.minimax1(board, 'X',player_x)
    return jsonify({"action": action})

@app.route("/minimax2", methods=["POST"])
def minimax2():
    data = request.json
    board = data["board"]
    #player = data["player"]
    #player_x = data.get("playerX")  # Récupération des noms des joueurs
    player_o = data.get("playerO")
    action = ttt.minimax2(board, 'O',player_o)
    return jsonify({"action": action})

@app.route("/api/players", methods=["GET"])
def get_players():
    return jsonify({"players": ttt.get_available_players()})

PLAYERS_FILE = "../src/data/players.json"
@app.route("/api/updatePlayers", methods=["POST"])
#@cross_origin()  # Autorise les requêtes cross-origin sur cette route
def update_players():
    try:
        players = request.json
        
        # Charger l'ancien fichier JSON
        with open(PLAYERS_FILE, "r", encoding="utf-8") as file:
            existing_players = json.load(file)
        
        # Mettre à jour les joueurs existants avec les nouvelles données
        for new_player in players:
            for existing_player in existing_players:
                if new_player["name"] == existing_player["name"]:
                    existing_player.update(new_player)

        # Sauvegarder les mises à jour dans le fichier JSON des joueurs
        with open(PLAYERS_FILE, "w", encoding="utf-8") as file:
            json.dump(existing_players, file, indent=4, ensure_ascii=False)

        return jsonify({"message": "Mise à jour réussie", "players": existing_players}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400,


MATCHES_FILE = "../src/data/matches.json"  
@app.route("/api/updateMatches", methods=["POST"])  
#@cross_origin()
def update_matches():
    try:
        match = request.json  # Récupérer les données envoyées par le frontend
        print(match)

        # Vérifier si le fichier existe, sinon créer une liste vide
        if not os.path.exists(MATCHES_FILE):
            existing_matches = []
        else:
            with open(MATCHES_FILE, "r", encoding="utf-8") as file:
                try:
                    existing_matches = json.load(file)
                    if not isinstance(existing_matches, list):  # Vérifier si le JSON est bien une liste
                        existing_matches = []
                except json.JSONDecodeError:  # Gérer les erreurs de lecture JSON
                    existing_matches = []

       # Vérifier si le match existe déjà (basé sur opponent1 et opponent2)
        match_found = False
        for existing_match in existing_matches:
            if (existing_match["opponent1"] == match["opponent1"] and existing_match["opponent2"] == match["opponent2"]):

                # Mise à jour des données du match existant
                existing_match.update({
                    "startTime": match["startTime"],
                    "opponent1Point": match["opponent1Point"],
                    "opponent1totalTime": match["opponent1totalTime"],
                    "opponent1errorCount": match["opponent1errorCount"],
                    "opponent2Point": match["opponent2Point"],
                    "opponent2totalTime": match["opponent2totalTime"],
                    "opponent2errorCount": match["opponent2errorCount"]
                })
                match_found = True
                break

        # Si le match n'existe pas, l'ajouter
        if not match_found:
            existing_matches.append(match)

        # Sauvegarder les mises à jour dans le fichier JSON
        with open(MATCHES_FILE, "w", encoding="utf-8") as file:
            json.dump(existing_matches, file, indent=4, ensure_ascii=False)

        return jsonify({"message": "Mise à jour réussie", "matches": existing_matches}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400  # 

if __name__ == "__main__":
    app.run(debug=True)


'''    

from flask import Flask, jsonify, request , g
import tictactoe as ttt
from flask_cors import CORS
import time

app = Flask(__name__)
CORS(app) 

# Middleware to measure execution time
@app.before_request
def start_timer():
    g.start_time = time.time()

@app.after_request
def log_execution_time(response):
    if hasattr(g, "start_time"):
        execution_time = time.time() - g.start_time
        print(f"Endpoint: {request.path}, Method: {request.method}, Execution Time: {execution_time:.4f} seconds")
    return response

@app.route("/minimax", methods=["POST"])
def minimax():
    board = request.json["board"]
    action = ttt.minimax(board, 'X')
    return jsonify({"action": action})

if __name__ == "__main__":
    app.run(debug=True)
'''