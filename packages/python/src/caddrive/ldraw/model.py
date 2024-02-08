class Color:
    def __init__(self, name: str, code: int, value: str, edge: str, alpha: float):
        self.name = name
        self.code = code
        self.value = value
        self.edge = edge
        self.alpha = alpha

class Vector:
    def __init__(self, x: float, y: float, z: float):
        self.x = x
        self.y = y
        self.z = z

class Matrix:
    def __init__(self, a: float, b: float, c: float, d: float, e: float, f: float, g: float, h: float, i: float):
        self.a = a
        self.b = b
        self.c = c
        self.d = d
        self.e = e
        self.f = f
        self.g = g
        self.h = h
        self.i = i

class Entry:
    pass

class Comment(Entry):
    def __init__(self, text: str):
        self.text = text

class Command(Entry):
    def __init__(self, text: str):
        self.text = text

class Reference(Entry):
    def __init__(self, color: int, position: Vector, orientation: Matrix, file: str):
        self.color = color
        self.position = position
        self.orientation = orientation
        self.file = file

class Shape(Entry):
    def __init__(self, color: int):
        self.color = color

class Line(Shape):
    def __init__(self, color: int, firstPoint: Vector, secondPoint: Vector):
        super().__init__(color)
        self.firstPoint = firstPoint
        self.secondPoint = secondPoint

class Triangle(Shape):
    def __init__(self, color: int, firstPoint: Vector, secondPoint: Vector, thirdPoint: Vector):
        super().__init__(color)
        self.firstPoint = firstPoint
        self.secondPoint = secondPoint
        self.thirdPoint = thirdPoint

class Quadliteral(Shape):
    def __init__(self, color: int, firstPoint: Vector, secondPoint: Vector, thirdPoint: Vector, fourthPoint: Vector):
        super().__init__(color)
        self.firstPoint = firstPoint
        self.secondPoint = secondPoint
        self.thirdPoint = thirdPoint
        self.fourthPoint = fourthPoint

class OptionalLine(Shape):
    def __init__(self, color: int, firstPoint: Vector, secondPoint: Vector, firstControlPoint: Vector, secondControlPoint: Vector):
        super().__init__(color)
        self.firstPoint = firstPoint
        self.secondPoint = secondPoint
        self.firstControlPoint = firstControlPoint
        self.secondControlPoint = secondControlPoint

class Model:
    entries: list[Entry] = []
    def __init__(self, name: str):
        self.name = name