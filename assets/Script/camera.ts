// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class Camera extends cc.Component {
  @property(cc.Node)
  playerNode: cc.Node = null;

  // onLoad () {}

  start() {}

  update(dt) {
    if (!this.playerNode) {
      return;
    }

    let w_pos = this.playerNode.convertToWorldSpaceAR(cc.v3(0, 0));
    let n_pos = this.node.parent.convertToNodeSpaceAR(w_pos);
    this.node.position = n_pos;
  }
}
