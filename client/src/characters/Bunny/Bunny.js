import BunnyImage from "../../assets/Bunny/Bunny.png";
import BunnyBlob from "../../assets/Bunny/Bunny.json";
import { LAYER_DEPTHS } from "../../Constants";

function Bunny(obj) {
  this.instance = {};
  this.timer = null;
  this.config = {
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
    previosState: "idle",
    previousDirection: "left",
  };

  this.interact = () => {
    console.log("interact");
    this.instance.isInteractable = false;
    this.delete();

    return {
      type: "CollectItem",
      contents: [
        
        {
          type: "Item",
          name: "Coney Meat",
          description: "A tender coney, or rabbit.",
          image: "Coney",
          stats: {
            health: 10,
          },
        },
      ],
    };
  };

  this.delete = () => {
    console.log("delete bunny");
    this.instance.destroy();
    this.instance.shadow.destroy();
    clearInterval(this.moveInterval);
  };

  this.loadImages = () => {
    console.log("loadBunnyImages", BunnyImage);
    PhaserContext.load.aseprite("Bunny", BunnyImage, BunnyBlob);
  };

  this.loadAnimations = () => {
    console.log("loadBunnyAnimations", BunnyBlob);
    PhaserContext.anims.createFromAseprite("Bunny");
    // instance = PhaserContext.physics.add.sprite(-100, -100, "Bunny");
    this.instance = PhaserContext.physics.add.sprite(-100, -100, "Bunny");
    //   instance = group.create(0, 0, "Bunny");
    this.instance.shadow = PhaserContext.physics.add.sprite(
      -100,
      -100,
      "Bunny"
    );
    this.instance.shadow._alpha = 0.2;
    this.instance.isInteractable = true;
    this.instance.play({ key: "BunnyLeftWalk", repeat: -1 });

    this.moveInterval = setInterval(() => {
      maybeMoveTowardsDestination();
    }, this.config.updateInterval);

    console.log("Bunny instance", this.instance);
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

        this.instance.play("BunnyLeftWalk");
        this.instance.shadow.play({ key: "BunnyLeftWalk", repeat: -1 });
        this.config.previousDirection = "left";
      } else {
        setXVelocity("right");

        this.instance.play({ key: "BunnyRightWalk", repeat: -1 });
        this.instance.shadow.play({ key: "BunnyRightWalk", repeat: -1 });
        this.config.previousDirection = "right";
      }
    } else if (yDistance > this.config.speed) {
      if (this.instance.y > this.config.destination.y) {
        setYVelocity("up");

        this.instance.play("BunnyUpWalk");
        this.instance.shadow.play({ key: "BunnyUpWalk", repeat: -1 });
        this.config.previousDirection = "down";
      } else {
        setYVelocity("down");

        this.instance.play("BunnyDownWalk");
        this.instance.shadow.play({ key: "BunnyDownWalk", repeat: -1 });
        this.config.previousDirection = "up";
      }
    } else {
      this.config.destination = randomPositionAroundDestination();
      this.instance.setVelocityX(0);
      this.instance.setVelocityY(0);
      switch (this.config.previousDirection) {
        case "left":
          this.instance.play({ key: "BunnyLeftIdle", repeat: -1 });
          this.instance.shadow.play({ key: "BunnyLeftIdle", repeat: -1 });
          break;
        case "right":
          this.instance.play({ key: "BunnyRightIdle", repeat: -1 });
          this.instance.shadow.play({ key: "BunnyRightIdle", repeat: -1 });
          break;
        case "up":
          this.instance.play({ key: "BunnyUpIdle", repeat: -1 });
          this.instance.shadow.play({ key: "BunnyUpIdle", repeat: -1 });
          break;
        case "down":
        default:
          this.instance.play({ key: "BunnyDownIdle", repeat: -1 });
          this.instance.shadow.play({ key: "BunnyDownIdle", repeat: -1 });
          break;
      }
    }

    return false;
  };

  this.update = () => {
    // maybeMoveTowardsDestination();
    // this.instance.play({ key: "BunnyLeftWalk", repeat: 100 });
    // this.instance.shadow.play({ key: "BunnyLeftWalk", repeat: 100 });
    this.instance.shadow.x = this.instance.x;
    this.instance.shadow.y = this.instance.y;
  };

  this.setMapPosition = (obj) => {
    if (obj?.x && this?.instance?.setScale) {
      this.config.bounds.Tx = obj.x;
      this.config.bounds.Bx = obj.x + obj.width;
      this.config.bounds.Ty = obj.y;
      this.config.bounds.By = obj.y + obj.height;

      this.instance.x = obj.x;
      this.instance.y = obj.y;
      this.instance.isInteractable = true;
      this.instance.depth = LAYER_DEPTHS.TOP;
      this.instance.shadow.setAlpha(0.3);
      this.instance.shadow.x = obj.x + 8;
      this.instance.shadow.y = obj.y - 8;
      this.instance.shadow.setDepth(LAYER_DEPTHS.TOP_SHADOW);
      this.instance.shadow.setTint(0x000000);

      this.instance.interact = () => {
        this.instance.isInteractable = false;
        console.log("Interacted with Bunny");
      };
    }
  };
}

export default Bunny;
