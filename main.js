var scene, camera, renderer;
var clock;
var meshFloor;
var RDPERSON = 0;
var HUNGRY = 90;
var GRAVITY = 0.1;
var fogcase = true
var s0 = 0;
var s1 = 0;
var timeSpeed = 0.0000000005;
var flashLightOn = 0;
var ANIMALS = [];
for(let i=1 ; i < 50 ; i++){
    ANIMALS.push('fcow'+i)
}
for(let i=1 ; i < 50 ; i++){
    ANIMALS.push('moose'+i)
}
for(let i=1 ; i < 50 ; i++){
    ANIMALS.push('fgoat'+i)
}
for(let i=1 ; i < 50 ; i++){
    ANIMALS.push('flama'+i)
}
for(let i=1 ; i < 50 ; i++){
    ANIMALS.push('fzebra'+i)
}
var keyboard = {};
var player = {
    x:0,
    z:-5,
    height:0.1,
    speed:0.2,
    throwspeed:0.7,
    turnSpeed:Math.PI*0.003 
    };

var loadingScreen = {
    scene:  new THREE.Scene(),
    camera: new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 100),
    box: new THREE.Mesh(
         new THREE.BoxGeometry(0.5,0.5,0.5),
         new THREE.MeshBasicMaterial({ color:0x4444ff })
    )
};

var LOADING_MANAGER = null;
var RESOURCES_LOADED = false;
var models = {
    skeleton: {
        obj:"models/skeleton/skeleton.obj",
        mtl:"models/skeleton/skeleton.mtl",
        mesh:null
    },
    tree: {
        obj:"models/ModularTerrainHilly/Prop_Tree_Oak_1.obj",
        mtl:"models/ModularTerrainHilly/Prop_Tree_Oak_1.mtl",
        mesh:null
    },
    
    tree2: {
        obj:"models/ModularTerrainHilly/Prop_Tree_Cedar_1.obj",
        mtl:"models/ModularTerrainHilly/Prop_Tree_Cedar_1.mtl",
        mesh:null
    },
    
    tree3: {
        obj:"models/ModularTerrainHilly/Prop_Tree_Pine_3.obj",
        mtl:"models/ModularTerrainHilly/Prop_Tree_Pine_3.mtl",
        mesh:null
    }, 

    tree4: {
        obj:"models/tree/tree.obj",
        mtl:"models/tree/tree.mtl",
        mesh:null
    }, 
   
    bush: {
        obj:"models/ModularTerrainHilly/Prop_Bush_1.obj",
        mtl:"models/ModularTerrainHilly/Prop_Bush_1.mtl",
        mesh:null
    },
    bush2: {
        obj:"models/ModularTerrainHilly/Prop_Bush_2.obj",
        mtl:"models/ModularTerrainHilly/Prop_Bush_2.mtl",
        mesh:null
    },
    bush3: {
        obj:"models/ModularTerrainHilly/Prop_Bush_3.obj",
        mtl:"models/ModularTerrainHilly/Prop_Bush_3.mtl",
        mesh:null
    },
    grass: {
        obj:"models/ModularTerrainHilly/Grass_Flat.obj",
        mtl:"models/ModularTerrainHilly/Grass_Flat.mtl",
        mesh:null
    },
    rock: {
        obj:"models/ModularTerrainHilly/Prop_Rock_1.obj",
        mtl:"models/ModularTerrainHilly/Prop_Rock_1.mtl",
        mesh:null
    },
    stone: {
        obj:"models/stone/stone.obj",
        mtl:"models/stone/stone.mtl",
        mesh:null
    },
    mushroom: {
        obj:"models/ModularTerrainHilly/Prop_Mushroom_1.obj",
        mtl:"models/ModularTerrainHilly/Prop_Mushroom_1.mtl",
        mesh:null
    },
    cow: {
        obj:"models/Cow/Cow.obj",
        mtl:"models/Cow/Cow.mtl",
        mesh:null
    },
    moose: {
        obj:"models/moose/Moose.obj",
        mtl:"models/moose/Moose.mtl",
        mesh:null
    },
    goat: {
        obj:"models/poly_goat/Goat.obj",
        mtl:"models/poly_goat/Goat.mtl",
        mesh:null
    },
    lama: {
        obj:"models/ModularTerrainHilly/Llama.obj",
        mtl:"models/ModularTerrainHilly/Llama.mtl",
        mesh:null
    },
    zebra: {
        obj:"models/ModularTerrainHilly/Zebra.obj",
        mtl:"models/ModularTerrainHilly/Zebra.mtl",
        mesh:null
    },
  
    sheep: {
        obj:"models/ModularTerrainHilly/Sheep.obj",
        mtl:"models/ModularTerrainHilly/Sheep.mtl",
        mesh:null
    },
    tent: {
        obj:"models/3dnaturepack/Tent_01.obj",
        mtl:"models/3dnaturepack/Tent_01.mtl",
        mesh:null
    },
    tentPoles: {
        obj:"models/3dnaturepack/Tent_Poles_01.obj",
        mtl:"models/3dnaturepack/Tent_Poles_01.mtl",
        mesh:null
    },
};

