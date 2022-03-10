import Phaser from "phaser";
import TagTextPlugin from "phaser3-rex-plugins/plugins/tagtext-plugin.js";
import "./styles/base.css";
import MageCityImage from "./assets/magecitycut.png";
import GoblinImage from "./assets/goblin.png";
import GoblinSheet from "./assets/goblinSheet.png";
import GoblinGlob from "./assets/goblinSheet.json";
import newMapImageBottom from "./assets/farm_bottom.png";
import newMapImageTop from "./assets/farm_top.png";
import { LAYER_DEPTHS } from "./Constants";
import UIScene from "./Scenes/UI";
import eventsCenter from "./utils/EventSystem";
// import ToonifyPipelinePlugin from "phaser3-rex-plugins/plugins/toonifypipeline-plugin.js";
import ToonifyPipelinePlugin from "./utils/Shaders/Test";
import {
  CharactersInitializer,
  initNPCs,
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
  interactionSpeed: 3000,
  canInteract: true,
  plugins: {
    global: [
      {
        key: "rexToonifyPipeline",
        plugin: ToonifyPipelinePlugin,
        start: true,
      },
      {
        key: "rexTagTextPlugin",
        plugin: TagTextPlugin,
        start: true,
      },
    ],
  },
  physics: {
    default: "arcade",
    // debug: true,
    arcade: {
      // debug: true,
      gravity: { y: 0, x: 0 },
    },
  },
  scene: [
    {
      preload: preload,
      create: create,
      update: update,
    },
    UIScene,
  ],
};

var game = new Phaser.Game(config);
const scene = new Phaser.Scene();

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
  const group = PhaserContext.add.group();
  GM.group = group;
  // PhaserContext.load.spritesheet("goblin", GoblinImage, {
  //   frameWidth: 64,
  //   frameHeight: 64,
  // });
  PhaserContext.load.aseprite("goblin", GoblinSheet, GoblinGlob);

  loadNPCImages(PhaserContext, group);
}

function loadMapImages(PhaserContext) {
  PhaserContext.load.image("city", MageCityImage);
  PhaserContext.load.image("farm_bottom", newMapImageBottom);
  // PhaserContext.load.image("farm_top", newMapImageTop);
}

const loadCharacterSprites = (PhaserContext) => {
  PhaserContext.anims.createFromAseprite("goblin");

  GM.player = PhaserContext.physics.add.sprite(1100, 200, "goblin");
  GM.player.strength = 15;
  GM.player.health = 100;
  GM.group.add(GM.player);
  // GM.player = GM.group.create(1100, 200, "goblin");
  GM.player.play("DownIdle");
  loadNPCAnimations(PhaserContext, GM.group);
  // GM.group.sort();
};

function preload() {
  window.PhaserContext = this;
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

  GM.player.body.setSize(GM.player.width * 0.5, GM.player.height * 0.5);
  window.player = GM.player;
  GM.player.setDepth(LAYER_DEPTHS.PLAYER);

  // GM.player.body.width = 20;
  // GM.player.body.height = 20;
  // GM.player.body.offset.x = 10;
  GM.player.body.offset.y = 40;

  PhaserContext.cameras.main.startFollow(GM.player);
};

let graphics = null;

