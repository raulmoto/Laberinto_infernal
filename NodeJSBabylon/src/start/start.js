import creationScene  from '../../scene/escena.js';
import scena_main from "../../scene/scena_main.js";
import Soundmanager from './SoundManager.js';

const canvas = document.getElementById("renderCanvas"); // Get the canvas element
const engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine
 //llama a la función createScene(); 
const main = await scena_main(canvas, engine)

// Register a render loop to continually update and display the scene
engine.runRenderLoop(function () {
    main.render(); //actual
    //scene.render();  
});

// Observe browser/canvas resize events
window.addEventListener("resize", function () {
    engine.resize();
});
// When you click on the start button we have the current rendering
document.getElementById("iniciar").addEventListener('click',async function(){
    try {
        //detenemos el sonido 
        Soundmanager.stopSound('respiracion');
        let getDifficulty = localStorage.getItem('dificultad');
        console.log("dificultaaaaaaaad "+getDifficulty)
        if(getDifficulty != null){
            engine.stopRenderLoop();
            const scene = await creationScene(canvas, engine);
            //show the loading page again
            document.getElementById("opciones").style.display = "none";
            document.getElementById("loadingDiv").style.display = "block";
            
            //we render the new scene
            engine.runRenderLoop(function() {
                scene.render();
            });
        }
    } catch (error) {
        console.error(error)
    }
     
});

localStorage.clear();
