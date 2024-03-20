import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffe0);

// Floor
const FLOOR_WIDTH = window.innerWidth;
const FLOOR_HEIGHT = window.innerHeight / 2.6;
const TILE_SIZE = 50;
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load("/textures/grass.jpg");
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.repeat.set(FLOOR_WIDTH / (TILE_SIZE * 2), FLOOR_HEIGHT / (TILE_SIZE * 2));

const floorGeometry = new THREE.PlaneGeometry(FLOOR_WIDTH, FLOOR_HEIGHT, 2, 2);
const floorMaterial = new THREE.MeshStandardMaterial({
  color: "#404040",
  metalness: 0,
  roughness: 0.9,
  map: texture,
});

const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.position.y = -FLOOR_HEIGHT / 2.2;
floor.rotation.x = -Math.PI * 0.25;
scene.add(floor);

//Night
const NIGTH_WIDTH = window.innerWidth;
const NIGTH_HEIGHT = window.innerHeight / 2.2;
const TILE_SIZE_NIGTH = 50;

const nightTexture = textureLoader.load("/textures/night.jpg");
nightTexture.wrapS = THREE.RepeatWrapping;
nightTexture.wrapT = THREE.RepeatWrapping;
nightTexture.repeat.set(NIGTH_WIDTH / TILE_SIZE_NIGTH, NIGTH_HEIGHT / (2.6 * TILE_SIZE_NIGTH));

const nightGeometry = new THREE.PlaneGeometry(NIGTH_WIDTH, NIGTH_HEIGHT / 2.7, 1, 1);

const nightMaterial = new THREE.MeshBasicMaterial({
  map: nightTexture,
  side: THREE.DoubleSide,
});

const nightImage = new THREE.Mesh(nightGeometry, nightMaterial);
nightImage.position.y = FLOOR_HEIGHT / 2.7 / 2;
nightImage.position.z = -50;
scene.add(nightImage);

//Moon
const moonTexture = textureLoader.load("/textures/moon.png");
const moonMaterial = new THREE.MeshBasicMaterial({ map: moonTexture });
const moonGeometry = new THREE.PlaneGeometry(10, 5);
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
moon.position.set(-30, 20, 0);
scene.add(moon);

// Models
let mixer = null;
let walk = null;
let trex = null;
let chest = null;
const gltfLoader = new GLTFLoader();

// TREX
const TREX_SCALE = 0.40;
const trexSpeed = 0.15;
let trexDirection = new THREE.Vector3();

gltfLoader.load(
  "/models/trex.glb",
  (gltf) => {
    console.log("trex loaded", gltf);
    trex = gltf.scene;
    scene.add(trex);
    trex.scale.set(TREX_SCALE, TREX_SCALE, TREX_SCALE);

    mixer = new THREE.AnimationMixer(trex);
    walk = mixer.clipAction(gltf.animations[5]);
    walk.clampWhenFinished = true;
  },
  (progress) => { },
  (error) => {
    console.log("error loading trex", error);
  }
);

// ThreeChest
const THREE_SCALE = 1.5;
const CHEST_SCALE = 1.3;
const chests = [];

const chestMessages = new Map();

function addTreeWithChest(x, z, message, score) {
  // Load the tree model
  gltfLoader.load(
    "/models/tree.glb",
    (gltf) => {
      console.log("tree loaded", gltf);
      const tree = gltf.scene;
      scene.add(tree);
      tree.scale.set(THREE_SCALE, THREE_SCALE, THREE_SCALE);
      tree.position.set(x, 0, z);

      // Load the chest model
      gltfLoader.load(
        "/models/chest.glb",
        (gltf) => {
          console.log("chest loaded", gltf);
          const chest = gltf.scene;
          scene.add(chest);
          chest.scale.set(CHEST_SCALE, CHEST_SCALE, CHEST_SCALE);
          chest.position.set(x, -0.5, z); // Set position of the chest below the tree

          chests.push(chest);
          chestMessages.set(chest, message, score);
        },
        (progress) => { },
        (error) => {
          console.log("error loading chest", error);
        }
      );
    },
    (progress) => { },
    (error) => {
      console.log("error loading tree", error);
    }
  );
}

// Add Messages
addTreeWithChest(-20, -3, `<p>Madame/Monsieur,</p>
     <p class="student-paragraph">Etudiant en Bachelor Développement Web à l'Ecole Supérieur du Digital (ESD), je souhaite candidater à votre offre de stage. Le monde du numérique m'a tout de suite plus c'est pourquoi j'ai passé mon bac avec les spécialités: Mathématiques et Numériques et Science de l'Informatique.</p>
     <br>
     <p>1/4</p>`, 1);
