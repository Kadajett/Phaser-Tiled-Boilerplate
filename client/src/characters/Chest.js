// import ChestImage from "../assets/ChestSpriteSheet.png";
import OpenDownAnim from "../assets/Chest/Down/openAnim.png";
import OpenDownBlob from "../assets/Chest/Down/openAnim.json";

let instance = {};

const loadChestImages = (PhaserContext) => {
  PhaserContext.load.path = "../assets/Chest/Down/";
  PhaserContext.load.aseprite("OpenAnimDown", OpenDownAnim, OpenDownBlob);
};

const loadChestAnimations = (PhaserContext) => {
  PhaserContext.anims.createFromAseprite("OpenAnimDown");
  // let anim = PhaserContext.anims.createFromAseprite('OpenDownAnim', 'Chest_Down_open');
  instance = PhaserContext.add.sprite(-100, -100, "OpenDownAnim");

  instance.isInteractable = true;
  console.log("isInteractable", instance.isInteractable);
};

const config = {
  open: false,
  speed: 50,
  position: {
    x: 0,
    y: 0,
  },
  destination: {
    x: 0,
    y: 0,
  },
  previosState: "idle",
  previousDirection: "left",
};

const Chest = (ChestObject) => {
  console.log("ChestObject", ChestObject);
  if (ChestObject) {
    instance.x = ChestObject.x;
    instance.y = ChestObject.y;
    config.previousDirection = ChestObject.direction;
    instance.play({ key: "Chest_Down_Closed_Idle", repeat: -1 });
    instance.interact = OpenChest;
  }
};

const getRandomPointInMapAroundCharacter = (map) => {};

let timer = null;

const checkDistanceToDestination = (position, destination) => {};

const moveToRandomPointAtInterval = (map) => {};

const idleState = () => {};

const OpenChest = () => {
  instance.isInteractable = false;
  console.log("isInteractable", instance.isInteractable);
  instance.play({
    key: "Chest_Down_Open_Anim",
    repeat: 0,
    onComplete: () => {
      instance.play({ key: "Chest_Down_Open_Idle", repeat: -1 });
    },
  });
  config.open = true;

  return {
    type: "CollectItem",
    contents: [
      {
        type: "Gold",
        amount: 100,
      },
      {
        type: "Item",
        name: "Sword",
        description: "A sword",
        image: "Sword",
        stats: {
          damage: 10,
          health: 10,
          mana: 10,
        },
      },
    ],
  };
};

const update = (PhaserContext, map) => {
  return instance;
};
Chest.update = update;
Chest.loadImages = loadChestImages;
Chest.loadAnimations = loadChestAnimations;
Chest.interact = OpenChest;

export default Chest;
