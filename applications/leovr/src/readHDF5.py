import h5py
import keyboard
import numpy as np



# Open file
fname = 'job.rmed'
f = h5py.File(fname, 'r')  


#Print full information
def printFileInformation():

    

    def visitor_func(name, node):
        print(node)
        if isinstance(node, h5py.Group):
            print(node.name, 'is a Group')
            i=0
        elif isinstance(node, h5py.Dataset):
           if (node.dtype == 'object') :
                print (node.name, 'is an object Dataset')
           else:
                print(node.name, 'is a Dataset')   
        else:
            print(node.name, 'is an unknown type')     

       

    #####    

    print (f'Content of {fname}')
    
    f.visititems(visitor_func) 
    
# Convert a dataset to numpy and print information
def printNumpyInfo(dsetName):
    print('-------------------')
    print(f[dsetName])
    print(dsetName)
    n1 = np.array(f[dsetName][:])
    print(n1)
    print(f'len = {len(n1)},   len/3 = {len(n1)/3}')
    print(n1.max())
    print(n1.min())
    
    
def getFieldData(dsetName):    # Coordinates and nodal displacements
    n1 = np.array(f[dsetName][:])
    numNodes = int(len(n1)/3)
    
    
    print(n1)
    print(f'len = {numNodes}')
    
    vx = n1[0:numNodes-1]
    vy = n1[numNodes : 2*numNodes-1]
    vz = n1[2*numNodes : 3*numNodes-1]
    
    print(f'vx = {vx}')
    print(f'size = {len(vx)}')
    print(f'vy = {vy}')
    print(f'size = {len(vy)}')
    print(f'vz = {vz}')
    print(f'size = {len(vz)}')

    return vx, vy, vz
    
def getNodeIDs(dsetName):
    n1 = np.array(f[dsetName][:])
    
    v_id = np.empty(len(n1), dtype=np.int32)
    v_name = [''] * len(n1)
    
    ii=0
    for node in n1:
        #print(node)
        #print(type(node))
    
        # node is a numpy array of ascii values 
        nodeName = np.array(node, dtype='b').tobytes().decode("ascii")    # convert array of ascii values to string
        nodeId = int(nodeName[1:])
        #print(f'{nodeName} {nodeId}')
        
        v_id[ii] = nodeId
        v_name[ii] = nodeName
        ii += 1


    #print(v_name)
    #print(v_id)
    
    return(v_name, v_id)
        
        
    

#########################################################################
#########################################################################

## Print information of file  
print('Full file information, press Key')
while True:
    if keyboard.read_key():
        break

printFileInformation()


## Extract coordinates

print('\n\nInformation coordinates, press Key')
while True:
    if keyboard.read_key():
        break
    
    
### 1. Read coordinates
#printNumpyInfo('/ENS_MAA/00000001/-0000000000000000001-0000000000000000001/NOE/COO')
#printNumpyInfo('/ENS_MAA/00000001/-0000000000000000001-0000000000000000001/NOE/NOM') 

print('\nNodal coordinates:')
vx, vy, vz = getFieldData('/ENS_MAA/00000001/-0000000000000000001-0000000000000000001/NOE/COO')


print('\nNodal displacements:')

## Extract nodal displacements
ux, uy, uz = getFieldData('/CHA/resnonl_DEPL/0000000000000000000100000000000000000001/NOE/MED_NO_PROFILE_INTERNAL/CO')


print('\nNodal forces:')

## Extract nodal displacements
fx, fy, fz = getFieldData('/CHA/resnonl_FORC_NODA/0000000000000000000100000000000000000001/NOE/MED_NO_PROFILE_INTERNAL/CO')

print('\nNode numbers:')
## Extract node numbers
nodeName, nodeId = getNodeIDs('/ENS_MAA/00000001/-0000000000000000001-0000000000000000001/NOE/NOM')
