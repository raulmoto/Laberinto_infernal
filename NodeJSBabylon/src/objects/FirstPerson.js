export default class Firstperson{
    constructor(scena,camara){
        this.speed = 0;
        this.acceleration = 0;
        this.scene = scena;
        this.camera = camara;
    }

    controlWASD(){
        try {
            var heroRotationSpeed = 0.1;
            var inputMap = {};
            this.scene.actionManager = new BABYLON.ActionManager(this.scene);
            this.scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, function (evt) {
                inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
            }));
            this.scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, function (evt) {
                inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
            }));
            //
            this.camera.angularSensibilityX = 2000;

            this.scene.onBeforeRenderObservable.add(() => {
                var keydown = false;
                //Manage the movements of the character (e.g. position, direction)
                if (inputMap["w"]) {
                    console.log("se ha tecleado W")
                    keydown = true;
                    
                }
                if (inputMap["s"]) {
                    
                    keydown = true;
                }
                if (inputMap["a"]) {
                    
                    this.camera.cameraRotation.y -= 0.01;
                    keydown = true;
                }
                if (inputMap["d"]) {
                    this.camera.cameraRotation.y += 0.01;
                    keydown = true;
                }
                if (inputMap["b"]) {
                    run.weight = 1.0;
                    dejar_de_Correr.weight = 0.0;
                    this.camera.moveWithCollisions(this.camera.forward.scaleInPlace(heroSpeed));
                    keydown = true;
                }
                //
                if (keydown) {
                    if (inputMap["s"]) {
                        //Walk backwards
                        console.log("acion caminar atras")
                        this.camera.cameraDirection.addInPlace(this.camera.getDirection(BABYLON.Vector3.Backward()).scale(0.05));
                    }else if(inputMap["b"] && run.weight > 0) {
                        console.log("tecla pulsada es la B====="+run.weight)
                        
                        const teclapulsada = (event) => {
                            console.log("========================================");
                            if (event.key === 'b') {
                                keydown = false;
                                // Si deja de pulsar la tecla "b", cambiamos la animación a dejar_de_Correr
                                console.log("le madamos objetivo::"+dejar_de_Correr.weight, "actual: "+run.weight)
                                cambiar_animacion(dejar_de_Correr, run);
                                // Eliminar el event listener una vez que ha sido utilizado
                                window.removeEventListener('keyup', teclapulsada);
                                console.log("borramos el listen")
                            }
                        };                                // Añadir el event listener
                        window.addEventListener('keyup', teclapulsada);
                    }
                    else if(inputMap["w"]){
                        //Walk
                        console.log("acion caminar =========>");
                        this.camera.cameraDirection.addInPlace(this.camera.getDirection(BABYLON.Vector3.Forward()).scale(0.05));  
                    }
                }
                
                //
            });
        } catch (error) {
            console.log("==== "+error)
        }
        
    }

}