function create() {
  graphics = this.add.graphics();

  // this.game.renderer.addPipeline("outline", new OutlinePipelineRed(this.game));
  const layers = {};

  Beginnings.layers.forEach((layer, index) => {
    if (layer.type === "tilelayer") {
      if (index === 0) {
        let mapBottomImage = this.add
          .image(0, 0, "farm_bottom")
          .setOrigin(0, 0);
        mapBottomImage.setScale(1);
      }
      layers[layer.name] = {
        data: groupBy(layer.data, Beginnings.width, Beginnings.height),
        properties: layer.properties,
        rest: layer,
      };
    }
    if (layer.type === "objectgroup") {
      GM.objectLayer = {
        objects: layer.objects,
        properties: layer.properties,
      };
    }
    // this.scene.pause();
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
    if (!layers[layer].visible) {
      let hideLayer = tileLayer[layer];
      hideLayer._alpha = 0;
    }
    if (layerProperties.Collidable) {
      tileLayer[layer].setCollisionByExclusion([-1]);
      CollisionLayer = tileLayer[layer];
      CollisionLayer._alpha = 0.5;
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
  interactText.setDepth(LAYER_DEPTHS.UI);
  const goldText = this.add.text(350, window.innerHeight - 20, "Gold: 0", {
    font: "16px Courier",
    fill: "#00ff00",
  });
  goldText.setDepth(LAYER_DEPTHS.UI);
  goldText.setScrollFactor(0);
  const healthText = this.add.text(
    350,
    window.innerHeight - 40,
    "Health: 100",
    {
      font: "16px Courier",
      fill: "#00ff00",
    }
  );
  healthText.setDepth(LAYER_DEPTHS.UI);
  healthText.setScrollFactor(0);
  GM.UI = {
    interactText,
    goldText,
    healthText,
  };

  CharactersInitializer(GM.objectLayer.objects, this, GM.group);
  initNPCs();
  this.scene.launch("UIScene", { someVal: 132 });
}

const handleInteraction = (interaction) => {
  switch (interaction.type) {
    case "CollectItem":
      interaction.contents.forEach((item) => {
        switch (item.type) {
          case "Gold":
            eventsCenter.emit("chat-event", {
              message: `<class="success">You found ${item.amount} gold!</class>`,
            });
            GM.gameState.gold += item.amount;
            break;
          case "Item":
            eventsCenter.emit("chat-event", {
              message: `<class="success">You found ${item.name}!</class>`,
            });
            GM.gameState.inventory.push(item);
            break;
          default:
            break;
        }
      });
      break;
    case "Attack":
      eventsCenter.emit("chat-event", {
        message: `<class="info">You attacked:</class> ${interaction.target}!`,
      });
      break;
    case "chat":
      eventsCenter.emit("chat-event", {
        message: `<class="info">${interaction.target}:</class> ${interaction.message}`,
        // message: `<class="info">h</class>ello`
      });
      break;
    default:
      break;
  }
};

let previousState = "idle";

function update() {
  if (GM.map) {
    GM.npcs = updateCharacters(this, GM.map, GM.group);
    GM.interactable = [];
    GM.npcs.forEach((obj) => {
      let npc = obj.instance;
      if (!npc) {
        return;
      }

      const distance = Phaser.Math.Distance.Between(
        npc.x,
        npc.y,
        GM.player.x,
        GM.player.y
      );
      if (distance < 100) {
        if (GM.interactable.length === 0 && npc.isInteractable) {
          GM.interactable.push({ npc: obj, distance });
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
      if (nearest && nearest.npc?.instance) {
        GM.UI.interactText.setText("Interact");
        GM.UI.interactText.x = nearest.npc?.instance?.x;
        GM.UI.interactText.y = nearest.npc?.instance?.y;
        if (GM.keys.spacebar.isDown && config.canInteract) {
          config.canInteract = false;
          const interaction = nearest?.npc?.interact?.(GM.player, config);
          if (interaction) {
            handleInteraction(interaction);
          }
          setTimeout(() => {
            config.canInteract = true;
          }, config.interactionSpeed);
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
      GM.player.play("LeftWalk", true);
      break;
    case "right":
      GM.player.setVelocityX(config.player_speed);
      GM.player.play("RightWalk", true);
      break;
    case "up":
      GM.player.play("UpWalk", true);
      GM.player.setVelocityY(-config.player_speed);
      break;
    case "down":
      GM.player.play("DownWalk", true);
      GM.player.setVelocityY(config.player_speed);
      break;
    default:
      switch (previousState) {
        case "left":
          GM.player.play("LeftIdle", true);
          break;
        case "right":
          GM.player.play("RightIdle", true);
          break;
        case "up":
          GM.player.play("UpIdle", true);
          break;
        case "down":
          GM.player.play("DownIdle", true);
          break;
        default:
          GM.player.play("DownIdle", true);
          break;
      }
      break;
  }
  const itemText = GM.gameState.inventory.map((item) => item.name).join(", ");
  GM.UI.goldText.setText(`Gold: ${GM.gameState.gold} Items: ${itemText}`);
  GM.UI.healthText.setText(`Health: ${GM.player.health}`);
  // GM.UI.goldText.y = window.innerHeight;

  //   if (GM.cursors.left.isDown && !GM.cursors.right.isDown) {
  //     GM.player.play('right', true);
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
