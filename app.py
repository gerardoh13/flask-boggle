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
    session['board'] = boggle_game.make_board()
    boggle_board = session['board']
    return render_template('board.html', board=boggle_board)

@app.route('/check-word', methods=['POST'])
def check_word():
    word = request.form['guess']
    board = session['board']
    valid = jsonify(result=boggle_game.check_valid_word(board, word))
    print(valid)
    return valid