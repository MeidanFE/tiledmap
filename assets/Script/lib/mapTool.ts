const maxHCnt = 4;
const maxWCnt = 4;

//偏移量
let dirArr = [
  { i: -1, j: 0 },
  { i: 1, j: 0 },
  { i: 0, j: -1 },
  { i: 0, j: 1 },
];

//连接两块地图
function connectMap(mapNameArr, index, dirNum, dirNotNull = false) {
  let dir = dirArr[dirNum];
  let nextIndex = {
    i: dir.i + index.i,
    j: dir.j + index.j,
  };

  if (
    nextIndex.i >= maxHCnt ||
    nextIndex.j >= maxWCnt ||
    nextIndex.i < 0 ||
    nextIndex.j < 0
  ) {
    return;
  }

  if (dirNotNull && mapNameArr[(nextIndex.i, nextIndex.j)] == "00000") {
    return;
  }

  let nowMapName = mapNameArr[index.i][index.j].split("");
  let nearMapName = mapNameArr[nextIndex.i][nextIndex.j].split("");

  nowMapName[dirNum] = "1";

  let nearNum;
  if (dirNum == 0) {
    nearNum = 1;
  } else if (dirNum == 1) {
    nearNum = 0;
  } else if (dirNum == 2) {
    nearNum = 3;
  } else if (dirNum == 3) {
    nearNum = 2;
  }

  nearMapName[nearNum] = "1";

  mapNameArr[index.i][index.j] = nowMapName.join("");
  mapNameArr[nextIndex.i][nextIndex.j] = nearMapName.join("");
}

//随机连接地图
function randEmptyMap(mapNameArr) {
  for (let i = 0; i < maxHCnt; i++) {
    for (let j = 0; j < maxWCnt; j++) {
      let mapName = mapNameArr[i][j];
      if (mapName != "00000") continue;

      let dirNum = ~~(Math.random() * dirArr.length);
      connectMap(mapNameArr, { i, j }, dirNum, true);
    }
  }
}

// 生成地图
function getRandNameArr() {
  let { nextArr: mapArr, stIndex } = randBaseMap();

  let mapNameArr = [];
  for (let i = 0; i < maxHCnt; i++) {
    mapNameArr[i] = [];
    for (let j = 0; j < maxWCnt; j++) {
      mapNameArr[i][j] = "00000";
    }
  }

  for (let i = 0; i < maxHCnt; i++) {
    for (let j = 0; j < maxWCnt; j++) {
      if (!mapNameArr[i][j]) continue;
      for (let dirNum = 0; dirNum < dirArr.length; dirNum++) {
        connectMap(mapNameArr, { i, j }, dirNum);
      }
    }
  }

  randEmptyMap(mapNameArr);
  return mapNameArr;
}

// 生成基础随机数据
function randBaseMap() {
  let mapCnt = 8; // 地图快数量
  let mapArr = [];

  for (let i = 0; i < maxHCnt; i++) {
    mapArr[i] = [];
    for (let j = 0; j < maxWCnt; j++) {
      mapArr[i][j] = 0;
    }
  }

  // 随机一个起点
  let stIndex = {
    i: ~~(Math.random() * maxHCnt),
    j: ~~(Math.random() * maxWCnt),
  };

  let nextArr = setMap(mapArr, stIndex);
  mapCnt--;

  while (mapCnt && nextArr.length > 0) {
    let randNum = nextArr[~~(Math.random() * nextArr.length)];
    let nextIndex = nextArr.splice(randNum, 1)[0];

    let nearArr = setMap(mapArr, nextIndex);
    if (nextArr) {
      mapCnt--;
      nextArr = uniqNextArr([...nearArr, ...nextArr]);
    }
  }

  return { nextArr, stIndex };
}

//去重
function uniqNextArr(nextArr) {
  let tag = [];
  let arr = [];
  for (let index of nextArr) {
    let num = index.i * maxHCnt + index.j * maxWCnt;
    if (!tag[num]) {
      tag[num] = 1;
      arr.push(index);
    }
  }
  return arr;
}

// 设置通路
function setMap(mapArr, index) {
  if (index.i >= maxHCnt || index.j >= maxWCnt || index.i < 0 || index.j < 0) {
    return null;
  }

  if (mapArr[index.i][index.j]) {
    return null;
  }

  mapArr[index.i][index.j] = 1;

  let nearArr = [];
  for (let dir of dirArr) {
    let i = dir.i + index.i;
    let j = dir.j + index.j;

    if (i >= maxHCnt || j >= maxWCnt || i < 0 || j < 0) {
      continue;
    }

    if (!mapArr[i][j]) {
      nearArr.push({ i, j });
    }
  }

  return nearArr;
}

export default {
  getRandNameArr,
};
