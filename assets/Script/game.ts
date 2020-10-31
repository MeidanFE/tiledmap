// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Dialog from "./dialog";
import mapTool from "./lib/mapTool";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
  @property(cc.Node)
  public mapNode: cc.Node = null;

  @property(cc.Node)
  public dialogNode: cc.Node = null;

  @property(cc.Node)
  public loading: cc.Node = null;

  private dialog: Dialog;

  onLoad() {
    let p = cc.director.getPhysicsManager();
    p.enabled = true;
    // p.debugDrawFlags = 1;
    p.gravity = cc.v2(0, 0);

    cc.director.getCollisionManager().enabled = true;
    // cc.director.getCollisionManager().enabledDebugDraw = true;

    // let mapNameArr = [
    //   ["00000", "01000", "00000"],
    //   ["00010", "11110", "00100"],
    //   ["00000", "10000", "00000"],
    // ];
    let mapNameArr = mapTool.getRandNameArr();
    // console.log(mapNameArr);

    this.loading.active = true;
    this.initMap(mapNameArr);
  }

  // 根据地图名字数组生成地图
  initMap(mapNameArr) {
    let mapSt = null;
    let loadCnt = 0;

    for (let i = 0; i < mapNameArr.length; i++) {
      for (let j = 0; j < mapNameArr[i].length; j++) {
        let mapName = mapNameArr[i][j];
        if (!mapName || mapName == "00000") continue;
        if (!mapSt) {
          mapSt = { i, j };
        }

        loadCnt++;

        cc.resources.load(
          `map/${mapName}`,
          cc.TiledMapAsset,
          (error, assets: cc.TiledMapAsset) => {
            let node = new cc.Node();
            let map = node.addComponent(cc.TiledMap);
            node.anchorX = node.anchorY = 0;
            node.x = (j - mapSt.j) * 384;
            node.y = -(i - mapSt.i) * 384;

            map.tmxAsset = assets;
            node.parent = this.mapNode;
            this.initMapNode(map);

            if (--loadCnt == 0) {
              this.loading.active = false;
            }
          }
        );
      }
    }
  }

  initMapNode(mapNode) {
    let tiledMap = mapNode.getComponent(cc.TiledMap);
    let tiledSize = tiledMap.getTileSize();
    let layer = tiledMap.getLayer("wall");
    let layerSize = layer.getLayerSize();
    //   let smogLayer = tiledMap.getLayer("smog");
    //   let smogLayerSize = smogLayer.getLayerSize();
    //   smogLayer.node.active = true;

    for (let x = 0; x < layerSize.width; x++) {
      for (let y = 0; y < layerSize.height; y++) {
        let tiled = layer.getTiledTileAt(x, y, true);
        if (tiled.gid != 0) {
          tiled.node.group = "wall";

          let body = tiled.node.addComponent(cc.RigidBody);
          body.type = cc.RigidBodyType.Static;
          let collider = tiled.node.addComponent(cc.PhysicsBoxCollider);
          collider.offset = cc.v2(tiledSize.width / 2, tiledSize.height / 2);
          collider.size = tiledSize;
          collider.apply();
        }

        //   tiled = smogLayer.getTiledTileAt(x, y, true);
        //   if (tiled.gid != 0) {
        //     tiled.node.group = "smoke";
        //     let collider = tiled.node.addComponent(cc.BoxCollider);
        //     collider.offset = cc.v2(tiledSize.width / 2, tiledSize.height / 2);
        //     collider.size = tiledSize;
        //   }
      }
    }
  }

  start() {
    for (const mapNode of this.mapNode.children) {
      this.initMapNode(mapNode);
    }

    this.dialog = this.dialogNode.getComponent("dialog");
    // this.dialog.init([
    //   { role: 1, content: "大家好,我是勇者" },
    //   { role: 3, content: "我是魔王" },
    // ]);
  }

  // update (dt) {}
}
