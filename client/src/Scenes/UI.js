import { uiWidgets } from "phaser-ui-tools";
import Phaser from "phaser";
import eventsCenter from "../utils/EventSystem";

const plainTextStyle = { font: "16px Courier New" };

const tags = {
  info: {
    color: "yellow",
  },
  error: {
    color: "red",
  },
  warning: {
    color: "orange",
    shadow: {
      color: "black",
      offsetX: 2,
      offsetY: 2,
      blur: 2,
    },
    underline: {
      // or 'u'
      color: "blue",
      thinkness: 3,
      offset: 2,
    },
  },
  success: {
    color: "green",
  },
};

export default class UIScene extends Phaser.Scene {
  cursors = null;
  eventArray = [];

  constructor() {
    super("UIScene");
    console.log("UI Scene: constructor");
  }
  init() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }
  preload() {
    this.load.image("background", "images/tut/background.png");
  }
  create() {
    console.log("UI Scene: create");
    // var buttonOne = new uiWidgets.TextButton(
    //   this,
    //   10,
    //   10,
    //   "SkeletonOldIdleRight",
    //   newGameCallback,
    //   this,
    //   10,
    //   10,
    //   12,
    //   11
    // ).setText("New Game", textStyle);

    // var column = new uiWidgets.Column(this, 200, 100);
    // column.addNode(buttonOne);
    eventsCenter.on(
      "chat-event",
      (evt) => {
        console.log("UI Scene: chat-event");
        this.eventArray.push(evt);
      },
      this
    );

    this.textContainer = this.add.rexTagText(10, 10, "", {
      tags: tags,
    });
  }

  selectButton(index) {
    // TODO
  }

  selectNextButton(change = 1) {
    // TODO
  }

  confirmSelection() {
    // TODO
  }

  update() {
    if (this.eventArray.length > 5) {
      this.eventArray.shift();
    }

    // this.textContainer.text = "";
    let newText = "";
    this.eventArray.forEach((evt) => {
      newText += `${evt.message} \n`;
    });
    // console.log(newText);
    this.textContainer.setText(newText, { tags });
  }
}
