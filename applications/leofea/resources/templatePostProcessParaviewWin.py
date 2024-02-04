
#jobname = '....'
#timeVisualization = 1.0   # Time to be displayed in paraview

# trace generated using paraview version 5.9.0

#### import the simple module from the paraview
from paraview.simple import *
#### disable automatic camera reset on 'Show'
paraview.simple._DisableFirstRenderCameraReset()

# create a new 'MED Reader'
s8_tableLeoCADprmed = MEDReader(registrationName=f'{jobname}.rmed', FileNames=f'{filename}.rmed')
#s8_tableLeoCADprmed.AllArrays = ['TS0/00000001/ComSup0/resnonl_SIEF_ELGA@@][@@GAUSS', 'TS0/00000001/ComSup0/resnonl_SIEQ_ELGA@@][@@GAUSS', 'TS0/00000001/ComSup0/resnonl_VARI_ELGA@@][@@GAUSS', 'TS0/00000001/ComSup0/resnonl_DEPL@@][@@P1', 'TS0/00000001/ComSup0/resnonl_FORC_NODA@@][@@P1', 'TS0/00000001/ComSup0/resnonl_REAC_NODA@@][@@P1', 'TS0/00000001/ComSup0/resnonl_SIEQ_NOEU@@][@@P1']
#s8_tableLeoCADprmed.AllTimeSteps = ['0000', '0001']

# get animation scene
animationScene1 = GetAnimationScene()

# update animation scene based on data timesteps
animationScene1.UpdateAnimationUsingDataTimeSteps()

# Properties modified on s8_tableLeoCADprmed
#s8_tableLeoCADprmed.AllArrays = ['TS0/00000001/ComSup0/resnonl_DEPL@@][@@P1', 'TS0/00000001/ComSup0/resnonl_FORC_NODA@@][@@P1', 'TS0/00000001/ComSup0/resnonl_REAC_NODA@@][@@P1', 'TS0/00000001/ComSup0/resnonl_SIEF_ELGA@@][@@GAUSS', 'TS0/00000001/ComSup0/resnonl_SIEQ_ELGA@@][@@GAUSS', 'TS0/00000001/ComSup0/resnonl_SIEQ_NOEU@@][@@P1', 'TS0/00000001/ComSup0/resnonl_VARI_ELGA@@][@@GAUSS']

# get active view
renderView1 = GetActiveViewOrCreate('RenderView')

# show data in view
s8_tableLeoCADprmedDisplay = Show(s8_tableLeoCADprmed, renderView1, 'UnstructuredGridRepresentation')

# trace defaults for the display properties.
s8_tableLeoCADprmedDisplay.Representation = 'Surface'
s8_tableLeoCADprmedDisplay.ColorArrayName = [None, '']
s8_tableLeoCADprmedDisplay.SelectTCoordArray = 'None'
s8_tableLeoCADprmedDisplay.SelectNormalArray = 'None'
s8_tableLeoCADprmedDisplay.SelectTangentArray = 'None'
s8_tableLeoCADprmedDisplay.OSPRayScaleArray = 'FamilyIdNode'
s8_tableLeoCADprmedDisplay.OSPRayScaleFunction = 'PiecewiseFunction'
s8_tableLeoCADprmedDisplay.SelectOrientationVectors = 'None'
s8_tableLeoCADprmedDisplay.ScaleFactor = 19.18
s8_tableLeoCADprmedDisplay.SelectScaleArray = 'FamilyIdNode'
s8_tableLeoCADprmedDisplay.GlyphType = 'Arrow'
s8_tableLeoCADprmedDisplay.GlyphTableIndexArray = 'FamilyIdNode'
s8_tableLeoCADprmedDisplay.GaussianRadius = 0.959
s8_tableLeoCADprmedDisplay.SetScaleArray = ['POINTS', 'FamilyIdNode']
s8_tableLeoCADprmedDisplay.ScaleTransferFunction = 'PiecewiseFunction'
s8_tableLeoCADprmedDisplay.OpacityArray = ['POINTS', 'FamilyIdNode']
s8_tableLeoCADprmedDisplay.OpacityTransferFunction = 'PiecewiseFunction'
s8_tableLeoCADprmedDisplay.DataAxesGrid = 'GridAxesRepresentation'
s8_tableLeoCADprmedDisplay.PolarAxes = 'PolarAxesRepresentation'
s8_tableLeoCADprmedDisplay.ScalarOpacityUnitDistance = 13.531230554418737
s8_tableLeoCADprmedDisplay.OpacityArrayName = ['POINTS', 'FamilyIdNode']
#s8_tableLeoCADprmedDisplay.ExtractedBlockIndex = 1



