from flask_restful import Resource
from models.present_model import PresentModel
from models.kid_model import KidModel
from utilities import create_response, present_post_parser, presents_post_parser, get_date, present_put_parser


class Present(Resource):
    def get(self, _id):
        present = PresentModel.get(_id)
        if not present:
            return create_response({"message": "could not find present with that id"}, 404)
        return create_response(present.to_json(), 200)
    
    def post(self, _id):
        parser = present_post_parser()
        data = parser.parse_args()
        kid = KidModel.get(data["kid_id"])
        if not kid:
            return create_response({"message": "No Kid with that ID exists"}, 404)
        #todo check that every year, only one present per kid exists
        present_type = data["year"] - kid.birthday.year
        present = PresentModel(data["kid_id"], present_type, data["year"], False)
        present.save()
        return create_response({"message": "Present created", "present": present.to_json()}, 201)
        
    def delete(self, _id):
        pass
    
    def put(self, _id):
        present = PresentModel.get(_id);
        if not present:
            return create_response({"message": f"Error. No Present with given ID({_id}) found"}, 400)
        parser = present_put_parser()
        data = parser.parse_args()
        if data["is_done"] != None:
            present.is_done = data["is_done"]
        if data["year"]:
            present.year = data["year"]
        present.save()
        return create_response({"message": "Present updated", "present": present.to_json()}, 200)
    
    
class Presents(Resource):
    def get(self):
        presents = PresentModel.get_all()
        body ={}
        for present in presents:
            body[present._id] = present.to_json()
        return create_response(body, 200)    
        
    def post(self):
        parser = presents_post_parser()
        data = parser.parse_args()
        start_date = None
        end_date = None
        if data["start_date"]:
            start_date = get_date(data["start_date"])
        if data["end_date"]:
            end_date = get_date(data["end_date"])
        presents = PresentModel.get_from_date_to_date(start_date, end_date)
        body ={}
        for present in presents:
            body[present._id] = present.to_json()
        return create_response(body, 200)