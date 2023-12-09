from flask import Flask, Response, send_from_directory, request,make_response
import os
import sys

app = Flask(__name__)

# @app.after_request
# def add_header(r):
#     """
#     Add headers to both force latest IE rendering engine or Chrome Frame,
#     and also to cache the rendered page for 10 minutes.
#     """
#     r.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
#     r.headers["Pragma"] = "no-cache"
#     r.headers["Expires"] = "0"
#     r.headers['Cache-Control'] = 'public, max-age=0'
#     return r
# Serve files
root_dir = os.path.dirname(os.path.realpath(os.path.dirname(__file__)))
PUBLIC_PATH = os.path.join(root_dir, "..", "public")

@app.route("/mapeditor/")
def home():
    print("Get home file")
    print(root_dir)
    return send_from_directory(PUBLIC_PATH, "index.html")
def sendFile(dir, filename):
    root_dir = os.path.dirname(os.path.realpath(os.path.dirname(__file__)))
    return send_from_directory(os.path.join(root_dir, "public", dir), filename)
@app.route("/mapeditor/public/<path:filename>")  # For usage.md's image
def getPUBLIC(filename):
    return sendFile("", filename)
@app.route("/mapeditor/favicon.ico")
def getFaviconICO():
    return sendFile(os.path.join(PUBLIC_PATH,""), "favicon.ico")
@app.route("/mapeditor/css/<path:filename>")
def getCSS(filename):
    return sendFile(os.path.join(PUBLIC_PATH,"css"), filename)
@app.route("/mapeditor/js/<path:filename>")
def getJS(filename):
    return sendFile(os.path.join(PUBLIC_PATH,"js"), filename)
@app.route("/mapeditor/img/<path:filename>")
def getIMG(filename):
    return sendFile(os.path.join(PUBLIC_PATH,"img"), filename)

app.run(host='0.0.0.0', port=8080)
sys.exit()