# init the 'PiecewiseFunction' selected for 'ScaleTransferFunction'
s8_tableLeoCADprmedDisplay.ScaleTransferFunction.Points = [0.0, 0.0, 0.5, 0.0, 778.0, 1.0, 0.5, 0.0]

# init the 'PiecewiseFunction' selected for 'OpacityTransferFunction'
s8_tableLeoCADprmedDisplay.OpacityTransferFunction.Points = [0.0, 0.0, 0.5, 0.0, 778.0, 1.0, 0.5, 0.0]

# reset view to fit data
renderView1.ResetCamera()

# get the material library
materialLibrary1 = GetMaterialLibrary()

# update the view to ensure updated data information
renderView1.Update()

# set scalar coloring
ColorBy(s8_tableLeoCADprmedDisplay, ('POINTS', 'resnonl_DEPL', 'Magnitude'))

# rescale color and/or opacity maps used to include current data range
s8_tableLeoCADprmedDisplay.RescaleTransferFunctionToDataRange(True, False)

# show color bar/color legend
s8_tableLeoCADprmedDisplay.SetScalarBarVisibility(renderView1, True)

# get color transfer function/color map for 'resnonl_DEPL'
resnonl_DEPLLUT = GetColorTransferFunction('resnonl_DEPL')

# Apply a preset using its name. Note this may not work as expected when presets have duplicate names.
resnonl_DEPLLUT.ApplyPreset('Rainbow Uniform', True)

# get opacity transfer function/opacity map for 'resnonl_DEPL'
resnonl_DEPLPWF = GetOpacityTransferFunction('resnonl_DEPL')

# Properties modified on animationScene1
animationScene1.AnimationTime = timeVisualization

# get the time-keeper
timeKeeper1 = GetTimeKeeper()

# rescale color and/or opacity maps used to exactly fit the current data range
s8_tableLeoCADprmedDisplay.RescaleTransferFunctionToDataRange(False, True)

# change representation type
s8_tableLeoCADprmedDisplay.SetRepresentationType('Surface With Edges')

# create a new 'Warp By Vector'
warpByVector1 = WarpByVector(registrationName='WarpByVector1', Input=s8_tableLeoCADprmed)
warpByVector1.Vectors = ['POINTS', 'resnonl_DEPL']


# Properties modified on warpByVector1
warpByVector1.ScaleFactor = 10.0


# show data in view
warpByVector1Display = Show(warpByVector1, renderView1, 'UnstructuredGridRepresentation')

