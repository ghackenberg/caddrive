# External dependencies
import os.path

# Internal dependencies
from .config import TEMPLATE_COMM_STATIC
from .part import Part

class PreProcessor():

    gravityScale = 1

    # Maximum admissibble nub force
    maxNubForce = 5   # Newton
    maxDisplacement = 1  # mm

    # Parameters for Dynamic simulation
    factor = 10
    dynSim_gravityScale = gravityScale * factor   # mm/s²
    dynSim_t_end = 0.1 / factor
    dynSim_n_incs = 5

    # For controlling the workflow and debugging purposes:
    analysisTypeStatic = 1
    analysisTypeModal = 2
    analysisTypeDynamic = 3

    analysisType = analysisTypeStatic # Default: Static simulation
    disable_contact = 0    # 1 ... do not consider any contact
    startSim = 1           # 0 ... do not run code_aster

    def __init__(self, outputsDir: str, jobName: str):

        self.fNameDebug = os.path.join(outputsDir, f"{jobName}.debug")
        self.fNameMail = os.path.join(outputsDir, f'{jobName}.mail')
        self.fNameComm = os.path.join(outputsDir, f"{jobName}.comm")

        self.parts: list[Part] = []
        self.numParts = 0
        self.numNodes = 0

        self.nodeNumberOffs = []
        self.elementNumberOffs = []

        self.templateCommFile = ''

        self.listBC = []
        self.listPressureLoad = []
        self.listBodyForce = []

        self.listLias = []
        self.listLiasNubBot = []
        self.listLiasNubTop = []
        self.listContact = []
    
    # Build leoFeaModel from tableLeoFeaDescripition. 
    def buildLeoFeaModel(self, tableLeoFeaDescription):
 
        # Add parts
        for part in tableLeoFeaDescription:
            print(part)
            #i, datname, dim[0], dim[1], dim[2], description, posx, posy, posz

            datname = part[1]
            dimx = part[2]
            dimy = part[3]
            dimz = part[4]
            posx = part[6]
            posy = part[7]
            posz = part[8]

            pid = self._addPart(datname, dimx, dimy, dimz, 0, 0, 0)   # add part at pos zero
            p = self.parts[pid]
            # TODO: Rotate !
            p.translate(posx, posy, posz)   # move to correct position

        # Apply boundary conditions at surfaces with coordinates zero
        for pid in range(self.numParts):
            p = self.parts[pid]

            if p.posz == 0:
                self._addBC(pid)
                print(f"Boundary condition added to part {pid}")

        # Connect Nubs
        self._connectNubs()

        #self.convertMailMED()

        # TBD allow definitions of different kind of analyses!
        
        # Type of analysis STATIC
        self.analyisType = self.analysisTypeStatic
        self.templateCommFile = TEMPLATE_COMM_STATIC.read_text()

        # Type of analysis MODAL
        #self.analyisType = self.analysisTypeModal
        #self.templateCommFile = TEMPLATE_COMM_MODAL.read_text()

        # Type of analysis DYNAMIC
        #self.analyisType = self.analysisTypeDynamic
        #self.templateCommFile = TEMPLATE_COMM_DYN.read_text()

        # TBD: ModelDescription file
        #      - Parts ... ok
        #      - Type of analysis ... (Static, Dynamic, Modal)
        #      - Loads and boundary conditions     

    def writeInputFiles(self):    # Write mail and comm file as input for CodeAster

        self._writeMailFile()
        self._writeCommSimulation()
    
    def deactivateNubConnection(self):          # For damage analysis: Disconnect overloaded nodes

        print("\n\nDeactivation of nub connections:")

        ## Print all Lias pairs
        #print("\n")
        #print("Lias pairs")
        #for i in self.listLias:
        #    print(i)"

        # Print the results for the nodal forces
        #print("\n\n")
        #print("Groupname       Nid    x        y         z          F")
        for i in range(len(self.nodeNames)):
            if self.groupNameNodes[i].find("NB")>0:
                Fz = self.resultForcNoda[i,5]
                if Fz < -1* self.maxNubForce:
                    str = "Nub overloaded -> deactivate!"

                    # Deactivate
                    #self._deactivateSingleNubConnection(self.groupNameNodes[i])
                    self._deactivateAllNubConnectionsPart(self.groupNameNodes[i])

                else:
                    str = ''

                #print(f"{self.groupNameNodes[i]}   {self.nodeNames[i]:s}  {self.resultForcNoda[i,0]}     {self.resultForcNoda[i,1]}      {self.resultForcNoda[i,2]}     {Fz:g}    {str}")

        #print("\n")

        print("\n\nDeactivated Nub connections:")
        print("Lias pairs")
        for i in self.listLias:
            print(i)

    def _addPart(self, partName: str, nSegx: int, nSegy: int, nSegz: int, posx: float, posy: float, posz: float):

        pid = self.numParts
        self.parts.append(Part(partName, pid, nSegx, nSegy, nSegz, posx, posy, posz))
        self.numParts += 1
        return(pid)
    
    def _addBC(self, partId: int):
        # a boundary condition can only be applied on the bottom of a lego part
        # all DOFs are fixed (ux, uy, uz)

        str = f"'{self._getGroupNameNodesBot(partId)}', "

        self.listBC.append(str)

    def _addPressureLoad(self, partId, location, pressure):
        # pressure load acting on the surface of a lego part
        # location = 'BOT' or 'TOP'
        # always in vertical direction
        # value can be positive or negative

        str = f"GROUP_MA=('SURF_P{partId}_F{location}', ), PRES={pressure}"

        self.listPressureLoad.append(str)

    def _addForceDistribureSurface(self, partId, location, force):
        # force load acting on  surface of a lego part (as pressure)
        # location = 'BOT' or 'TOP'
        # always in vertical direction
        # value can be positive or negative

        area = self.parts[partId].Lx * self.parts[partId].Ly

        pressure = force / area

        str = f"GROUP_MA=('SURF_P{partId}_F{location}', ), PRES={pressure}"

        self.listPressureLoad.append(str)
        
    def _addForceDistributeVolume(self, partId, Fx, Fy, Fz):

        volume = self.parts[partId].Lx * self.parts[partId].Ly * self.parts[partId].Lz

        fx = Fx / volume
        fy = Fy / volume
        fz = Fz / volume

        str = f"GROUP_MA=('Vpart{partId}', ), FX={fx}, FY={fy}, FZ={fz}"

        self.listBodyForce.append(str)

    def _connectNubs(self):

        dbgfile = open(self.fNameDebug, 'w')

        nubConnectTolerance = 0.01
        debug = 0

        for i in range(len(self.parts)):              # Jede Kombination auf Noppenkontakt untersuchen
            for j in range(i+1, len(self.parts)):
                nbot_i_z = self.parts[i].posz        # z-Koordinaten der Noppen
                nbot_j_z = self.parts[j].posz
                ntop_i_z = self.parts[i].posz + self.parts[i].Lz
                ntop_j_z = self.parts[j].posz + self.parts[j].Lz

                if abs(nbot_i_z - ntop_j_z) < nubConnectTolerance:
                    str = f'Nubs in one plane: bot{i} and top{j}'
                    print(f'{i} <-> {j}:   {str}')
                    dbgfile.write(f'{i} <-> {j}:   {str}\n')

                    self._findConnections(i, j, debug, dbgfile)

                if abs(nbot_j_z - ntop_i_z) < nubConnectTolerance:
                    str = f'Nubs in one plane: bot{j} and top{i}'
                    print(f'{i} <-> {j}:   {str}')
                    dbgfile.write(f'{i} <-> {j}:   {str}\n')

                    self._findConnections(j, i, debug, dbgfile)

        dbgfile.close()

    def _findConnections(self, pid1, pid2, debug, dbgfile):

        #self.parts[j].nubbotx, self.parts[j].nubboty,self.parts[j].nubtopx, self.parts[j].nubtopy
        nub1 = self.parts[pid1]
        nub2 = self.parts[pid2]

        cont = 0
        for i1 in range(nub1.nubbotx.shape[0]):
            for j1 in range(nub1.nubbotx.shape[1]):
                for i2 in range(nub2.nubbotx.shape[0]):
                    for j2 in range(nub2.nubbotx.shape[1]):
                        diffx = nub1.nubbotx[i1, j1] - nub2.nubtopx[i2, j2]
                        diffy = nub1.nubboty[i1, j1] - nub2.nubtopy[i2, j2]

                        if debug:
                            print(f"{diffx} , {diffy}")

                        if (abs(diffx) < 0.01) and (abs(diffy)< 0.01):
                            s1 = self._getGroupNameSingleNubTop(pid2, i2, j2)
                            s2 = self._getGroupNameSingleNubBot(pid1, i1, j1)
                            str = f"GROUP_NO=('{s1:s}', '{s2:s}')"
                            print(f'                       {str}')
                            dbgfile.write(f'                       {str}    x: ({nub1.nubbotx[i1, j1]},{nub2.nubtopx[i2, j2]})    y: ({nub1.nubboty[i1, j1]},{nub2.nubtopy[i2, j2]})\n')

                            self.listLias.append([str, 1, [pid2, i2, j2], [pid1, i1, j1] ])

                            # Group name for output of node force
                            str = f"{s2:s}"
                            self.listLiasNubBot.append(str)

                            str = f"{s1:s}"
                            self.listLiasNubTop.append(str)

                            cont = 1    # Contact occurs between these two parts

        if cont == 1 :
            # Contact surfaces
            surf1 = self._getGroupNameFaceTop(pid2)
            surf2 = self._getGroupNameFaceBot(pid1)
            str = f"_F( GROUP_MA_ESCL=('{surf1}', ), GROUP_MA_MAIT=('{surf2}', ) ),"
            print(f"                                {str}")
            self.listContact.append([str, 1])    # Contact string, 1=active
            #_F( GROUP_MA_ESCL=('P1_SU', ), GROUP_MA_MAIT=('B1_SD', ) ),

    def _deactivateSingleNubConnection(self, groupNameNode):                               
        # Deactivate
        for lias in self.listLias:
            if lias[0].find(groupNameNode)>0:
                lias[1]=0

    def _deactivateAllNubConnectionsPart(self, groupNameNode):

        # Deactivate
        for lias in self.listLias:
            if lias[0].find(groupNameNode)>0:
                lias[1]=0
                partTop = lias[2][0]
                partBot = lias[3][0]

                #print(f" PartTop = {partTop} , Part Bot = {partBot}")

        # Disconnect partTop and partBot
        for lias in self.listLias:
            nubTop = lias[2]
            nubBot = lias[3]
            if (nubBot[0] == partBot) and (nubTop[0] == partTop):   # a nub on part connection
                #print("Disconnect")
                lias[1]=0

    def _writeCommSimulation(self):

        numNubConn = 0 # Number of nub connections
        numCont = 0    # Number of contract conditions
        
        fNameJob = self.fNameComm
        print(f"Write Command file: {fNameJob}")

        fJob = open(fNameJob, 'w')

        # Write the parameters
        fJob.write("#Parameters:\n")
        if self.analyisType == self.analysisTypeStatic:  # For static analysis
            fJob.write(f"gravityScale = {self.gravityScale}\n")
        elif self.analyisType == self.analysisTypeModal:   # For modal analysis
            fJob.write(f"gravityScale = {self.gravityScale}\n")    # Not necessary, because loads are not considered in a modal analyis. Only set to avoid undefined value
        elif self.analyisType == self.analysisTypeDynamic: # For dynamic analyis
            fJob.write(f"gravityScale = {self.dynSim_gravityScale}\n")
            fJob.write(f"t_end = {self.dynSim_t_end}\n")
            fJob.write(f"n_incs = {self.dynSim_n_incs}\n")
        # else: Do nothing for modal analyis

        # Adapt the template
        for line in self.templateCommFile.splitlines(keepends=True):

            #### Add kinematic BC
            if line.find('ADD kineamtic')>0:
                fJob.write('### Kinematic boundary conditions\n')
                fJob.write("bc_kin = AFFE_CHAR_MECA(identifier='8:1', \n")
                fJob.write('       DDL_IMPO=_F(DX=0.0, \n')
                fJob.write('                   DY=0.0, \n')
                fJob.write('                   DZ=0.0, \n')
                fJob.write(f'                   GROUP_NO=( \n')
                #str = f"'{self._getGroupNameNodesBot(0)}', "      #P0_NBOT   # Ground plate always clamped!
                #fid.write(f'                             {str}\n')
                for str in self.listBC:
                    fJob.write(f'                             {str}\n')
                fJob.write(f'                            )), \n')
                fJob.write('       MODELE=model) \n')

            ##### Add loads
            elif (line.find('ADD Load')>0):
                # pressure load
                if len(self.listPressureLoad)>0:
                    fJob.write('### Pressure loads \n')#
                    fJob.write("bc_dyn_pressure = AFFE_CHAR_MECA( identifier='9:1', \n")
                    fJob.write("                         MODELE=model, \n")
                    fJob.write(f"                        PRES_REP=( \n")
                    for str in self.listPressureLoad:
                        fJob.write(f"                                 _F({str}), \n")
                    fJob.write(f"                                 )\n ")
                    fJob.write(f"                      )\n ")

                # body force
                if len(self.listBodyForce)>0:
                    fJob.write('### Body forces\n')#
                    fJob.write("bc_dyn_body = AFFE_CHAR_MECA( identifier='9:1', \n")
                    fJob.write("                         MODELE=model, \n")
                    fJob.write(f"                        FORCE_INTERNE=( \n")
                    for str in self.listBodyForce:
                        fJob.write(f"                                 _F({str}), \n")
                    fJob.write(f"                                 )\n ")
                    fJob.write(f"                      )\n ")

            ##### Add nub connections
            elif line.find('ADD LIAISON_DDL')>0:
                # Find out if there are liaision conditions at all

                for nubConn in self.listLias:
                    active = nubConn[1]  # 1 ... liaision is active
                    numNubConn += active

                if not numNubConn:
                    fJob.write('### No nub connections !!!\n')
                    fJob.write("### lias = AFFE_CHAR_MECA(identifier='11:1', LIAISON_DDL=( ...\n")
                else:   # If there are nub connections
                    fJob.write('### Nub connections\n')
                    fJob.write("lias = AFFE_CHAR_MECA(identifier='11:1',\n")
                    fJob.write("                      LIAISON_DDL=(\n")

                    for nubConn in self.listLias:
                        active = nubConn[1]
                        if active:
                            str = nubConn[0]
                            # Liasion x-direction
                            fJob.write("                                   _F(COEF_IMPO=0.0,\n")
                            fJob.write("                                      COEF_MULT=(-1.0, 1.0),\n")
                            fJob.write("                                      DDL=('DX', 'DX'),\n")
                            fJob.write(f"                                      {str}\n")
                            fJob.write("                                     ),\n")
                            # Liasion y-direction
                            fJob.write("                                   _F(COEF_IMPO=0.0,\n")
                            fJob.write("                                      COEF_MULT=(-1.0, 1.0),\n")
                            fJob.write("                                      DDL=('DY', 'DY'),\n")
                            fJob.write(f"                                      {str}\n")
                            fJob.write("                                     ),\n")
                            # Liasion z-direction
                            fJob.write("                                   _F(COEF_IMPO=0.0,\n")
                            fJob.write("                                      COEF_MULT=(-1.0, 1.0),\n")
                            fJob.write("                                      DDL=('DZ', 'DZ'),\n")
                            fJob.write(f"                                      {str}\n")
                            fJob.write("                                     ),\n")

                    fJob.write("                                   ),\n")
                    fJob.write("                      MODELE=model\n")
                    fJob.write("                     )\n")
            ## Contact

            elif (self.disable_contact==0) and  (line.find("ADD contact ")>0):
                # Find out if there are contact conditions at all

                for cont in self.listContact:
                    active = cont[1]  # 1 ... liaision is active
                    numCont += active

                if not numCont:
                    fJob.write('### No contact conditions !!!\n')
                    fJob.write("### contact = DEFI_CONTACT( ...\n")
                else:
                    fJob.write("contact = DEFI_CONTACT(identifier='12:1', \n")
                    fJob.write("                       FORMULATION='DISCRETE',\n")
                    fJob.write("                       MODELE=model,\n")
                    fJob.write("                       ZONE=(\n")

                    for cont in self.listContact:
                        active = cont[1]
                        if active:
                            str = cont[0]
                        fJob.write(f"         {str}\n")

                    fJob.write("                            )\n")
                    fJob.write("                      )\n")
    #                       ZONE = (_F( GROUP_MA_ESCL=('P1_SU', ), GROUP_MA_MAIT=('B1_SD', ) ),
    #                               _F( GROUP_MA_ESCL=('P1_SU', ), GROUP_MA_MAIT=('B1_SD', ) )

            # Consider conditions in analysis
            elif line.find('CHARGE=bc_dyn')>0:
                if len(self.listPressureLoad)==0:
                    fJob.write("                               # ")
                fJob.write("_F(CHARGE=bc_dyn_pressure),\n")

                if len(self.listBodyForce)==0:
                    fJob.write("                               # ")
                fJob.write("_F(CHARGE=bc_dyn_body),\n")

            elif (line.find('CHARGE=lias')>0) and (numNubConn==0):
                fJob.write("#                               _F(CHARGE=lias),\n")

            # if no contact or disabled
            elif ((numCont==0) or (self.disable_contact)) and line.find("CONTACT=contact,")>0:
                fJob.write("#                        CONTACT=contact,\n")

            # Output commands
            elif line.find("ADD nub output")>0:
                fJob.write("IMPR_RESU(identifier='9:1',\n")
                fJob.write("          FORMAT='RESULTAT',\n")
                fJob.write("          RESU=( \n")
                for str in self.listLiasNubBot:
                    fJob.write(f"                _F(GROUP_NO=('{str:s}'), INST=(1.0), NOM_CHAM=('FORC_NODA', 'REAC_NODA'), IMPR_COOR='OUI', RESULTAT=resnonl),\n") ########## HERE!

                for str in self.listLiasNubTop:
                    fJob.write(f"                _F(GROUP_NO=('{str:s}'), INST=(1.0), NOM_CHAM=('FORC_NODA', 'REAC_NODA'), IMPR_COOR='OUI', RESULTAT=resnonl),\n") ########## HERE!

                fJob.write("               ),\n")
                fJob.write("          UNITE=8\n")
                fJob.write("         )\n")

            else:
                fJob.write(line)

        fJob.close()

    def _getNameNode(self, i):
        return f'N{i:03.0f}'

    def _getNameElem(self, i):
        return f'm{i:03.0f}'

    def _getGroupNameNodesTop(self, pid):
        return f'P{pid}_NTOP'
    
    def _getGroupNameNodesBot(self, pid):
        return f'P{pid}_NBOT'

    def _getGroupNameSingleNubBot(self, pid, i, j):
        return f'P{pid}_NB_{i+1:03.0f}_{j+1:03.0f}'

    def _getGroupNameSingleNubTop(self, pid, i, j):
        return f'P{pid}_NT_{i+1:03.0f}_{j+1:03.0f}'

    def _getGroupNameAllNubsBot(self, pid):
        return f'P{pid}_NUBBOT'

    def _getGroupNameAllNubsTop(self, pid):
        return f'P{pid}_NUBTOP'

    def _getElemNameFaceBot(self, pid):
        return f'P{pid}_FBOT'

    def _getElemNameFaceTop(self, pid):
        return f'P{pid}_FTOP'

    def _getElemNameFaceLeft(self, pid):
        return f'P{pid}_FLEFT'

    def _getElemNameFaceRight(self, pid):
        return f'P{pid}_FRIGHT'

    def _getElemNameFaceFront(self, pid):
        return f'P{pid}_FFRONT'

    def _getElemNameFaceBack(self, pid):
        return f'P{pid}_FBACK'

    def _getGroupNameFaceBot(self, pid):
        return f'SURF_{self._getElemNameFaceBot(pid)}'

    def _getGroupNameFaceTop(self, pid):
        return f'SURF_{self._getElemNameFaceTop(pid)}'

    def _getGroupNameFaceLeft(self, pid):
        return f'SURF_{self._getElemNameFaceLeft(pid)}'

    def _getGroupNameFaceRight(self, pid):
        return f'SURF_{self._getElemNameFaceRight(pid)}'

    def _getGroupNameFaceFront(self, pid):
        return f'SURF_{self._getElemNameFaceFront(pid)}'

    def _getGroupNameFaceBack(self, pid):
        return f'SURF_{self._getElemNameFaceBack(pid)}'

    def _writeNodeCoords(self, fid):

        offs = 0
        self.nodeNumberOffs = []

        fid.write('COOR_3D\n')

        self.numNodes = 0

        for p in self.parts:
            self.nodeNumberOffs.append(offs)

            fid.write(f'   %% Part: {p.partName}\n')
            #print(f'_writeNodeCoords, Part: {p.partName}\n')

            for k in range(p.nodesx.shape[2]):
                for j in range(p.nodesx.shape[1]):
                    for i in range(p.nodesx.shape[0]):
                        nameNode = self._getNameNode(offs + p.nodesId[i,j,k])
                        string = '    {:s} {:5.2f} {:5.2f} {:5.2f}'.format(nameNode, p.nodesx[i,j,k], p.nodesy[i,j,k], p.nodesz[i,j,k])
                        self.numNodes += 1
                        fid.write(string)
                        fid.write('\n')

            offs += p.nodesx.size

        fid.write('FINSF\n\n')

        print(f'Number of nodes: {self.numNodes}')

    def _writeElements(self, fid):

        offs = 0
        self.elementNumberOffs = []

        fid.write('HEXA8\n')

        for p in self.parts:
            self.elementNumberOffs.append(offs)

            fid.write(f'   %% Part{p.partId}: {p.partName}\n')

            elid = 0
            for elem in p.elements:
                n1 = self._getNameNode( p.elements[elid, 0] + self.nodeNumberOffs[p.partId])
                n2 = self._getNameNode( p.elements[elid, 1] + self.nodeNumberOffs[p.partId])
                n3 = self._getNameNode( p.elements[elid, 2] + self.nodeNumberOffs[p.partId])
                n4 = self._getNameNode( p.elements[elid, 3] + self.nodeNumberOffs[p.partId])
                n5 = self._getNameNode( p.elements[elid, 4] + self.nodeNumberOffs[p.partId])
                n6 = self._getNameNode( p.elements[elid, 5] + self.nodeNumberOffs[p.partId])
                n7 = self._getNameNode( p.elements[elid, 6] + self.nodeNumberOffs[p.partId])
                n8 = self._getNameNode( p.elements[elid, 7] + self.nodeNumberOffs[p.partId])

                nameElem = self._getNameElem(offs+elid)

                string = '    {:s} {:s} {:s} {:s} {:s} {:s} {:s} {:s} {:s}'.format(nameElem, n1, n2, n3, n4, n5, n6, n7, n8)

                fid.write(string)

                fid.write('\n')
                elid += 1

            offs += len(p.elements)

        fid.write('FINSF\n\n')

    def _writeGroupMaillageVolume(self, fid):

        for p in self.parts:
            fid.write(f'%% Group maillage (volume), Part{p.partId}: {p.partName}\n')
            fid.write(f'GROUP_MA NOM = Vpart{p.partId}\n')
            #print(f'_writeGroupMaillageVolume Vpart{p.partId}\n')

            ct = 0
            for i in range(len(p.elements)):
                ct = ct + 1

                nameElem = self._getNameElem(i + self.elementNumberOffs[p.partId])
                fid.write(f'{nameElem:s} ')
                if ct == 7:
                    fid.write('\n');
                    ct = 0
            if ct != 7:
                fid.write('\n')
            fid.write('FINSF\n\n')

    def _writeGroupNodesDatasetArray(self, fid, funcGetName, data, pid):

        fid.write(f'GROUP_NO NOM = {funcGetName(pid)}\n')
        ct = 0
        for i in data:
            ct += 1
            fid.write('{:s} '.format(self._getNameNode(i + self.nodeNumberOffs[pid])))
            if ct == 7:
                fid.write('\n');
                ct = 0
        if ct>0:
            fid.write('\n')
        fid.write('FINSF\n\n')
    
    def _writeGroupNodesDatasetMatrix(self, fid, funcGetName, data, pid):

        fid.write(f'GROUP_NO NOM = {funcGetName(pid)}\n')
        ct = 0
        for i in range(data.shape[0]):
            for j in range(data.shape[1]):
                ct += 1
                fid.write('{:s} '.format(self._getNameNode(data[i,j] + self.nodeNumberOffs[pid])))
                if ct == 7:
                    fid.write('\n');
                    ct = 0
        if ct>0:
            fid.write('\n')
        fid.write('FINSF\n\n')

    def _writeGroupNodesNubSeparate(self, fid, funcGetName, data, pid):

        for i in range(data.shape[0]):
            for j in range(data.shape[1]):
                groupname =  funcGetName(pid, i,j)

                fid.write(f'GROUP_NO NOM = {groupname}\n')
                fid.write('{:s}\n'.format(self._getNameNode(data[i,j] + self.nodeNumberOffs[pid])))
                fid.write('FINSF\n\n')

    def _writeGroupNodes(self, fid):

        for p in self.parts:
            fid.write(f'%% Group of nodes: Part{p.partId}, all nodes on bottom)\n')
            self._writeGroupNodesDatasetArray(fid, self._getGroupNameNodesBot, p.nbot, p.partId)

            fid.write(f'%% Group of nodes: Part{p.partId}, all nodes on top)\n')
            self._writeGroupNodesDatasetArray(fid, self._getGroupNameNodesTop, p.ntop, p.partId)

            fid.write(f'%% Group of nodes: Part{p.partId}, all nub-nodes on bottom)\n')
            self._writeGroupNodesDatasetMatrix(fid, self._getGroupNameAllNubsBot, p.nubbot, p.partId)

            fid.write(f'%% Group of nodes: Part{p.partId}, all nub-nodes on top)\n')
            self._writeGroupNodesDatasetMatrix(fid, self._getGroupNameAllNubsTop, p.nubtop, p.partId)

            fid.write(f'%% Group of nodes: Part{p.partId}, nub-nodes on bottom, separately\n')
            self._writeGroupNodesNubSeparate(fid, self._getGroupNameSingleNubBot, p.nubbot, p.partId)

            fid.write(f'%% Group of nodes: Part{p.partId}, nub-nodes on top, separately\n')
            self._writeGroupNodesNubSeparate(fid, self._getGroupNameSingleNubTop, p.nubtop, p.partId)

    def _writeGroupFaceDataset(self, fid, getElemName, getGroupName, faceprefix, data, pid):

        fid.write(f'QUAD4 NOM = {getElemName(pid)}\n')

        string_faces = []
        for i in range(len(data)):
            self.i_face += 1
            n1 = self._getNameNode( data[i, 0] + self.nodeNumberOffs[pid] )
            n2 = self._getNameNode( data[i, 1] + self.nodeNumberOffs[pid] )
            n3 = self._getNameNode( data[i, 2] + self.nodeNumberOffs[pid] )
            n4 = self._getNameNode( data[i, 3] + self.nodeNumberOffs[pid] )
            facename = f'{faceprefix}{self.i_face:03.0f}'
            fid.write('{:s} {:s} {:s} {:s} {:s}\n'.format(facename, n1, n2, n3, n4))
            string_faces.append(f'{facename} ')

        fid.write('FINSF\n\n')

        fid.write('% Group maillage for the surfaces\n')
        fid.write(f'GROUP_MA NOM = {getGroupName(pid)}\n')
        ct = 0
        for i in string_faces:
            ct = ct + 1
            fid.write(f'{i}')
            if ct == 7:
                fid.write('\n');
                ct = 0
        if ct:
            fid.write('\n')
        fid.write('FINSF\n\n')

    def _writeGroupMaillageFaces(self, fid):

        fid.write('%%%%%%%%%%%%%%% Faces\n')
        self.i_face = 0
        for p in self.parts:
            fid.write(f'%% Face Bottom: Part{p.partId})\n')
            self._writeGroupFaceDataset(fid, self._getElemNameFaceBot, self._getGroupNameFaceBot, 'bo', p.fbot, p.partId)

        self.i_face = 0
        for p in self.parts:
            fid.write(f'%% Face Top: Part{p.partId})\n')
            self._writeGroupFaceDataset(fid, self._getElemNameFaceTop, self._getGroupNameFaceTop, 'to', p.ftop, p.partId)

        self.i_face = 0
        for p in self.parts:
            fid.write(f'%% Face Left: Part{p.partId})\n')
            self._writeGroupFaceDataset(fid, self._getElemNameFaceLeft, self._getGroupNameFaceLeft, 'le', p.fleft, p.partId)

        self.i_face = 0
        for p in self.parts:
            fid.write(f'%% Face Right: Part{p.partId})\n')
            self._writeGroupFaceDataset(fid, self._getElemNameFaceRight, self._getGroupNameFaceRight, 'ri', p.fright, p.partId)

        self.i_face = 0
        for p in self.parts:
            fid.write(f'%% Face Front: Part{p.partId})\n')
            self._writeGroupFaceDataset(fid, self._getElemNameFaceFront, self._getGroupNameFaceFront, 'fr', p.ffront, p.partId)

        self.i_face = 0
        for p in self.parts:
            fid.write(f'%% Face Back: Part{p.partId})\n')
            self._writeGroupFaceDataset(fid, self._getElemNameFaceBack, self._getGroupNameFaceBack, 'ba', p.fback, p.partId)

    def _writeMailFile(self):

        # Write MAIL file
        mailFileName = self.fNameMail
        print(f'WriteMailFile: {mailFileName}')
        
        fJob = open(mailFileName, 'w')
        self._writeNodeCoords(fJob)
        self._writeElements(fJob)
        self._writeGroupMaillageVolume(fJob)
        self._writeGroupNodes(fJob)
        self._writeGroupMaillageFaces(fJob)

        fJob.write('FIN\n')

        fJob.close()

    