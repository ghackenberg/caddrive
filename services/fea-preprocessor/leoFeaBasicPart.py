# Create the mesh for leoFea Parts (e.g. a brick or a plate)
#
# Input of specification at Init:
#    def __init__(self, partname, pid, nSegx, nSegy, nSegz, posx, posy, posz):
#
# Features:
# - create nodes
# - create elements
# - translate a body
# - rotate a body (TBD)


import numpy as np
import leoFeaModelDescription as LDR

class legoBasicPart():

    lD = LDR.leoFeaModelDescription()

    len_tolerance = 0.1   # Tolerance of lego parts

    # Length of basic segment
    lenxSeg = lD.numLDUx * lD.lenLDU        #20 * lenLDU    # Element length in x-direction
    lenySeg = lD.numLDUy * lD.lenLDU        #20 * lenLDU    # in y-direction
    lenzSeg = lD.numLDUz * lD.lenLDU        #8 * lenLDU     # in z-direction  (3 segments for "normal brick")

    # Number of elements for basic lego segment (mesh fineness)
    nx = 2   # always even number !
    ny = 2   # always an even number !
    nz = 1   # even or uneven

    lenx0 = lenxSeg / nx    # Element length in x-direction
    leny0 = lenySeg / ny    # in y-direction
    lenz0 = lenzSeg / nz     # in z-direction

    pid = 0   # Part ID

    def __init__(self, partname, pid, nSegx, nSegy, nSegz, posx, posy, posz):
        self.pid = pid
        self.partname = partname
        self.nSegx = nSegx
        self.nSegy = nSegy
        self.nSegz = nSegz
        self.posx = posx
        self.posy = posy
        self.posz = posz

        # Size
        self.Lx = self.lenxSeg * self.nSegx
        self.Ly = self.lenySeg * self.nSegy
        self.Lz = self.lenzSeg * self.nSegz

        # Total number of elements
        self.num_elx = self.nx * self.nSegx
        self.num_ely = self.ny * self.nSegy
        self.num_elz = self.nz * self.nSegz

        # Nodes
        self.nodesId = np.zeros((self.num_elx+1, self.num_ely+1, self.num_elz+1))   # id
        self.nodesx = np.zeros((self.num_elx+1, self.num_ely+1, self.num_elz+1))  # coorx
        self.nodesy = np.zeros((self.num_elx+1, self.num_ely+1, self.num_elz+1))  # coory
        self.nodesz = np.zeros((self.num_elx+1, self.num_ely+1, self.num_elz+1))  # coorz

        # Elements
        numberElements = self.num_elx * self.num_ely * self.num_elz
        self.elements = np.zeros((numberElements, 8))

        # Group of Nodes: Array of integer with the node numbers
        self.ntop   = np.zeros( (self.num_elx+1)*(self.num_ely+1) )    # All nodes on top
        self.nbot   = np.zeros( (self.num_elx+1)*(self.num_ely+1) )    # All nodes on botttom
        self.nleft  = np.zeros( (self.num_ely+1)*(self.num_elz+1) )    # All nodes left
        self.nright = np.zeros( (self.num_ely+1)*(self.num_elz+1) )    # All nodes right
        self.nfront = np.zeros( (self.num_elx+1)*(self.num_elz+1) )    # All nodes front
        self.nback  = np.zeros( (self.num_elx+1)*(self.num_elz+1) )    # All nodes back

        self.nubtop  = np.zeros((self.nSegx, self.nSegy))    # Nub node ids on top
        self.nubtopx = np.zeros((self.nSegx, self.nSegy))    # Nub on top: coorx
        self.nubtopy = np.zeros((self.nSegx, self.nSegy))    #                 y
        self.nubtopz = np.zeros((self.nSegx, self.nSegy))    #                 z

        self.nubbot  = np.zeros((self.nSegx, self.nSegy))    # Nub node ids on botttom
        self.nubbotx = np.zeros((self.nSegx, self.nSegy))    # Nub on botttom: coorx
        self.nubboty = np.zeros((self.nSegx, self.nSegy))    #                     y
        self.nubbotz = np.zeros((self.nSegx, self.nSegy))    #                     z

        # Faces (for contact)
        self.ftop   = np.zeros((self.num_elx*self.num_ely, 4))    # Faces on top (QUAD 4)
        self.fbot   = np.zeros((self.num_elx*self.num_ely, 4))    # Faces on bottom (QUAD4)
        self.fleft  = np.zeros((self.num_ely*self.num_elz, 4))
        self.fright = np.zeros((self.num_ely*self.num_elz, 4))
        self.ffront = np.zeros((self.num_elx*self.num_elz, 4))
        self.fback  = np.zeros((self.num_elx*self.num_elz, 4))

        self.generateMesh()

    def generateMesh(self):

        print('Generating Part ' + self.partname)

        print(f'Number nodes x: {self.num_elx+1}')
        print(f'Number nodes y: {self.num_ely+1}')
        print(f'Number nodes z: {self.num_elz+1}')

        nid = 0  # Node id as rising integer number
        nid_top = 0
        nid_bot = 0
        nid_left = 0
        nid_right = 0
        nid_front = 0
        nid_back = 0

        ### Create the nodes
        for k in range(self.num_elz + 1):
            coorz = self.posz + k * self.lenz0

            for j in range(self.num_ely + 1):
                coory = self.posy + j * self.leny0
                if j==0:
                    coory += self.len_tolerance     # Consider tolerances
                if  j==self.num_ely:
                    coory -= self.len_tolerance

                for i in range(self.num_elx + 1):

                    coorx = self.posx + i * self.lenx0
                    if i==0:
                        coorx += self.len_tolerance     # Consider tolerances
                    if  i==self.num_elx:
                        coorx -= self.len_tolerance

                    self.nodesId[i,j,k] = nid
                    self.nodesx[i,j,k] = coorx
                    self.nodesy[i,j,k] = coory
                    self.nodesz[i,j,k] = coorz

                    ### Create Group of Nodes for the whole bottom / nubs on the bottom
                    if k == 0:
                        self.nbot[nid_bot] = nid
                        nid_bot += 1

                        # Nubs
                        if (i % 2) and (j%2):
                            (ix, dummy) = divmod(i-1, self.nx)
                            (iy, dummy) = divmod(j-1, self.ny)
                            self.nubbot[ix,iy] = nid
                            self.nubbotx[ix,iy] = coorx
                            self.nubboty[ix,iy] = coory
                            self.nubbotz[ix,iy] = coorz

                    ### Create Group of Nodes for the whole top / nubs on the top
                    if k == self.num_elz:
                        self.ntop[nid_top] = nid
                        nid_top += 1

                        # Nubs
                        if (i % 2) and (j%2):
                            (ix, dummy) = divmod(i-1, self.nx)
                            (iy, dummy) = divmod(j-1, self.ny)
                            self.nubtop[ix, iy] = nid
                            self.nubtopx[ix,iy] = coorx
                            self.nubtopy[ix,iy] = coory
                            self.nubtopz[ix,iy] = coorz

                    ### Create nodes left
                    if i == 0:
                        self.nleft[nid_left] = nid
                        nid_left += 1

                    ### Create nodes right
                    if i == self.num_elx:
                        self.nright[nid_right] = nid
                        nid_right += 1

                    ### Create nodes front
                    if j == 0:
                        self.nfront[nid_front] = nid
                        nid_front += 1

                    ### Create nodes back
                    if j == self.num_ely:
                        self.nback[nid_back] = nid
                        nid_back += 1

                    nid = nid + 1

        #### Create the elements
        elid = 0
        i_fbot = 0
        i_ftop = 0
        i_fleft = 0
        i_fright = 0
        i_ffront = 0
        i_fback = 0

        for k in range(self.num_elz):
            for j in range(self.num_ely):
                for i in range(self.num_elx):

                    offy1 = (self.num_elx+1)*j
                    offy2 = (self.num_elx+1)*(j+1)
                    offz1 = (self.num_elx+1)*(self.num_ely+1)*k
                    offz2 = (self.num_elx+1)*(self.num_ely+1)*(k+1)

                    n1 = offz1 + offy1 + i
                    n2 = offz1 + offy1 + i + 1
                    n3 = offz1 + offy2 + i + 1
                    n4 = offz1 + offy2 + i
                    n5 = offz2 + offy1 + i
                    n6 = offz2 + offy1 + i + 1
                    n7 = offz2 + offy2 + i + 1
                    n8 = offz2 + offy2 + i

                    self.elements[elid, 0] = n1
                    self.elements[elid, 1] = n2
                    self.elements[elid, 2] = n3
                    self.elements[elid, 3] = n4
                    self.elements[elid, 4] = n5
                    self.elements[elid, 5] = n6
                    self.elements[elid, 6] = n7
                    self.elements[elid, 7] = n8

                    ### Create Face on bottom
                    if k == 0:
                        self.fbot[i_fbot, 0] = n1
                        self.fbot[i_fbot, 1] = n4
                        self.fbot[i_fbot, 2] = n3
                        self.fbot[i_fbot, 3] = n2
                        i_fbot += 1

                        #self.string_fbot.append(' fb{:03.0f} N{:03.0f} N{:03.0f} N{:03.0f} N{:03.0f}'.format( \
                         #i_fbot, n1, n4, n3, n2))

                    ### Create Face on top
                    if k == self.num_elz-1:
                        self.ftop[i_ftop, 0] = n5
                        self.ftop[i_ftop, 1] = n6
                        self.ftop[i_ftop, 2] = n7
                        self.ftop[i_ftop, 3] = n8
                        i_ftop += 1
                        #self.string_ftop.append(' ft{:03.0f} N{:03.0f} N{:03.0f} N{:03.0f} N{:03.0f}'.format( \
                        #                      i_ftop, n5, n6, n7, n8))

                    ### Create Face left
                    if i == 0:
                        self.fleft[i_fleft, 0] = n1
                        self.fleft[i_fleft, 1] = n5
                        self.fleft[i_fleft, 2] = n8
                        self.fleft[i_fleft, 3] = n4
                        i_fleft += 1
                        #self.string_fleft.append(' fle{:03.0f} N{:03.0f} N{:03.0f} N{:03.0f} N{:03.0f}'.format( \
                        #                         i_fleft, n1, n5, n8, n4))

                    ### Create Face right
                    if i == self.num_elx-1:
                        self.fright[i_fright, 0] = n2
                        self.fright[i_fright, 1] = n3
                        self.fright[i_fright, 2] = n7
                        self.fright[i_fright, 3] = n6
                        i_fright += 1
                        #self.string_fright.append(' fri{:03.0f} N{:03.0f} N{:03.0f} N{:03.0f} N{:03.0f}'.format( \
                        #                         i_fright, n2, n3, n7, n6))

                    ### Create Face front
                    if j == 0:
                        self.ffront[i_ffront, 0] = n1
                        self.ffront[i_ffront, 1] = n2
                        self.ffront[i_ffront, 2] = n6
                        self.ffront[i_ffront, 3] = n5
                        i_ffront += 1

                        #self.string_ffront.append(' ffro{:03.0f} N{:03.0f} N{:03.0f} N{:03.0f} N{:03.0f}'.format( \
                        #                         i_ffront, n1, n2, n6, n5))

                    ### Create Face back
                    if j == self.num_ely-1:
                        self.fback[i_fback, 0] = n3
                        self.fback[i_fback, 1] = n4
                        self.fback[i_fback, 2] = n8
                        self.fback[i_fback, 3] = n7
                        i_fback += 1

                        #self.string_fback.append(' fbac{:03.0f} N{:03.0f} N{:03.0f} N{:03.0f} N{:03.0f}'.format( \
                        #                         i_fback, n3, n4, n8, n7))

                    elid = elid + 1



    def translate(self,ux,uy,uz):

        # Translation part position
        self.posx += ux
        self.posy += uy
        self.posz += uz

        # Translation of all node coordinates
        for i in range(self.nodesx.shape[0]):
            for j in range(self.nodesx.shape[1]):
                for k in range(self.nodesx.shape[2]):
                    self.nodesx[i,j,k] += ux
                    self.nodesy[i,j,k] += uy
                    self.nodesz[i,j,k] += uz

        # Translation of all nub coordinates
        #for i in range(self.nubtopx.shape[0]):
        #    for j in range(self.nubtopx.shape[1]):
        self.nubtopx += ux
        self.nubtopy += uy
        self.nubtopz += uz

        self.nubbotx += ux
        self.nubboty += uy
        self.nubbotz += uz


    def rotate(self, phi1, phi2, phi3):
        # TBD
        x = 0
