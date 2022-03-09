import SkeletonOldImage from "../../assets/OldManSkelly/SkeletonOld.png";
import SkeletonOldIdleBlob from "../../assets/OldManSkelly/SkeletonOld.json";

import { LAYER_DEPTHS } from "../../Constants";

function SkeletonOld(obj) {
  this.instance = {};
  this.timer = null;
  this.config = {
    conversationState: {
      current: 2,
      messages: [
        "Hello, I'm Skelly the old",
        "I'm a skeleton",
        'This isn`t a <class="warning">club</class>, its a cane. I`m a skeleton. Bluhhhh',
      ],
    },
    alive: true,
    health: 100,
    strength: 10,
    updateInterval: 1000,
    speed: 50,
    travelDistance: 100,
    bounds: {
      Tx: 0,
      Ty: 0,
      Bx: 0,
      By: 0,
    },
    position: {
      x: 0,
      y: 0,
    },
    originalDestination: {
      x: 256,
      y: 256,
    },
    destination: {
      x: 300,
      y: 300,
    },
    previousState: "idle",
    previousDirection: "left",
  };

  this.interact = (player) => {
    let message =
      this.config.conversationState.messages[
        this.config.conversationState.current
      ];
    this.config.conversationState.current++;
    if (
      this.config.conversationState.current >=
      this.config.conversationState.messages.length
    ) {
      this.config.conversationState.current = 0;
    }

    return {
      type: "chat",
      target: "Old Man Skelly",
      message,
    };
  };

  this.delete = () => {
    console.log("delete SkeletonOld");
    this.instance.destroy();
    this.instance.shadow.destroy();
    clearInterval(this.moveInterval);
    clearTimeout(this.timer);
  };

  this.loadImages = () => {
    console.log("load Skeleton Old Images", SkeletonOldImage);
    PhaserContext.load.aseprite(
      "SkeletonOld",
      SkeletonOldImage,
      SkeletonOldIdleBlob
    );
    PhaserContext.load.aseprite(
      "SkeletonOld",
      SkeletonOldImage,
      SkeletonOldIdleBlob
    );
  };

  this.loadAnimations = () => {
    console.log("loadKnightAnimations", SkeletonOldIdleBlob);
    PhaserContext.anims.createFromAseprite("SkeletonOld");
    // instance = PhaserContext.physics.add.sprite(-100, -100, "Knight");
    this.instance = PhaserContext.physics.add.sprite(-100, -100, "SkeletonOld");
    // this.instance.anims.add
    //   instance = group.create(0, 0, "Knight");
    this.instance.shadow = PhaserContext.physics.add.sprite(
      -100,
      -100,
      "SkeletonOld"
    );
    this.instance.shadow._alpha = 0.2;
    this.instance.setScale(1.4);
    this.instance.body.setSize(
      this.instance.width * 0.5,
      this.instance.height * 0.5
    );
    this.instance.isInteractable = true;
    this.instance.anims.timeScale = 2;
    this.instance.shadow.anims.timeScale = 2;
    this.instance.shadow.setScale(1.4);

    // this.moveInterval = setInterval(() => {
    //   maybeMoveTowardsDestination();
    // }, this.config.updateInterval);
    const self = this;
    this.timer = this.randomIntervalUpdate(self);
  };

  const chooseRandomDirection = () => {
    const directions = ["Left", "Right", "Down"];
    const randomIndex = Math.floor(Math.random() * directions.length);
    return directions[randomIndex];
  };

  this.randomIntervalUpdate = (self) => {
    if (!self?.instance?.anims?.duration) {
      return setTimeout(() => {
        // self?.instance?.play?.({ key: "KnightWalkDown", repeat: -1 });
        const randDirection = chooseRandomDirection();
        console.log("randomIntervalUpdate", randDirection);
        self?.instance?.play?.({
          key: "SkeletonOldIdle" + randDirection,
          repeat: -1,
        });
        self?.instance?.shadow?.play?.({
          key: "SkeletonOldIdle" + randDirection,
          repeat: -1,
        });
        self.timer = self.randomIntervalUpdate(self);
      }, 1000);
    }
    console.log("Animation Duration", self.instance.anims.duration);
    return setTimeout(() => {
      const randDirection = chooseRandomDirection();
      console.log("randomIntervalUpdate", randDirection);
      self?.instance?.play?.({
        key: "SkeletonOldIdle" + randDirection,
        repeat: -1,
      });
      self?.instance?.shadow?.play?.({
        key: "SkeletonOldIdle" + randDirection,
        repeat: -1,
      });
      self.timer = self.randomIntervalUpdate(self);
    }, self.instance.anims.duration * 2);
  };

  this.update = () => {
    // maybeMoveTowardsDestination();
    // this.instance.play({ key: "KnightLeftWalk", repeat: 100 });
    // this.instance.shadow.play({ key: "KnightLeftWalk", repeat: 100 });
    // this.instance.shadow.x = this.instance.x + 16;
    // this.instance.shadow.y = this.instance.y - 32;
    // this.instance.play({
    //     key: "SkeletonOldIdleLeft",
    //     repeat: -1
    // });
    // this.instance.shadow.play({
    //     key: "SkeletonOldIdleLeft",
    //     repeat: -1
    // });
  };

  this.setMapPosition = (obj) => {
    if (obj?.x && this?.instance?.setScale) {
      //   this.config.bounds.Tx = obj.x;
      //   this.config.bounds.Bx = obj.x + obj.width;
      //   this.config.bounds.Ty = obj.y;
      //   this.config.bounds.By = obj.y + obj.height;
      //   this.config.destination = randomPositionAroundDestination();
      this.instance.x = obj.x;
      this.instance.y = obj.y;
      this.instance.isInteractable = true;
      this.instance.depth = LAYER_DEPTHS.OBJECTS;
      this.instance.play({
        key: "SkeletonOldIdleRight",
        repeat: -1,
      });
      this.instance.shadow.play({
        key: "SkeletonOldIdleRight",
        repeat: -1,
      });
      this.instance.shadow.setAlpha(0.3);
      this.instance.shadow.x = obj.x + 16;
      this.instance.shadow.y = obj.y - 16;
      this.instance.shadow.setDepth(LAYER_DEPTHS.OBJECTS_SHADOW);
      this.instance.shadow.setTint(0x000000);
    }
  };
}

export default SkeletonOld;
