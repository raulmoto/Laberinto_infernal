import add_maze from "../src/objects/labyrinth.js";
import Firstperson from "../src/objects/FirstPerson.js";
import adddecorations from "../src/objects/decorated.js";
import Soundmanager from "../src/start/SoundManager.js";

var interval = 0
var getDifficulty = '';
let totalTime = 0;
let  sound;
export default function creationScene(canvas, engine) {
    const scene = new BABYLON.Scene(engine);
    try {
        // Gravity and collision optimization
        scene.gravity.set(0, -0.8, 0);
        scene.collisionsEnabled = true;
        scene.enablePhysics();
        scene.skipPointerMovePicking = true;
        // Camera settings
        const camera = new BABYLON.UniversalCamera("FirstViewCamera", new BABYLON.Vector3(0, 1, 0), scene);
        camera.ellipsoid.set(1, 2, 1);
        camera.speed = 0.3;
        camera.position.set(-88, -7, -66);
        camera.checkCollisions = true;
        camera.attachControl(canvas, true);
        camera.applyGravity = true
        // Soil creation
        const ground = BABYLON.MeshBuilder.CreateGround("ground1", { width: 2000, height: 2000 }, scene);
        ground.position.y = -11;
        let material = new BABYLON.StandardMaterial("wallMaterial", scene);
        material.diffuseTexture = new BABYLON.Texture("http://localhost:3000/assets/materials/sueloSucio.jpg", scene);
        // Adjust UV coordinates for 5x5 meter texture
        var scaleX5 = 2000 / 5;
        var scaleY5 = 2000 / 5;
        material.diffuseTexture.uScale = scaleX5;
        material.diffuseTexture.vScale = scaleY5;
        // Assign the material to the terrain
        ground.material = material;
        ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, scene);
        // Setting up first-person control
        const p = new Firstperson(scene, camera);
        p.controlWASD();
        // Light Settings
        const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 10, 0), scene);
        light.intensity = 0.7;
        // Add the maze and decorations
        add_maze(scene);
        adddecorations(scene,engine);
        //add light re-glow
        const gl = new BABYLON.GlowLayer("glow", scene);
        gl.intensity = 0.5;
        document.getElementById("menu").style.display = "block";
        //sound
        horrorsound(scene);
        // Add the doors
        addDoors().then(() => {
            setTimeout(hideLoadingView, 800);
        });
        // Create the sphere and its light
        const sphere = BABYLON.MeshBuilder.CreateSphere("esfera1", { diameter: 2 }, scene);
        sphere.position.set(89, -2, -78);
        const spotLight = new BABYLON.SpotLight("spotLight", new BABYLON.Vector3(89, 8, -78), new BABYLON.Vector3(0, -1, 0), Math.PI / 3, 2, scene);
        spotLight.diffuse = new BABYLON.Color3(1, 1, 1);
        spotLight.specular = new BABYLON.Color3(1, 1, 1);
        spotLight.intensity = 0.9;
        const emissiveMaterial = new BABYLON.StandardMaterial("emissiveMaterial", scene);
        emissiveMaterial.emissiveColor = new BABYLON.Color3(0, 0, 1);
        sphere.material = emissiveMaterial;
        const glowLayer = new BABYLON.GlowLayer("glow2", scene);
        glowLayer.intensity = 0.01;
        glowLayer.addIncludedOnlyMesh(sphere);
        getDifficulty = localStorage.getItem('dificultad');
        console.log('OBTENEMOS :',getDifficulty)
        scene.onBeforeRenderObservable.add(() => {
            calcularDistancia(sphere, camera,canvas,engine);
        });
        //We set the time according to the chosen difficulty
        let tiempo = 0;
        if(getDifficulty === 'Facil'){
            tiempo = 15;
        }else if(getDifficulty === 'Normal'){
            tiempo = 10;
        }else{
            tiempo = 6;
            document.getElementById("distancia_lleagr").style.display = "none";
        }
        totalTime = tiempo * 60; //regressive time
        const prcentajetiempoTotal = Math.floor(totalTime / 60);

        // Show FPS statistics
        const statsDiv = document.getElementById("stats-text");
        interval =  setInterval(() => {
            statsDiv.innerHTML = `<b>${Math.round(engine.getFps())} FPS</b>`;
            mostrarHora(prcentajetiempoTotal);
        }, 1000);
        return scene;
    } catch (error) {
        console.error("Error al crear la escena: ", error);
    }
}
/**
 * Pre: sphere, camera, the canvas
 * Post: This method calculates the distance between the first person and the sphere next to the final door
 */
