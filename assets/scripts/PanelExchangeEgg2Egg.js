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

        txtCode: cc.EditBox,  //验证码
        txtCount: cc.Label,  //兑换数量
        txtRatio: cc.Label, //兑换比率        

        prePanelExchangeEgg2EggConfirm: cc.Prefab,  //兑换确认面板预制体

        _exchangeCount: 0,  //兑换数量(真鸡蛋数量)
        _eggCount: 0,  //鸡蛋数量
        _ratio: 0,   //比率
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        // this.load();
    },


    //兑换
    onExchange() {
        var self=this;
        // Network.exchangeEgg2Egg(self._exchangeCount,(res)=>{
        //     if(res.result){
        //         Global.game.updateIndex();
        //     }
        //     self.onClose();
        //     Global.game.showTip(res.data);
        // });
        if (this._exchangeCount == 0) {
            Global.game.showTip("对不起，兑换数量必须大于0个");
            return;
        }
        Network.exchangeEgg2Egg2(this._exchangeCount,(res)=>{
            if(res.result){
                let newPanel = cc.instantiate(self.prePanelExchangeEgg2EggConfirm);
                newPanel.parent = cc.find("Canvas/Panels");
                let newPanelScr = newPanel.getComponent("PanelExchangeEgg2EggConfirm");
                newPanelScr.fill(res.data, self._exchangeCount);
                self.onClose();
            }
        })

    },
    //添加
    add() {
        let num = this._exchangeCount + 1;
        let max = parseInt(this._eggCount * this._ratio);
        if (num > max)
            return;
        this.setExchangeCount(num);
    },
    //减少
    desc() {
        let num = this._exchangeCount - 1;
        if (num < 0)
            return;
        this.setExchangeCount(num);
    },
    //最大兑换量
    all() {
        this._exchangeCount = parseInt(this._eggCount * this._ratio);
        this.txtCount.string = this._exchangeCount.toString();

    },
    setExchangeCount(num) {
        this._exchangeCount = num;
        this.txtCount.string = this._exchangeCount.toString();
    },

    onClose() {
        this.node.destroy();
    },
    load() {
        var self = this;
        Network.exchangeEgg2MoneyInfo((res) => {
            if (res.result) {
                self._ratio = res.data.egg2eggRatio;
                self._eggCount = res.data.selfEggCount;

                self.all();
            }
        });
    },
    fill(count,ratio){
        this.setRatio(ratio);
        this._eggCount=count;
    },
    setRatio(rt){
        this._ratio=rt;
        this.txtRatio.string="1:"+rt.toString();
    }
});
