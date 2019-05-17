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
        txtName: cc.Label,  //名称
        txtDesc: cc.Label,  //描述
        txtCount: cc.Label,  //输入框
        txtResultCount: cc.Label,  //兑换数量
        txtRate: cc.Label,  //兑换比率
        spSelfEgg: cc.SpriteFrame,  //自己的鸡蛋精灵
        spOtherEgg: cc.SpriteFrame,  //比人的鸡蛋精灵
        imgEgg: cc.Sprite,  //鸡蛋图片


        mode: 0,  //0 别人的鸡蛋兑换金币， 1 自己的鸡蛋兑换金币

        _ownCount:0,  //拥有数量
        _count:0,  //数量
        _ratio:0,  //兑换比率
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
    },

    // update (dt) {},
    fill(md) {
        var self=this;
        if (md) {
            this.mode = md;
        }
        this.txtName.string = "兑换金币";
        Network.exchangeEgg2MoneyInfo((res) => {
            if (res.result) {
                if (md == 0) {
                    self.imgEgg.spriteframe = self.spOtherEgg;
                    self.txtDesc.string = "将收获他人的鸡蛋兑换成金币可以购买食物、经验卡、装扮等道具.";
                    self.txtRate.string = "1:" + res.data.otherEggPrice.toString();
                    self._ownCount=res.data.otherEggCount;
                }
                else if (md == 1) {
                    self.imgEgg.spriteframe = self.spSelfEgg;
                    self.txtDesc.string = "将收获的鸡蛋兑换成金币可以购买食物、经验卡、装扮等道具.";
                    self.txtRate.string = "1:" + res.data.selfEggPrice.toString();
                    self._ownCount=res.data.selfEggCount;
                }
            }
        });
        self.setCount(1);
    },
    //兑换
    onExchange() {
        var self = this;
        if (this._count == 0) {
            Global.game.showTip("什么也没有发生!");
            return;
        }
        switch (this.mode) {
            case 0: {
                Network.exchageOtherEgg2Money(this._count, (res) => {
                    if (res.result) {
                        Global.game.showTip("兑换成功");
                        Global.game.updateIndex();
                    } else {
                        Global.game.showTip("兑换失败");
                    }
                })
            }; break;
            case 1: {
                Network.exchangeSelfEgg2Money(this._count, (res) => {
                    if (res.result) {
                        Global.game.showTip("兑换成功");
                        Global.game.updateIndex();
                    } else {
                        Global.game.showTip("兑换失败");
                    }
                })
            }; break;
        }
        this.onClose();
    },
    //设置兑换数量和结果数量
    setCount(num) {
        if (num > this._ownCount)
            return;
        this._count = num;
        this.txtCount.string = num.toString();
        this.txtResultCount.string = parseInt(this._count * this._ratio);
    },
    //添加数量
    addCount() {
        let num = this._count + 1;
        if (num > this._ownCount)
            return;
        this.setCount(num);
    },
    //减少数量
    decCount() {
        let num = this._count - 1;
        if (num < 0)
            return;
        this.setCount(num);
    },
    //关闭
    onClose() {
        this.node.destroy();
    },
});
