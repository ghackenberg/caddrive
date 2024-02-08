from ..model import *

class ModelParser:

    _context: Model = None

    def parseFile(self, file: str):
        self._context = Model(file)

        with open(file, "r") as file:
            for line in file:
                self._parseLine(line)

        return self._context
    
    def parseText(self, text: str):
        self._context = Model("anonymous")

        for line in text.splitlines():
            self._parseLine(line)

        return self._context

    def _parseLine(self, line: str):
        if line[0] == "0":
            self._parseLineType0(line)

        elif line[0] == "1":
            self._parseLineType1(line)

        elif line[0] == "2":
            self._parseLineType2(line)

        elif line[0] == "3":
            self._parseLineType3(line)

        elif line[0] == "4":
            self._parseLineType4(line)

        elif line[0] == "5":
            self._parseLineType5(line)

        elif line == "":
            pass

        else:
            raise Exception("Line type not supported!")
    
    def _parseLineType0(self, line: str):
        if line.startswith("0 FILE "):
            self._parseLineType0_FILE(line)
        
        elif line.startswith("0 NOFILE"):
            self._parseLineType0_NOFILE(line)
        
        elif line.startswith("0 Name: "):
            self._parseLineType0_NAME(line)
        
        elif line.startswith("0 Author: "):
            self._parseLineType0_AUTHOR(line)
        
        elif line.startswith("0 BFC "):
            self._parseLineType0_BFC(line)

        elif line.startswith("0 !"):
            self._context.entries.append(Command(line[3:]))

            if line.startswith("0 !COLOUR "):
                self._parseLineType0_COLOUR(line)

            elif line.startswith("0 !TEXMAP "):
                self._parseLineType0_TEXMAP(line)

            elif line.startswith("0 !DATA "):
                self._parseLineType0_DATA(line)

            elif line.startswith("0 !: "):
                self._parseLineType0_DATA_CHUNK(line)

            elif line.startswith("0 !CATEGORY "):
                self._parseLineType0_CATEGORY(line)

            elif line.startswith("0 !KEYWORDS "):
                self._parseLineType0_KEYWORDS(line)

            elif line.startswith("0 !LDRAW_ORG "):
                self._parseLineType0_LDRAW_ORG(line)
            
            elif line.startswith("0 !LICENSE "):
                self._parseLineType0_LICENSE(line)

            elif line.startswith("0 !HELP "):
                self._parseLineType0_HELP(line)

            elif line.startswith("0 !CMDLINE "):
                self._parseLineType0_CMDLINE(line)

            elif line.startswith("0 !HISTORY "):
                self._parseLineType0_HISTORY(line)

            elif line.startswith("0 !LEOCAD MODEL COMMENT "):
                self._parseLineType0_LEOCAD_MODEL_COMMENT(line)

        elif line.startswith("0 // "):
            self._context.entries.append(Comment(line[5:]))

        else:
            self._context.entries.append(Comment(line[2:]))
    
    def _parseLineType0_FILE(self, line: str):
        self._context = self._context.root()
        
        child = Model(line[7:])
        child.parent = self._context
        
        self._context.children.append(child)
        self._context = child

    def _parseLineType0_NOFILE(self, line: str):
        self._context = self._context.parent

    def _parseLineType0_NAME(self, line: str):
        self._context.name = line[8:]

    def _parseLineType0_AUTHOR(self, line: str):
        self._context.author = line[10:]

    def _parseLineType0_BFC(self, line: str):
        pass

    def _parseLineType0_COLOUR(self, line: str):
        pass

    def _parseLineType0_TEXMAP(self, line: str):
        pass

    def _parseLineType0_DATA(self, line: str):
        pass

    def _parseLineType0_DATA_CHUNK(self, line: str):
        pass

    def _parseLineType0_CATEGORY(self, line: str):
        pass

    def _parseLineType0_KEYWORDS(self, line: str):
        pass

    def _parseLineType0_LDRAW_ORG(self, line: str):
        pass

    def _parseLineType0_LICENSE(self, line: str):
        pass

    def _parseLineType0_HELP(self, line: str):
        pass

    def _parseLineType0_CMDLINE(self, line: str):
        pass

    def _parseLineType0_HISTORY(self, line: str):
        pass

    def _parseLineType0_LEOCAD_MODEL_COMMENT(self, line: str):
        pass
    
    def _parseLineType1(self, line: str):
        parts = line.split()

        if (len(parts) == 15):
            color = int(parts[1])

            x = float(parts[2])
            y = float(parts[3])
            z = float(parts[4])
            position = Vector(x, y, z)
            
            a = float(parts[5])
            b = float(parts[6])
            c = float(parts[7])
            d = float(parts[8])
            e = float(parts[9])
            f = float(parts[10])
            g = float(parts[11])
            h = float(parts[12])
            i = float(parts[13])
            orientation = Matrix(a, b, c, d, e, f, g, h, i)
            
            file = parts[14]
            
            self._context.entries.append(Reference(color, position, orientation, file))

        else:
            raise Exception("Line type 1 syntax not supported!")
    
    def _parseLineType2(self, line: str):
        parts = line.split()

        if len(parts) == 8:
            color = parts[1]

            x1 = float(parts[2])
            y1 = float(parts[3])
            z1 = float(parts[4])
            firstPoint = Vector(x1, y1, z1)

            x2 = float(parts[5])
            y2 = float(parts[6])
            z2 = float(parts[7])
            secondPoint = Vector(x2, y2, z2)

            self._context.entries.append(Line(color, firstPoint, secondPoint))

        else:
            raise Exception("Line type 2 syntax not supported!")
    
    def _parseLineType3(self, line: str):
        parts = line.split()

        if len(parts) == 11:
            color = parts[1]

            x1 = float(parts[2])
            y1 = float(parts[3])
            z1 = float(parts[4])
            firstPoint = Vector(x1, y1, z1)

            x2 = float(parts[5])
            y2 = float(parts[6])
            z2 = float(parts[7])
            secondPoint = Vector(x2, y2, z2)

            x3 = float(parts[8])
            y3 = float(parts[9])
            z3 = float(parts[10])
            firstControlPoint = Vector(x3, y3, z3)

            self._context.entries.append(Triangle(color, firstPoint, secondPoint, firstControlPoint))

        else:
            raise Exception("Line type 3 syntax not supported!")
    
    def _parseLineType4(self, line: str):
        parts = line.split()

        if len(parts) == 14:
            color = parts[1]

            x1 = float(parts[2])
            y1 = float(parts[3])
            z1 = float(parts[4])
            firstPoint = Vector(x1, y1, z1)

            x2 = float(parts[5])
            y2 = float(parts[6])
            z2 = float(parts[7])
            secondPoint = Vector(x2, y2, z2)

            x3 = float(parts[8])
            y3 = float(parts[9])
            z3 = float(parts[10])
            firstControlPoint = Vector(x3, y3, z3)

            x4 = float(parts[11])
            y4 = float(parts[12])
            z4 = float(parts[13])
            secondControlPoint = Vector(x4, y4, z4)

            self._context.entries.append(Quadliteral(color, firstPoint, secondPoint, firstControlPoint, secondControlPoint))

        else:
            raise Exception("Line type 4 syntax not supported!")
    
    def _parseLineType5(self, line: str):
        parts = line.split()

        if len(parts) == 14:
            color = parts[1]

            x1 = float(parts[2])
            y1 = float(parts[3])
            z1 = float(parts[4])
            firstPoint = Vector(x1, y1, z1)

            x2 = float(parts[5])
            y2 = float(parts[6])
            z2 = float(parts[7])
            secondPoint = Vector(x2, y2, z2)

            x3 = float(parts[8])
            y3 = float(parts[9])
            z3 = float(parts[10])
            firstControlPoint = Vector(x3, y3, z3)

            x4 = float(parts[11])
            y4 = float(parts[12])
            z4 = float(parts[13])
            secondControlPoint = Vector(x4, y4, z4)

            self._context.entries.append(OptionalLine(color, firstPoint, secondPoint, firstControlPoint, secondControlPoint))

        else:
            raise Exception("Line type 5 syntax not supported!")