# trace defaults for the display properties.
warpByVector1Display.Representation = 'Surface'
warpByVector1Display.ColorArrayName = ['POINTS', 'resnonl_DEPL']
warpByVector1Display.LookupTable = resnonl_DEPLLUT
warpByVector1Display.SelectTCoordArray = 'None'
warpByVector1Display.SelectNormalArray = 'None'
warpByVector1Display.SelectTangentArray = 'None'
warpByVector1Display.OSPRayScaleArray = 'FamilyIdNode'
warpByVector1Display.OSPRayScaleFunction = 'PiecewiseFunction'
warpByVector1Display.SelectOrientationVectors = 'None'
warpByVector1Display.ScaleFactor = 19.250944942564622
warpByVector1Display.SelectScaleArray = 'FamilyIdNode'
warpByVector1Display.GlyphType = 'Arrow'
warpByVector1Display.GlyphTableIndexArray = 'FamilyIdNode'
warpByVector1Display.GaussianRadius = 0.962547247128231
warpByVector1Display.SetScaleArray = ['POINTS', 'FamilyIdNode']
warpByVector1Display.ScaleTransferFunction = 'PiecewiseFunction'
warpByVector1Display.OpacityArray = ['POINTS', 'FamilyIdNode']
warpByVector1Display.OpacityTransferFunction = 'PiecewiseFunction'
warpByVector1Display.DataAxesGrid = 'GridAxesRepresentation'
warpByVector1Display.PolarAxes = 'PolarAxesRepresentation'
warpByVector1Display.ScalarOpacityFunction = resnonl_DEPLPWF
warpByVector1Display.ScalarOpacityUnitDistance = 13.576284100807992
warpByVector1Display.OpacityArrayName = ['POINTS', 'FamilyIdNode']
#warpByVector1Display.ExtractedBlockIndex = 1

# init the 'PiecewiseFunction' selected for 'ScaleTransferFunction'
warpByVector1Display.ScaleTransferFunction.Points = [0.0, 0.0, 0.5, 0.0, 778.0, 1.0, 0.5, 0.0]

# init the 'PiecewiseFunction' selected for 'OpacityTransferFunction'
warpByVector1Display.OpacityTransferFunction.Points = [0.0, 0.0, 0.5, 0.0, 778.0, 1.0, 0.5, 0.0]

# hide data in view
Hide(s8_tableLeoCADprmed, renderView1)

# show color bar/color legend
warpByVector1Display.SetScalarBarVisibility(renderView1, True)

# update the view to ensure updated data information
renderView1.Update()

# change representation type
warpByVector1Display.SetRepresentationType('Surface With Edges')

# get layout
layout1 = GetLayout()

# layout/tab size in pixels
layout1.SetSize(887, 579)

# current camera placement for renderView1
renderView1.CameraPosition = [459.0665256627675, -36.87014103922412, 233.35626992493675]
renderView1.CameraFocalPoint = [231.99999999999983, 263.99999999999994, 28.799999999999997]
renderView1.CameraViewUp = [-0.3488896990961528, 0.33242318455634107, 0.8762253159056846]
renderView1.CameraParallelScale = 110.9984684579026

# save screenshot
SaveScreenshot('C:/work/salomeMeca/13_LeoFEM/table.png', renderView1, ImageResolution=[887, 579])

#================================================================
# addendum: following script captures some of the application
# state to faithfully reproduce the visualization during playback
#================================================================

#--------------------------------
# saving layout sizes for layouts

# layout/tab size in pixels
layout1.SetSize(887, 579)

#-----------------------------------
# saving camera placements for views

# current camera placement for renderView1
#renderView1.CameraPosition = [459.0665256627675, -36.87014103922412, 233.35626992493675]
#renderView1.CameraFocalPoint = [231.99999999999983, 263.99999999999994, 28.799999999999997]
#renderView1.CameraViewUp = [-0.3488896990961528, 0.33242318455634107, 0.8762253159056846]
#renderView1.CameraParallelScale = 110.9984684579026

# current camera placement for renderView1
renderView1.CameraPosition = [504.18069104868545, -421.0512495561344, 366.8949071453546]
renderView1.CameraFocalPoint = [120.0000002637771, 88.0, 20.799995732208668]
renderView1.CameraViewUp = [-0.3488896990961528, 0.33242318455634107, 0.8762253159056846]
renderView1.CameraParallelScale = 187.80165047998622
renderView1.CameraParallelProjection = 1

#--------------------------------------------
# uncomment the following to render all views
# RenderAllViews()
# alternatively, if you want to write images, you can use SaveScreenshot(...).
