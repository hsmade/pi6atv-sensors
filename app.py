from flask import Flask, jsonify, send_from_directory
from . sensorsConfig import sensor_config
app = Flask(__name__, static_url_path='static')


@app.route("/api/sensors")
def sensors():
    result = dict()
    for sensor in sensor_config:
        result[sensor.get("name")] = {"data": sensor.get("object").read(), "type": sensor.get("type")}
    return jsonify(result)


@app.route("/")
def index():
    app.send_static_file('html/index.html')


@app.route('/js/<path:path>')
def send_js(path):
    return send_from_directory('js', path)


@app.route('/css/<path:path>')
def send_css(path):
    return send_from_directory('css', path)


if __name__ == '__main__':
    app.run()
