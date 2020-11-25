
var Network = require("Network");
cc.Class({
    extends: cc.Component,

    properties: {
        imgGoods: cc.Sprite,  //物品图片
        txtName: cc.Label,  //物品名称
        txtDescript: cc.Label,  //物品说明
        txtCount: cc.Label,  //数量

        preDine: cc.Prefab,  //吃饭预制体
        _cid: -1,  //物品ID
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },
    /**填充项
     * @param  {int} id  物品id
     * @param  {string} name  物品名称
     * @param  {string} descript  物品描述
     * @param  {int} count  物品数量
     */
    fill(id, name, descript, count) {
        var self = this;
        this._cid = id;
        this.txtName.string = name;
        this.txtDescript.string = descript;
        this.txtCount.string = count.toString();
        let path = "Shop/shop_" + id;
        cc.loader.loadRes(path, function (err, tex) {
            if (!err) {
                self.imgGoods.spriteFrame = new cc.SpriteFrame(tex);
            }

        });
    },
    onUse() {
        var self = this;
        if (Global.sceneCode == 0) {
            Network.requestDine(this._cid, (res) => {
                if (res.result) {
                    // Global.game.panels.deletePanel();
                    Global.game.updateDine(res);
                }else{
                    Global.game.showTip(res.data.say);
                }


                // if(res.result){
                //     Global.game.panels.deletePanel();
                //     Global.game.updateDine(res.data);
                // }else{
                //     Global.game.showTip(res.data);
                // }
            });
        } else if (Global.sceneCode == 1) {

            Network.giveOtherFood(Global.scene.otherUid, this._cid, (res) => {
                if (res.result) {

                    Global.game.onPlayPlayerDine(this._cid,res.data);
                    // Global.player.openSay(res.data);
                } else {

                    Global.game.showTip(res.data);
                }
            })
        }
        this.node.parent.parent.parent.parent.parent.getComponent("PanelPackage").onClose();
        //本地测试
        // let res={result:true,data:10};
        // if(res.result){
        //     Global.game.panels.deletePanel();
        //     Global.game.updateDine(res.data);
        // }else{
        //     Global.game.showTip(res.data);
        // }
    },
});
