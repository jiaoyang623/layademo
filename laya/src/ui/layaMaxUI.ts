/**This class is automatically generated by LayaAirIDE, please do not make any modifications. */
import View=Laya.View;
import Dialog=Laya.Dialog;
import Scene=Laya.Scene;
var REG: Function = Laya.ClassUtils.regClass;
export module ui.test {
    export class TestSceneUI extends Scene {
        public static  uiView:any ={"type":"Scene","props":{"width":640,"runtime":"script/GameUI.ts","positionVariance_0":100,"maxPartices":100,"height":1136},"compId":1,"child":[{"type":"Button","props":{"width":200,"top":200,"skin":"comp/button.png","labelSize":20,"label":"按钮","height":60,"centerX":0},"compId":20}],"loadList":["comp/button.png"],"loadList3D":[]};
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.createView(TestSceneUI.uiView);
        }
    }
    REG("ui.test.TestSceneUI",TestSceneUI);
}