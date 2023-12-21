from flask import Flask, Blueprint, send_from_directory
import os

MapEditorRoutes = Blueprint('MapEditorRoutes', __name__)

from dotenv import load_dotenv
load_dotenv()
# Serve files
root_dir = os.path.dirname(os.path.realpath(os.path.dirname(__file__)))
production_mode = 'ENV' in os.environ and os.environ['ENV'] == 'prod'
print("Prodoction Mode" if production_mode else "Development Mode")
PUBLIC_PATH = os.path.join(root_dir, "flask", "mapeditor") if production_mode else os.path.join(root_dir, "..", "public")


@MapEditorRoutes.route("/mapeditor/")
def home():
    print("Get home file")
    print(root_dir)
    return send_from_directory(PUBLIC_PATH, "index.html")
def sendFile(dir, filename):
    root_dir = os.path.dirname(os.path.realpath(os.path.dirname(__file__)))
    return send_from_directory(os.path.join(PUBLIC_PATH, dir), filename)
@MapEditorRoutes.route("/mapeditor/public/<path:filename>")  # For usage.md's image
def getPUBLIC(filename):
    return sendFile("", filename)
@MapEditorRoutes.route("/mapeditor/favicon.ico")
def getFaviconICO():
    return sendFile(os.path.join(PUBLIC_PATH,""), "favicon.ico")
@MapEditorRoutes.route("/mapeditor/css/<path:filename>")
def getCSS(filename):
    return sendFile(os.path.join(PUBLIC_PATH,"css"), filename)
@MapEditorRoutes.route("/mapeditor/js/<path:filename>")
def getJS(filename):
    return sendFile(os.path.join(PUBLIC_PATH,"js"), filename)
@MapEditorRoutes.route("/mapeditor/img/<path:filename>")
def getIMG(filename):
    return sendFile(os.path.join(PUBLIC_PATH,"img"), filename)
