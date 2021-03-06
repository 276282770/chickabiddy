// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

var Network = require("Network");
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
        cid: 1,
        prePanelBuy: cc.Prefab,  //购买界面预制体
        txtCount: cc.Label,  //道具数量
imgUse:cc.Sprite,//按钮图片
spUse:[cc.SpriteFrame],  //按钮图片精灵

        _cid: -1,  //道具ID   1:双倍经验卡；  6:蹭吃卡  13.场景切换卡
        _count: 0,  //数量

        imgBg: cc.Sprite,  //背景
        imgTip: cc.Sprite,  //说明
        spBg: [cc.SpriteFrame],//背景精灵
        spTip: [cc.SpriteFrame],//说明精灵
    },





    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        // this.init(this.cid,0);
    },

    // update (dt) {},
    //使用
    onClick() {
        if (this._count > 0) {
            switch (this._cid) {
                case 1: this.onUse(); break;
                case 6: Global.game.showTip("请在好友家里使用"); break;
                case 13: this.onChangeScene(); break;
            }
        } else {  //购买
            console.log("【购买道具卡】");
            let newPanel = cc.instantiate(this.prePanelBuy);
            newPanel.parent = cc.find("Canvas/UICanvas");
            let newPanelScr = newPanel.getComponent("PanelBuy2");
            newPanelScr.load(this._cid);

        }
        Global.game.panels.deletePanel();
    },

    //使用场景切换卡
    onChangeScene() {
        Network.setStyle(null,Global.id, (res) => {
            if (res.result) {
                console.log("【使用场景切换卡】 ");
               cc.director.loadScene("SelectStyle");
            } else {
                Global.game.showTip(res.data);
            }

        });
        

    },


    //使用按钮点击
    onUse() {
        Network.requestUseProp(this._cid, (res) => {
            if (res.result) {
                console.log("【使用道具卡 ");
                Global.game.showTip(res.data);
                Global.game.updateIndex();
            }

        });
        Global.game.panels.deletePanel();
    },
    fill(id, count, percent) {
        var self = this;
        this._count = count;
        this._cid = id;
        percent = 1 - percent;
        if (id) {
            let path;
            if (percent > 0 || count > 0) {
                path = "Shop2/shop_" + id;
                self.txtCount.string = count.toString();
                if (percent != 1) {
                    self.ndUse.getComponent(cc.Button).interactable = false;
                    // self.ndUse.getChildByName("txtUse").getComponent(cc.Label).string="使用中..";
                }
                // self.ndUse.getComponent(cc.ProgressBar).progress=percent;
            }
            else {
                this.ndUse.active = false;
                // path="Shop/shop_"+id+"_g";
            }
            cc.loader.loadRes(path, function (err, tex) {
                if (!err) {
                    self.node.getChildByName("bg").getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(tex);
                }
            });
        }
    },
    init(id, count) {
        //id  0:双倍经验卡；  1:蹭吃卡
        this._cid = id;
        this._count = count;

        if (id == 1) {
            this.imgBg.spriteFrame = this.spBg[0];
            this.imgTip.spriteFrame = this.spTip[0];
        } else if (id == 6) {
            this.imgBg.spriteFrame = this.spBg[1];
            this.imgTip.spriteFrame = this.spTip[1];
        } else if (id == 13) {
            this.imgBg.spriteFrame = this.spBg[2];
            this.imgTip.spriteFrame = this.spTip[2];
        }
        this.txtCount.string = count;

        if(count<=0){
            this.imgUse.spriteFrame=this.spUse[1];
        }
    }
});
