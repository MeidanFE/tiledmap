// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

let roleMap = {
  1: {
    name: "勇者",
    url: "role/hero",
  },
  3: {
    name: "骷髅王",
    url: "role/npc",
  },
};

declare global {
  interface Window {
    dialog: cc.Node;
  }
}

@ccclass
export default class Dialog extends cc.Component {
  @property(cc.Sprite)
  public picSprite: cc.Sprite;

  @property(cc.Label)
  public nameLabel: cc.Label;

  @property(cc.Label)
  public textLabel: cc.Label;

  private textDataArr = [];
  private textIndex = -1;
  private nowText = null;
  private textEnd: boolean = true;
  private tt: number = 0;

  init(textDataArr) {
    this.textIndex = -1;
    this.textDataArr = textDataArr;
    this.node.active = true;
    this.nextTextData();
    cc.systemEvent.on("keydown", this.onKeyDown, this);
    window.dialog = this.node;
  }

  onKeyDown(e: cc.Event.EventKeyboard) {
    if (e.keyCode == cc.macro.KEY.space) {
      this.nextTextData();
    }
  }

  onDestroy() {
    cc.systemEvent.off("keydown", this.onKeyDown, this);
  }

  nextTextData() {
    if (!this.textEnd) return;
    if (++this.textIndex < this.textDataArr.length) {
      this.setTextData(this.textDataArr[this.textIndex]);
    } else {
      this.closeDialog();
    }
  }

  onLoad() {}

  setTextData(textData) {
    if (!this.textEnd) return;
    this.textEnd = false;

    this.nameLabel.string = roleMap[textData.role].name;
    this.textLabel.string = "";
    this.nowText = textData.content;

    console.log(cc);
    cc.resources.load(
      `2${textData.role}`,
      cc.SpriteFrame,
      (_, texture: cc.SpriteFrame) => {
        console.log(texture);
        this.picSprite.spriteFrame = texture;
      }
    );
  }

  closeDialog() {
    this.node.active = false;
  }

  start() {}

  update(dt: number) {
    if (this.textEnd) return;
    this.tt += dt;

    if (this.tt >= 0.1) {
      if (this.textLabel.string.length < this.nowText.length) {
        this.textLabel.string = this.nowText.slice(
          0,
          this.textLabel.string.length + 1
        );
      } else {
        this.textEnd = true;
        this.nowText = null;
      }

      this.tt = 0;
    }
  }
}
