from flask_restful import Resource, reqparse
from models.kid_model import KidModel
import datetime
from flask import make_response
import flask

class Kid(Resource):
    
    def get(self, identifier):
        kid = KidModel.get(identifier)
        if not kid:
            return Kid.create_response({"message": "no Kid found in database"}, 404)
        return Kid.create_response(kid.to_json(), 200)
        
        
    def post(self, identifier):
        parser = Kid.post_parser()
        data = parser.parse_args()
        date = Kid.get_date(data['birthday'])
        if not date:
            return Kid.create_response({"message": "Could not assign birthday. Make sure the format is yyyy-MM-dd as a String"}, 400)
        kid = KidModel.get(data['name'])
        if kid:
            return Kid.create_response({"message": "Name already exists, please choose an other name"}, 400)
        kid = KidModel(data["name"], date)
        kid.save()
        return Kid.create_response({"message": "Kid created",
                                    "kid": kid.to_json()}, 201)
        
    def delete(self, identifier):
        pass
    
    @classmethod
    def post_parser(cls):
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
        
    @classmethod
    def get_date(cls, string):
        try:
            year = int(string[0:4])
            month = int(string[5:7])
            day = int(string[8:])
            date = datetime.datetime(year, month, day)
            return date
        except:
            return None
        
    @classmethod
    def create_response (cls, body, status):
        response = make_response(flask.jsonify(body), status)
        response.headers.add('Access-Control-Allow-Origin', 'http://127.0.0.1:5000')
        return response