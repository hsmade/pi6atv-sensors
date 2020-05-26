class BaseSensor:
    """
    base for any sensor
    """
    type = ""

    def __init__(self, name, ):
        self.name = name

    def read(self):
        return None

    def to_dict(self):
        value = self.read()
        return {
            "name": self.name,
            "type": self.type,
            "value": value,
            "prometheus_data": self.to_openmetrics(value),
        }

    def to_openmetrics(self, value):
        if type(value).__name__ not in ["float", "int"]:
            return
        return '{type}{{name="{name}", class="{class_name}"}} {value}\n'.format(type=self.type, class_name=type(self).__name__.lower(), name=self.name, value=value)
