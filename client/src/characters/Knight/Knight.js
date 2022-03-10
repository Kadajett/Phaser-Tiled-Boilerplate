import KnightDeathBlob from "../../assets/Knight/Death/KnightDeath.json";
import KnightDeathImage from "../../assets/Knight/Death/KnightDeath.png";

import KnightWalkBlob from "../../assets/Knight/Walk/knightWalk.json";
import KnightWalkImage from "../../assets/Knight/Walk/knightWalk.png";

import { LAYER_DEPTHS, CHARACTER_STATES } from "../../Constants";
import eventsCenter from "../../utils/EventSystem";
import tryTransition from "../../utils/State";

function Knight(obj) {
  this.instance = {};
  this.timer = null;
  this.config = {
    currentState: CHARACTER_STATES.IDLE,
    alive: true,
    health: 100,
    strength: 10,
    updateInterval: 3000,
    updateIntervalAttack: 2000,
    speed: 50,
    travelDistance: 100,
    attackRange: 50,
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
    deathDrop: {
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
    },
  };

  this.interact = (player, config) => {
    console.log("interact");
    this.config.currentState = CHARACTER_STATES.ATTACK;
    this.config.currentTarget = player;
    this.config.currentTargetConfig = config;
    this.config.health -= player.strength;
    if (this.config.health <= 0) {
      this.config.alive = false;
      this.config.currentState = CHARACTER_STATES.DEAD;
      this.instance.isInteractable = false;
      return this.config.deathDrop;
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
    this.instance.body.setSize(
      this.instance.width * 0.5,
      this.instance.height * 0.5
    );
    this.instance.isInteractable = true;
    this.instance.setScale(3);
    this.instance.anims.timeScale = 2;
    this.instance.shadow.anims.timeScale = 2;

    this.instance.shadow.setScale(3);
    // this.moveInterval = setInterval(() => {
    //   maybeMoveTowardsDestination();
    // }, this.config.updateInterval);
    const self = this;
    // this.timer = this.randomIntervalUpdate(self);
    this.timer = this.stateLoop(self);
    console.log("Knight instance", this.instance);
  };

  this.addAttackOutline = () => {
    var postFxPlugin = PhaserContext.plugins.get("rexToonifyPipeline");

    this.removeAttackOutline();
    // var customPipeline = postFxPlugin.add(this.cameras.main);
    // GM.player.setPipeline(postFxPlugin);
    postFxPlugin.add(this.instance, {
      thickness: 3,
      outlineColor: 0xff8a50,
    });
    postFxPlugin.add(this.instance, {
      thickness: 5,
      outlineColor: 0xc41c00,
    });
  };

  this.removeAttackOutline = () => {
    var postFxPlugin = PhaserContext.plugins.get("rexToonifyPipeline");
    postFxPlugin.remove(this.instance);
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

    console.log("randomPositionAroundDestination", randomX, randomY);
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

  this.getDistanceBetweenPlayer = () => {
    const player = this.config.currentTarget;
    const distance = Phaser.Math.Distance.Between(
      this.instance.x,
      this.instance.y,
      player.x,
      player.y
    );
    return distance;
  };

  this.attackPlayer = () => {
    const player = this.config.currentTarget;
    const config = this.config.currentTargetConfig;
    if (player) {
      const distance = this.getDistanceBetweenPlayer();
      if (distance <= this.config.attackRange) {
        this.config.currentState = CHARACTER_STATES.ATTACK;
        player.health -= this.config.strength;
        eventsCenter.emit("chat-event", {
          message: `Knight: <class="error">- ${this.config.strength} </class> `,
        });
      }
    }
  };
  const maybeMoveTowardsDestination = () => {
    let xDistance = 0;
    let yDistance = 0;

    if (this.config.currentTarget) {
      xDistance = Phaser.Math.Distance.Between(
        this.instance.x,
        0,
        this.config.currentTarget.x,
        0
      );
      yDistance = Phaser.Math.Distance.Between(
        this.instance.y,
        0,
        this.config.currentTarget.y,
        0
      );
    } else {
      xDistance = Phaser.Math.Distance.Between(
        this.instance.x,
        0,
        this.config.destination.x,
        0
      );
      yDistance = Phaser.Math.Distance.Between(
        this.instance.y,
        0,
        this.config.destination.y,
        0
      );
    }
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
    }

    return false;
  };

  this.update = () => {
    // maybeMoveTowardsDestination();
    // this.instance.play({ key: "KnightLeftWalk", repeat: 100 });
    // this.instance.shadow.play({ key: "KnightLeftWalk", repeat: 100 });
    this.instance.shadow.x = this.instance.x + 16;
    this.instance.shadow.y = this.instance.y - 32;

    if (this.config.currentState === CHARACTER_STATES.ATTACK_WALK || this.config.currentState === CHARACTER_STATES.ATTACK) {
      maybeMoveTowardsDestination();
    }
  };

  this.idleWithDirection = (direction) => {
    this.instance.setVelocityX(0);
    this.instance.setVelocityY(0);
    switch (direction) {
      case "left":
        this.instance.play({ key: "KnightIdleLeft", repeat: 1 });
        this.instance.shadow.play({ key: "KnightIdleLeft", repeat: 1 });
        break;
      case "right":
        this.instance.play({ key: "KnightIdleRight", repeat: 1 });
        this.instance.shadow.play({ key: "KnightIdleRight", repeat: 1 });
        break;
      case "up":
        this.instance.play({ key: "KnightIdleUp", repeat: 1 });
        this.instance.shadow.play({ key: "KnightIdleUp", repeat: 1 });
        break;
      case "down":
      default:
        this.instance.play({ key: "KnightIdleDown", repeat: 1 });
        this.instance.shadow.play({ key: "KnightIdleDown", repeat: 1 });
        break;
    }
  };

  this.stateLoop = (self) => {
    if (!(self?.config?.alive && self?.config?.currentState === CHARACTER_STATES.DEAD)) {
      let intervalTime = self.config.updateInterval;
      console.log("currentState: ", self.config.currentState);
      // console.log(CHARACTER_STATE_TRANSITIONS[self.config.currentState]);
      // maybeMoveTowardsDestination(randomPositionAroundDestination());

      if (self.config.currentState === CHARACTER_STATES.IDLE) {
        if (Phaser.Math.Between(0, 1) > 0.5) {
          self.config.currentState = tryTransition(
            self.config.currentState,
            CHARACTER_STATES.WALK
          );
        }
      } else if (self.config.currentState === CHARACTER_STATES.WALK) {
        if (Phaser.Math.Between(0, 1) > 0.5) {
          self.config.currentState = tryTransition(
            self.config.currentState,
            CHARACTER_STATES.IDLE
          );
        }
      } else if (self.config.currentState === CHARACTER_STATES.ATTACK) {
        // do attack
        intervalTime = self.config.updateIntervalAttack;
        self.attackPlayer();
        self.config.currentState = tryTransition(
          self.config.currentState,
          CHARACTER_STATES.ATTACK_WALK
        );
      } else if (self.config.currentState === CHARACTER_STATES.ATTACK_WALK) {
        intervalTime = self.config.updateIntervalAttack;
        self.attackPlayer();
        self.config.currentState = tryTransition(
          self.config.currentState,
          CHARACTER_STATES.ATTACK
        );
      } else if (self.config.currentState === CHARACTER_STATES.DEAD) {
        self.removeAttackOutline();
        
      }

      self.actOnState(self, self.config.currentState);

      return setTimeout(() => {
        // self?.instance?.play?.({ key: "KnightWalkDown", repeat: -1 });
        self.timer = self.stateLoop(self);
      }, intervalTime);
    }
  };

  this.actOnState = (self, State) => {
    switch (State) {
      case CHARACTER_STATES.IDLE:
        self.idleWithDirection(self.config.previousDirection);
        break;
      case CHARACTER_STATES.WALK:
        self.config.destination = randomPositionAroundDestination();
        maybeMoveTowardsDestination();
        break;
      case CHARACTER_STATES.ATTACK:
        self.addAttackOutline();
        break;
      case CHARACTER_STATES.ATTACK_WALK:
        self.addAttackOutline();
        break;
      case CHARACTER_STATES.DEAD:
        // do nothing
        self.removeAttackOutline();
        self.delete();
        break;
      default:
        break;
    }
  };

  this.setMapPosition = (obj) => {
    if (obj?.properties) {
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
