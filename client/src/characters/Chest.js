// import ChestImage from "../assets/ChestSpriteSheet.png";
import OpenDownAnim from "../assets/Chest/Down/openAnim.png";
import OpenDownBlob from "../assets/Chest/Down/openAnim.json";
import { LAYER_DEPTHS } from "../Constants";

const ChestRes = (() => {
  let instance = {};

  const loadChestImages = () => {
    
    PhaserContext.load.aseprite("OpenAnimDown", OpenDownAnim, OpenDownBlob);
    console.log("loadChestImages", PhaserContext);
  };

  const loadChestAnimations = () => {
    PhaserContext.anims.createFromAseprite("OpenAnimDown");
    // let anim = PhaserContext.anims.createFromAseprite('OpenDownAnim', 'Chest_Down_open');

    instance = PhaserContext.add.sprite(-100, -100, "OpenAnimDown");
    instance.shadow = PhaserContext.add.sprite(-100, -100, "OpenAnimDown");
    instance.shadow._alpha = 0.5;
    console.log("instance shadow", instance.shadow);
    instance.shadow.setAlpha(0.3);
    instance.shadow.setOrigin(0.5, 0.5);
    instance.isInteractable = true;
    console.log("Loaded Chest Animations", instance);
    instance.play({ key: "Chest_Down_Closed_Idle", repeat: -1 });
      instance.shadow.play({ key: "Chest_Down_Closed_Idle", repeat: -1 });
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
    console.log("Init ChestObject", ChestObject);
    instance.interact = OpenChest;
    return instance;
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

  const update = (map) => {
    return {
      init: Chest,
      instance,
      interact: OpenChest,
      update,
      setMapPosition,
      loadAnimations: loadChestAnimations,
      loadImages: loadChestImages,
    };
  };

  const setMapPosition = (obj) => {
    if (obj) {
      instance.x = obj.x;
      instance.y = obj.y;
      instance.setDepth(LAYER_DEPTHS.OBJECTS);
      instance.shadow.x = obj.x + 8;
      instance.shadow.y = obj.y - 8;
      instance.shadow.setDepth(LAYER_DEPTHS.GROUND);
      instance.shadow.setTint(0x000000);
      config.previousDirection = obj.direction;
      
    }
  };

  return {
    init: Chest,
    update,
    setMapPosition,
    loadAnimations: loadChestAnimations,
    loadImages: loadChestImages,
  };
})();

export default ChestRes;
