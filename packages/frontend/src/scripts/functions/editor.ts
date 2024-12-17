import { CylinderGeometry, GridHelper, Group, Mesh, MeshBasicMaterial, TorusGeometry, CircleGeometry } from 'three'

export function createScene() {
        // grid
        const size = 400
        const divisions = 20
        const grid = new GridHelper( size, divisions, 'red', 'blue' )

        // translation (x-axis)
        const cyXB = new CylinderGeometry(1, 1, 20)
        const maXB = new MeshBasicMaterial({ color: 'green' ,depthTest: false})
        const meXB = new Mesh(cyXB, maXB)
        meXB.renderOrder = 999
        meXB.rotateZ(-Math.PI/2)
        meXB.position.set(12, 0, 0)

        const cyXA = new CylinderGeometry(2, 0, 2)
        const maXA = new MeshBasicMaterial({ color: 'green' ,depthTest: false})
        const meXA = new Mesh(cyXA, maXA)
        meXA.renderOrder = 999
        meXA.rotateZ(Math.PI/2)
        meXA.position.set(22, 0, 0)

        const arrowX = new Group()
        arrowX.name = 'x'
        arrowX.add(meXA)
        arrowX.add(meXB)

        // translation (y-axis)
        const cyYB = new CylinderGeometry(1, 1, 20)
        const maYB = new MeshBasicMaterial({ color: 'red' ,depthTest: false ,depthWrite: false})
        const meYB = new Mesh(cyYB, maYB)
        meYB.renderOrder = 999
        meYB.position.set(0, -12, 0)

        const cyYA = new CylinderGeometry(2, 0, 2)
        const maYA = new MeshBasicMaterial({ color: 'red' ,depthTest: false ,depthWrite: false})
        const meYA = new Mesh(cyYA, maYA)
        meYA.renderOrder = 999
        meYA.position.set(0, -22, 0)
        
        const arrowY = new Group()
        arrowY.name = 'y'
        arrowY.add(meYA)
        arrowY.add(meYB)

        // translation (z-axis)
        const cyZB = new CylinderGeometry(1, 1, 20)
        const maZB = new MeshBasicMaterial({ color: 'blue' ,depthTest: false ,depthWrite: false})
        const meZB = new Mesh(cyZB, maZB)
        meZB.renderOrder = 999
        meZB.rotateX(Math.PI/2)
        meZB.position.set(0, 0, -12)

        const cyZA = new CylinderGeometry(2, 0, 2)
        const maZA = new MeshBasicMaterial({ color: 'blue' ,depthTest: false ,depthWrite: false})
        const meZA = new Mesh(cyZA, maZA)
        meZA.renderOrder = 999
        meZA.rotateX(Math.PI/2)
        meZA.position.set(0, 0, -22)

        const arrowZ = new Group()
        arrowZ.name = 'z'
        arrowZ.add(meZA)
        arrowZ.add(meZB)
        
        // rotation (y-axis)
        const trRYB = new TorusGeometry(15, 1, 16, 100, Math.PI/2)
        const maRYB = new MeshBasicMaterial({ color: 'red' ,depthTest: false ,depthWrite: false})
        const meRYB = new Mesh(trRYB, maRYB)
        meRYB.renderOrder = 999
        meRYB.rotateX(-Math.PI/2)
        meRYB.position.set(10, 0, -10)

        const cyRYA = new CylinderGeometry(0, 2, 2)
        const maRYA = new MeshBasicMaterial({ color: 'red' ,depthTest: false ,depthWrite: false})
        const meRYA = new Mesh(cyRYA, maRYA)
        meRYA.renderOrder = 999
        meRYA.rotateX(Math.PI/2)
        meRYA.position.set(25, 0, -10)

        const clRYE = new CircleGeometry(1)
        const maRYE = new MeshBasicMaterial({ color: 'red' ,depthTest: false ,depthWrite: false})
        const meRYE = new Mesh(clRYE, maRYE)
        meRYE.renderOrder = 999
        meRYE.rotateY(-Math.PI/2)
        meRYE.position.set(10, 0, -25)

        const arrowRotY = new Group()
        arrowRotY.name = 'rotation y'
        arrowRotY.add(meRYA)
        arrowRotY.add(meRYB)
        arrowRotY.add(meRYE)

        // Manipulator
        const manipulator = new Group()
        manipulator.visible = false
        manipulator.add(arrowX)
        manipulator.add(arrowY)
        manipulator.add(arrowZ)
        manipulator.add(arrowRotY)

        //Model
        const model = new Group()
        model.add(grid)
        model.add(manipulator)
        model.rotation.x = Math.PI
        
        return [model, manipulator]
}