class CollisionsMachine{
    constructor() {
        this.meshes = []
    }

    async addMesh(mesh, scene) {
        // if (this.meshes.find(actualMesh => actualMesh === mesh)) return
        console.log("nombre del mesh: "+mesh.name)
        
        mesh.physicsImpostor = new BABYLON.PhysicsImpostor(mesh, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1, restitution: 0.9 }, scene);
        mesh.checkCollisions = true
        mesh.applyGravity = true
        

        this.meshes.push(mesh)
    }
}

const collisionsMachine = new CollisionsMachine()

export default collisionsMachine