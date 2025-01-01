from flask import Flask, jsonify, request
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)

# Load JSON data from file
def load_data(sheetName):
    if sheetName == "GUI":
        with open("basicgui.json", "r") as file:
            data = json.load(file)
        return data
    elif sheetName == "API":
        with open("basicAPI.json", "r") as file:
            data = json.load(file)
        return data

# Write JSON data to file
def save_data(data , sheetName):
    if sheetName == "GUI":
        with open("basicgui.json", "w") as file:
            json.dump(data, file, indent=4)
    elif sheetName == "API":
        with open("basicAPI.json", "w") as file:
            json.dump(data, file, indent=4)


# Endpoint to get all data
@app.route('/api/data/<string:sheetName>', methods=['GET'])
def get_data(sheetName):
    print(sheetName)
    data = load_data(sheetName)
    return jsonify(data)

@app.route('/api/data/updateStatus/<string:id>//<string:sheetName>', methods=['PUT'])
def updateStaus(id ,sheetName):
    print(f"Received request to update status for item: {id}")
    indices = [int(i) - 1 for i in id.replace("collapse", "").split("-")]
    print(indices)
    data = load_data(sheetName)
    print(sheetName)
    item = data['topics'][indices[0]]['children'][indices[1]]['Content'][indices[2]]
    if item:
        item["status"] = not item["status"]  # Toggle the status
        save_data(data , sheetName)  # Function to save your updated data
        return jsonify({"message": "Status updated successfully"}), 200
    else:
        return jsonify({"error": "Item not found"}), 404
    # print(item)

@app.route('/api/data/updateRivision/<string:id>/<string:sheetName>', methods=['PUT'])
def updateRivision(id , sheetName):
    print(f"Received request to update status for item: {id}")
    indices = [int(i) - 1 for i in id.replace("collapse", "").split("-")]
    print(indices)
    data = load_data(sheetName)
    item = data['topics'][indices[0]]['children'][indices[1]]['Content'][indices[2]]
    if item:
        item["revision"] = not item["revision"]  # Toggle the status
        save_data(data ,sheetName)  # Function to save your updated data
        return jsonify({"message": "Rivision updated successfully"}), 200
    else:
        return jsonify({"error": "Item not found"}), 404
    # print(item)

if __name__ == '__main__':
    app.run(debug=True)
