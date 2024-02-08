from enum import Enum

class FinishType(Enum):
    CHROME = 1
    PEARLESCENT = 2
    RUBBER = 3
    MATTE_METALLIC = 4
    METAL = 5
    MATERIAL = 6

class FinishName(Enum):
    GLITTER = 1
    SPECKLE = 2

class Finish:
    def __init__(self, type: FinishType, name: FinishName, value: str, alpha: int, luminance: float, fraction: float, vFraction: float, size: int, minSize: int, maxSize: int):
        self.type = type
        self.name = name
        self.value = value
        self.alpha = alpha
        self.luminance = luminance
        self.fraction = fraction
        self.vFraction = vFraction
        self.size = size
        self.minSize = minSize
        self.maxSize = maxSize

class Color:
    def __init__(self, name: str, code: int, value: str, edge: str, alpha: int, luminance: float, finish: Finish):
        self.name = name
        self.code = code
        self.value = value
        self.edge = edge
        self.alpha = alpha
        self.luminance = luminance
        self.finish = finish

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
    
    def __init__(self, uri: str):
        self.uri = uri

        self.name: str = None
        self.author: str = None
        self.category: str = None
        self.keywords: list[str] = []

        self.parent: Model = None
        self.children: list[Model] = []

    def root(self):
        if self.parent:
            return self.parent.root()
        else:
            return self