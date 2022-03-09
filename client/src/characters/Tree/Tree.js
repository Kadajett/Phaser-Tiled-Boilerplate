import TreeImage from "../../assets/Tree/treeSheet.png";
import TreeBlob from "../../assets/Tree/treesheet.json";
import { LAYER_DEPTHS } from "../../Constants";

function Tree(obj) {
  this.instance = {};
  this.timer = null;
  this.config = {
    speed: 50,
    position: {
      x: 0,
      y: 0,
    },
    originalDestination: {
      x: 256,
      y: 256,
    },
    destination: {
      x: 256,
      y: 256,
    },
    previosState: "idle",
    previousDirection: "left",
  };

  this.delete = () => {
    console.log("delete bunny");
    this.instance.destroy();
    this.instance.shadow.destroy();
  };

  this.loadImages = () => {
    console.log("loadTreeImages", TreeImage);
    PhaserContext.load.aseprite("Tree", TreeImage, TreeBlob);
  };

  this.loadAnimations = () => {
    console.log("loadTreeAnimations");
    console.log(
      "create anim: ",
      PhaserContext.anims.createFromAseprite("Tree")
    );
    // instance = PhaserContext.physics.add.sprite(-100, -100, "Tree");
    this.instance = PhaserContext.add.sprite(-100, -100, "Tree");
    //   instance = group.create(0, 0, "Tree");
    this.instance.shadow = PhaserContext.add.sprite(-100, -100, "Tree");
    this.instance.shadow._alpha = 0.2;
    this.instance.isInteractable = false;
    console.log("tree instance", this.instance);
    this.instance.play({ key: "breeze", repeat: -1 });
    this.instance.shadow.play({ key: "breeze", repeat: -1 });
  };

  this.update = () => {};

  this.setMapPosition = (obj) => {
    const randomScale = Phaser.Math.Between(3, 3.5);
    if (obj?.x && this?.instance?.setScale) {
      this.instance.x = obj.x;
      this.instance.y = obj.y;
      this.instance.setScale(randomScale);
      this.instance.isInteractable = false;
      this.instance.depth = LAYER_DEPTHS.TOP;
      this.instance.shadow.setAlpha(0.3);
      this.instance.shadow.x = obj.x + 32;
      this.instance.shadow.y = obj.y - 16;
      this.instance.shadow.setScale(randomScale + 0.5);
      this.instance.shadow.setDepth(LAYER_DEPTHS.TOP_SHADOW);
      this.instance.shadow.setTint(0x000000);

      this.instance.interact = () => {
        this.instance.isInteractable = false;
        console.log("Interacted with tree");
      };
    }
  };
}

export default Tree;