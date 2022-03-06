import Phaser from "phaser";
import "./styles/base.css";
import MageCityImage from "./assets/magecitycut.png";
import GoblinImage from "./assets/goblin.png";
import {
  CharactersInitializer,
  loadNPCImages,
  loadNPCAnimations,
  updateCharacters,
} from "./characters";

import Beginnings from "./assets/maps/Beginning/map_beginning.json";
import { groupBy } from "./utils/array";

var config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  player_speed: 200,
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
  keys: {},
  map: null,
  scene: scene,
  interactable: [],
  gameState: {
    gold: 0,
    inventory: [],
  },
};

function loadCharacterImages(PhaserContext) {
  PhaserContext.load.spritesheet("goblin", GoblinImage, {
    frameWidth: 64,
    frameHeight: 64,
  });

  loadNPCImages(PhaserContext);
}

function loadMapImages(PhaserContext) {
  PhaserContext.load.image("city", MageCityImage);
}

const loadCharacterSprites = (PhaserContext) => {
  loadNPCAnimations(PhaserContext);
  GM.player = PhaserContext.physics.add.sprite(1100, 200, "goblin");
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

function sortedIndex(array, value) {
  var low = 0,
    high = array.length;

  while (low < high) {
    var mid = (low + high) >>> 1;
    if ((array[mid]?.distance || 0) < value) low = mid + 1;
    else high = mid;
  }
  return low;
}

const setupPlayer = (PhaserContext) => {
  loadCharacterSprites(PhaserContext);
  CharactersInitializer(GM.objectLayer.objects);
  GM.player.body.setSize(30, 30, 20, 20);
  window.player = GM.player;

  GM.player.body.width = 20;
  GM.player.body.height = 20;
  GM.player.body.offset.x = 10;
  GM.player.body.offset.y = 40;

  PhaserContext.cameras.main.startFollow(GM.player);
};

let graphics = null;

function create() {
  graphics = this.add.graphics();
  const layers = {};

  Beginnings.layers.forEach((layer) => {
    if (layer.type === "tilelayer") {
      layers[layer.name] = {
        data: groupBy(layer.data, Beginnings.width, Beginnings.height),
        properties: layer.properties,
      };
    }
    if (layer.type === "objectgroup") {
      GM.objectLayer = {
        objects: layer.objects,
        properties: layer.properties,
      };
    }
  });

  const map = this.make.tilemap({
    key: "cityMap",
    tileWidth: 32,
    tileHeight: 32,
    width: Beginnings.width,
    height: Beginnings.height,
  });
  GM.map = map;
  console.log("Map Width: ", Beginnings.width * 32);
  console.log("Map Height: ", Beginnings.height * 32);
  const tileset = map.addTilesetImage("city");

  const tileLayer = {};
  let CollisionLayer = {};

  for (const layer in layers) {
    const layerData = layers[layer].data;
    const layerProperties = {};
    if (layers[layer].properties?.length) {
      layers[layer].properties.forEach((property) => {
        layerProperties[property.name] = property.value;
      });
    }

    tileLayer[layer] = map.createBlankLayer(layer, tileset);
    tileLayer[layer].putTilesAt(layerData, 0, 0, true);
    if (layerProperties.Collidable) {
      tileLayer[layer].setCollisionByExclusion([-1]);
      CollisionLayer = tileLayer[layer];
      CollisionLayer._alpha = 0;
      // CollisionLayer.setOpacity(0);
    }
    if (layerProperties.PlayerLayer) {
      GM.cursors = this.input.keyboard.createCursorKeys();
      GM.keys.spacebar = this.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.SPACE
      );
      setupPlayer(this);
      this.physics.add.collider(GM.player, CollisionLayer);
      const playerLayerIndex = map.getLayerIndexByName("PlayerLayer");
      map.layers[playerLayerIndex].data.forEach((column) => {
        column.forEach((tile) => {
          if (tile.index !== -1) {
            GM.player.x = tile.pixelX;
            GM.player.y = tile.pixelY;
          }
        });
      });
    }
  }
  const interactText = this.add.text(350, 270, "Interact", {
    font: "16px Courier",
    fill: "#00ff00",
  });
  const goldText = this.add.text(350, window.innerHeight - 20, "Gold: 0", {
    font: "16px Courier",
    fill: "#00ff00",
  });
  goldText.setScrollFactor(0);
  GM.UI = {
    interactText,
    goldText,
  };
}

const handleInteraction = (interaction) => {
  switch (interaction.type) {
    case "CollectItem":
      interaction.contents.forEach((item) => {
        switch (item.type) {
          case "Gold":
            GM.gameState.gold += item.amount;
            break;
            case "Item":
              GM.gameState.inventory.push(item);
            break;
          default:
            break;
        }
      });
      break;
    default:
      break;
  }
};

let previousState = "idle";

function update() {
  if (GM.map) {
    GM.npcs = updateCharacters(this, GM.map);
    GM.interactable = [];
    GM.npcs.forEach((npc) => {
      if (!npc) {
        return;
      }
      const distance = Phaser.Math.Distance.Between(
        npc.x,
        npc.y,
        GM.player.x,
        GM.player.y
      );
      if (distance < 64) {
        if (GM.interactable.length === 0 && npc.isInteractable) {
          GM.interactable.push({ npc, distance });
        } else if (npc.isInteractable) {
          const index = sortedIndex(GM.interactable, distance);
          GM.interactable.splice(index, 0, { npc, distance });
        }
      } else {
        GM.UI.interactText.setText("");
      }
    });
    if (GM.interactable.length > 0) {
      const nearest = GM.interactable[0];
      if (nearest) {
        GM.UI.interactText.setText("Interact");
        GM.UI.interactText.x = nearest.npc.x;
        GM.UI.interactText.y = nearest.npc.y;
        if (GM.keys.spacebar.isDown) {
          const interaction = GM.interactable[0].npc.interact(this);
          if (interaction) {
            handleInteraction(interaction);
          }
        }
      } else {
        GM.UI.setText("");
      }
    }
  } else {
    console.log("no map");
  }
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
  const itemText = GM.gameState.inventory.map((item) => item.name).join(", ");
  GM.UI.goldText.setText(`Gold: ${GM.gameState.gold} Items: ${itemText}`);

  // GM.UI.goldText.y = window.innerHeight;

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
