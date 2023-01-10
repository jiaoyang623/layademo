import ThumbManager from "./ThumbManager";
import Scene3D = Laya.Scene3D;
import Camera = Laya.Camera;
import CameraController from "./CameraController";
import Sprite3D = Laya.Sprite3D;
import MeshSprite3D = Laya.MeshSprite3D;
import PBRMaterial = Laya.PBRMaterial;
import MulSampleRenderTexture = Laya.MulSampleRenderTexture;
import RenderTexture = Laya.RenderTexture;
import BaseTexture = Laya.BaseTexture;

/**
 * 本示例采用非脚本的方式实现，而使用继承页面基类，实现页面逻辑。在IDE里面设置场景的Runtime属性即可和场景进行关联
 * 相比脚本方式，继承式页面类，可以直接使用页面定义的属性（通过IDE内var属性定义），比如this.tipLbll，this.scoreLbl，具有代码提示效果
 * 建议：如果是页面级的逻辑，需要频繁访问页面内多个元素，使用继承式写法，如果是独立小模块，功能单一，建议用脚本方式实现，比如子弹脚本。
 */
export default class GameUI extends Laya.Scene {
    constructor() {
        super();

        //添加3D场景
        // var scene: Laya.Scene3D = Laya.stage.addChild(new Laya.Scene3D()) as Laya.Scene3D;
        //
        // //添加照相机
        // var camera: Laya.Camera = (scene.addChild(new Laya.Camera(0, 0.1, 100))) as Laya.Camera;
        // camera.transform.translate(new Laya.Vector3(0, 3, 3));
        // camera.transform.rotate(new Laya.Vector3(-30, 0, 0), true, false);
        //
        // //添加方向光
        // var directionLight: Laya.DirectionLight = scene.addChild(new Laya.DirectionLight()) as Laya.DirectionLight;
        // directionLight.color = new Laya.Vector3(0.6, 0.6, 0.6);
        // directionLight.transform.worldMatrix.setForward(new Laya.Vector3(1, -1, 0));
        //
        // //添加自定义模型
        // var box: Laya.MeshSprite3D = scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(1, 1, 1))) as Laya.MeshSprite3D;
        // box.transform.rotate(new Laya.Vector3(0, 45, 0), false, false);
        // var material: Laya.BlinnPhongMaterial = new Laya.BlinnPhongMaterial();
        // Laya.Texture2D.load("res/layabox.png", Laya.Handler.create(null, function (tex: Laya.Texture2D) {
        //     material.albedoTexture = tex;
        // }));
        // box.meshRenderer.material = material;

        this.showImage();
        this.showUnityScene()
    }


    private showImage(): void {
        const thumb = new ThumbManager();
        Laya.stage.addChild(thumb.getRoot());
        thumb.pos(100, 100);
        thumb.setOrigin(0.5, 0.5);
        thumb.move(-50, -50, 135);
    }

    private mScene: Scene3D;
    private mCamera: Camera;

    private showUnityScene(): void {
        Laya.Scene3D.load("3d/scene01/scene.ls", Laya.Handler.create(this, this.onSceneLoaded))
    }

    public onSceneLoaded(scene: Scene3D) {
        this.mScene = scene
        this.mCamera = scene.getChildByName("PlayerHolder") as Camera
        this.mCamera.addComponent(CameraController)
        Laya.stage.addChild(scene)
        this.loadRemoteImage()
        // this.checkTexture()
    }

    private imageUrl = "http://w2h.fun/u3d/games104_tree.jpg"

    private loadRemoteImage() {
        Laya.loader.load(this.imageUrl, Laya.Handler.create(this, () => {
            let texture = Laya.loader.getRes(this.imageUrl)
            let cube = this.mScene.getChildByName("Cube") as MeshSprite3D
            let material = cube.meshRenderer.material as PBRMaterial

            // material.albedoTexture = texture
        }))
    }

    private checkTexture() {
        let cube = this.mScene.getChildByName("Cube") as MeshSprite3D
        let material = cube.meshRenderer.material as PBRMaterial
        console.log("checkTexture " + (material.albedoTexture instanceof BaseTexture))
    }
}