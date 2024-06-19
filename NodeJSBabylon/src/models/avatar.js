export default class Avatar{
    constructor(scene,camara){
        this.velocidad = 0;
        this.aceleracion = 0;
        this.salud = 100;
        this.scene = scene;
        this.camara = camara;
    }

    cambiar_animacion(animacion_objetivo,animacion_actual){
        console.log("animacion_objetivo:", animacion_objetivo.name);
        console.log("entramos")
        
            while(animacion_actual.weight>=0.0 && animacion_objetivo.weight<= 1.0){
                animacion_actual.weight -= 0.01;
                animacion_objetivo.weight += 0.01;
                console.log("i = " +animacion_objetivo.weight)
            }
    
        setTimeout(()=>{
            animacion_objetivo.start(true,1.0,animacion_objetivo.from,animacion_objetivo.to,false); 
            
        }, 100);
        let onAnimationLoopObserver = animacion_objetivo.onAnimationLoopObservable.add(() => { 
            if(animacion_objetivo.name != "Idle"){
                console.log("la animacion :"+animacion_objetivo.name)
                console.log("paramos la animacion :"+animacion_actual.name)
                animacion_objetivo.stop();
                animacion_objetivo.onAnimationLoopObservable.remove(onAnimationLoopObserver); 
            } 
        }); 
    }
    agregar_avatr(){
        const avatar = this;
        BABYLON.SceneLoader.ImportMesh("", "http://localhost:3000/assets/", "prueba2.9.glb", avatar.scene,async  function (meshes,particleSystems, skeleton) {
            const mesh = meshes[0];
            mesh.scaling = new BABYLON.Vector3(5, 5, 5);
            mesh.checkCollisions = true;
            mesh.position.z = -85
            mesh.position.y = 15
            avatar.camara.target = mesh;

            const ellipsoid2 = BABYLON.MeshBuilder.CreateSphere("ellipsoid", { diameterX: 15, diameterY: 15, diameterZ: 20 }, avatar.scene);
            const redMaterial = new BABYLON.StandardMaterial("redMaterial", avatar.scene);
            redMaterial.diffuseColor = new BABYLON.Color3(1, 0, 0); // Color rojo
            
            // Posiciona el elipsoide en la posición del personaje
            ellipsoid2.position = mesh.position;
            ellipsoid2.material = redMaterial;
            ellipsoid2.checkCollisions = true;
            
            // Asigna el mesh impostor de tipo elipsoide al elipsoide
            ellipsoid2.physicsImpostor = new BABYLON.PhysicsImpostor(ellipsoid, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1, friction: 0.5, restitution: 0.1 }, avatar.scene);
            mesh.ellipsoid = ellipsoid2;
                        
            
            var animating = true;
            //animaciones
            const run = avatar.scene.getAnimationGroupByName("run");
            const inactivo = avatar.scene.getAnimationGroupByName("Idle");
            const caminar = avatar.scene.getAnimationGroupByName("Walking");
            const caminarAtras = avatar.scene.getAnimationGroupByName("Walkingback");
            const dejar_de_Caminar = avatar.scene.getAnimationGroupByName("WalkStop");
            const dejar_de_Correr = avatar.scene.getAnimationGroupByName("runStop");
            // 
            var heroSpeed = 1;
            var heroSpeedBackwards = 0.01;
            var heroRotationSpeed = 0.1;
            //
            var inputMap = {};
            avatar.scene.actionManager = new BABYLON.ActionManager(avatar.scene);
            avatar.scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, function (evt) {
                inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
            }));
            avatar.scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, function (evt) {
                inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
            }));
            
            avatar.scene.onBeforeRenderObservable.add(() => {
                var keydown = false;
                //Manage the movements of the character (e.g. position, direction)
                if (inputMap["w"]) {
                    console.log("se ha tecleado W")
                    //avatar.avatarMesh.moveWithCollisions(moveDirection);
                    mesh.moveWithCollisions(mesh.forward.scaleInPlace(heroSpeed)); // Mover el personaje en la dirección calculada
                    keydown = true;
                    caminar.weight = 1.0;
                    dejar_de_Caminar.weight = 0.0
                }
                if (inputMap["s"]) {
                    mesh.moveWithCollisions(mesh.forward.scaleInPlace(-heroSpeedBackwards));
                    caminarAtras.weight = 1.0;
                    inactivo.weight = 0.0
                    keydown = true;
                }
                if (inputMap["a"]) {
                    mesh.rotate(BABYLON.Vector3.Up(), -heroRotationSpeed);
                    keydown = true;
                }
                if (inputMap["d"]) {
                    mesh.rotate(BABYLON.Vector3.Up(), heroRotationSpeed);
                    keydown = true;
                }
                if (inputMap["b"]) {
                    run.weight = 1.0;
                    dejar_de_Correr.weight = 0.0;
                    mesh.moveWithCollisions(mesh.forward.scaleInPlace(heroSpeed));
                    keydown = true;
                }
                
                //
            });
            
        });
    }
}

 
