from flask_restful import reqparse
import datetime
from flask import make_response, jsonify
from models.present_model import PresentModel
from models.kid_model import KidModel    


    
def get_date(string):
    try:
        year = int(string[0:4])
        month = int(string[5:7])
        day = int(string[8:])
        date = datetime.date(year, month, day)
        return date
    except:
        return None
        
    
def create_response (body, status):
    response = make_response(jsonify(body), status)
    response.headers.add('Access-Control-Allow-Origin', 'http://127.0.0.1:5000')
    return response

#Takes a kid and creates the given amount of presents-entries for the next years
def create_presents_entries (kid, amount):
    for i in range (amount):
        present = PresentModel(kid._id,
                               i + 1,
                               kid.birthday.year + 1 + i,
                               False)
        present.save()
        
#checks, if a kid with given name but different id already exist in db 
def check_double(identifier, name):
    kid = KidModel.get(name)
    if not kid:
        return False
    if kid._id == identifier:
        return False
    return True
        


#Below are all methods to create a parser for a specific Request
def kid_post_parser():
    parser = reqparse.RequestParser()
    parser.add_argument("name",
                        type=str,
                        required=True,
                        help="This field cannot be left blank")
    parser.add_argument("birthday",
                        type=str,
                        required=True,
                        help="This field cannot be left blank and is in format yyyy-MM-dd")
    return parser

def kid_put_parser():
    parser = reqparse.RequestParser()
    parser.add_argument("name",
                        type=str)
    parser.add_argument("birthday",
                        type=str)
    return parser
        
def present_post_parser():
    parser = reqparse.RequestParser()
    parser.add_argument("kid_id",
                        type=int,
                        required=True,
                        help="This field cannot be left blank")
    parser.add_argument("year",
                        type=int,
                        required=True,
                        help="This field cannot be left blank and is in format yyyy-MM-dd")
    return parser

def present_put_parser():
    parser = reqparse.RequestParser()
    parser.add_argument("is_done",
                        type=bool)
    parser.add_argument("year",
                        type=int)
    return parser

def presents_post_parser():
    parser = reqparse.RequestParser()
    parser.add_argument("start_date",
                        type=str)
    parser.add_argument("end_date",
                        type=str)
    return parser