var treeModel = {
    glb:"models/testingTree/tree.glb",
    mesh:null
};

var meshes = { };


function init(){

    scene = new THREE.Scene( );
    camera = new THREE.PerspectiveCamera(90, window.innerWidth/window.innerHeight, 0.05, 1000);
    var listener = new THREE.AudioListener();
    camera.add( listener );
    camera.rotation.order = "YXZ";
    scene.fog = new THREE.Fog( 0xbae5ff, 50, 150 );
  
    let loadingManager = new THREE.LoadingManager();

    loadingManager.onProgress = function(item, loaded, total){
    };

    loadingManager.onLoad = function(){
        RESOURCES_LOADED = true;
        onResourcesLoaded();
    };

    var floorTexture = new THREE.ImageUtils.loadTexture( './skybox/Plants/grass.jpg' );
    floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping; 
    floorTexture.repeat.set( 400, 600 );
    var floorMaterial = new THREE.MeshLambertMaterial( { map: floorTexture, side: THREE.DoubleSide } );
    var floorGeometry = new THREE.PlaneBufferGeometry(500, 500, 20, 20);
    var floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = Math.PI / 2;

    // Note the mesh is flagged to receive shadows
    floor.receiveShadow = true;
    scene.add(floor);

  
    var flora = new THREE.Mesh(floorGeometry, floorMaterial);
    flora.rotation.x = Math.PI / 2;
    flora.position.y -=1
    // Note the mesh is flagged to receive shadows
    flora.castShadow = true;
    flora.receiveShadow = true;
    scene.add(flora);

    ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
    scene.add(ambientLight);

    light = new THREE.PointLight(0xffffff, 0.7, 500);
    light.position.set(100, 100, 100);
    light.castShadow = true;
    light.shadowCameraNear = 0.1;
    light.shadowCameraFar = 2500;
    light.shadowCameraFar = 2500;
    light.shadowMapWidth = 4096; // default is 512
    light.shadowMapHeight = 4096; // default is 512
    scene.add(light);


    flameLight = new THREE.PointLight(0xff9d69, 0.5, 30);
    flameLight.position.set(4, 12, 4);
    flameLight.castShadow = true;
    flameLight.shadowCameraNear = 0.1;
    flameLight.shadowCameraFar = 250;
    flameLight.distance = 25;
    flameLight.shadowMapWidth = 1024; // default is 512
    flameLight.shadowMapHeight = 1024; // default is 512
    scene.add(flameLight);

    const totalBody = new THREE.Bone();
    const headBone = new THREE.Bone();
    const leftArmBone = new THREE.Bone();
    const rightArmBone = new THREE.Bone();
    const leftLegBone = new THREE.Bone();
    const rightLegBone = new THREE.Bone();
  
    totalBody.position.set(0, 0, 0);
    totalBody.scale.set(0.01, 0.01, 0.01);
    headBone.position.set(0, 4, 0);
    headBone.scale.set(0.01, 0.01, 0.01);
    leftArmBone.position.set(0, 0, 0);
    leftArmBone.scale.set(0.1, 0.1, 0.1);
    rightArmBone.position.set(-3, 3, 0);
    rightArmBone.scale.set(0.1, 0.1, 0.1);
    leftLegBone.position.set(-3, 3, -5);
    leftLegBone.scale.set(0.1, 0.1, 0.1);
    rightLegBone.position.set(3, 3, -5);
    rightLegBone.scale.set(0.1, 0.1, 0.1);
  
    totalBody.add(headBone);
    totalBody.add(leftArmBone);
    totalBody.add(rightArmBone);
    totalBody.add(leftLegBone);
    totalBody.add(rightLegBone);
  
    const bones = [];
    bones.push(totalBody);
    bones.push(headBone);
    bones.push(leftArmBone);
    bones.push(rightArmBone);
    bones.push(leftLegBone);
    bones.push(rightLegBone);
  
    const skeleton = new THREE.Skeleton(bones);
  
    const bodyGeometry = new THREE.BoxGeometry(5, 4, 10, 1, 1, 1);
    const headGeometry = new THREE.BoxGeometry(1, 4, 1, 1, 1, 1);
    const leftArmGeometry = new THREE.BoxGeometry(1.5, 4, 2, 1, 1, 1);
    const rightArmGeometry = new THREE.BoxGeometry(1.5, 4, 2, 1, 1, 1);
    const leftLegGeometry = new THREE.BoxGeometry(1.5, 4, 2, 1, 1, 1);
    const rightLegGeometry = new THREE.BoxGeometry(1.5, 4, 2, 1, 1, 1);
  
    headGeometry.translate(0, 0, 4);
    
    leftArmGeometry.translate(-3.5, 0, 4);
    rightArmGeometry.translate(3.5, 0, 4);
    leftLegGeometry.translate(-3.5, 0, -4);
    rightLegGeometry.translate(3.5, 0, -4);
  
    const humanGeometry = new THREE.Geometry();
    humanGeometry.merge(bodyGeometry);
    humanGeometry.merge(headGeometry);
    humanGeometry.merge(leftArmGeometry);
    humanGeometry.merge(rightArmGeometry);
    humanGeometry.merge(leftLegGeometry);
    humanGeometry.merge(rightLegGeometry);
    for (let boneIndex = 0; boneIndex < 6; boneIndex += 1) {
      for (let vertexIndex = 0; vertexIndex < 8; vertexIndex += 1) {
        humanGeometry.skinIndices.push(new THREE.Vector4(boneIndex, 0, 0, 0));
        humanGeometry.skinWeights.push(new THREE.Vector4(1, 0, 0, 0));
      }
    }
    const material = new THREE.MeshStandardMaterial({
      skinning: true,
      metalness: 0,
    });
    player1 = new THREE.SkinnedMesh(humanGeometry, material);
    player1.add(totalBody);
    player1.bind(skeleton);
    scene.add(player1);
    player1.scale.set(0.1,0.1,0.1)
    player1.position.set(0,2,0)
    var geometry = new THREE.CubeGeometry(1200,1200,1200);
    var cubeMaterials = [
        new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader( ).load("skybox/Plants/posx.jpg"), side: THREE.DoubleSide }),
        new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader( ).load("skybox/Plants/negx.jpg"), side: THREE.DoubleSide }),
        new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader( ).load("skybox/Plants/posy.jpg"), side: THREE.DoubleSide }),
        new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader( ).load("skybox/Plants/negy.jpg"), side: THREE.DoubleSide }),
        new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader( ).load("skybox/Plants/posz.jpg"), side: THREE.DoubleSide }),
        new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader( ).load("skybox/Plants/negz.jpg"), side: THREE.DoubleSide }),
    ];

    var cubeMaterial = new THREE.MeshFaceMaterial ( cubeMaterials );
    var qube = new THREE.Mesh(geometry, cubeMaterial);
    scene.add(qube);


    for( var _key in models ){
        (function (key){
            var mtlLoader = new THREE.MTLLoader(loadingManager);
            mtlLoader.load(models[key].mtl, function(materials){
                materials.preload();
                var objLoader = new THREE.OBJLoader(loadingManager);
                objLoader.setMaterials(materials);
                objLoader.load(models[key].obj, function(mesh){
                    mesh.traverse(function(node){
                        if(node instanceof THREE.Mesh){
                    
                            node.castShadow = true;
                            node.receiveShadow = true;
                        }
                    });
                    models[key].mesh = mesh;
                });
            })
        })(_key);
    }
    camera.position.set(player.x,player.height+0.1,player.z);
    camera.lookAt(new THREE.Vector3(0, player.height, 0));
  
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth,window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.BasicShadowMap;
    document.body.appendChild(renderer.domElement);
    var controls = new THREE.PointerLockControls(camera, renderer.domElement);
    document.body.addEventListener( 'click', function () {
        //lock mouse on screen
        controls.lock();
    }, false );

    animate();
}

