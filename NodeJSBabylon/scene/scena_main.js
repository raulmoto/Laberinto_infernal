import Firstperson from "../src/objects/FirstPerson.js"
import Soundmanager from "../src/start/SoundManager.js";
let sound;
// import HavokPhysics from "https://cdn.babylonjs.com/havok/HavokPhysics_es.js";
export default async function scena_main (canvas,engine) {
    var scene = new BABYLON.Scene(engine)
    try {
        var scene = new BABYLON.Scene(engine)
        scene.gravity.y = -0.08;
        scene.collisionsEnabled = true
        scene.enablePhysics();
        //var camera = new BABYLON.ArcRotateCamera("camera1", Math.PI / 2, Math.PI / 4, 10, new BABYLON.Vector3(5, 10, 80), scene);
        const camera = new BABYLON.UniversalCamera("FirstViewCamera", new BABYLON.Vector3(0, 1, 0), scene)
        camera.ellipsoid = new BABYLON.Vector3(1, 2, 1)
        camera.speed = 0.3;
        camera.position.x = 0
        camera.position.z = 0
        camera.position.y = 52
        camera.checkCollisions = true
        //camera.applyGravity = true
        var ground = BABYLON.Mesh.CreateGround("ground1", 500, 500, 500, scene);
        ground.isVisible = true;
        ground.position.y = -5
        ground.isVisible = true
        await addtortureroom();
        setTimeout(() => {
            hideLoadingView();       
        }, 1000);
        ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, scene);
        const p = new Firstperson(scene,camera)
        
        const canvas = scene.getEngine().getRenderingCanvas()
        camera.attachControl(canvas, true)
        let light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 10, 0), scene)
        light.intensity = 0.7
        //we add the method to choose difficulty
        chooseDifficulty();
        soundbreathing();
        return scene;
    } catch (error) {
        console.error("nuevo error: "+ error)
    }
}
//We show the menu to show the difficulty options
function chooseDifficulty(){
    document.getElementById("menu").style.display = "none";
    const opciones = document.querySelectorAll(".dropdown-item");
    opciones.forEach(item => {
        item.addEventListener('click',()=>{
            const dificultad = item.textContent;
            localStorage.setItem('dificultad',dificultad);
            console.log('opcion selecionada:' ,dificultad);
        });
    });
}
// Hide Loading View
function hideLoadingView() {
    document.getElementById("loadingDiv").style.display = "none";
    document.getElementById("opciones").style.display = "block";
}
async function addtortureroom(scene){
    return new Promise((resolve, reject) => {
        BABYLON.SceneLoader.ImportMeshAsync("", "./assets/", "salatortura.glb", scene).then((result) => {
            const hall = result.meshes[0];
            hall.scaling.x = 40;
            hall.scaling.y = 44;
            hall.scaling.z = 40;

            hall.position.x = 0;
            hall.position.y = 0;
            hall.position.z = 0;
            for (const mesh of result.meshes) {
                mesh.checkCollisions = true;
                if(mesh.name == "Chair_Furniture_0"){
                    console.log("lo tengo--------")   
                }
            }
            resolve();
        }).catch((error) => {
            console.error("Error al cargar la sala de tortura: " + error);
            reject(error);
        });
    });
}
//we add music to the scene
function soundbreathing(scene){
    // Load the sound and play it automatically once ready
    sound = new BABYLON.Sound("terror2", "../assets/sounds/respiracion.mp3", scene, null, {
        loop: true,
        autoplay: true,
    });
    Soundmanager.setSonido('respiracion',sound);
}