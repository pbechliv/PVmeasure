import { script1, script2 } from './animationScripts';
import * as THREE from 'three';

const SceneUtils = {
  createMultiMaterialObject: function(geometry, materials) {
    var group = new THREE.Group();

    for (var i = 0, l = materials.length; i < l; i++) {
      group.add(new THREE.Mesh(geometry, materials[i]));
    }

    return group;
  },

  detach: function(child, parent, scene) {
    child.applyMatrix(parent.matrixWorld);
    parent.remove(child);
    scene.add(child);
  },

  attach: function(child, scene, parent) {
    child.applyMatrix(new THREE.Matrix4().getInverse(parent.matrixWorld));

    scene.remove(child);
    parent.add(child);
  }
};

export const startAnim = function() {
  var App;

  window.App = function() {
    class App {
      constructor() {
        this.init = this.init.bind(this);
        this.update = this.update.bind(this);
        this.renderScene = this.renderScene.bind(this);
        this.resize = this.resize.bind(this);
      }

      init() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
          60,
          window.innerWidth / window.innerHeight,
          0.1,
          100000
        );
        this.camera.position.z = 9;
        this.camera.position.y = 1;
        this.renderer = new THREE.WebGLRenderer({
          width: window.innerWidth,
          height: window.innerHeight,
          scale: 1,
          antialias: false
        });
        this.renderer.setClearColor(0xffffff);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.container = document.createElement('div');
        this.container.id = 'canvasGL';
        this.container.appendChild(this.renderer.domElement);
        this.camera.lookAt(new THREE.Vector3());
        document.getElementById('bgr').appendChild(this.container);
        this.terrain = new window.Terrain(this.scene);
        this.scene.add(this.terrain.plane_mesh);
        return this.update();
      }

      update() {
        requestAnimationFrame(this.update);
        this.terrain.update();
        return this.renderScene();
      }

      renderScene() {
        return this.renderer.render(this.scene, this.camera);
      }

      resize(stageWidth, stageHeight) {
        this.camera.aspect = stageWidth / stageHeight;
        this.camera.updateProjectionMatrix();
        return this.renderer.setSize(stageWidth, stageHeight);
      }
    }

    App.prototype.canvasGL = null;

    App.prototype.container = null;

    App.prototype.scene = null;

    App.prototype.camera = null;

    App.prototype.renderer = null;

    App.prototype.geometry = null;

    App.prototype.material = null;

    App.prototype.mesh = null;

    App.prototype.gui = null;

    App.prototype.terrain = null;

    App.prototype.composer = null;

    App.prototype.render_pass = null;

    App.prototype.fxaa_pass = null;

    App.prototype.posteffect = false;

    App.prototype.meteo = null;

    App.prototype.skybox = null;

    return App;
  }.call(this);

  window.Terrain = function() {
    class Terrain {
      constructor(scene) {
        this.init = this.init.bind(this);
        this.buildPlanes = this.buildPlanes.bind(this);
        this.update = this.update.bind(this);
        this.scene = scene;
        this.init();
      }

      init() {
        this.uniforms = {
          time: {
            type: 'f',
            value: 0.0
          },
          speed: {
            type: 'f',
            value: this.options.speed
          },
          elevation: {
            type: 'f',
            value: this.options.elevation
          },
          noise_range: {
            type: 'f',
            value: this.options.noise_range
          },
          offset: {
            type: 'f',
            value: this.options.elevation
          },
          perlin_passes: {
            type: 'f',
            value: this.options.perlin_passes
          },
          sombrero_amplitude: {
            type: 'f',
            value: this.options.sombrero_amplitude
          },
          sombrero_frequency: {
            type: 'f',
            value: this.options.sombrero_frequency
          },
          line_color: {
            type: 'c',
            value: new THREE.Color(this.options.wireframe_color)
          }
        };
        this.buildPlanes(this.options.segments);
      }

      buildPlanes(segments) {
        this.plane_geometry = new THREE.PlaneBufferGeometry(20, 20, segments, segments);
        this.plane_material = new THREE.ShaderMaterial({
          vertexShader: script1,
          fragmentShader: script2,
          wireframe: this.options.wireframe,
          wireframeLinewidth: 1,
          transparent: true,
          uniforms: this.uniforms
        });
        this.groundMaterial = new THREE.MeshPhongMaterial({
          ambient: 0xffffff,
          color: 0xffffff,
          specular: 0x050505
        });
        this.groundMaterial.color.setHSL(0.095, 1, 0.75);
        this.groundMaterial.visible = false;
        this.materials = [this.groundMaterial, this.plane_material];
        this.plane_mesh = SceneUtils.createMultiMaterialObject(this.plane_geometry, this.materials);
        this.plane_mesh.rotation.x = -Math.PI / 2;
        return (this.plane_mesh.position.y = -0.5);
      }

      update() {
        return (this.plane_material.uniforms['time'].value = this.clock.getElapsedTime());
      }
    }

    Terrain.prototype.uniforms = null;

    Terrain.prototype.plane_mesh = null;

    Terrain.prototype.plane_geometry = null;

    Terrain.prototype.groundMaterial = null;

    Terrain.prototype.clock = new THREE.Clock(true);

    Terrain.prototype.options = {
      elevation: -2.2,
      noise_range: 0.8,
      sombrero_amplitude: -0.3,
      sombrero_frequency: 10.0,
      speed: 0.64,
      segments: 300,
      wireframe_color: '#9b9b9b',
      perlin_passes: 2,
      wireframe: true,
      floor_visible: false
    };

    Terrain.prototype.scene = null;

    return Terrain;
  }.call(this);

  App = new window.App();

  App.init();

  window.addEventListener('resize', onWindowResize, false);

  function onWindowResize() {
    App.camera.aspect = window.innerWidth / window.innerHeight;
    App.camera.updateProjectionMatrix();
    App.renderer.setSize(window.innerWidth, window.innerHeight);
  }
};
