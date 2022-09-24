from boggle import Boggle
from flask import Flask, request, render_template, redirect, flash, session, make_response, jsonify
from flask_debugtoolbar import DebugToolbarExtension

boggle_game = Boggle()

app = Flask(__name__)

app.config['SECRET_KEY'] = "cats_are_cool"
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False

debug = DebugToolbarExtension(app)


@app.route('/')
def show_homepage():
    """Shows homepage with a new board, and updated number of plays and high score."""
    session['board'] = boggle_game.make_board()
    highscore = session.get("highscore", 0)
    nplays = session.get("nplays", 0)
    boggle_board = session['board']
    return render_template('board.html', board=boggle_board, highscore=highscore, nplays=nplays)


@app.route('/check-word', methods=['POST'])
def check_word():
    """Checks if a guess is a valid english word, and wether it is on the board."""
    word = request.form['guess']
    board = session['board']
    valid = jsonify(result=boggle_game.check_valid_word(board, word))
    return valid


@app.route('/game-over', methods=['POST'])
def game_over():
    """Updates the high score in session if needed, updates number of plays and returns wether the latest score is the new high score"""
    score = int(request.form['score'])
    highscore = session.get("highscore", 0)
    nplays = session.get("nplays", 0)

    session['nplays'] = nplays + 1
    session['highscore'] = max(score, highscore)
    return jsonify(newRecord=score > highscore)
