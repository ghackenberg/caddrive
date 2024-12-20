import { CylinderGeometry, Group, Mesh, MeshBasicMaterial, TorusGeometry, CircleGeometry, BoxHelper, BoxGeometry } from 'three'

const ARROW_BASE_RADIUS = 2
const ARROW_BASE_LENGTH = 24

const ARROW_HEAD_RADIUS = 4
const ARROW_HEAD_LENGTH = 8

const ARROW_OFFSET = ARROW_BASE_LENGTH / 2

export const COLOR_X = 'green'
export const COLOR_Y = 'red'
export const COLOR_Z = 'blue'
export const COLOR_S = 'yellow'

export function createScene() {
        // translation (x-axis)
        const cyXB = new CylinderGeometry(ARROW_BASE_RADIUS, ARROW_BASE_RADIUS, ARROW_BASE_LENGTH)
        const maXB = new MeshBasicMaterial({ color: COLOR_X, depthTest: false })
        const meXB = new Mesh(cyXB, maXB)
        meXB.renderOrder = 999
        meXB.rotateZ(-Math.PI / 2)
        meXB.position.set(ARROW_BASE_LENGTH / 2 + ARROW_BASE_RADIUS, 0, 0)

        const cyXA = new CylinderGeometry(ARROW_HEAD_RADIUS, 0, ARROW_HEAD_LENGTH)
        const maXA = new MeshBasicMaterial({ color: COLOR_X, depthTest: false })
        const meXA = new Mesh(cyXA, maXA)
        meXA.renderOrder = 999
        meXA.rotateZ(Math.PI/2)
        meXA.position.set(ARROW_HEAD_LENGTH / 2 + ARROW_BASE_LENGTH, 0, 0)

        const arrowX = new Group()
        arrowX.name = 'x'
        arrowX.add(meXA)
        arrowX.add(meXB)

        // translation (y-axis)
        const cyYB = new CylinderGeometry(ARROW_BASE_RADIUS, ARROW_BASE_RADIUS, ARROW_BASE_LENGTH)
        const maYB = new MeshBasicMaterial({ color: COLOR_Y, depthTest: false, depthWrite: false })
        const meYB = new Mesh(cyYB, maYB)
        meYB.renderOrder = 999
        meYB.position.set(0, -ARROW_BASE_LENGTH / 2 - ARROW_BASE_RADIUS, 0)

        const cyYA = new CylinderGeometry(ARROW_HEAD_RADIUS, 0, ARROW_HEAD_LENGTH)
        const maYA = new MeshBasicMaterial({ color: COLOR_Y, depthTest: false , depthWrite: false })
        const meYA = new Mesh(cyYA, maYA)
        meYA.renderOrder = 999
        meYA.position.set(0, -ARROW_HEAD_LENGTH / 2 - ARROW_BASE_LENGTH, 0)
        
        const arrowY = new Group()
        arrowY.name = 'y'
        arrowY.add(meYA)
        arrowY.add(meYB)

        // translation (z-axis)
        const cyZB = new CylinderGeometry(ARROW_BASE_RADIUS, ARROW_BASE_RADIUS, ARROW_BASE_LENGTH)
        const maZB = new MeshBasicMaterial({ color: COLOR_Z, depthTest: false, depthWrite: false })
        const meZB = new Mesh(cyZB, maZB)
        meZB.renderOrder = 999
        meZB.rotateX(Math.PI/2)
        meZB.position.set(0, 0, -ARROW_BASE_LENGTH / 2 - ARROW_BASE_RADIUS)

        const cyZA = new CylinderGeometry(ARROW_HEAD_RADIUS, 0, ARROW_HEAD_LENGTH)
        const maZA = new MeshBasicMaterial({ color: COLOR_Z, depthTest: false, depthWrite: false })
        const meZA = new Mesh(cyZA, maZA)
        meZA.renderOrder = 999
        meZA.rotateX(Math.PI/2)
        meZA.position.set(0, 0, -ARROW_HEAD_LENGTH / 2 - ARROW_BASE_LENGTH)

        const arrowZ = new Group()
        arrowZ.name = 'z'
        arrowZ.add(meZA)
        arrowZ.add(meZB)
        
        // rotation (y-axis)
        const trRYB = new TorusGeometry(ARROW_BASE_RADIUS + ARROW_BASE_LENGTH, ARROW_BASE_RADIUS, 16, 100, Math.PI/2)
        const maRYB = new MeshBasicMaterial({ color: COLOR_Y, depthTest: false, depthWrite: false })
        const meRYB = new Mesh(trRYB, maRYB)
        meRYB.renderOrder = 999
        meRYB.rotateX(-Math.PI/2)
        meRYB.position.set(ARROW_OFFSET, 0, -ARROW_OFFSET)

        const cyRYA = new CylinderGeometry(0, ARROW_HEAD_RADIUS, ARROW_HEAD_LENGTH)
        const maRYA = new MeshBasicMaterial({ color: COLOR_Y, depthTest: false, depthWrite: false })
        const meRYA = new Mesh(cyRYA, maRYA)
        meRYA.renderOrder = 999
        meRYA.rotateX(Math.PI/2)
        meRYA.position.set(ARROW_BASE_RADIUS + ARROW_BASE_LENGTH + ARROW_OFFSET, 0, -ARROW_OFFSET)

        const clRYE = new CircleGeometry(ARROW_BASE_RADIUS)
        const maRYE = new MeshBasicMaterial({ color: COLOR_Y, depthTest: false, depthWrite: false })
        const meRYE = new Mesh(clRYE, maRYE)
        meRYE.renderOrder = 999
        meRYE.rotateY(-Math.PI/2)
        meRYE.position.set(ARROW_OFFSET, 0, -ARROW_BASE_RADIUS - ARROW_BASE_LENGTH - ARROW_OFFSET)

        const arrowRotY = new Group()
        arrowRotY.name = 'rotation y'
        arrowRotY.add(meRYA)
        arrowRotY.add(meRYB)
        arrowRotY.add(meRYE)

        // Manipulator
        const manipulator = new Group()
        manipulator.name = 'manipulator'
        manipulator.visible = false
        manipulator.add(arrowX)
        manipulator.add(arrowY)
        manipulator.add(arrowZ)
        manipulator.add(arrowRotY)

        // Box
        const boxGeometry = new BoxGeometry()
        const boxMesh = new Mesh(boxGeometry)
        const box = new BoxHelper(boxMesh)
        box.name = 'box'
        box.visible = false

        //Model
        const model = new Group()
        model.add(manipulator)
        model.add(box)
        model.rotation.x = Math.PI
        
        return { model, manipulator, arrowX, arrowY, arrowZ, arrowRotY, box }
}