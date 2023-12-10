from flask import Flask, Blueprint, send_from_directory, request
import json

StadiumsManagerRoutes = Blueprint('StadiumsManagerRoutes', __name__)
STADIUM_MGR_SUPPORT_DATA_TYPE = ["site", "floor"]

def getDataType():
    return request.path.split("/")[2]

@StadiumsManagerRoutes.route("/list", methods=["GET"])
def listStadiums():
    dataType = getDataType()
    listType = request.args.get("type")
    print(listType)
    if(listType == "all"):
        rtvList = {}
    elif(listType == "query"):
        rtvList = {}
    elif(listType == "name"):
        rtvList = {
            "stadium_1" :{"name": "Stadium 1", "key": "stadium_1"},
            "stadium_2" :{"name": "Stadium 2", "key": "stadium_2"},
            "stadium_3" :{"name": "Stadium 3", "key": "stadium_3"},
            "stadium_4" :{"name": "Stadium 4", "key": "stadium_4"}
        }
    else:
        return json.dumps({"error": f"Invalid list type: {listType}"}), 400
    return json.dumps(rtvList)

@StadiumsManagerRoutes.route("/create", methods=["POST"])
def createStadium():
    dataType = getDataType()
    return f"Create {dataType}"

@StadiumsManagerRoutes.route("/update", methods=["POST"])
def editStadium():
    dataType = getDataType()

    return f"Update {dataType}"

@StadiumsManagerRoutes.route("/delete", methods=["DELETE"])
def deleteStadium():
    dataType = getDataType()
    return f"Delete {dataType}"