var targetObject;
var jarid;
var fireStick;

function onResourcesLoaded(){   
    var randomRange = (max,min,cluster)=>{
        var random1 = Math.floor(Math.random() * (max - min + 1)) + min;
        var random2 = Math.floor(Math.random() * (max - min + 1)) + min;
        if(-cluster < random1 && random1 < cluster){
            if(-cluster < random2 && random2 < cluster){
                var xx = randomRange(max,min,cluster);
                random1 = xx[0];
                random2 = xx[1];
            }
        }
        
        return [random1,random2]
    };
    for (let i = 0; i < 750;i++) {
        meshes["xtree"+i] = models.tree.mesh.clone();
        meshes["ytree"+i] = models.tree2.mesh.clone();
        meshes["ztree"+i] = models.tree3.mesh.clone();
        meshes["xtree2"+i] = models.tree4.mesh.clone();
        meshes["xbush"+i] = models.bush.mesh.clone();
        meshes["xmushroom"+i] = models.mushroom.mesh.clone();
        meshes["xrock"+i] = models.rock.mesh.clone();
        meshes["xstone"+i] = models.stone.mesh.clone();
        max = 250;
        min = -250;
        cluster = 20;
   
        var random1,random2;    
        var xx = randomRange(max,min,cluster);
        random1 = xx[0];
        random2 = xx[1];
        meshes["xtree"+i].position.set(random1,0,random2);

        var xx = randomRange(max,min,cluster);
        random1 = xx[0];
        random2 = xx[1];
        meshes["xtree2"+i].position.set(random1,0,random2);

         var xx = randomRange(max,min,cluster);
        random1 = xx[0];
        random2 = xx[1];
        meshes["ytree"+i].position.set(random1,0,random2);

         var xx = randomRange(max,min,cluster);
        random1 = xx[0];
        random2 = xx[1];
        meshes["ztree"+i].position.set(random1,0,random2);

        var xx = randomRange(max,min,cluster);
        random1 = xx[0];
        random2 = xx[1];        // continue
        meshes["xbush"+i].position.set(random1,0,random2);
        var xx = randomRange(max,min,cluster);
        random1 = xx[0];
        random2 = xx[1];       
        // continue

        meshes["xmushroom"+i].position.set(random1,0,random2);
        var xx = randomRange(max,min,cluster);
        random1 = xx[0];
        random2 = xx[1];      
        // continue
        meshes["xrock"+i].position.set(random1,0,random2);

        meshes["xstone"+i].position.set(random1,0,random2);

        rand = Math.random()
        meshes["xtree"+i].scale.set(rand+0.6,rand+0.9,rand+0.6);
        meshes["xtree"+i].receiveShadow = true;
        meshes["xtree"+i].castShadow = true;
        scene.add(meshes["xtree"+i]);

        rand = Math.random()
        meshes["xtree2"+i].scale.set(rand-0.5,rand-0.5,rand-0.5);
        meshes["xtree2"+i].receiveShadow = true;
        meshes["xtree2"+i].castShadow = true;
        scene.add(meshes["xtree2"+i]);

         meshes["ytree"+i].scale.set(rand+0.6,rand+0.9,rand+0.6);
        meshes["ytree"+i].receiveShadow = true;
        meshes["ytree"+i].castShadow = true;
        scene.add(meshes["ytree"+i]);
        
         meshes["ztree"+i].scale.set(rand+0.6,rand+0.9,rand+0.6);
        meshes["ztree"+i].receiveShadow = true;
        meshes["ztree"+i].castShadow = true;
        scene.add(meshes["ztree"+i]);

        meshes["xbush"+i].scale.set(rand+0.6,rand+0.9,rand+0.6);
        meshes["xbush"+i].receiveShadow = true;
        meshes["xbush"+i].castShadow = true;
        scene.add(meshes["xbush"+i]);

        meshes["xmushroom"+i].scale.set(rand+0.6,rand+0.9,rand+0.6);
        meshes["xmushroom"+i].receiveShadow = true;
        meshes["xmushroom"+i].castShadow = true;
        scene.add(meshes["xmushroom"+i]);

        meshes["xrock"+i].scale.set(rand+0.6,rand+0.9,rand+0.6);
        meshes["xrock"+i].receiveShadow = true;
        meshes["xrock"+i].castShadow = true;
        scene.add(meshes["xrock"+i]);

        meshes["xstone"+i].scale.set(rand+0.6,rand+0.9,rand+0.6);
        meshes["xstone"+i].receiveShadow = true;
        meshes["xstone"+i].castShadow = true;
        scene.add(meshes["xstone"+i]);
    }



    for(let i = 1; i < 50 ; i++){

        max = 250;
        min = -250;
        cluster = 20;

        var random1,random2;    
        var xx = randomRange(max,min,cluster);
        random1 = xx[0];
        random2 = xx[1];
        meshes["fcow"+i] = models.cow.mesh.clone();
        meshes["fcow"+i].position.set(random1,0,random2);
        meshes["fcow"+i].scale.set(0.4,0.4,0.4);
        meshes["fcow"+i].castShadow = true;
        scene.add(meshes["fcow"+i]);

        var xx = randomRange(max,min,cluster);
        random1 = xx[0];
        random2 = xx[1];
        meshes["moose"+i] = models.moose.mesh.clone();
        meshes["moose"+i].position.set(random1,1,random2);
        meshes["moose"+i].scale.set(0.4,0.4,0.4);
        meshes["moose"+i].castShadow = true;
        scene.add(meshes["moose"+i]);

        var xx = randomRange(max,min,cluster);
        random1 = xx[0];
        random2 = xx[1];
        meshes["fgoat"+i] = models.goat.mesh.clone();
        meshes["fgoat"+i].position.set(random1,1,random2);
        meshes["fgoat"+i].scale.set(0.4,0.4,0.4);
        meshes["fgoat"+i].castShadow = true;
        scene.add(meshes["fgoat"+i]);

        var xx = randomRange(max,min,cluster);
        random1 = xx[0];
        random2 = xx[1];
        meshes["flama"+i] = models.lama.mesh.clone();
        meshes["flama"+i].position.set(random1,0,random2);
        meshes["flama"+i].scale.set(0.4,0.4,0.4);
        meshes["flama"+i].castShadow = true;
        scene.add(meshes["flama"+i]);
        
        var xx = randomRange(max,min,cluster);
        random1 = xx[0];
        random2 = xx[1];
        meshes["fzebra"+i] = models.zebra.mesh.clone();
        meshes["fzebra"+i].position.set(random1,0,random2);
        meshes["fzebra"+i].scale.set(0.4,0.4,0.4);
        meshes["fzebra"+i].castShadow = true;
        scene.add(meshes["fzebra"+i]);
    }

    
    max = 100;
    min = -100;

    meshes["rock"] = models.rock.mesh.clone();
    meshes["rock"].position.set(5,0,5);
    meshes["rock"].scale.set(0.6,0.6,0.6);
    meshes["rock"].castShadow = true;
    scene.add(meshes["rock"]);

    meshes["stone"] = models.stone.mesh.clone();
    meshes["stone"].position.set(5,0,5);
    meshes["stone"].scale.set(0.6,0.6,0.6);
    meshes["stone"].castShadow = true;
    scene.add(meshes["stone"]);
   
    meshes["tent"] = models.tent.mesh.clone();
    scene.add(meshes["tent"]);
    
    targetObject = new THREE.Object3D();
    scene.add(targetObject);
    var geometry = new THREE.CylinderGeometry( 0.05, 0.05, 2, 32 );
    var material = new THREE.MeshBasicMaterial( {color: 0x964B00} );
    jarid = new THREE.Mesh( geometry, material );
    scene.add( jarid );
    jarid.position.set(player.x-0.3,player.height+0.8,player.z);
    jarid.rotation.x = Math.PI / 2
    
    var geometry = new THREE.CylinderGeometry( 0.05, 0.05,3, 32 );
    var material = new THREE.MeshBasicMaterial( {color: 0x4d3700} );
    fireStick = new THREE.Mesh( geometry, material );
    scene.add( fireStick );
    fireStick.position.set(player.x+5,player.height-0.5,player.z);
    // fireStick.rotation.x
}
moving = 0;
flag = {};

