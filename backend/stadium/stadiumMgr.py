from flask import Flask, Blueprint, send_from_directory, request
import json
from flask_restful import Resource, Api
class StadiumsManagerREST(Resource):
    def __init__(self, tableName : str):
        self.tableName = tableName
    
    def __get_data_type__(self):
        return request.path.split("/")[2]
    
    def get(self):
        # dataType = self.__get_data_type__()
        listType = request.args.get("type")
        # print(listType)
        if(listType == "all"):
            rtvList = {}
        elif(listType == "query"):
            rtvList = {}
        elif(listType == "page"):
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
    
    def post(self): # Create
        dataType = self.__get_data_type__()
        return f"Create {dataType}"
    
    def put(self): # Update
        dataType = self.__get_data_type__()
        return f"Update {dataType}"
    
    def delete(self):
        dataType = self.__get_data_type__()
        return f"Delete {dataType}"    

