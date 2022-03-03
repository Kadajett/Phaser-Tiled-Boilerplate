import Phaser from "phaser";
import "./styles/base.css";
import MageCityImage from "./assets/magecitycut.png";
import GoblinImage from "./assets/goblin.png";
import fakeCity from "./FakeCity";
import { groupBy } from "./utils/array";

var config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  player_speed: 100,
  physics: {
    default: "arcade",

    arcade: {
      gravity: { y: 0, x: 0 },
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

var game = new Phaser.Game(config);
const scene = new Phaser.Scene();
scene.preload = preload;
scene.create = create;
scene.update = update;

const GM = {
  game: game,
  player: null,
  cursors: null,
  map: null,
  scene: scene,
};

function loadCharacterImages(PhaserContext) {
  PhaserContext.load.spritesheet("goblin", GoblinImage, {
    frameWidth: 64,
    frameHeight: 64,
  });
}

function loadMapImages(PhaserContext) {
  PhaserContext.load.image("city", MageCityImage);
}

const loadCharacterSprites = (PhaserContext) => {
  GM.player = PhaserContext.physics.add.sprite(0, 0, "goblin");
  PhaserContext.anims.create({
    key: "left",
    frames: PhaserContext.anims.generateFrameNumbers("goblin", {
      start: 33,
      end: 37,
    }),
    frameRate: 10,
    repeat: -1,
  });
  PhaserContext.anims.create({
    key: "right",
    frames: PhaserContext.anims.generateFrameNumbers("goblin", {
      start: 11,
      end: 15,
    }),
    frameRate: 10,
    repeat: -1,
  });
  PhaserContext.anims.create({
    key: "up",
    frames: PhaserContext.anims.generateFrameNumbers("goblin", {
      start: 22,
      end: 26,
    }),
    frameRate: 10,
    repeat: -1,
  });
  PhaserContext.anims.create({
    key: "down",
    frames: PhaserContext.anims.generateFrameNumbers("goblin", {
      start: 0,
      end: 4,
    }),
    frameRate: 10,
    repeat: -1,
  });
  //   idle states
  PhaserContext.anims.create({
    key: "idle_left",
    frames: PhaserContext.anims.generateFrameNumbers("goblin", {
      start: 38,
      end: 38,
    }),
    frameRate: 10,
    repeat: -1,
  });
  PhaserContext.anims.create({
    key: "idle_right",
    frames: PhaserContext.anims.generateFrameNumbers("goblin", {
      start: 16,
      end: 16,
    }),
    frameRate: 10,
    repeat: -1,
  });
  PhaserContext.anims.create({
    key: "idle_up",
    frames: PhaserContext.anims.generateFrameNumbers("goblin", {
      start: 27,
      end: 27,
    }),
    frameRate: 10,
    repeat: -1,
  });
  PhaserContext.anims.create({
    key: "idle_down",
    frames: PhaserContext.anims.generateFrameNumbers("goblin", {
      start: 6,
      end: 6,
    }),
    frameRate: 10,
    repeat: -1,
  });
};

function preload() {
  loadCharacterImages(this);
  loadMapImages(this);
}

const setupPlayer = (PhaserContext) => {
  loadCharacterSprites(PhaserContext);
  GM.player.setCollideWorldBounds(true);

  PhaserContext.cameras.main.startFollow(GM.player);
};

function create() {
  const grasstile = groupBy(
    fakeCity.layers[0].data,
    fakeCity.width,
    fakeCity.height
  );
  const stonetile = groupBy(
    fakeCity.layers[1].data,
    fakeCity.width,
    fakeCity.height
  );
  const foliagetile = groupBy(
    fakeCity.layers[2].data,
    fakeCity.width,
    fakeCity.height
  );

  const collisionTile = groupBy(
    fakeCity.layers[3].data,
    fakeCity.width,
    fakeCity.height
  );

  const map = this.make.tilemap({
    key: "cityMap",
    tileWidth: 32,
    tileHeight: 32,
    data: grasstile,
    width: fakeCity.width,
    height: fakeCity.height,
  });

  const tileset = map.addTilesetImage("city");

  const grasslayer = map.createBlankLayer("grass", tileset, 0, 0);
  grasslayer.putTilesAt(grasstile, 0, 0, true);

  const pathLayer = map.createBlankLayer("path", tileset);
  pathLayer.putTilesAt(stonetile, 0, 0, true);

  const collisionLayer = map.createBlankLayer("collision", tileset);
  collisionLayer.putTilesAt(collisionTile, 0, 0, true);

  collisionLayer.setCollisionByExclusion([-1]);

  GM.cursors = this.input.keyboard.createCursorKeys();
  //   GM.player = this.physics.add.sprite(0, 0, GM.player.sprite);

  setupPlayer(this);
  this.physics.add.collider(GM.player, collisionLayer);
  const foliageLayer = map.createBlankLayer("foliage", tileset);
  foliageLayer.putTilesAt(foliagetile, 0, 0, true);
  //   this.cameras.main.centerOn(GM.player.x, GM.player.y);
}

let previousState = "idle";

function update() {
  GM.player.setVelocity(0);
  let currentState = "idle";
  

  if (GM.cursors.left.isDown && !GM.cursors.right.isDown) {
    currentState = "left";
    previousState = "left";
  }
  if (GM.cursors.right.isDown && !GM.cursors.left.isDown) {
    currentState = "right";
    previousState = "right";
  }
  if (GM.cursors.up.isDown && !GM.cursors.down.isDown) {
    currentState = "up";
    previousState = "up";
  }
  if (GM.cursors.down.isDown && !GM.cursors.up.isDown) {
    currentState = "down";
    previousState = "down";
  }

  switch (currentState) {
    case "left":
      GM.player.setVelocityX(-config.player_speed);
      GM.player.anims.play("left", true);
      break;
    case "right":
      GM.player.setVelocityX(config.player_speed);
      GM.player.anims.play("right", true);
      break;
    case "up":
      GM.player.anims.play("up", true);
      GM.player.setVelocityY(-config.player_speed);
      break;
    case "down":
      GM.player.anims.play("down", true);
      GM.player.setVelocityY(config.player_speed);
      break;
    default:
      switch (previousState) {
        case "left":
          GM.player.anims.play("idle_left", true);
          break;
        case "right":
          GM.player.anims.play("idle_right", true);
          break;
        case "up":
          GM.player.anims.play("idle_up", true);
          break;
        case "down":
          GM.player.anims.play("idle_down", true);
          break;
        default:
          GM.player.anims.play("idle_down", true);
          break;
      }
      break;
  }

  //   if (GM.cursors.left.isDown && !GM.cursors.right.isDown) {
  //     GM.player.anims.play('right', true);
  //     GM.player.setVelocityX(-config.player_speed);
  //   }
  //   if (GM.cursors.right.isDown && !GM.cursors.left.isDown) {
  //     GM.player.setVelocityX(config.player_speed);
  //   }
  //   if (GM.cursors.up.isDown && !GM.cursors.down.isDown) {
  //     GM.player.setVelocityY(-config.player_speed);
  //   }
  //   if (GM.cursors.down.isDown && !GM.cursors.up.isDown) {
  //     GM.player.setVelocityY(config.player_speed);
  //   }
}
