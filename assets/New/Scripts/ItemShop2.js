
cc.Class({
    extends: cc.Component,

    properties: {

        imgGoods:cc.Sprite,   //物品图片
        txtGoodsName:cc.Label,  //物品名称
        txtGoodsDesc:cc.Label,  //物品说明
        txtPrice:cc.Label,  //物品价格
        prePanelBuy:cc.Prefab,  //购买预制体
        _cid:-1,

        spBg:[cc.SpriteFrame],  //背景精灵
        spBuyBtn:[cc.SpriteFrame],  //按钮精灵
        imgBg:cc.Sprite,  //背景
        imgBuyBtn:cc.Sprite,  //购买按钮
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},
    /**
     *填充项
     *
     * @param {*} id  物品id
     * @param {*} name  物品名称
     * @param {*} desc  物品描述
     * @param {*} price  物品价格
     */
    fill(id,name,desc,price){
        var self=this;
        this._cid=id;
        cc.loader.loadRes("Shop2/shop_"+id,function(err,tex){
            if(!err){
                self.imgGoods.spriteFrame=new cc.SpriteFrame(tex);
            }
        });
        this.txtGoodsName.string=name;
        this.txtGoodsDesc.string=desc;
        this.txtPrice.string=price.toString();
        
        let bgIdx=id%3;
        this.imgBg.spriteFrame=this.spBg[bgIdx];
        this.imgBuyBtn.spriteFrame=this.spBuyBtn[bgIdx];
    },
    //购买
    onBuy(){
        // Global.game.panels.deletePanel();
        let newPanel= cc.instantiate(this.prePanelBuy);
        newPanel.parent=cc.find("Canvas/UICanvas");
        let newPanelScr=newPanel.getComponent("PanelBuy2");
        newPanelScr.load(this._cid);
    },
});
