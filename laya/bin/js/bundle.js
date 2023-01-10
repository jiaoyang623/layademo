(function () {
    'use strict';

    var Sprite = Laya.Sprite;
    class ThumbManager {
        constructor() {
            this.pageWidth = 200;
            this.pageHeight = 200;
            this.playerWidth = 10;
            this.playerHeight = 10;
            this.originX = 0;
            this.originY = 0;
            this.page = new Sprite();
            this.page.width = this.pageWidth;
            this.page.height = this.pageHeight;
            this.player = new Sprite();
            this.player.width = this.playerWidth;
            this.player.height = this.playerHeight;
            this.page.addChild(this.player);
            this.page.loadImage("res/thumb.png");
            this.player.loadImage("res/arrow.png");
        }
        setOrigin(x, y) {
            this.originX = x;
            this.originY = y;
        }
        pos(x, y) {
            this.page.pos(x, y);
        }
        getRoot() {
            return this.page;
        }
        show() {
            this.page.visible = true;
            this.player.visible = true;
        }
        hide() {
            this.page.visible = false;
            this.player.visible = false;
        }
        move(x, y, rotation) {
            this.player.pos(x + this.originX * this.page.width + this.page.x, y + this.originY * this.page.height + this.page.y);
            this.player.rotation = rotation;
        }
    }

    var Vector3 = Laya.Vector3;
    class CameraController extends Laya.Script {
        constructor() {
            super();
            this.direction = null;
            this.transform = null;
            this.moveSpeed = 1;
        }
        onStart() {
            super.onStart();
            this.transform = this.owner.transform;
        }
        onUpdate() {
            super.onUpdate();
            if (this.direction) {
                let out = new Vector3();
                Vector3.scale(this.direction, this.moveSpeed * Laya.timer.delta * 0.001, out);
                Vector3.add(this.transform.position, out, out);
                this.transform.position = out;
            }
        }
        onKeyDown(e) {
            super.onKeyDown(e);
            switch (e.keyCode) {
                case 87: {
                    let f = new Vector3();
                    this.transform.getForward(f);
                    this.direction = new Vector3(-f.x, -f.y, -f.z);
                    break;
                }
                case 83: {
                    let f = new Vector3();
                    this.transform.getForward(f);
                    this.direction = f;
                    break;
                }
                case 65: {
                    let r = new Vector3();
                    this.transform.getRight(r);
                    this.direction = r;
                    break;
                }
                case 68: {
                    let r = new Vector3();
                    this.transform.getRight(r);
                    this.direction = new Vector3(-r.x, -r.y, -r.z);
                    break;
                }
                case 81: {
                    let u = new Vector3();
                    this.transform.getUp(u);
                    this.direction = new Vector3(-u.x, -u.y, -u.z);
                    break;
                }
                case 69: {
                    let u = new Vector3();
                    this.transform.getUp(u);
                    this.direction = new Vector3(u.x, u.y, u.z);
                    break;
                }
            }
        }
        onKeyUp(e) {
            super.onKeyUp(e);
            this.direction = null;
        }
    }

    var BaseTexture = Laya.BaseTexture;
    class GameUI extends Laya.Scene {
        constructor() {
            super();
            this.imageUrl = "http://w2h.fun/u3d/games104_tree.jpg";
            this.showImage();
            this.showUnityScene();
        }
        showImage() {
            const thumb = new ThumbManager();
            Laya.stage.addChild(thumb.getRoot());
            thumb.pos(100, 100);
            thumb.setOrigin(0.5, 0.5);
            thumb.move(-50, -50, 135);
        }
        showUnityScene() {
            Laya.Scene3D.load("3d/scene01/scene.ls", Laya.Handler.create(this, this.onSceneLoaded));
        }
        onSceneLoaded(scene) {
            this.mScene = scene;
            this.mCamera = scene.getChildByName("PlayerHolder");
            this.mCamera.addComponent(CameraController);
            Laya.stage.addChild(scene);
            this.loadRemoteImage();
        }
        loadRemoteImage() {
            Laya.loader.load(this.imageUrl, Laya.Handler.create(this, () => {
                let texture = Laya.loader.getRes(this.imageUrl);
                let cube = this.mScene.getChildByName("Cube");
                let material = cube.meshRenderer.material;
            }));
        }
        checkTexture() {
            let cube = this.mScene.getChildByName("Cube");
            let material = cube.meshRenderer.material;
            console.log("checkTexture " + (material.albedoTexture instanceof BaseTexture));
        }
    }

    class GameConfig {
        constructor() { }
        static init() {
            var reg = Laya.ClassUtils.regClass;
            reg("script/GameUI.ts", GameUI);
        }
    }
    GameConfig.width = 640;
    GameConfig.height = 1136;
    GameConfig.scaleMode = "fixedwidth";
    GameConfig.screenMode = "none";
    GameConfig.alignV = "top";
    GameConfig.alignH = "left";
    GameConfig.startScene = "test/TestScene.scene";
    GameConfig.sceneRoot = "";
    GameConfig.debug = false;
    GameConfig.stat = false;
    GameConfig.physicsDebug = false;
    GameConfig.exportSceneToJson = true;
    GameConfig.init();

    class Main {
        constructor() {
            if (window["Laya3D"])
                Laya3D.init(GameConfig.width, GameConfig.height);
            else
                Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
            Laya["Physics"] && Laya["Physics"].enable();
            Laya["DebugPanel"] && Laya["DebugPanel"].enable();
            Laya.stage.scaleMode = GameConfig.scaleMode;
            Laya.stage.screenMode = GameConfig.screenMode;
            Laya.stage.alignV = GameConfig.alignV;
            Laya.stage.alignH = GameConfig.alignH;
            Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;
            if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true")
                Laya.enableDebugPanel();
            if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"])
                Laya["PhysicsDebugDraw"].enable();
            if (GameConfig.stat)
                Laya.Stat.show();
            Laya.alertGlobalError(true);
            Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
        }
        onVersionLoaded() {
            Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
        }
        onConfigLoaded() {
            GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
        }
    }
    new Main();

}());
