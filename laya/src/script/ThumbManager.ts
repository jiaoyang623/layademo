import Sprite = Laya.Sprite;

export default class ThumbManager {
    private readonly page: Sprite;
    private readonly player: Sprite;
    private readonly pageWidth = 200;
    private readonly pageHeight = 200;
    private readonly playerWidth = 10;
    private readonly playerHeight = 10;
    private originX = 0;
    private originY = 0;

    constructor() {
        this.page = new Sprite();
        this.page.width = this.pageWidth;
        this.page.height = this.pageHeight;

        this.player = new Sprite();
        this.player.width = this.playerWidth;
        this.player.height = this.playerHeight;
        this.page.addChild(this.player)

        this.page.loadImage("res/thumb.png");
        this.player.loadImage("res/arrow.png");

    }

    public setOrigin(x: number, y: number): void {
        this.originX = x;
        this.originY = y;
    }

    public pos(x: number, y: number): void {
        this.page.pos(x, y);
    }

    public getRoot(): Sprite {
        return this.page;
    }

    public show(): void {
        this.page.visible = true;
        this.player.visible = true;
    }

    public hide(): void {
        this.page.visible = false;
        this.player.visible = false;
    }

    public move(x: number, y: number, rotation: number): void {
        this.player.pos(x + this.originX * this.page.width + this.page.x,
            y + this.originY * this.page.height + this.page.y);
        this.player.rotation = rotation;
    }
}