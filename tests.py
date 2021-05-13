import unittest, os
from . import main
from app import app, db
from app.models import User, TestAttempt
from datetime import datetime, timedelta
# from selenium import webdriver #Not currently used but useful for further testing

class UsersTest(unittest.TestCase):

    def setUp(self):
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite://'
        db.create_all()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        
    def test_password_hashing(self):

        u = User(username = 'checkingUser')
        u.password_hash('passw0rd')
        
        self.assertFalse(u.check_password_hash('password'))
        self.asserTrue(u.check_password_hash('passw0rd'))

    def test_usernames(self):
        u1 = User(username = 'user1')
        u2 = User(username = 'user2')

        db.session.add(u1)
        db.session.add(u2)
        db.session.commit()
        with self.assertRaises(UserExists):
            u3 = User(username = 'user1')

    def test_test_scores(self):
        u1 = User(username = 'user1')
        u2 = User(username = 'user2')
        u1.password_hash('password1')
        u2.password_hash('password2')
        db.session.add(u1)
        db.session.add(u2)
        db.seesion.commit()

        test1u1 = TestAttempt(id = u1, testId = 1, score = 100, date = datetime.date())
        test2u1 = TestAttempt(id = u1, testId = 2, score = 100, date = datetime.date())
        test3u1 = TestAttempt(id = u1, testId = 3, score = 100, date = datetime.date())

        test1u2 = TestAttempt(id = u2, testId = 1, score = 100, date = datetime.date())
        test2u2 = TestAttempt(id = u2, testId = 2, score = 100, date = datetime.date())
        test3u2 = TestAttempt(id = u2, testId = 3, score = 100, date = datetime.date())
        u1.testAttempts(test1u1)
        u1.testAttempts(test2u1)
        u1.testAttempts(test3u1)
        u2.testAttempts(test1u1)
        u2.testAttempts(test2u1)
        u2.testAttempts(test3u1)
        db.session.commit()

        
    

        
        

if __name__ =='__main__':
    unittest.main(verbosity = 2)
