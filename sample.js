import * as THREE from 'three';

import { GLTFLoader } from './node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import {OrbitControls} from './node_modules/three/examples/jsm/controls/OrbitControls.js';
const path = './matilda/scene.gltf';



class Website3DDemo {
    constructor() {
        this._Initialize();
        this._LoadModel();
    }

    _Initialize() {
        this._threejs = new THREE.WebGLRenderer();
        this._threejs.shadowMap.enabled = true;
        this._threejs.shadowMap.type = THREE.PCFSoftShadowMap;
        this._threejs.physicallyCorrectLights = true;
        this._threejs.toneMapping = THREE.ACESFilmicToneMapping;
        this._threejs.outputEncoding = THREE.sRGBEncoding;
        this._threejs.setPixelRatio(window.devicePixelRatio);
        this._threejs.setSize(window.innerWidth, window.innerHeight);

        document.body.appendChild(this._threejs.domElement);

        window.addEventListener('resize', () => {
            this._OnWindowResize();
        }, false);

        const fov = 60;
        const aspect = window.innerWidth / window.innerHeight;
        const near = 1.0;
        const far = 1000.0;
        this._camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        this._camera.position.set(75, 20, 0);

        this._scene = new THREE.Scene();

        let light = new THREE.DirectionalLight(0xFFFFFF, 1.0);
        light.position.set(20, 100, 10);
        light.target.position.set(0, 0, 0);
        light.castShadow = true;
        light.shadow.bias = -0.001;
        light.shadow.mapSize.width = 2048;
        light.shadow.mapSize.height = 2048;
        light.shadow.camera.near = 0.5;
        light.shadow.camera.far = 500.0;
        light.shadow.camera.left = 100;
        light.shadow.camera.right = -100;
        light.shadow.camera.top = 100;
        light.shadow.camera.bottom = -100;
        this._scene.add(light);

        light = new THREE.AmbientLight(0x101010);
        this._scene.add(light);

        const controls = new OrbitControls(
            this._camera, this._threejs.domElement);
        controls.target.set(0, 20, 0);
        controls.update();

        const loader = new THREE.CubeTextureLoader();
        const texture = loader.load([
            './resources/posx.jpg',
            './resources/negx.jpg',
            './resources/posy.jpg',
            './resources/negy.jpg',
            './resources/posz.jpg',
            './resources/negz.jpg',
        ]);
        this._scene.background = texture;

        const plane = new THREE.Mesh(
            new THREE.PlaneGeometry(100, 100, 1, 1),
            new THREE.MeshStandardMaterial({
                color: 0xFFFFFF,
            }));
        plane.castShadow = false;
        plane.receiveShadow = true;
        plane.rotation.x = -Math.PI / 2;
        this._scene.add(plane);


        this._RAF();
    }

    /* _LoadModel(){
        const loader = new GLTFLoader();
        loader.load('./matilda/scene.gltf', (gltf) => {
            gltf.scene.traverse(c => {
                c.castShadow = true;
            });
            this._scene.add(gltf.scene);
        });
    } */

    _LoadModel(){
        const loader = new GLTFLoader();
        loader.load(path, (gltf) => {
            gltf.scene.traverse(c => {
                c.castShadow = true;
            });
        console.log('Model loaded successfully');

          // Scale the model
        gltf.scene.scale.set(0.7, 0.7, 0.7);
        this._scene.add(gltf.scene);

    }, undefined, (error) => {
        console.error('An error occurred while loading the model:', error);
    });
  }
        
    _OnWindowResize(){
        this._camera.aspect = window.innerWidth / window.innerHeight;
        this._camera.updateProjectionMatrix();
        this._threejs.setSize(window.innerWidth, window.innerHeight);
    }

    //request animation frame
    _RAF() {
        requestAnimationFrame(() => {
          this._threejs.render(this._scene, this._camera);
          this._RAF();
        });
    }
}

let app = new Website3DDemo();
    

  