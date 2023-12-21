from flask import Flask, Response, send_from_directory, request,make_response
from flask_cors import CORS
import os
import sys
from mapeditor import MapEditorRoutes
from dashboard import DashboardRoutes
import argparse
from stadiumMgr import StadiumsManagerREST
from courtMgr import CourtsManagerREST
from opentime import OpenTimeREST
from closetime import CloseTimeREST
from announce import AnnounceREST
from flask_restful import Resource, Api
from app import app, db, jwt

from dotenv import load_dotenv
load_dotenv()

parser = argparse.ArgumentParser()
parser.add_argument("-d", "--debug", action="store_true")
args = parser.parse_args()
production_mode = 'ENV' in os.environ and os.getenv('ENV') == 'prod'

# app.register_blueprint(MapEditorRoutes)
if production_mode:
    app.register_blueprint(DashboardRoutes)
api = Api(app)

api.add_resource(StadiumsManagerREST, '/api/stadium/site', endpoint="stadium")
api.add_resource(CourtsManagerREST, '/api/stadium/court', endpoint="stadium_court")
api.add_resource(OpenTimeREST, '/api/stadium/opentime', endpoint="stadium_opentime")
api.add_resource(CloseTimeREST, '/api/stadium/closetime', endpoint="stadium_closetime")
api.add_resource(AnnounceREST, '/api/stadium/announce', endpoint="stadium_announce")
# StadiumsManagerREST.register(app,init_argument={"tableName": "stadium"},route_base="/stadium/")
# StadiumsManagerREST.register(app,init_argument={"tableName": "stadium_floor"},route_base="/stadium/floor/", redirect_to="/stadium/floor/")

app.run(host='127.0.0.1', port=5000, debug=args.debug)
sys.exit()