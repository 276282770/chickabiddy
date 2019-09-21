
cc.Class({
    extends: cc.Component,

    properties: {
        spImages:[cc.SpriteFrame],  //衣服篓
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
    },

    // update (dt) {},
    setFull(isFull){
        let idx=isFull?1:0;
        this.node.getComponent(cc.Sprite).spriteFrame=this.spImages[idx];
    }
});
