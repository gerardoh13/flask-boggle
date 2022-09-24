from unittest import TestCase
from app import app
from flask import session
from boggle import Boggle


class FlaskTests(TestCase):
    def setUp(self):
        app.config['TESTING'] = True
        app.config['DEBUG_TB_HOSTS'] = ['dont-show-debug-toolbar']

    def test_show_homepage(self):
        """Checks if the game stats are in session and displayed in the homepage"""
        with app.test_client() as client:
            res = client.get('/')
            self.assertIn('board', session)
            self.assertIn(b'High Score:', res.data)
            self.assertIn(b'Games Played:', res.data)
            self.assertIn(b'Time:', res.data)

    def test_check_word(self):
        """Tests if a word is valid and on the board within a defined board in session"""
        with app.test_client() as client:
            with client.session_transaction() as sesh:
                sesh['board'] = [['T', 'K', 'U', 'R', 'P'],
                                ['X', 'N', 'T', 'C', 'N'],
                                ['H', 'W', 'Q', 'A', 'D'],
                                ['X', 'T', 'V', 'A', 'G'],
                                ['D', 'T', 'O', 'H', 'D']]
        valid_res = client.post('/check-word', data={'guess': 'toad'})
        not_word_res = client.post('/check-word', data={'guess': 'chonk'})
        not_on_board_res = client.post('/check-word', data={'guess': 'crocodile'})
        self.assertEqual('ok', valid_res.json['result'])
        self.assertEqual('not-word', not_word_res.json['result'])
        self.assertEqual('not-on-board', not_on_board_res.json['result'])
    
    def test_game_over(self):
        """Test if number of plays gets updated after a game is complete"""
        with app.test_client() as client:
            res = client.post('/game-over', data={'score': '10'})
            self.assertEqual(session['nplays'], 1)
            self.assertEqual(session['highscore'], 10)
            self.assertTrue(res.json['newRecord'])
            res2 = client.post('/game-over', data={'score': '9'})
            self.assertEqual(session['nplays'], 2)
            self.assertEqual(session['highscore'], 10)
            self.assertFalse(res2.json['newRecord'])







