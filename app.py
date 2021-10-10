from flask import Flask, render_template
from flask_restful import Api
from db import db
from resources.kid import Kid
from resources.present import Present, Presents


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///data.db"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.secret_key = "hahahahah"
api = Api(app)

@app.before_first_request
def create_table():
    db.create_all()
    
@app.route('/', methods=['GET'])
def home():
    return render_template("index.html")
    

api.add_resource(Kid, '/kid/<string:identifier>')
api.add_resource(Present, '/present/<int:_id>')
api.add_resource(Presents, '/presents')
    
if __name__ == '__main__':
    db.init_app(app)
    app.run(port=5000, host='0.0.0.0', debug=True)
