import Vector3 = Laya.Vector3;
import Sprite3D = Laya.Sprite3D;
import Transform3D = Laya.Transform3D;

export default class CameraController extends Laya.Script {
    private direction: Vector3 = null
    private transform: Transform3D = null;
    public moveSpeed: number = 1;

    constructor() {
        super();
    }

    onStart() {
        super.onStart();
        this.transform = (this.owner as Sprite3D).transform
    }

    onUpdate() {
        super.onUpdate();

        if (this.direction) {
            let out = new Vector3();
            Vector3.scale(this.direction, this.moveSpeed * Laya.timer.delta * 0.001, out)
            Vector3.add(this.transform.position, out, out)
            this.transform.position = out;
        }
    }

    onKeyDown(e: Laya.Event) {
        super.onKeyDown(e);
        switch (e.keyCode) {
            case 87: { //w
                let f = new Vector3()
                this.transform.getForward(f)
                this.direction = new Vector3(-f.x, -f.y, -f.z)
                break;
            }
            case 83: { //s
                let f = new Vector3()
                this.transform.getForward(f)
                this.direction = f
                break;
            }
            case 65: { //a
                let r = new Vector3()
                this.transform.getRight(r)
                this.direction = r
                break;
            }
            case 68: { //d
                let r = new Vector3()
                this.transform.getRight(r)
                this.direction = new Vector3(-r.x, -r.y, -r.z)
                break;
            }

            case 81: { //q down
                let u = new Vector3()
                this.transform.getUp(u)
                this.direction = new Vector3(-u.x, -u.y, -u.z)
                break;
            }
            case 69: { //e up
                let u = new Vector3()
                this.transform.getUp(u)
                this.direction = new Vector3(u.x, u.y, u.z)
                break;
            }
        }
    }

    onKeyUp(e: Laya.Event) {
        super.onKeyUp(e);
        this.direction = null
    }
}