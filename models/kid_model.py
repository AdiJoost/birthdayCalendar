from db import db

class KidModel(db.Model):
    
    __tablename__ = 'kids'
    _id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80))
    birthday = db.Column(db.Date())
    
    def __init__(self, name, birthday):
        self.name = name
        self.birthday = birthday
        
    def to_json(self):
        return {self._id : {'name' : self.name,
                            'birthday': str(self.birthday),
                            'id': self._id}}
    
    def save(self):
        db.session.add(self)
        db.session.commit()
        
    def delete(self):
        db.session.delete(self)
        db.session.commit()
        
    @classmethod
    def get (cls, name):
        kid = cls.query.filter_by(_id=name).first()
        if kid:
            return kid
        kid = cls.query.filter_by(name=name).first()
        return kid
    
    @classmethod
    def get_all(cls):
        return cls.query.all()
    
    
        