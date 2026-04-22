import random



from students_AI import XO_ALAEDDINE as titac_alaeddine




X     = "X"
O     = "O"
EMPTY = ""



# Take board state as List of List contain 3 Rows and 3 Columns
# Example of initial state board :
# board = 
# [     
#       [EMPTY, EMPTY, EMPTY],
#       [EMPTY, EMPTY, EMPTY],
#       [EMPTY, EMPTY, EMPTY]
# ]
#
# board can take 3 values (X,O,EMPTY)


def _alaeddine_move(board, player):
    parsed_board = titac_alaeddine.Board.from_2d(board)
    return titac_alaeddine.alphaBeta(parsed_board, player)


PLAYER_MAP = {
    "Alaeddine": _alaeddine_move,
    "ALAE DDINE SAID MEDJHAED": _alaeddine_move,
}


def _normalize_name(name):
    if not isinstance(name, str):
        return ""
    return " ".join(name.strip().lower().split())


def get_available_players():
    return ["Alaeddine"]


def get_minimax_function(player_x):
    target = _normalize_name(player_x)
    for name, fn in PLAYER_MAP.items():
        if _normalize_name(name) == target:
            return fn
    return None  # Retourne None si le joueur n'est pas trouvé

def minimax1(board, player,player_x):
    minimax_function = get_minimax_function(player_x)
    if minimax_function:
        return minimax_function(board, player)
    else:
        raise ValueError(f"Aucune fonction minimax trouvée pour le joueur: {player_x}")
    


def minimax2(board, player,player_o):
    minimax_function = get_minimax_function(player_o)
    if minimax_function:
        return minimax_function(board, player)
    else:
        raise ValueError(f"Aucune fonction minimax trouvée pour le joueur: {player_o}")
    