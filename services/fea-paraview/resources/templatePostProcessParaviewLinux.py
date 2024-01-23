
#jobname = '....'
#timeVisualization = 1.0   # Time to be displayed in paraview

import os
username = os.getlogin()

# trace generated using paraview version 5.11.1-1862-g99cf1048e5
#import paraview
#paraview.compatibility.major = 5
#paraview.compatibility.minor = 11

#### import the simple module from the paraview
from paraview.simple import *
#### disable automatic camera reset on 'Show'
paraview.simple._DisableFirstRenderCameraReset()

# load plugin
LoadPlugin(f'/home/{username}/apps/paraview/bin/../lib/paraview-5.11/plugins/MEDReader/MEDReader.so', remote=False, ns=globals())

# create a new 'MED Reader'
result_rmed = MEDReader(registrationName=f'{jobname}.rmed', FileNames=[f'{filename}.rmed'])

# get animation scene
animationScene1 = GetAnimationScene()

# update animation scene based on data timesteps
animationScene1.UpdateAnimationUsingDataTimeSteps()

# Properties modified on result_rmed
result_rmed.FieldsStatus = ['TS0/00000001/ComSup0/resnonl_DEPL@@][@@P1', 'TS0/00000001/ComSup0/resnonl_FORC_NODA@@][@@P1', 'TS0/00000001/ComSup0/resnonl_REAC_NODA@@][@@P1', 'TS0/00000001/ComSup0/resnonl_SIEF_ELGA@@][@@GAUSS', 'TS0/00000001/ComSup0/resnonl_SIEQ_ELGA@@][@@GAUSS', 'TS0/00000001/ComSup0/resnonl_SIEQ_NOEU@@][@@P1', 'TS0/00000001/ComSup0/resnonl_VARI_ELGA@@][@@GAUSS']

# get active view
renderView1 = GetActiveViewOrCreate('RenderView')

# show data in view
result_rmedDisplay = Show(result_rmed, renderView1, 'UnstructuredGridRepresentation')

# trace defaults for the display properties.
result_rmedDisplay.Representation = 'Surface'

# reset view to fit data
renderView1.ResetCamera(False, 0.9)

# get the material library
materialLibrary1 = GetMaterialLibrary()

# update the view to ensure updated data information
renderView1.Update()

renderView1.ResetActiveCameraToPositiveY()

# reset view to fit data
renderView1.ResetCamera(False, 0.9)

# set scalar coloring
ColorBy(result_rmedDisplay, ('POINTS', 'resnonl_DEPL', 'Magnitude'))

# rescale color and/or opacity maps used to include current data range
result_rmedDisplay.RescaleTransferFunctionToDataRange(True, False)

# show color bar/color legend
result_rmedDisplay.SetScalarBarVisibility(renderView1, True)

# get color transfer function/color map for 'resnonl_DEPL'
resnonl_DEPLLUT = GetColorTransferFunction('resnonl_DEPL')

# Apply a preset using its name. Note this may not work as expected when presets have duplicate names.
resnonl_DEPLLUT.ApplyPreset('Rainbow Uniform', True)

# get opacity transfer function/opacity map for 'resnonl_DEPL'
resnonl_DEPLPWF = GetOpacityTransferFunction('resnonl_DEPL')

# get 2D transfer function for 'resnonl_DEPL'
resnonl_DEPLTF2D = GetTransferFunction2D('resnonl_DEPL')

# change representation type
result_rmedDisplay.SetRepresentationType('Surface With Edges')

# Properties modified on renderView1
renderView1.CameraParallelProjection = 1

# Properties modified on animationScene1
animationScene1.AnimationTime = timeVisualization

# get the time-keeper
timeKeeper1 = GetTimeKeeper()

# rescale color and/or opacity maps used to exactly fit the current data range
result_rmedDisplay.RescaleTransferFunctionToDataRange(False, True)

# get layout
layout1 = GetLayout()

# layout/tab size in pixels
layout1.SetSize(1612, 713)

# current camera placement for renderView1
renderView1.CameraPosition = [112.0, -422.8299576397467, 11.2]
renderView1.CameraFocalPoint = [112.0, 16.0, 11.2]
renderView1.CameraViewUp = [0.0, 0.0, 1.0]
renderView1.CameraParallelScale = 113.57755059869886
renderView1.CameraParallelProjection = 1

###########################################################################
### Set Color

# find settings proxy
generalSettings = GetSettingsProxy('GeneralSettings')

# find settings proxy
iOSettings = GetSettingsProxy('IOSettings')

# find settings proxy
renderViewInteractionSettings = GetSettingsProxy('RenderViewInteractionSettings')

# find settings proxy
renderViewSettings = GetSettingsProxy('RenderViewSettings')

# find settings proxy
representedArrayListSettings = GetSettingsProxy('RepresentedArrayListSettings')

# find settings proxy
colorPalette = GetSettingsProxy('ColorPalette')

