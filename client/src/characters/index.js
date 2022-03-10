import Bunny from "./Bunny/Bunny";
import Chest from "./Chest";
import Tree from "./Tree/Tree";
import Knight from "./Knight/Knight";
import SkeletonOld from "./OldManSkelly/OldManSkelly";
const CharactersConfigs = {
  Bunny: Bunny,
  //   Chest: Chest,
  TreeTop: Tree,
  Knight,
  SkeletonOld,
};
const CharacterInstances = {};
let npcsInitialized = false;

let npcArray = [];

const CharactersInitializer = (objectLayer, PhaserContext, group) => {
  console.log("CharactersInitializer");
  objectLayer.forEach((object, index) => {
    console.log("Initializing Object: ", object.name, CharactersConfigs);
    if (!CharactersConfigs[object.name]) {
      return;
    }
    const Character = new CharactersConfigs[object.name](object);

    // Character.loadImages()
    // Character.loadAnimations()
    if (Character) {
      Character.object = object;
      console.log("Initialized Character: ", Character);
      CharacterInstances[object.name + index] = Character;
    } else {
      console.error("Character not found: ", object.name);
    }
  });

  // Object.keys(CharactersConfigs).forEach((key) => {
  //     CharactersConfigs[key](objectLayer);
  // });
};

const loadNPCImages = (PhaserContext, group) => {
  console.log("loadNPCImages");
  Object.keys(CharactersConfigs).forEach((key) => {
    const tempChar = new CharactersConfigs[key]();
    tempChar.loadImages(group);
  });
};

const loadNPCAnimations = (PhaserContext, group) => {
  console.log("loadNPCAnimations", CharacterInstances);

  Object.keys(CharactersConfigs).forEach((key) => {
    const tempChar = new CharactersConfigs[key]();
    tempChar.loadAnimations(group, PhaserContext);
    tempChar.delete?.();
  });
};

const updateCharacters = (PhaserContext, map, group) => {
  //   console.log("updateCharacters");
  npcArray = [];
  if (npcsInitialized) {
    Object.keys(CharacterInstances).forEach((key) => {
      // console.log("updateCharacters", key);
      // console.log("updateCharacters result", CharacterInstances[key].update(map, group));
      CharacterInstances[key].update(map, group);
      npcArray.push(CharacterInstances[key]);
    });
  }

  return npcArray;
};

const initNPCs = () => {
  console.log("initNPCs");
  if (!npcsInitialized) {
    Object.keys(CharacterInstances).forEach((key) => {
      CharacterInstances[key].loadImages();
      CharacterInstances[key].loadAnimations();
      // console.log("object", CharacterInstances[key].object);
      CharacterInstances[key].setMapPosition(CharacterInstances[key].object);
    });
    npcsInitialized = true;
  }
};

export {
  loadNPCImages,
  loadNPCAnimations,
  initNPCs,
  CharactersInitializer,
  updateCharacters,
};
