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
        ndBg: cc.Node,  //背景
        // spTabNormal:cc.SpriteFrame, //正常按钮的背景
        // spTabSelected:cc.SpriteFrame,  //当前按钮的背景
        btnTabShop: cc.Button,  //商店按钮
        btnTabExchange: cc.Button,  //兑换按钮
        btnTabOther: cc.Button,  //其它按钮
        ndSvShop: cc.Node,
        ndSvExchange: cc.Node,
        // ndSvOther:cc.Node,

        preItemShop: cc.Prefab,   //项预制体



        _panelReady: false,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.load();
        this.onTab(this, 0);
    },

    start() {

    },
    /**选择
     */
    onTab(event, customerData) {
        console.log("点击按钮" + customerData);

        var tabBtn = [this.btnTabShop, this.btnTabExchange];
        var svNode = [this.ndSvShop, this.ndSvExchange];

        let idx = parseInt(customerData);

        for (var i = 0; i < tabBtn.length; i++) {
            let me = i == idx;
            tabBtn[i].node.getChildByName("honghengxian").active = me;
            tabBtn[i].interactable = !me;
            svNode[i].active = me;
        }
    },

    onTabBtn(name) {
        switch (name) {
            case "all": {
                this.btnTabAll.interactable = false;
                this.btnTabHat.interactable = true;
                this.btnTabClothes.interactable = true;
                this.btnTabGlasses.interactable = true;
                this.btnTabAll.node.getComponent(cc.Sprite).spriteFrame = this.spTabSelected;
                this.btnTabHat.node.getComponent(cc.Sprite).spriteFrame = this.spTabNormal;
                this.btnTabClothes.node.getComponent(cc.Sprite).spriteFrame = this.spTabNormal;
                this.btnTabGlasses.node.getComponent(cc.Sprite).spriteFrame = this.spTabNormal;
            }; break;
            case "hat": {
                this.btnTabAll.interactable = true;
                this.btnTabHat.interactable = false;
                this.btnTabClothes.interactable = true;
                this.btnTabGlasses.interactable = true;
                this.btnTabAll.node.getComponent(cc.Sprite).spriteFrame = this.spTabNormal;
                this.btnTabHat.node.getComponent(cc.Sprite).spriteFrame = this.spTabSelected;
                this.btnTabClothes.node.getComponent(cc.Sprite).spriteFrame = this.spTabNormal;
                this.btnTabGlasses.node.getComponent(cc.Sprite).spriteFrame = this.spTabNormal;
            }; break;
            case "glasses": {
                this.btnTabAll.interactable = true;
                this.btnTabHat.interactable = true;
                this.btnTabClothes.interactable = true;
                this.btnTabGlasses.interactable = false;
                this.btnTabAll.node.getComponent(cc.Sprite).spriteFrame = this.spTabNormal;
                this.btnTabHat.node.getComponent(cc.Sprite).spriteFrame = this.spTabNormal;
                this.btnTabClothes.node.getComponent(cc.Sprite).spriteFrame = this.spTabNormal;
                this.btnTabGlasses.node.getComponent(cc.Sprite).spriteFrame = this.spTabSelected;
            }; break;
            case "clothes": {
                this.btnTabAll.interactable = true;
                this.btnTabHat.interactable = true;
                this.btnTabClothes.interactable = false;
                this.btnTabGlasses.interactable = true;
                this.btnTabAll.node.getComponent(cc.Sprite).spriteFrame = this.spTabNormal;
                this.btnTabHat.node.getComponent(cc.Sprite).spriteFrame = this.spTabNormal;
                this.btnTabClothes.node.getComponent(cc.Sprite).spriteFrame = this.spTabSelected;
                this.btnTabGlasses.node.getComponent(cc.Sprite).spriteFrame = this.spTabNormal;
            }; break;
        }
    },
    onShow() {
        let h = this.ndBg.height;
        let x = this.ndBg.position.x;
        this.ndBg.runAction(cc.sequence(
            cc.moveTo(0.5, x, h),
            cc.callFunc(() => {
                this._panelReady = true;
            })
        ));
    },
    onClose() {
        if (!this._panelReady)
            return;
        let x = this.ndBg.position.x;
        this.ndBg.runAction(cc.sequence(
            cc.moveTo(0.5, x, 0),
            cc.callFunc(() => {
                //引导3
                if(Global.game._buyCount>0){
                let guide=cc.find("Canvas/Guid").getComponent("Guid");
                if(guide._isGuid){
                    guide.stepSchedule(3);
                }
            }
             
            this.node.destroy();

            })
        ));
    },
    onEnable() {
        this.onShow();
    },
    //
    onTabOther() {
        Global.game.onShowTipExpect();
    },
    //加载
    load() {

        var self = this;

        Network.requestShop(1, (res) => {
            if (res.result) {
                var data = res.data;
                for (var i = 0; i < data.length; i++) {
                    let item = cc.instantiate(self.preItemShop);
                    item.parent = self.ndSvShop.getChildByName("view").getChildByName("content");
                    let itemScr = item.getComponent("ItemShop");
                    itemScr.fill(data[i].id, data[i].name, data[i].description, data[i].price);
                }
            }
        });

    },
});
