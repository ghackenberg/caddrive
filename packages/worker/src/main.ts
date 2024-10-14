import initOpenCascade from 'opencascade.js'

const OCCT = initOpenCascade()

OCCT.then(() => console.log('OpenCascade.js initialized!'))

let type: string

addEventListener('message', async message => {
    // Check message data type
    if (typeof message.data != 'string') {
        throw 'Call message data type unexpected: ' + typeof message.data
    }

    // Cast message data
    const content = message.data

    // Wait for OCCT to load
    const occt = await OCCT

    if (!type) {
        type = content
    } else if (type == 'brp') {
        type = undefined

        // Parse shape
        //console.log('Reading BRep')
        occt.FS.createDataFile('.', 'part.brp', content, true, true, true)
        const shape = new occt.TopoDS_Shape()
        const builder = new occt.BRep_Builder()
        const readProgress = new occt.Message_ProgressRange_1()
        occt.BRepTools.Read_2(shape, './part.brp', builder, readProgress)
        occt.FS.unlink('./part.brp')
    
        // Visualize shape
        //console.log('Meshing BRep')
        const storageformat = new occt.TCollection_ExtendedString_1()
        const doc = new occt.TDocStd_Document(storageformat)
        const shapeTool = occt.XCAFDoc_DocumentTool.ShapeTool(doc.Main()).get()
        shapeTool.SetShape(shapeTool.NewShape(), shape)
        new occt.BRepMesh_IncrementalMesh_2(shape, 1, false, 1, false)
    
        // Export a GLB file (this will also perform the meshing)
        //console.log('Writing GLB')
        const glbFileName = new occt.TCollection_AsciiString_2('./part.glb')
        const cafWriter = new occt.RWGltf_CafWriter(glbFileName, true)
        const docHandle = new occt.Handle_TDocStd_Document_2(doc)
        const fileInfo = new occt.TColStd_IndexedDataMapOfStringString_1()
        const writeProgress = new occt.Message_ProgressRange_1()
        cafWriter.Perform_2(docHandle, fileInfo, writeProgress)
    
        // Read the GLB file from the virtual file system
        //console.log('Readling GLB')
        const glbFileData = occt.FS.readFile('./part.glb', { encoding: "binary" })
        occt.FS.unlink('./part.glb')
    
        // Returning GLB data
        postMessage(glbFileData)
    } else if (type == 'stp') {
        type = undefined

        // Read STEP file
        console.log('Reading STEP file')
        occt.FS.createDataFile('.', 'model.stp', content, true, true, true)
        const reader = new occt.STEPCAFControl_Reader_1()
        const result = reader.ReadFile('./model.stp')
        occt.FS.unlink('./model.stp')
        if (result != occt.IFSelect_ReturnStatus.IFSelect_RetDone) {
            throw 'Could not read STEP file'
        }

        // Transfer STEP file
        console.log('Transferring STEP file')
        const format = new occt.TCollection_ExtendedString_1()
        const doc = new occt.TDocStd_Document(format)
        const docHandle = new occt.Handle_TDocStd_Document_2(doc)
        const readProgress = new occt.Message_ProgressRange_1()
        reader.Transfer_1(docHandle, readProgress)
        
        // Mesh STEP file
        console.log('Meshing STEP file')
        const builder = new occt.BRep_Builder()
        const compound = new occt.TopoDS_Compound()
        builder.MakeCompound(compound)
        const sequence = new occt.TDF_LabelSequence_1()
        const shapeTool = occt.XCAFDoc_DocumentTool.ShapeTool(doc.Main()).get()
        shapeTool.GetFreeShapes(sequence)
        for (let index = sequence.Lower(); index <= sequence.Upper(); index++) {
            const label = sequence.Value(index)
            const shape = occt.XCAFDoc_ShapeTool.GetShape_2(label)
            if (shape) {
                builder.Add(compound, shape)
            }
        }
        new occt.BRepMesh_IncrementalMesh_2(compound, 1, false, 1, false)

        // Export a GLB file (this will also perform the meshing)
        //console.log('Writing GLB')
        const glbFileName = new occt.TCollection_AsciiString_2('./model.glb')
        const cafWriter = new occt.RWGltf_CafWriter(glbFileName, true)
        const fileInfo = new occt.TColStd_IndexedDataMapOfStringString_1()
        const writeProgress = new occt.Message_ProgressRange_1()
        cafWriter.Perform_2(docHandle, fileInfo, writeProgress)
    
        // Read the GLB file from the virtual file system
        //console.log('Readling GLB')
        const glbFileData = occt.FS.readFile('./model.glb', { encoding: 'binary' })
        occt.FS.unlink('./model.glb')
    
        // Returning GLB data
        postMessage(glbFileData)
    }
})