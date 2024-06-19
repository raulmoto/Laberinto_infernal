export default function add_maze(scene){
    BABYLON.SceneLoader.ImportMesh("", "http://localhost:3000/assets/", "laberinto.glb", scene,async  function (meshes) {
        const root = meshes[0]
        root.scaling.y += 1
        //we apply material to the walls
        let material = new BABYLON.StandardMaterial("wallMaterial", scene);
        material.diffuseTexture = new BABYLON.Texture("http://localhost:3000/assets/pared.jpg", scene);
        //we obtain the meshes that form the walls of the labyrinth
        let wall = root.getChildMeshes().find(mesh => mesh.name === "Object_3");
        let wall2 = root.getChildMeshes().find(mesh => mesh.name === "Object_2");
        let ground = root.getChildMeshes().find(mesh => mesh.name === "Object_4");
        if (wall) {
            console.log("????????????????????????????? "+root.scaling.y);
            wall.material = material;
        }
        if(wall2){
            console.log("========================");
            wall2.material = material;
        }else {
            console.error("No se encontró la pared especificada.");
        }
        //we go through all the child nodes
        const childMeshes = root.getChildMeshes()
        //We cause collisions to all child nodes.
        for (let mesh of childMeshes) {
            console.log("metemos colision al laberibto")
            mesh.checkCollisions = true
        } 
    });
}