ANIMALS.map((elem,index)=>{
    flag[elem] =1
});
alive = {};
ANIMALS.map((elem,index)=>{
    alive[elem] =1
});

console.log(ANIMALS)
console.log(flag)
console.log(alive)
var checkCollision = (obj1,obj2,dist) =>{
    return Math.abs(obj1.position.x - obj2.position.x) < dist &&
       Math.abs(obj1.position.y - obj2.position.y) < dist+10 && //DIKKAT
       Math.abs(obj1.position.z - obj2.position.z) < dist
};


var randomMovement = (obj1,meshName,initPos,speed)=>{
    if(flag[meshName] === 1){
        if(obj1.rotation.y >=  Math.PI / 2){
            obj1.position.x += speed
        }else{
            obj1.rotation.y +=  Math.PI / 50;
            obj1.position.z +=  0.1
        }
    }
    if(flag[meshName] === 0){
        if(obj1.rotation.y <=  -Math.PI / 2){ 
            obj1.position.x -= speed
        }else{
            obj1.rotation.y -=  Math.PI / 50;
            obj1.position.z +=  0.1
        }
    }
    if(flag[meshName] === 1){
        if(obj1.position.x > initPos+10)
        flag[meshName] = 0
    }
    if(flag[meshName] === 0){
        if(obj1.position.x < initPos-10)
        flag[meshName] = 1
    }
}


