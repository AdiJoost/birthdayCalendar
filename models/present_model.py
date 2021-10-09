from db import db

class GiftModel(db.Model):
    
    __tablename__ = "gifts";
    _id = db.Column(db.Integer, primary_key=True)
    
    kid_id = db.Column(db.Integer, db.ForeignKey("kids._id"))
    kid = db.relationship('KidModel')
    
    gift_type = db.Column(db.Integer)
    year = db.Column(db.Integer)
    
    def __init__(self, kid_id, gift_type, year):
        self.kid_id = kid_id
        self.gift_type = gift_type
        self.year = year
                
    def to_json(self):
        if (self.kid == None):
            return {"id": self._id,
                "kid_id": self.kid_id,
                "gift_type": self.gift_type,
                "year": self.year,
                "kid_name": "None, probably should delete this",
                "kid_birthday": "None, probably should delete this"}
        
        return {"id": self._id,
                "kid_id": self.kid_id,
                "gift_type": self.gift_type,
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
        