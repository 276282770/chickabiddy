// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        imgGoods:cc.Sprite,   //物品图片
        txtGoodsName:cc.Label,  //物品名称
        txtGoodsDesc:cc.Label,  //物品说明
        txtPrice:cc.Label,  //物品价格
        prePanelBuy:cc.Prefab,  //购买预制体
        _cid:-1,
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
        cc.loader.loadRes("Shop/shop_"+id,function(err,tex){
            if(!err){
                self.imgGoods.spriteFrame=new cc.SpriteFrame(tex);
            }
        });
        this.txtGoodsName.string=name;
        this.txtGoodsDesc.string=desc;
        this.txtPrice.string=price.toString();
    },
    //购买
    onBuy(){
        Global.game.panels.deletePanel();
        let newPanel= cc.instantiate(this.prePanelBuy);
        newPanel.parent=cc.find("Canvas");
        let newPanelScr=newPanel.getComponent("PanelBuy");
        newPanelScr.load(this._cid);
    },
});