# Properties modified on colorPalette
colorPalette.Background = [1.0, 1.0, 1.0]

# Properties modified on colorPalette
colorPalette.Foreground = [0.0, 0.0, 0.0]

# Properties modified on colorPalette
colorPalette.Text = [0.0, 0.0, 0.0]
###########################################################################

# save screenshot
SaveScreenshot(f'/home/{username}/work/13_leoFEM/simulation_files/s{jobname}_DEPL_F000.png', renderView1, 16, ImageResolution=[1612, 713])

# layout/tab size in pixels
layout1.SetSize(1612, 713)

## current camera placement for renderView1
#renderView1.CameraPosition = [112.0, -422.8299576397467, 11.2]
#renderView1.CameraFocalPoint = [112.0, 16.0, 11.2]
#renderView1.CameraViewUp = [0.0, 0.0, 1.0]
#renderView1.CameraParallelScale = 113.57755059869886#
renderView1.CameraParallelProjection = 1

# save screenshot
#SaveScreenshot('/home/{username}/work/13_leoFEM/simulation_files/s4_barCantilever_DEPL1.png', renderView1, 16, ImageResolution=[1612, 713],#
#    TransparentBackground=1)

# create a new 'Warp By Vector'
warpByVector1 = WarpByVector(registrationName='WarpByVector1', Input=result_rmed)

# show data in view
warpByVector1Display = Show(warpByVector1, renderView1, 'UnstructuredGridRepresentation')

# trace defaults for the display properties.
warpByVector1Display.Representation = 'Surface'

# hide data in view
Hide(result_rmed, renderView1)

# show color bar/color legend
warpByVector1Display.SetScalarBarVisibility(renderView1, True)

# update the view to ensure updated data information
renderView1.Update()

# Properties modified on warpByVector1Display
warpByVector1Display.Opacity = 10.0

# change representation type
warpByVector1Display.SetRepresentationType('Surface With Edges')

# Properties modified on warpByVector1Display
warpByVector1Display.Opacity = 1.0

# Properties modified on warpByVector1
warpByVector1.ScaleFactor = 10.0

# update the view to ensure updated data information
renderView1.Update()

# layout/tab size in pixels
layout1.SetSize(1500, 713)

# current camera placement for renderView1
renderView1.CameraPosition = [112.0, -422.8299576397467, 11.2]
renderView1.CameraFocalPoint = [112.0, 16.0, 11.2]
renderView1.CameraViewUp = [0.0, 0.0, 1.0]
renderView1.CameraParallelScale = 113.57755059869886
renderView1.CameraParallelProjection = 1

# save screenshot
SaveScreenshot(f'/home/{username}/work/13_leoFEM/simulation_files/{jobname}_DEPL_F010.png', renderView1, 16, ImageResolution=[1500, 713],
    TransparentBackground=0)

# Properties modified on warpByVector1
warpByVector1.ScaleFactor = 1.0

# update the view to ensure updated data information
renderView1.Update()

# layout/tab size in pixels
layout1.SetSize(1500, 713)

# current camera placement for renderView1
renderView1.CameraPosition = [112.0, -422.8299576397467, 11.2]
renderView1.CameraFocalPoint = [112.0, 16.0, 11.2]
renderView1.CameraViewUp = [0.0, 0.0, 1.0]
renderView1.CameraParallelScale = 113.57755059869886
renderView1.CameraParallelProjection = 1



#================================================================
# addendum: following script captures some of the application
# state to faithfully reproduce the visualization during playback
#================================================================

#--------------------------------
# saving layout sizes for layouts

# layout/tab size in pixels
layout1.SetSize(1500, 713)

#-----------------------------------
# saving camera placements for views

# current camera placement for renderView1
renderView1.CameraPosition = [112.0, -422.8299576397467, 11.2]
renderView1.CameraFocalPoint = [112.0, 16.0, 11.2]
renderView1.CameraViewUp = [0.0, 0.0, 1.0]
renderView1.CameraParallelScale = 113.57755059869886
renderView1.CameraParallelProjection = 1

# save screenshot
SaveScreenshot(f'./output/job.png', renderView1, 16, ImageResolution=[1500, 713],
    TransparentBackground=0)

##--------------------------------------------
## You may need to add some code at the end of this python script depending on your usage, eg:
#
## Render all views to see them appears
# RenderAllViews()
#
## Interact with the view, usefull when running from pvpython
# Interact()
#
## Save a screenshot of the active view
# SaveScreenshot("path/to/screenshot.png")
#
## Save a screenshot of a layout (multiple splitted view)
# SaveScreenshot("path/to/screenshot.png", GetLayout())
#
## Save all "Extractors" from the pipeline browser
# SaveExtracts()
#
## Save a animation of the current active view
# SaveAnimation()
#
## Please refer to the documentation of paraview.simple
## https://kitware.github.io/paraview-docs/latest/python/paraview.simple.html
##--------------------------------------------
