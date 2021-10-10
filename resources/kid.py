from flask_restful import Resource, reqparse
from models.kid_model import KidModel
import datetime
from flask import make_response
import flask
from utilities import create_response, get_date, kid_post_parser, create_presents_entries

class Kid(Resource):
    
    def get(self, identifier):
        kid = KidModel.get(identifier)
        if not kid:
            return create_response({"message": "no Kid found in database"}, 404)
        return create_response(kid.to_json(), 200)
        
        
    def post(self, identifier):
        parser = kid_post_parser()
        data = parser.parse_args()
        date = get_date(data['birthday'])
        if not date:
            return create_response({"message": "Could not assign birthday. Make sure the format is yyyy-MM-dd as a String"}, 400)
        kid = KidModel.get(data['name'])
        if kid:
            return create_response({"message": "Name already exists, please choose an other name"}, 400)
        kid = KidModel(data["name"], date)
        kid.save()
        create_presents_entries(kid, 8)
        return create_response({"message": "Kid created",
                                    "kid": kid.to_json()}, 201)
        
    def delete(self, identifier):
        pass
    
class Kids(Resource):
    def get(self):
        kids = KidModel.get_all()
        return_body = {}
        for kid in kids:
            return_body[kid._id] = kid.to_json()
        return create_response(return_body, 200)
    