addTreeWithChest(70, -8, `<p class="student-paragraph">Passionné par les escapes games, la gamification, les nouvelles technologies, le numérique et leurs développements, cela m'a paru inné de postuler chez vous afin d'effectuer mon stage de deuxième année.Ce que je trouve intéressant serait de faire ce stage chez vous ainsi si tous se passe bien faire l'année prochaine mon alterance chez vous.Ainsi vous pourrez durant mon stage m'apprendre les ficelles du métier et j'apprendrai ce que vous voudrez pour pouvoir répondre au  mieux à vos attentes pour que durant l'alternance vous ayez un dévellopeur qui répondera clairement à vos attentes et qui ne vous décevra pas.</p>
<br>
<p>2/4</p>`, 2);
addTreeWithChest(-30, 20, `<p class="student-paragraph">Ce qui me plait dans votre entreprise, c'est votre qualité de travail, vos valeurs et l'ambiance de travail que vous dégagez par votre site et vos vidéos. 
      <p>J'ai pu réaliser plusieurs sites web et jeux vidéos lors de mon cursus, que je vous laisserais découvrir via votre box jeux vidéos ou bien sur mon git hub où vous pourrez voir aussi quelques projets en html, js et php.</p>
      <p>Je sais que je manque d'expérience professionnelle ou en studio et que mon bachelor ne vaaux pas un master. Mais mon énergie et mon dynamisme peuvent les compenser.Ainsi que mon envie de découvrir et d'approndir mon savoir sur d'autres langages.</p>
      <br>
      <p>3/4</p>`, 3);
addTreeWithChest(10, 25, `<p class="student-paragraph">Je serai ravi de vous rencontrer afin de vous présenter les projets que j'ai pu développer.</p> 
<p>Cordialement,</p>
<p>Sixte Morio de l'Isle</p> 
<p>Téléphone: O7.66.19.74.99</p>
<p>Mail: moriodelislesixte@gmail.com</p>
<br>
<p>4/4</p>`, 4);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffe0, 2);
scene.add(ambientLight);

const moonLight = new THREE.DirectionalLight(0xffffff, 1);
moonLight.position.copy(moon.position);
scene.add(moonLight);

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 20, 40);
camera.lookAt(scene.position);

// isNearChest
function isNearChest() {
  const DISTANCE_THRESHOLD = 4;
  for (const chest of chests) {
    const distance = trex.position.distanceTo(chest.position);
    console.log("Distance au coffre:", distance);
    if (distance < DISTANCE_THRESHOLD) {
      return chest;
    }
  }
  return null;
}

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Animation
const clock = new THREE.Clock();
let previousTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  if (mixer) {
    mixer.update(deltaTime);

    // Update T-Rex position based on direction
    if (trex && (trexDirection.x !== 0 || trexDirection.z !== 0)) {
      trex.position.addScaledVector(trexDirection, trexSpeed);

      // Update T-Rex orientation based on direction
      const angle = Math.atan2(trexDirection.x, trexDirection.z);
      trex.rotation.y = angle;
      walk.play();
    } else {
      mixer.stopAllAction();
    }
  }

  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};

tick();

// Keyboard event handling
window.addEventListener("keydown", (event) => {
  function closePopup() {
    document.getElementById("popup").style.display = "none";
    document.removeEventListener("click", closePopup);
  }
  switch (event.key) {
    case "z":
      closePopup();
      trexDirection.set(0, 0, -1); // Move forward
      break;
    case "s":
      closePopup();
      trexDirection.set(0, 0, 1); // Move backward
      break;
    case "q":
      closePopup();
      trexDirection.set(-1, 0, 0); // Move left
      break;
    case "d":
      closePopup();
      trexDirection.set(1, 0, 0); // Move right
      break;
    case "e":
      if (isNearChest()) {
        document.getElementById("popup").style.display = "flex";
        document.getElementById("popup-message").innerHTML = chestMessages.get(isNearChest());
        document.addEventListener("click", closePopup);
      }
      break;
  }
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "z":
    case "s":
    case "q":
    case "d":
      trexDirection.set(0, 0, 0);
      break;
  }
});

// Resize event handling
window.addEventListener("resize", () => {
  const wWidth = window.innerWidth;
  const wHeight = window.innerHeight;

  camera.aspect = wWidth / wHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(wWidth, wHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

