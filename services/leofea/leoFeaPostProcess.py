import re
import numpy as np
import pandas as pd

class leoFeaPostProcess():

    def __init__(self, jobname):

        self.jobname = jobname

        self.numNodes = 0

        # Results as Pandas
        self.pd_DeplNoda = pd.DataFrame(columns=['GROUPNAME', 'NOEUD', 'COOR1', 'COOR2', 'COOR3', 'DEPL1', 'DEPL2', 'DEPL3'])   # Result for nodal displacements as pandas dataframe (all nodes in model!)
        self.pd_ForcNoda = pd.DataFrame(columns=['GROUPNAME', 'NOEUD', 'COOR1', 'COOR2', 'COOR3', 'FORC1', 'FORC2', 'FORC3'])   # Result for nodal forces in nub connections as pandas dataframe
        
        self.pd_resultsMinMax = pd.DataFrame(columns=['DESCRIPTION', 'VALUE', 'COOR1', 'COOR2', 'COOR3'])

        self.analysisTime = 0


    ##########################################################################################
    def postProcessStatic(self):

        self._convertResu2Pandas()           # Read resu file and save the data lines in numpy result data  (resultDeplNoda, resultForcNoda)

        self._evaluateMinMax()               # Evaluate numpy result for min/max displacements and nodal forces    

        self._readMessageSimulationTime()    # Read simulaiton time from CodeAster message file

        # Store results
        self.pd_DeplNoda.to_feather(f"./output/{self.jobname}.depl.feather")
        self.pd_ForcNoda.to_feather(f"./output/{self.jobname}.forc.feather")
        self.pd_resultsMinMax.to_feather(f"./output/{self.jobname}.resMinMax.feather")
        self.pd_resultsMinMax.to_csv(f"./output/{self.jobname}.resMinMax")

    ##########################################################################################
    def postProcessModal(self):

        self._readMessageSimulationTime()    # Read simulaiton time from CodeAster message file

        self._readMessageFrequencyModal()   # Read evaluated frequencies

        return("TBD")

    ##########################################################################################
    def postProcessDynamic(self):
        return ("TBD")


            
    ############################################ PRIVATE
    def _convertResu2Pandas(self):

        # Read the following Data:
        dataLineDeplNoda = []
        dataLineForcNoda = []
        
        # Create Pandas dataframe for nodal displacements             
                                                # GROUP_NO      NOEUD                 X                     Y                     Z                     DX                    DY                    DZ      
                                                # ALLNODES  N000      1.60100000000000E+02  5.61000000000000E+01  0.00000000000000E+00  7.74761045372134E-22  3.06084519102783E-23 -2.17173121790557E-21
        
        self.pd_DeplNoda = pd.DataFrame(columns=['GROUPNAME', 'NOEUD', 'COOR1', 'COOR2', 'COOR3', 'DEPL1', 'DEPL2', 'DEPL3'])
        self.pd_ForcNoda = pd.DataFrame(columns=['GROUPNAME', 'NOEUD', 'COOR1', 'COOR2', 'COOR3', 'FORC1', 'FORC2', 'FORC3'])
            
        # Open the result file to read the nodal forces
        fin = open(f'./output/{self.jobname}.resu', 'r')

        while fin:
            line = fin.readline()

            isForc = 0
            isReac = 0

            if line == "":
                break

            line = line[:-1]

            ## Read displacements for all nodes
            if line.find('DEPL') > 0:
                header1_Depl = line

                line = fin.readline()[:-1]    #Get next line
                header2 = line

                line = fin.readline()[:-1]    #Get next line
                header3 = f"GROUP_NO     {line}"
                
                line = fin.readline()[:-1]    # Read DataLine -> line[1] should be "N"
                #print(line)
                #print(line[1])

                while ( len(line) > 1 ) and ( line[1] == "N" ):
                    #print(line)
                    dataLineNew = f"ALLNODES {line}"

                    dataLineDeplNoda.append(dataLineNew)
                
                    # Create data for pandas
                    lineSep = self._separateStringDataPandas(dataLineNew)
                
                    self.pd_DeplNoda.loc[len(self.pd_DeplNoda.index)] = lineSep        # Add dataline to pandas 

                    line = fin.readline()[:-1]    # Read next DataLine
                

            ## Read nodal forces (FORC_NODA)
            if line.find('GROUP_NO')>0:
                #print(f'RRRRR {gName}')
                x = re.split("\s", line)
                gName = x[3]
            
                
                while line.find('FORC_NODA') < 0:   # Read file until forc_noda is found
                    line = fin.readline()

                #print('!!!')
                #print(line)

                if line.find('FORC_NODA')>0:    # If FORC_NODA found, read data
                    line = fin.readline()[:-1]
                    line = fin.readline()[:-1]
                    line = fin.readline()[:-1]       # This is the relevant dataline

                    dataLineNew = f"{gName} {line}"
                    dataLineForcNoda.append(dataLineNew)

                    lineSep = self._separateStringDataPandas(dataLineNew)
                
                    self.pd_ForcNoda.loc[len(self.pd_ForcNoda.index)] = lineSep   

                #if line.find('REAC_NODA')>0:    # If REAC_NODA found, read data
                #    line = fin.readline()
                #    line = fin.readline()
                #    line = fin.readline()        # This is the relevant dataline
                #
                #    dataLineNew = f"{gName} {line}"
                #    dataLineReacNoda.append(dataLineNew)
                #
                #    lineSep = self._separateStringDataPandas(dataLineNew)
                #
                #    self.pd_ReacNoda.loc[len(self.pd_ReacNoda.index)] = lineSep 

        fin.close()

        self.numNodes = len(self.pd_DeplNoda.index) 
        print(f"Displacements (DEPL) read for {self.numNodes} Nodes")
        
        print(self.pd_DeplNoda)


        print(f"Number of nodal connections (LIAS) {len(self.pd_ForcNoda.index)} Nodes")

        print(self.pd_ForcNoda)

    ############################################ PRIVATE
    def _separateStringDataPandas(self, dataLineNew):

        lineSep = re.split("\s+", dataLineNew)    # Separate date in substrings
                    
        for i in range(len(lineSep)):   # Iterate for all elements in data to convert to float if possible
            try: 
                lineSep[i] = float(lineSep[i])          # convert string to float if possible
            except ValueError:
                dummy = 0

        return lineSep
                    
    ############################################ PRIVATE
    def _evaluateMinMax(self):  # Calculate min/max displacements and nodal forces, write to file resMinMax

        ## Sumarize maximum and minimum values in pandas dataframe
        self.pd_resultsMinMax = pd.DataFrame(columns=['DESCRIPTION', 'VALUE', 'COOR1', 'COOR2', 'COOR3'])

        # Calculate min and max displacements and write to pandas
        i_uz_min = self.pd_DeplNoda["DEPL3"].idxmin()        # Index for the maximum displacement
        depl3min = self.pd_DeplNoda.loc[i_uz_min]
        self.pd_resultsMinMax.loc[len(self.pd_resultsMinMax.index)] = ["DEPL3_MIN", depl3min["DEPL3"], depl3min["COOR1"], depl3min["COOR3"], depl3min["COOR3"] ]

        i_uz_max = self.pd_DeplNoda["DEPL3"].idxmax()        # Index for the maximum displacement
        depl3max = self.pd_DeplNoda.loc[i_uz_max]
        self.pd_resultsMinMax.loc[len(self.pd_resultsMinMax.index)] = ["DEPL3_MAX", depl3max["DEPL3"], depl3max["COOR1"], depl3max["COOR3"], depl3max["COOR3"] ]
        
        print(f'uzmin = {self.pd_DeplNoda["DEPL3"].loc[i_uz_min]}, index = {i_uz_min}')
        print(f'uzmax = {self.pd_DeplNoda["DEPL3"].loc[i_uz_max]}, index = {i_uz_max}')

        # Calculate Min and max nodal forces (only for buttom nodes) and write to pandas
        pd_ForcNoda_NB = self.pd_ForcNoda[self.pd_ForcNoda['GROUPNAME'].str.contains("NB")]  # Filter Pandas dataframe for Groupnames containing "NB"

        i_fz_min = pd_ForcNoda_NB["FORC3"].idxmin()        # Index for the maximum displacement
        forc3min = pd_ForcNoda_NB.loc[i_fz_min]   
        self.pd_resultsMinMax.loc[len(self.pd_resultsMinMax.index)] = ["FORC3_MIN", forc3min["FORC3"], forc3min["COOR1"], forc3min["COOR3"], forc3min["COOR3"] ]
             
        i_fz_max = pd_ForcNoda_NB["FORC3"].idxmax()        # Index for the maximum displacement
        forc3max = pd_ForcNoda_NB.loc[i_fz_max]   
        self.pd_resultsMinMax.loc[len(self.pd_resultsMinMax.index)] = ["FORC3_MAX", forc3max["FORC3"], forc3max["COOR1"], forc3max["COOR3"], forc3max["COOR3"] ]
    
        print(self.pd_resultsMinMax)


    ##################################################################################
    def _readMessageSimulationTime(self):       # Read simulation time from codeaster message file

        ################ Read Message file for time and frequencies for modal analyis
        messagefile = f'./output/{self.jobname}.message'
        print(f"Read Message File: {messagefile}")
        #print(messagefile)

        fmes = open(messagefile, 'r', encoding="utf8")
        #print(fmes)

        freqRead = 0
        for line in fmes:
            #print(line[:-1])
            if line.find('TOTAL_JOB')>0:       #* TOTAL_JOB                :       0.82 :       0.34 :       1.16 :       1.21 *
                #print(line)
                
                self.analysisTime = self._extractSimulationTime(line)

                print(f"    Total simulation time Code Aster: {self.analysisTime}s")
                
        fmes.close()

        print("File read")
    ##################################################################################
    def _extractSimulationTime(self, line):
         
        x = re.split("\s+",line)              #* TOTAL_JOB                :       0.82 :       0.34 :       1.16 :       1.21 *

        #print(x)

        vtimes = []
            
        for substr in x:
            try:
                time = float(substr)
                vtimes.append(time)
            except ValueError:
                dummy = 0
            
            #print(vtimes)

        #t_user = vtimes[0]      # user time
        #t_system = vtimes[1]    # system time
        #t_total = vtimes[2]     # user + system
        t_elapsed = vtimes[3]   # elapsed time
 
        return(t_elapsed)

    ##################################################################################
    def _readMessageFrequencyModal(self):    # Read frequencies of modal analysis

        messagefile = f'{self.jobname}.message'
        print(f"Read Message File: {messagefile}")
        #print(messagefile)

        fmes = open(messagefile, 'r', encoding="utf8")
        #print(fmes)

        freqRead = 0
        for line in fmes:
            #print(line[:-1])

            if line.find('(HZ)') > 0:   
                print(line[:-1])

                freqRead = 1
                print("    Start reading eigenfrequencies")

            if freqRead == 1:
                if line.find('moyenne') > 0:   # End of frequency output reached
                    freqRead = 0
                    print("    End reading")
                elif re.search("^\d", line):
                    x = re.split("\s+",line)
                    print(f"    f{int(x[0])} = {float(x[1]):.0f} Hz")

        fmes.close()

        print("File read")