var objinteract = (obj1,opt1) =>{

   
    if(keyboard[37]){//left
        obj1.rotation.y += player.turnSpeed;
    }
    if(keyboard[39]){//right
        obj1.rotation.y -= player.turnSpeed;
    }
    if(keyboard[38]){
        if(obj1.rotation.x <= Math.PI/4){
            obj1.rotation.x += player.turnSpeed;
        }
    }
    if(keyboard[40]){
        if(obj1.rotation.x >= -Math.PI/4){
            obj1.rotation.x -= player.turnSpeed;
        }
    }
}


var interract = (obj1,opt1)=>{
    if(keyboard[89]){//Y
        if(enemyhit>0){
            enemyhit -= 1;
            HUNGRY += 10;
            if(HUNGRY > 100)
                HUNGRY = 100;
            if(HUNGRY <= 0)
                HUNGRY = 0;
            document.getElementById('info4').innerHTML = "Food: "+ enemyhit
        } else {
            
        }
    }
    if(keyboard[80]){//P
        daytime += 1
    }
    if(keyboard[70]){//P
        fogcase = !fogcase
    }
    if(keyboard[87]){//W
        obj1.position.z -= Math.cos(obj1.rotation.y) * player.speed;
        obj1.position.x -= Math.sin(obj1.rotation.y) * player.speed;
        moving = 1
    }
    if(keyboard[83]){//S
        obj1.position.z += Math.cos(obj1.rotation.y) * player.speed;
        obj1.position.x += Math.sin(obj1.rotation.y) * player.speed;
        moving = 1
    }
    if(keyboard[65]){//A
        obj1.position.z -= Math.cos(obj1.rotation.y + Math.PI/2) * player.speed;
        obj1.position.x += Math.sin(obj1.rotation.y - Math.PI/2) * player.speed;
        moving = 1
    }
    if(keyboard[68]){//D
        obj1.position.z -= Math.cos(obj1.rotation.y - Math.PI/2) * player.speed;
        obj1.position.x += Math.sin(obj1.rotation.y + Math.PI/2) * player.speed;
        moving = 1
    }
    if(keyboard[37]){//left
        obj1.rotation.y += player.turnSpeed;
        obj1.updateProjectionMatrix();
    }
    if(keyboard[39]){//right
        obj1.rotation.y -= player.turnSpeed;
        obj1.updateProjectionMatrix();
    }
    if(keyboard[38]){
        if(obj1.rotation.x <= Math.PI/4){
            obj1.rotation.x += player.turnSpeed;
            obj1.updateProjectionMatrix();
        }
    }
    if(keyboard[40]){
        if(obj1.rotation.x >= -Math.PI/4){
            obj1.rotation.x -= player.turnSpeed;
            obj1.updateProjectionMatrix();
        }
    }

}
var bindd = (obj1,obj2,margin)=>{
    obj2.position.x = obj1.position.x + margin[0];
    obj2.position.y = obj1.position.y + margin[1];
    obj2.rotation.y = obj1.rotation.y;
    obj2.position.z = obj1.position.z + margin[2]
}

