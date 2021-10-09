from db import db

class PresentModel(db.Model):
    
    __tablename__ = "presents";
    _id = db.Column(db.Integer, primary_key=True)
    
    kid_id = db.Column(db.Integer, db.ForeignKey("kids._id"))
    kid = db.relationship('KidModel')
    
    present_type = db.Column(db.Integer)
    year = db.Column(db.Integer)
    
    def __init__(self, kid_id, present_type, year):
        self.kid_id = kid_id
        self.present_type = present_type
        self.year = year
                
    def to_json(self):
        if (self.kid == None):
            return {"id": self._id,
                "kid_id": self.kid_id,
                "present_type": self.present_type,
                "year": self.year,
                "kid_name": "None, probably should delete this",
                "kid_birthday": "None, probably should delete this"}
        
        return {"id": self._id,
                "kid_id": self.kid_id,
                "present_type": self.present_type,
                "year": self.year,
                "kid_name": self.kid.name,
                "kid_birthday": str(self.kid.birthday)}

    def save(self):
        db.session.add(self)
        db.session.commit()
        
    def deleteMe(self):
        db.session.delete(self)
        db.session.commit()
        
    @classmethod
    def get (cls, _id):
        return cls.query.filter_by(_id=_id).first();
        