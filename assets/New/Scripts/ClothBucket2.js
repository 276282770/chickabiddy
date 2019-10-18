
cc.Class({
    extends: cc.Component,

    properties: {
        // spImages:[cc.SpriteFrame],  //衣服篓
        spEmptys:[cc.SpriteFrame],  //空衣服篓
        spFulls:[cc.SpriteFrame],  //满衣服篓

        _style:0,
        _isFull:false,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
    },

    // update (dt) {},
    setFull(isFull){
        this._isFull=isFull;
        let sprite=isFull?this.spFulls:this.spEmptys;
        this.node.getComponent(cc.Sprite).spriteFrame= sprite[this._style];
    },
    changeStyle(st){
        this._style=st;
        this.setFull(this._isFull);
    }
});
