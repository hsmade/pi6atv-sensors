from flask import Flask, send_from_directory
app = Flask(__name__, static_folder="static")
# app.config["sensors"] = "/dev/shm/sensors"
app.config["sensors"] = "example_sensors.json"


@app.route("/api/sensors")
def sensors():
    with open(app.config["sensors"]) as sensors:
        data = sensors.read()
    response = app.response_class(
        response=data,
        mimetype='application/json'
    )
    return response


@app.route("/")
def index():
    return app.send_static_file('html/index.html')


@app.route('/js/<path:path>')
def send_js(path):
    return send_from_directory('js', path)


@app.route('/css/<path:path>')
def send_css(path):
    return send_from_directory('css', path)


if __name__ == '__main__':
    app.run()
