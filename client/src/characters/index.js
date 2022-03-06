import Bunny from "./Bunny";
import Chest from "./Chest";
const CharactersConfigs = {
  Bunny: Bunny,
  Chest: Chest,
};

let npcArray = [];

const CharactersInitializer = (objectLayer) => {
  objectLayer.forEach((object) => {
    const Character = CharactersConfigs[object.name];
    if (Character) {
      Character(object);
    }
  });
  // Object.keys(CharactersConfigs).forEach((key) => {
  //     CharactersConfigs[key](objectLayer);
  // });
};

const loadNPCImages = (PhaserContext) => {
  Object.keys(CharactersConfigs).forEach((key) => {
    CharactersConfigs[key].loadImages(PhaserContext);
  });
};

const loadNPCAnimations = (PhaserContext) => {
  Object.keys(CharactersConfigs).forEach((key) => {
    CharactersConfigs[key].loadAnimations(PhaserContext);
  });
};

const updateCharacters = (PhaserContext, map) => {
  npcArray = [];
  Object.keys(CharactersConfigs).forEach((key) => {
    npcArray.push(CharactersConfigs[key].update(PhaserContext, map));
   
  });
  return npcArray;
};

export {
  loadNPCImages,
  loadNPCAnimations,
  CharactersInitializer,
  updateCharacters,
};