var bindz = (obj1,obj2,margin)=>{
    obj2.position.x = obj1.position.x + Math.sin(obj1.rotation.y + Math.PI/4) * 0.6;
    obj2.position.y = player.height+0.8;
    obj2.position.z = obj1.position.z + Math.cos(obj1.rotation.y + Math.PI/4) * 0.6;
    obj2.rotation.z = obj1.rotation.y;
    obj2.rotation.x = obj1.rotation.z - Math.PI/2;
}
var fall = (obj1,GRAVITY1)=>{
    if(obj1.position.y > 0.1){
        obj1.position.y -= GRAVITY1
    }
}
var thrower = (obj1,power)=>{
    obj1.position.x -= Math.sin(obj1.rotation.z) * power;
    obj1.position.z -= Math.cos(obj1.rotation.z) * power;
}
var throwera = (obj1,power)=>{
    obj1.position.z -= Math.cos(obj1.rotation.y) * power;
    obj1.position.x -= Math.sin(obj1.rotation.y) * power;
}
binded = {}
throwing = {}
food = {}
ANIMALS.map((elem,index)=>{
    food[elem] =1
})
var enemyhit = 0
var update = () => {
    // bindd(camera,flameLight,[0,2,0])
    var gg = parseInt(document.getElementById('bar1').value)
    GRAVITY1 = (GRAVITY+gg/70)
    var gg = parseInt(document.getElementById('bar2').value)
    power = (player.throwspeed+gg/5)
    var gg = parseInt(document.getElementById('bar3').value)
    timeSpeedNorm = (timeSpeed+gg/500),
    HUNGRY -= 0.01
    document.getElementById('health').innerHTML =  "hungry: "+100+"/"+Math.floor(HUNGRY);
    interract(camera,0)
    bindd(camera,player1,[0,-1,0])
    
    posVal = Math.round(player1.position.x) + " " + Math.round(player1.position.y) + " " + Math.round(player1.position.z);
    document.getElementById('info').innerHTML =  "position: "+posVal;
    if(checkCollision(player1,jarid,1.8)){
        if(binded['jarid'] !== 1)
            document.getElementById('info2').innerHTML =  "Press E to pick item";
        else
        document.getElementById('info2').innerHTML =  "";
        if(keyboard[69]){
            binded['jarid'] = 1
        }
    } else {
        document.getElementById('info2').innerHTML =  ""
    }
    if(binded['jarid'] === 1){

        bindz(player1,jarid,[0,0,0]);
        document.getElementById('info3').innerHTML = "Press T to drop item"
    } else{
        fall(jarid,GRAVITY1)
    }
    if(keyboard[84]){
        binded['jarid'] = 0;
        document.getElementById('info3').innerHTML = ""
    }
    if(keyboard[82] && binded['jarid'] === 1){
        binded['jarid'] = 0;
        throwing['jarid'] = 1;
        jarid.position.y += 0.5
    }
    if(throwing['jarid']===1){
        thrower(jarid,power);
        if(jarid.position.y < 0.1){
            throwing['jarid'] = 0
        }
    }

    if(checkCollision(player1,meshes['rock'],1.8)){
        if(binded['rock'] !== 1)
            document.getElementById('info2').innerHTML =  "Press E to pick item";
        else
        document.getElementById('info2').innerHTML =  "";
        if(keyboard[69]){
            binded['rock'] = 1
        }
    } else {
        document.getElementById('info2').innerHTML =  ""
    }
    if(binded['rock'] === 1){

        bindd(player1,meshes['rock'],[0,0,3]);
        document.getElementById('info3').innerHTML = "Press T to drop item"
    } else{
        fall(meshes['rock'],GRAVITY1)
    }
    fall(meshes["rock"],GRAVITY1)
    if(keyboard[84]){
        binded['rock'] = 0;
        document.getElementById('info3').innerHTML = ""
    }
    if(keyboard[82] && binded['rock'] === 1){
        binded['rock'] = 0;
        throwing['rock'] = 1;
        meshes['rock'].position.y += 0.5
    }
    if(throwing['rock']===1){
        throwera(meshes['rock'],power+0.8);
        if(meshes['rock'].position.y < 0.1){
            throwing['rock'] = 0
        }
    }

    ANIMALS.map((elem,index)=>{

        if(alive[elem] === 0  && checkCollision(player1,meshes[elem],1.8) && food[elem]){
            document.getElementById('info5').innerHTML = "Press E to harvest food";
            if(keyboard[69]){
                enemyhit += 1
                document.getElementById('info4').innerHTML = "Food: "+ enemyhit;
                food[elem] = 0
                scene.remove(meshes[elem])
            }
        } else if(alive[elem] === 0  && checkCollision(player1,meshes[elem],1.8) && !food[elem]){
            document.getElementById('info5').innerHTML = ""
    
        }
        if(alive[elem]===1)
            randomMovement(meshes[elem],elem,meshes[elem].position.z,0.12)
    });

    if(Math.floor(player1.position.x) < 4 && Math.floor(player1.position.x) > 0 &&
        Math.floor(player1.position.z) < -9 && Math.floor(player1.position.z) > -13)
    {
        document.getElementById('info6').innerHTML = "Press E to enter house";
        if(keyboard[69]){
            camera.position.set(0, -30+player.height, 10);
        }
    }
    else{
        document.getElementById('info6').innerHTML = "";
    }

    // jarid.rotation.z += 0.1
    // camera.rotation.y += 0.1
  
    //sun

    daytime += 1 * timeSpeedNorm/2;
    light.position.x = Math.sin(daytime * 0.7 ) * 30;
    light.position.y = Math.cos(daytime * 0.5 ) * 40;
    light.position.z = Math.cos(daytime * 0.3 ) * 30;

    if(light.position.y < 0){
       
    }
    if(daytime >= 3.13 && daytime < 10.26){
        light.castShadow = false
        if(fogcase)
            scene.fog = new THREE.Fog( 0x111624, 50, 150 );
        else
            scene.fog = new THREE.Fog( 0x111624, 150, 200 );
        flameLight.intensity = 2.0
        flameLight.castShadow = true

        light.intensity = 0.0
        // console.log("gece "+daytime)
        s0 = 1
        s1 = 0
    } else {
        s1 = 1
        if(s0 && s1){
            daytime = 0;
        }
        s0 = 0
        light.castShadow = true
        if(fogcase)
            scene.fog = new THREE.Fog( 0xbae5ff, 50, 150 );
        else
            scene.fog = new THREE.Fog( 0xbae5ff, 150, 1600);
        light.intensity = 0.7
        flameLight.intensity = 0.0

        flameLight.castShadow = false
        // console.log("DayTime: "+daytime)

    }
    
    if(moving === 1){
        var time = Date.now() * 0.01;
        const angle = Math.sin(time);
        const bones = player1.skeleton.bones;
        bones[1].rotation.y = (Math.PI * angle) / 8;
        bones[2].rotation.x = (Math.PI * angle) / 4;
        bones[3].rotation.x = -(Math.PI * angle) / 4;
        bones[4].rotation.x = -(Math.PI * angle) / 4;
        bones[5].rotation.x = (Math.PI * angle) / 4;
    }
    moving = 0;

};
var daytime = 0;
function animate( ){
    if(RESOURCES_LOADED === false){
        requestAnimationFrame( animate );
        renderer.render( loadingScreen.scene , loadingScreen.camera );
        return;
    }
    update( );

    requestAnimationFrame( animate );
    renderer.render( scene , camera );
}

function keyDown( event ){
    keyboard[ event.keyCode ] = true;
}

function keyUp( event ){
    keyboard[ event.keyCode ] = false;
}

window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);
window.onload = init;