class BaseSensor:
    """
    base for any sensor
    """
    type = ""

    def __init__(self, name, ):
        self.name = name

    def read(self):
        return None

    def toDict(self):
        return {
            "name": self.name,
            "type": self.type,
            "value": self.read()
        }
