from flask import Flask, Blueprint, send_from_directory
import os

DashboardRoutes = Blueprint('DashboardRoutes', __name__)

# Serve files
root_dir = os.path.dirname(os.path.realpath(os.path.dirname(__file__)))
PUBLIC_PATH = os.path.join(root_dir,"flask", "dashboard")


@DashboardRoutes.route("/dashboard/")
def home():
    print("Get home file")
    print(root_dir)
    return send_from_directory(PUBLIC_PATH, "index.html")
def sendFile(dir, filename):
    root_dir = os.path.dirname(os.path.realpath(os.path.dirname(__file__)))
    return send_from_directory(os.path.join(root_dir, "public", dir), filename)
# @DashboardRoutes.route("/dashboard/public/<path:filename>")  # For usage.md's image
# def getPUBLIC(filename):
#     return sendFile("", filename)
@DashboardRoutes.route("/dashboard/favicon.ico")
def getFaviconICO():
    return sendFile(os.path.join(PUBLIC_PATH,""), "favicon.ico")
@DashboardRoutes.route("/dashboard/assets/<path:filename>")
def getCSS(filename):
    return sendFile(os.path.join(PUBLIC_PATH,"assets"), filename)
@DashboardRoutes.route("/dashboard/img/<path:filename>")
def getIMG(filename):
    return sendFile(os.path.join(PUBLIC_PATH,"img"), filename)
