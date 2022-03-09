import KnightDeathBlob from "../../assets/Knight/Death/KnightDeath.json";
import KnightDeathImage from "../../assets/Knight/Death/KnightDeath.png";

import KnightWalkBlob from "../../assets/Knight/Walk/knightWalk.json";
import KnightWalkImage from "../../assets/Knight/Walk/knightWalk.png";

import { LAYER_DEPTHS } from "../../Constants";

function Knight(obj) {
  this.instance = {};
  this.timer = null;
  this.config = {
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

  this.playDeathAnimation = (cb) => {
    console.log("playDeathAnimation");
    switch (this.config.previousDirection) {
      case "left":
        this.instance.play({ key: "KnightLeftDeath", repeat: 0 });
        break;
      case "right":
        this.instance.play({ key: "KnightRightDeath", repeat: 0 });
        break;
      case "up":
        this.instance.play({ key: "KnightUpDeath", repeat: 0 });
        break;
      case "down":
        this.instance.play({ key: "KnightDownDeath", repeat: 0 });
        break;
      default:
        this.instance.play({ key: "deathLeft", repeat: 0 });
        break;
    }
    setTimeout(
      (self) => {
        self.delete();
      },
      this.instance.anims.duration,
      this
    );
  };

  this.interact = (player) => {
    console.log("interact");
    this.config.health -= player.strength;
    if (this.config.health <= 0 && this.config.alive) {
      this.config.alive = false;
      this.instance.isInteractable = false;
      this.playDeathAnimation();
      // this.instance.play({ key: "death", repeat: -1 });
      // this.instance.shadow.play({ key: "death", repeat: -1 });
      return {
        target: "knight",
        type: "CollectItem",
        contents: [
          {
            type: "Item",
            name: "Basic Sword",
            description: "A basic sword.",
            image: "Coney",
            stats: {
              strengthModifier: 1,
            },
          },
        ],
      }
    }
    return {
      target: "knight",
      type: "Attack",
      data: {
        strength: this.config.strength,
        newHealth: this.config.health,
      },
    };
  };

  this.delete = () => {
    console.log("delete Knight");
    this.instance.destroy();
    this.instance.shadow.destroy();
    clearInterval(this.moveInterval);
    clearTimeout(this.timer);
  };

  this.loadImages = () => {
    console.log("loadKnightImages", KnightDeathImage);
    PhaserContext.load.aseprite(
      "KnightDeath",
      KnightDeathImage,
      KnightDeathBlob
    );
    PhaserContext.load.aseprite("KnightWalk", KnightWalkImage, KnightWalkBlob);
  };

  this.loadAnimations = () => {
    console.log("loadKnightAnimations", KnightDeathBlob);
    PhaserContext.anims.createFromAseprite("KnightDeath");
    PhaserContext.anims.createFromAseprite("KnightWalk");
    // instance = PhaserContext.physics.add.sprite(-100, -100, "Knight");
    this.instance = PhaserContext.physics.add.sprite(-100, -100, "KnightWalk");
    // this.instance.anims.add
    //   instance = group.create(0, 0, "Knight");
    this.instance.shadow = PhaserContext.physics.add.sprite(
      -100,
      -100,
      "Knight"
    );
    this.instance.shadow._alpha = 0.2;
    this.instance.body.setSize(this.instance.width * 0.5, this.instance.height * 0.5);
    this.instance.isInteractable = true;
    this.instance.setScale(3);
    this.instance.anims.timeScale = 2;
    this.instance.shadow.anims.timeScale = 2;

    this.instance.shadow.setScale(3);
    // this.moveInterval = setInterval(() => {
    //   maybeMoveTowardsDestination();
    // }, this.config.updateInterval);
    const self = this;
    this.timer = this.randomIntervalUpdate(self);
    console.log("Knight instance", this.instance);
  };

  this.randomIntervalUpdate = (self) => {
    if (!self?.instance?.anims?.duration || !self?.config?.alive) {
      randomPositionAroundDestination();
      return setTimeout(() => {
        self?.instance?.play?.({ key: "KnightWalkDown", repeat: -1 });
        self.timer = self.randomIntervalUpdate(self);
      }, 1000);
    }

    return setTimeout(() => {
      maybeMoveTowardsDestination.apply(self);
      self.timer = self.randomIntervalUpdate(self);
    }, self.instance.anims.duration);
  };

  const randomPositionAroundDestination = () => {
    const randomX = Phaser.Math.Between(
      this.config.bounds.Tx,
      this.config.bounds.Bx
    );
    const randomY = Phaser.Math.Between(
      this.config.bounds.Ty,
      this.config.bounds.By
    );
    return { x: randomX, y: randomY };
  };

  const setYVelocity = (direction) => {
    this.instance.setVelocityX(0);
    if (direction === "up") {
      this.instance.setVelocityY(-this.config.speed);
    } else if (direction === "down") {
      this.instance.setVelocityY(this.config.speed);
    }
  };

  const setXVelocity = (direction) => {
    this.instance.setVelocityY(0);
    if (direction === "left") {
      this.instance.setVelocityX(-this.config.speed);
    } else if (direction === "right") {
      this.instance.setVelocityX(this.config.speed);
    }
  };

  const maybeMoveTowardsDestination = () => {
    const xDistance = Phaser.Math.Distance.Between(
      this.instance.x,
      0,
      this.config.destination.x,
      0
    );
    const yDistance = Phaser.Math.Distance.Between(
      this.instance.y,
      0,
      this.config.destination.y,
      0
    );

    if (xDistance > this.config.speed) {
      if (this.instance.x > this.config.destination.x) {
        setXVelocity("left");

        this.instance.play({ key: "KnightWalkLeft", repeat: 1 });
        this.instance.shadow.play({ key: "KnightWalkLeft", repeat: 1 });
        this.config.previousDirection = "left";
      } else {
        setXVelocity("right");

        this.instance.play({ key: "KnightWalkRight", repeat: 1 });
        this.instance.shadow.play({ key: "KnightWalkRight", repeat: 1 });
        this.config.previousDirection = "right";
      }
    } else if (yDistance > this.config.speed) {
      if (this.instance.y > this.config.destination.y) {
        setYVelocity("up");

        this.instance.play({ key: "KnightWalkUp", repeat: 1 });
        this.instance.shadow.play({ key: "KnightWalkUp", repeat: 1 });
        this.config.previousDirection = "down";
      } else {
        setYVelocity("down");

        this.instance.play({ key: "KnightWalkDown", repeat: 1 });
        this.instance.shadow.play({ key: "KnightWalkDown", repeat: 1 });
        this.config.previousDirection = "up";
      }
    } else {
      this.config.destination = randomPositionAroundDestination();
      this.instance.setVelocityX(0);
      this.instance.setVelocityY(0);
      //   switch (this.config.previousDirection) {
      //     case "left":
      //       this.instance.play({ key: "KnightLeftIdle", repeat: 1 });
      //       this.instance.shadow.play({ key: "KnightLeftIdle", repeat: 1 });
      //       break;
      //     case "right":
      //       this.instance.play({ key: "KnightRightIdle", repeat: 1 });
      //       this.instance.shadow.play({ key: "KnightRightIdle", repeat: 1 });
      //       break;
      //     case "up":
      //       this.instance.play({ key: "KnightUpIdle", repeat: 1 });
      //       this.instance.shadow.play({ key: "KnightUpIdle", repeat: 1 });
      //       break;
      //     case "down":
      //     default:
      //       this.instance.play({ key: "KnightDownIdle", repeat: 1 });
      //       this.instance.shadow.play({ key: "KnightDownIdle", repeat: 1 });
      //       break;
      //   }
    }

    return false;
  };

  this.update = () => {
    // maybeMoveTowardsDestination();
    // this.instance.play({ key: "KnightLeftWalk", repeat: 100 });
    // this.instance.shadow.play({ key: "KnightLeftWalk", repeat: 100 });
    this.instance.shadow.x = this.instance.x + 16;
    this.instance.shadow.y = this.instance.y - 32;
  };

  this.setMapPosition = (obj) => {
    if(obj?.properties) {
      obj.properties.forEach((property) => {
        if (property.name === "health") {
          this.config.health = property.value;
        }
      });
    }
    if (obj?.x && this?.instance?.setScale) {
      this.config.bounds.Tx = obj.x;
      this.config.bounds.Bx = obj.x + obj.width;
      this.config.bounds.Ty = obj.y;
      this.config.bounds.By = obj.y + obj.height;
      this.config.destination = randomPositionAroundDestination();
      this.instance.x = obj.x;
      this.instance.y = obj.y;
      this.instance.isInteractable = true;
      this.instance.depth = LAYER_DEPTHS.OBJECTS;
      this.instance.shadow.setAlpha(0.3);
      this.instance.shadow.x = obj.x + 64;
      this.instance.shadow.y = obj.y - 64;
      this.instance.shadow.setDepth(LAYER_DEPTHS.OBJECTS_SHADOW);
      this.instance.shadow.setTint(0x000000);

      this.instance.interact = () => {
        this.instance.isInteractable = false;
        console.log("Interacted with Knight");
      };
    }
  };
}

export default Knight;
