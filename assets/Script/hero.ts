// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class Hero extends cc.Component {
  @property
  public _speed = 200;

  private inputEvent = {};
  private heroAni: cc.Animation;
  private state: string;
  private sp: cc.Vec2 = cc.v2(0, 0);

  private lv: cc.RigidBody;

  onLoad() {
    cc.systemEvent.on("keydown", this.onKeyDown, this);
    cc.systemEvent.on("keyup", this.onKeyUp, this);
    this.heroAni = this.node.getComponent(cc.Animation);
    this.lv = this.node.getComponent(cc.RigidBody);
  }

  setState(state: string) {
    if (this.state === state) {
      return;
    }

    this.state = state;
    this.heroAni.play(this.state);
  }

  onKeyDown(e: cc.Event.EventKeyboard) {
    this.inputEvent[e.keyCode] = 1;
  }

  onKeyUp(e: cc.Event.EventKeyboard) {
    this.inputEvent[e.keyCode] = 0;
  }

  start() {}

  update(dt: number) {
    if (window.dialog && window.dialog.active) {
      return;
    }

    if (this.inputEvent[cc.macro.KEY.a] || this.inputEvent[cc.macro.KEY.left]) {
      this.sp.x = -1;
    } else if (
      this.inputEvent[cc.macro.KEY.d] ||
      this.inputEvent[cc.macro.KEY.right]
    ) {
      this.sp.x = 1;
    } else {
      this.sp.x = 0;
    }

    if (this.inputEvent[cc.macro.KEY.w] || this.inputEvent[cc.macro.KEY.up]) {
      this.sp.y = 1;
    } else if (
      this.inputEvent[cc.macro.KEY.s] ||
      this.inputEvent[cc.macro.KEY.down]
    ) {
      this.sp.y = -1;
    } else {
      this.sp.y = 0;
    }

    if (this.sp.x) {
      this.lv.linearVelocity = cc.v2(this.sp.x * this._speed, 0);
    } else if (this.sp.y) {
      this.lv.linearVelocity = cc.v2(0, this.sp.y * this._speed);
    } else {
      this.lv.linearVelocity = cc.v2(0, 0);
    }

    let state = "";
    if (this.sp.x == 1) {
      state = "hero_right";
    } else if (this.sp.x == -1) {
      state = "hero_left";
    } else if (this.sp.y == 1) {
      state = "hero_up";
    } else if (this.sp.y == -1) {
      state = "hero_down";
    }

    if (state) {
      this.setState(state);
    }
  }

  onCollisionEnter(other, self) {
    if (other.node.group == "smoke") {
      other.node.active = false;
      other.node.getComponent(cc.TiledTile).gid = 0;
    }
  }
}
