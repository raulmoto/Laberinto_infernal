export default function adddecorations(scene,engine) {
    const assetsUrl = "http://localhost:3000/assets/";
    const gl = new BABYLON.GlowLayer("glow", scene);
    gl.intensity = 1.9;
    //We previously establish the position of all the cables that we have in the scene in a list of objects
    const CablePosition = [
        { x: 8, y: 0, z: -33 },
        { x: 18, y: 0, z: -63 },
        { x: 18, y: 0, z: -67 },
        { x: 18, y: 0, z: -77 },
        { x: 8, y: 0, z: -13 },
        { x: 17, y: 0, z: -6 }
    ];
    //Previously establish the position of the pipes in a list of objects that only saves the coordinates
    const positionPipes = [
        { x: -91, y: -1, z: -78, rotationY: 0 },
        { x: -91, y: -1, z: -30, rotationY: 0 },
        { x: -79, y: -1, z: -2, rotationY: 90 },
        { x: -66, y: -1, z: -10, rotationY: 180 },
        { x: -66, y: -1, z: -40, rotationY: 180 },
        { x: -47, y: -2, z: -10, rotationY: 180 },
        { x: -38.7, y: -1, z: -10, rotationY: 180 },
        { x: -29, y: -1, z: -7, rotationY: 180 },
        { x: -18, y: -1, z: -26.7, rotationY: 270 },
        { x: -24, y: -1, z: -36, rotationY: 270 },
        { x: -40, y: -1, z: -45.3, rotationY: 270 }
    ];
    //we previously prepare a list of objects containing the name of the model, a list containing objects with positions and scalability
    const objectsInTheScene = [
        { url: "bolsa_basura.glb", positions: [
            { x: -87, y: -11, z: -2, scaling: { x: 4, y: 4, z: 3 }},
            { x: -67, y: -12, z: -32, scaling: { x: 4, y: 4, z: 3 }}
        ]},
        { url: "cadaver.glb", positions: [
            { x: -68, y: -10, z: -15, scaling: { x: 1, y: 3, z: 3 }}
        ]},
        { url: "bombona_gas.glb", positions: [
            { x: -69, y: -9, z: -60, scaling: { x: 17, y: 17, z: 17 }}
        ]},
        { url: "focos.glb", positions: [
            { x: -66, y: 0, z: -37, scaling: { x: 18, y: 12, z: 8 }, light: { color: new BABYLON.Color3(1, 0, 0) }},
            { x: 12, y: -1, z: -37, scaling: { x: 18, y: 12, z: 8 }, light: { color: new BABYLON.Color3(1, 0, 0) }}
        ]}
    ];
    //We define a single function that will be responsible for loading the models into the scene and placing them in their respective positions.
    const createMesh = (url, position, scaling = { x: 1, y: 1, z: 1 }, rotation = { alpha: 0, beta: 0, gamma: 0 }, light = null,aplicarDestello = false) => {
        BABYLON.SceneLoader.ImportMesh("", assetsUrl, url, scene, (meshes) => {
            let root = meshes[0];
            root.position.set(position.x, position.y, position.z);
            root.scaling.set(scaling.x, scaling.y, scaling.z);
            root.rotation = new BABYLON.Vector3(
                BABYLON.Tools.ToRadians(rotation.alpha),
                BABYLON.Tools.ToRadians(rotation.beta),
                BABYLON.Tools.ToRadians(rotation.gamma)
            );
            //we check if the object we are going to load has the light property.
            //if yes, we establish the point type light and add an emissive material
            if (light) {
                var pointLight = new BABYLON.PointLight("pointLight", root.position, scene);
                pointLight.diffuse = light.color;
                pointLight.specular = light.color;
                pointLight.intensity = 0.9;
                //establish the emissive material
                var materialEmisivo = new BABYLON.StandardMaterial("emissiveMaterial", scene);
                materialEmisivo.emissiveColor = light.color;
                root.material = materialEmisivo;

                let otherObjects = scene.meshes.filter(mesh => mesh !== root);
                otherObjects.forEach(obj => {
                    if (!obj.material) {
                        obj.material = new BABYLON.StandardMaterial("objMaterial", scene);
                    }
                    obj.material.diffuseColor = new BABYLON.Color3(1, 1, 1);
                    obj.material.specularColor = new BABYLON.Color3(1, 1, 1);
                });
            }
            //We also check if the model we are passing has a flash property.
            if(aplicarDestello){
                gl.addIncludedOnlyMesh(root);
            }
            //we reduce the calculation of world matrices (babylon optimization)
            root.freezeWorldMatrix();
        });
    };
    //we load the cables to the scene
    CablePosition.forEach(pos => createMesh("cable.glb", pos));
    //we load the pipes to the scene
    positionPipes.forEach(pos => {
        createMesh("tuberiasPared.glb", pos, undefined, { alpha: 0, beta: pos.rotationY, gamma: -95 });
    });
    //We load the other models to the scene as the light sources, calling the mesh creation method
    objectsInTheScene.forEach(item => {
        console.log("elemento "+item.url)
        if(item.url == "focos.glb"){
            item.positions.forEach(pos => {
                createMesh(item.url, pos, pos.scaling, undefined, pos.light,true);
            });
        }else{
            item.positions.forEach(pos => {
                createMesh(item.url, pos, pos.scaling);
            });
        }   
    });
    // Create and configure the sphere
    var sphere1 = BABYLON.Mesh.CreateSphere("Sphere1", 32, 5, scene);
    sphere1.position.y += 14;

    var material = new BABYLON.StandardMaterial("kosh", scene);
    var cubeTexture = new BABYLON.CubeTexture("https://assets.babylonjs.com/textures/TropicalSunnyDay", scene);
    material.refractionTexture = cubeTexture;
    material.reflectionTexture = cubeTexture;
    material.diffuseColor = new BABYLON.Color3(0, 0, 0);
    material.invertRefractionY = false;
    material.indexOfRefraction = 0.98;
    material.specularPower = 128;
    material.refractionFresnelParameters = new BABYLON.FresnelParameters();
    material.refractionFresnelParameters.power = 2;
    material.reflectionFresnelParameters = new BABYLON.FresnelParameters();
    material.reflectionFresnelParameters.power = 2;
    material.reflectionFresnelParameters.leftColor = BABYLON.Color3.Black();
    material.reflectionFresnelParameters.rightColor = BABYLON.Color3.White();
    sphere1.material = material;
    // Create and configure the skybox
    var skybox = BABYLON.Mesh.CreateBox("skyBox", 280.0, scene);
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = cubeTexture;
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.disableLighting = true;

    var colorGrading = new BABYLON.ColorGradingTexture("https://assets.babylonjs.com/textures/LateSunset.3dl", scene);
    skyboxMaterial.cameraColorGradingTexture = colorGrading;
    material.cameraColorGradingTexture = colorGrading;
    skyboxMaterial.cameraColorGradingEnabled = true;
    material.cameraColorGradingEnabled = true;
    skybox.material = skyboxMaterial;
    // Instrumentation
    var instrumentation = new BABYLON.EngineInstrumentation(engine);
    instrumentation.captureGPUFrameTime = true;
    instrumentation.captureShaderCompilationTime = true;
    var i = 0;
    const statsDiv = document.getElementById("currenteFrame");
    const statsDiv2 = document.getElementById("currenteFrame2");
    scene.registerBeforeRender(function () {
        colorGrading.level = Math.sin(i++ / 120) * 0.5 + 0.5;
        let tiempoFrameActualGPU = (instrumentation.gpuFrameTimeCounter.current * 0.000001).toFixed(2) + "ms";
        let tiempoPromedioFrameActualGPU = (instrumentation.gpuFrameTimeCounter.average * 0.000001).toFixed(2) + "ms";
        let tiempoDeCompilacionSobreadosTotal = (instrumentation.shaderCompilationTimeCounter.total).toFixed(2) + "ms";
        let tiempoPromedioDeCompilacionSombreado = (instrumentation.shaderCompilationTimeCounter.average).toFixed(2) + "ms";
        let contadorDeCompiladorSombreado = instrumentation.shaderCompilationTimeCounter.count;
        statsDiv.innerHTML = `<b>current frame time (GPU): ${tiempoFrameActualGPU} average frame time (GPU):${tiempoPromedioFrameActualGPU} </b>`;
        statsDiv2.innerHTML = `<b>total shader compilation time: ${tiempoDeCompilacionSobreadosTotal} average shader compilation time:${tiempoPromedioDeCompilacionSombreado} </b>`;
    });

}
