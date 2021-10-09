from flask_restful import reqparse
import datetime
from flask import make_response, jsonify    

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
        
    
def get_date(string):
    try:
        year = int(string[0:4])
        month = int(string[5:7])
        day = int(string[8:])
        date = datetime.datetime(year, month, day)
        return date
    except:
        return None
        
    
def create_response (body, status):
    response = make_response(jsonify(body), status)
    response.headers.add('Access-Control-Allow-Origin', 'http://127.0.0.1:5000')
    return response