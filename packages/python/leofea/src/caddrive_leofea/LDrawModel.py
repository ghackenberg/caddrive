# Features
#  - Create lego Model: tableLeoFeaModel, strTableLeoFeaModel  
#  - read LDR file (e.g. created by LeoCAD) and return tabular Info of the parts in LDR
#  - read Lego part library from file, e.g.  f'{RESOURCESDIR}/libLegoParts.lib'
#
# Usage:
# 1. readFileLDR('libLegoParts.txt', 'mymodel.ldr')
# 2. getStrTableLeoFeaModel() .... Human readable description of lego file

import re

class LDrawModel():

    # Length of an LDU
    lenLDU = 0.4  #mm

    # Length of basic segment
    numLDUx = 20     # Number of LDUs in x-direction
    numLDUy = 20     # in y-direction
    numLDUz = 8      # in z-direction  (3 segments for "normal brick")
    
    volume = 0
    numberSegments = 0
    price = 0

    fileNameLib = ""
    fileNameLDR = ""
    tablePartLib = {}
    tableLeoFeaModel = [] 
    strTableLeoFeaModel = ""
    
    def readFileLDR(self, fileNameLib, fileNameLDR):

        self.fileNameLib = fileNameLib
        self.fileNameLDR = fileNameLDR

        # Read Lib of parts
        self._readPartLib()

        #print("Part Lib Table:")
        #print(self.tablePartLib)

        self.tableLeoFeaModel = []     # Initialize table for read LDR parts

        fin = open(self.fileNameLDR, "r")
        
        i = 0

        for line in fin:
            x = re.split("\s", line)
            #print(len(x))

            if len(x) == 16:

                posxL = float( x[2] )   # LDR coordinates
                posyL = float( x[3] )
                poszL = float( x[4] )

                datname = x[14]    # dat file describes the Lego part (subpart)

                dim = self.tablePartLib[datname]     # number of segments + part description + price
                #print(dim)

                # convert to physical coordinates (Code-Aster)
                lenLDU = self.lenLDU    #0.4
                
                # Size of part
                Lx = self.lenLDU *  self.numLDUx * dim[0]
                Ly = self.lenLDU *  self.numLDUy * dim[1]
                Lz = self.lenLDU *  self.numLDUz * dim[2]
                partPrice = dim[4]
                
                # Volume and price
                self.volume += Lx * Ly * Lz
                self.numberSegments += dim[0] * dim[1] * dim[2]
                self.price += partPrice

                posx =  posxL * self.lenLDU - Lx / 2   # Code-Aster coordinates
                posy =  poszL * self.lenLDU - Ly / 2
                posz = -posyL * self.lenLDU - Lz

                #print([i, datname, dim[0], dim[1], dim[2], dim[3], posx, posy, posz])
                self.tableLeoFeaModel.append([i, datname, dim[0], dim[1], dim[2], dim[3], posx, posy, posz])
                
                i += 1

        fin.close()
        
        # Return model
        return self.tableLeoFeaModel
    
    def getStrTableLeoFeaModel(self, fileNameTbl):

        self.fileNameTbl = fileNameTbl

        # Build string
        self.strTableLeoFeaModel = "PartID, DatFile, lenx, leny, lenz, name, posx, posy, posz         #lenx, leny,lenz ... number of basic LDU\n"
        for line in self.tableLeoFeaModel:
            self.strTableLeoFeaModel += f"{line}\n"

        # Write string
        fid = open(self.fileNameTbl, 'w')
        fid.write(self.strTableLeoFeaModel)
        fid.close()

        # Return string
        return self.strTableLeoFeaModel
    
    def _readPartLib(self):

        # Reads the library for Lego parts from file, e.g. f'{RESOURCESDIR}/libLegoParts.txt'
        # Write it to the table self.partLibTable, e.g.
        # self.partLibTable = {    '3001.dat' : [ 4, 2, 3, 'brick4x2'],50,
        #                 '3003.dat' : [ 2, 2, 3, 'brick3x3', 100] ,
        #                '30072.dat' : [24,12, 3, 'brick24x12', 20],
        #                 '4282.dat' : [ 16,2, 1, 'plate16x2', 40],
        #                '43802.dat' : [ 8, 8, 3, 'brick8x8', 40],
        #                '80319.dat' : [ 8, 8, 1, 'plate8x8', 5],
        #                      }

        self.partLibTable = {}            # reset before reading
        
        fin = open(self.fileNameLib, "r")
        
        
        for line in fin:
            
            x = re.split("\s+", line)
                        
            partnameDat = x[0]
            if partnameDat:   # If string not empty
                
                dimx = int(x[1])    # number of segments in x direction
                dimy = int(x[2])
                dimz = int(x[3])
                partnameLego = x[4]
                price = float(x[5])
                
                self.tablePartLib[partnameDat] = [dimx, dimy, dimz, partnameLego, price]
        fin.close()

        #print(self.tablePartLib)

    