function calcularDistancia(esfera, camera,canvas,engine) {
    const distance = BABYLON.Vector3.Distance(esfera.position, camera.position).toFixed(2);
    console.log("La distancia es de: " + distance);
    document.getElementById("distance").innerHTML = distance+"m"
    if(distance < 11){
        //alert
        let boton = document.getElementById("Volver");
        let card = document.getElementById("card-container");
        card.style.display = "block";
        if(!boton.dataset.listenerAdded){
            boton.addEventListener('click', () => {
                engine.stopRenderLoop();
                window.location.href = "/";
            });
            boton.dataset.listenerAdded = "true";
            //bloqueamos el movimiento de la camara y paramos el temporizador
            clearInterval(interval);
            camera.detachControl(canvas);
            //bloqueamos entrada de teclado
            window.addEventListener('keydown',function(event){
                if(["w","a","s","d"].includes(event.key)){
                    event.preventDefault();
                }  
            });
        }
        //Soundmanager.setSonido('pasillos');
    }
}

//obtenemos la dificultad
/**
 * Pre: ---
 *Post: This method calculates the time the player has left to complete the mission. To be able to subtract life in
 * as a function of time, what is done is a simple rule of 3. If the time is 10 min, 10 would be 100%. The first thing I know
 * does is convert minutes to seconds, and then 60 seconds are stored in a variable. When seconds are < 10,
 * 0 is added so that it always has two digits, for example, if it is 5 seconds, it will be 05s.
 * To update the health bar, we pass 100% of the time and the current minute to the method, from which it returns
 * we check if the time is less than 0, if it is not, we subtract -1 from the initial time to update the minutes and seconds.
*/

function mostrarHora(prcentajetiempoTotal) {
    const minutes = Math.floor(totalTime / 60);
    const seconds = totalTime % 60;
    document.getElementById('minuto').innerHTML = minutes;
    document.getElementById('segundo').innerHTML = (seconds < 10 ? "0" : "") + seconds;
    //we pass the start time which will be 100%
    let current_minute = parseInt(document.getElementById('minuto').textContent,10);
    console.log("minuto actual ==="+current_minute+"minutes = "+minutes)
    if(isNaN(current_minute)){
        console.error("minuto actual no es un numero válido",current_minute)
    }
    let quedatiempo = estadoSalud(prcentajetiempoTotal,current_minute)
    console.log("el segundo == "+seconds)

    if (quedatiempo <= 0 && seconds == 0) {
        clearInterval(interval);
        Soundmanager.stopAllSonidos();
        Soundmanager.getSound('pasillos');
        window.location.href = "/gameover";
        //document.getElementById("gameover").style.display= "block"
        //alert("¡El tiempo ha terminado!");
    } else {
        totalTime--;
    }
}
//we position the doors
async function addDoors() {
    try {
        const doorHome = await loadDoor({ x: -90, y: -13, z: -60 }, { x: 6, y: 6, z: 10 });
        const doorEnd = await loadDoor({ x: 93, y: -13, z: -78 }, { x: 32, y: 6, z: 10 });
    } catch (error) {
        console.log("Error al cargar las puertas: " + error);
    }
}
//let's add the doors to the scene
async function loadDoor(position, scaling) {
    const res = await BABYLON.SceneLoader.ImportMeshAsync("", "http://localhost:3000/assets/puerta3.glb");
    const puerta = res.meshes[0];
    puerta.position.set(position.x, position.y, position.z);
    puerta.scaling.set(scaling.x, scaling.y, scaling.z);
    puerta.getChildMeshes().forEach(mesh => mesh.checkCollisions = true);
    return puerta;
}
//we hide the loading view
function hideLoadingView() {
    document.getElementById("loadingDiv").style.display = "none";
    document.getElementById("pnael_inferior").style.display = "block";
}
/***
 * Pre: 100% time, current time.
 * Post: A simple rule of 3 is made to calculate the percentage of time left compared to the initial one.
 * after finding the (x), we check if the remaining time is less than 50% and greater than 20%.
*/
const baraSalud = document.getElementById("progress-bar")
function estadoSalud(cienporciento,minutos_actual){
    console.log("la salud actual es deminutos_actual=====> "+minutos_actual)
    console.log("la salud actual en cienporciento=====> "+cienporciento)
    //we get the set time and the current time left
    //calculate the percentage left in the countdown and update the countdown bar
    let x = (minutos_actual * 100) / cienporciento;
    console.log("la salud actual es de "+x)
    baraSalud.style.width = x + '%';
    if (x <= 50 && x >= 20) { 
        baraSalud.classList.remove("bg-success");
        baraSalud.classList.add('bg-warning');
    } else if (x < 20) {
        baraSalud.classList.remove("bg-warning");
        baraSalud.classList.add('bg-danger');
    } else {
        baraSalud.classList.remove("bg-warning");
        baraSalud.classList.remove("bg-danger");
        baraSalud.classList.add('bg-success');
    }
    console.log("devolvemos :"+x)
    return x
}
//we add music to the scene
function horrorsound(scene){
    // Load the sound and play it automatically once ready
    sound = new BABYLON.Sound("terror2", "../assets/sounds/terror2.mp3", scene, null, {
        loop: true,
        autoplay: true,
    });
    Soundmanager.setSonido('pasillos',sound)
}
