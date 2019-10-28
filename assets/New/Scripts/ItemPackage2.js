
var Network = require("Network");
cc.Class({
    extends: cc.Component,

    properties: {
        imgGoods: cc.Sprite,  //物品图片
        txtName: cc.Label,  //物品名称
        txtDescript: cc.Label,  //物品说明
        txtCount: cc.Label,  //数量

        imgBg: cc.Sprite,  //背景
        imgBtn: cc.Sprite,  //按钮
        spBgs: [cc.SpriteFrame],  //背景精灵
        spBtn: [cc.SpriteFrame], //按钮精灵

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
        let path = "Shop2/shop_" + id;
        cc.loader.loadRes(path, function (err, tex) {
            if (!err) {
                self.imgGoods.spriteFrame = new cc.SpriteFrame(tex);
            }

        });

        let idx = id % 3;
        this.imgBg.spriteFrame = this.spBgs[idx];
        this.imgBtn.spriteFrame = this.spBtn[idx];
    },
    onUse() {
        var self = this;
        if (Global.sceneCode == 0) {
            Network.requestDine(this._cid, (res) => {

                // Global.game.panels.deletePanel();
                // Global.game.updateDine(res);
                // Global.game.onDine();


                if(res.result){
                    
                    Global.game.onDine();
                }else{
                    Global.game.player.openSay(res.data.say);
                }
            });
        }else if(Global.sceneCode==1){

            Network.giveOtherFood(Global.scene.otherUid,this._cid,(res)=>{
                if(res.result){
                    
                    Global.game.onDine();
                    Global.player.openSay(res.data);
                }else{

                    Global.game.showTip(res.data);
                }
            })
        }
        Global.game.updateIndex();
        Global.game.panels.deletePanel();
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
