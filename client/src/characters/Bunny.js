import BunnyImage from "../assets/bunnysheet.png";

let instance = null;

const loadBunnyImages = (PhaserContext) => {
  PhaserContext.load.spritesheet("bunny", BunnyImage, {
    frameWidth: 32,
    frameHeight: 32,
  });
};

const loadBunnyAnimations = (PhaserContext) => {
  instance = PhaserContext.physics.add.sprite(-100, -100, "bunny");
  instance.isInteractable = true;
  console.log("instance", instance);
  PhaserContext.anims.create({
    key: "bunny-left",
    frames: PhaserContext.anims.generateFrameNumbers("bunny", {
      start: 56,
      end: 63,
    }),
    frameRate: 10,
    repeat: -1,
  });
  PhaserContext.anims.create({
    key: "bunny-right",
    frames: PhaserContext.anims.generateFrameNumbers("bunny", {
      start: 40,
      end: 47,
    }),
    frameRate: 10,
    repeat: -1,
  });
  PhaserContext.anims.create({
    key: "bunny-up",
    frames: PhaserContext.anims.generateFrameNumbers("bunny", {
      start: 24,
      end: 31,
    }),
    frameRate: 10,
    repeat: -1,
  });
  PhaserContext.anims.create({
    key: "bunny-down",
    frames: PhaserContext.anims.generateFrameNumbers("bunny", {
      start: 8,
      end: 14,
    }),
    frameRate: 10,
    repeat: -1,
  });
  //   idle states
  PhaserContext.anims.create({
    key: "bunny-idle_left",
    frames: PhaserContext.anims.generateFrameNumbers("bunny", {
      start: 63,
      end: 64,
    }),
    frameRate: 10,
    repeat: -1,
  });
  PhaserContext.anims.create({
    key: "bunny-idle_right",
    frames: PhaserContext.anims.generateFrameNumbers("bunny", {
      start: 46,
      end: 47,
    }),
    frameRate: 10,
    repeat: -1,
  });
  PhaserContext.anims.create({
    key: "bunny-idle_up",
    frames: PhaserContext.anims.generateFrameNumbers("bunny", {
      start: 30,
      end: 31,
    }),
    frameRate: 10,
    repeat: -1,
  });
  PhaserContext.anims.create({
    key: "bunny-idle_down",
    frames: PhaserContext.anims.generateFrameNumbers("bunny", {
      start: 14,
      end: 15,
    }),
    frameRate: 10,
    repeat: -1,
  });
};

const config = {
  speed: 50,
  position: {
    x: 0,
    y: 0,
  },
  destination: {
    x: 0,
    y: 0,
  },
  previosState: 'idle',
  previousDirection: 'left',
};

const Bunny = (BunnyObject) => {
  console.log("BunnyObject", BunnyObject);
  if (BunnyObject) {
    instance.x = BunnyObject.x;
    instance.y = BunnyObject.y;
    instance.isInteractable = true;
    instance.interact = () => {
        instance.isInteractable = false;
        console.log("Bunny Interact");
    };
  }
};

const getRandomPointInMapAroundCharacter = (map) => {
  const x = Phaser.Math.Between(0, 100);
  const y = Phaser.Math.Between(0, 100);
  console.log("x", x);
    console.log("y", y);
  config.destination.x = x;
  config.destination.y = y;
};

let timer = null;

const checkDistanceToDestination = (position, destination) => {
    const distance = Phaser.Math.Distance.Between(position.x, position.y, destination.x, destination.y);
    console.log("distance", distance);
    if (distance <= config.speed + 32) {
        return true;
    }
    return false;
};

const moveToRandomPointAtInterval = (map) => {
  console.log("Bunny Move");
  setInterval(() => {
    if(config.previosState === 'idle') {
        config.previosState = 'moving';
    if(checkDistanceToDestination(instance, config.destination)) {
        getRandomPointInMapAroundCharacter(map);
    }

    const xDistance = config.destination.x - instance.x;
    const yDistance = config.destination.y - instance.y;
    const xDirection = xDistance > 0 ? 1 : -1;
    const yDirection = yDistance > 0 ? 1 : -1;
    if (Math.abs(xDistance) > Math.abs(yDistance)) {
        if(instance.x < config.destination.x) {
            instance.anims.play("bunny-right", true);
            config.previousDirection = 'right';
        } else {
            instance.anims.play("bunny-left", true);
            config.previousDirection = 'left';
        }
        instance.setVelocityX( config.speed * xDirection);
    } else {
        if(instance.y < config.destination.y) {
            instance.anims.play("bunny-down", true);
            config.previousDirection = 'down';
        } else {
            instance.anims.play("bunny-up", true);
            config.previousDirection = 'up';
        }
        instance.setVelocityY( config.speed * yDirection);
    }
    } else {
        config.previosState = 'idle';
        idleState();
    }

    // if (config.destination.x < instance.x) {
    //   instance.anims.play("bunny-left", true);
    //   instance.setVelocityX(-config.speed);
    // }
    // if (config.destination.x > instance.x) {
    //   instance.anims.play("bunny-right", true);
    //     instance.setVelocityX(config.speed);
    // }
    // if (config.destination.y < instance.y) {
    //   instance.anims.play("bunny-up", true);
    //     instance.setVelocityY(-config.speed);
    // }
    // if (config.destination.y > instance.y) {
    //   instance.anims.play("bunny-down", true);
    //     instance.setVelocityY(config.speed);
    // }
  }, 1000);
};

const idleState = () => {
    console.log("Bunny Idle");
    instance.setVelocityX(0);
    instance.setVelocityY(0);
    if (config.previousDirection === 'left') {
        instance.anims.play("bunny-idle_left", true);
    }
    if (config.previousDirection === 'right') {
        instance.anims.play("bunny-idle_right", true);
    }
    if (config.previousDirection === 'up') {
        instance.anims.play("bunny-idle_up", true);
    }
    if (config.previousDirection === 'down') {
        instance.anims.play("bunny-idle_down", true);
    }
};

const update = (PhaserContext, map) => {
  instance.map = map;
  if (!timer) {
    timer = true;
    getRandomPointInMapAroundCharacter(map);
    moveToRandomPointAtInterval(instance.map);
  }
  return instance;
};
Bunny.update = update;
Bunny.loadImages = loadBunnyImages;
Bunny.loadAnimations = loadBunnyAnimations;
Bunny.instance = instance;

export default Bunny;
