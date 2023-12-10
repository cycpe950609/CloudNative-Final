from flask import Flask, Response, send_from_directory, request,make_response
import os
import sys
from mapeditor import MapEditorRoutes
from stadiumMgr import StadiumsManagerRoutes

app = Flask(__name__)
app.register_blueprint(MapEditorRoutes)
app.register_blueprint(StadiumsManagerRoutes,name="stadiumsMgr", url_prefix="/stadium/")
app.register_blueprint(StadiumsManagerRoutes,name="stadiumFloorsMgr", url_prefix="/stadium/floor/")

app.run(host='0.0.0.0', port=8080)
sys.exit()