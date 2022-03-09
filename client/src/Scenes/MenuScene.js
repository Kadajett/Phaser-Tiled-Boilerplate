import Phaser from "phaser";
export default class MenuScene extends Phaser.Scene {
    cursors = null;

    constructor() {
        super({
            key: "MenuScene"
        });
    }
    init()
	{
		this.cursors = this.input.keyboard.createCursorKeys()
	}
    preload() {
        this.load.image("menu-background", "assets/menu-background.png");
        this.load.image("menu-logo", "assets/menu-logo.png");
        this.load.image("menu-play-button", "assets/menu-play-button.png");
        this.load.image("menu-play-button-hover", "assets/menu-play-button-hover.png");
    }
    create() {
        this.add.image(0, 0, "menu-background");
        this.add.image(0, 0, "menu-logo");
        this.add.image(0, 0, "menu-play-button");
        this.add.image(0, 0, "menu-play-button-hover");
    }

    create()
    {
		// TODO
	}

	selectButton(index)
	{
		// TODO
	}

	selectNextButton(change = 1)
	{
		// TODO
	}

	confirmSelection()
	{
		// TODO
	}
	
	update()
	{
		const upJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors?.up)
		const downJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors?.down)
		const spaceJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors?.space)
		
		if (upJustPressed)
		{
			this.selectNextButton(-1)
		}
		else if (downJustPressed)
		{
			this.selectNextButton(1)
		}
		else if (spaceJustPressed)
		{
			this.confirmSelection()
		}
	}
}