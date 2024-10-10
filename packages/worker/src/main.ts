import initOpenCascade from 'opencascade.js'

const OCCT = initOpenCascade()

OCCT.then(() => console.log('OpenCascade initialized!'))

addEventListener('message', async message => {
    // Check message data type
    if (typeof message.data != 'string') {
        throw 'Call message data type unexpected: ' + typeof message.data
    }
    // Cast message data
    const content = message.data as string

    // Wait for OCCT to load
    const occt = await OCCT

    // Parse shape
    //console.log('Reading BRep')
    const shape = new occt.TopoDS_Shape()
    occt.FS.createDataFile('.', 'part.brp', content, true, true, true)
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
})