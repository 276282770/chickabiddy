var Player = require("Player2");
cc.Class({
    extends: cc.Component,

    properties: {
        thiefs: [Player],  //小偷集合
        positions: [cc.v2],  //原始坐标
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    // update (dt) {},

    setData(datas) {
        for (var i = 0; i < datas.length; i++) {
            if (i >= this.thiefs.length) {
                return;
            }
            if (datas[i] == null) {
                this.thiefs.node.active = false;
            } else {
                if (this.thiefs[i].node.active = false) {
                    this.thiefs[i].node.position=this.positions[i];
                    this.thiefs[i].setThiefData(datas[i].id, datas[i].name, datas[i].level, null, null);
                    this.thiefs.play("thief2_eatting");
                }
            }
        }
    },
});
