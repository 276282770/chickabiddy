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
        btnTabExchangeList: cc.Button,  //兑换记录按钮
        btnTabExchange: cc.Button,  //兑换按钮
        ndSvExchangeList: cc.Node,  //
        ndSvExchange: cc.Node,

        txtStealEgg2MoneyCount: cc.Label,  //偷鸡蛋个数
        txtEgg2EggCount: cc.Label,  //鸡蛋个数
        txtEgg2MoneyCount: cc.Label,  //鸡蛋个数
        txtStealEgg2MoneyRate: cc.Label,  //偷鸡蛋比例
        txtEgg2EggRate: cc.Label,  //鸡蛋比例
        txtEgg2MoneyRate: cc.Label,  //鸡蛋换钱比例


        preItemExchangeList: cc.Prefab,   //兑换记录项预制体
        prePanelExchangeBuy: cc.Prefab,  //兑换页面预制体

        _stealEggCount: 0, //偷来的鸡蛋个数
        _eggCount: 0,  //自己的鸡蛋个数
        _stealEgg2MoneyRate: 0,  //偷来鸡蛋换钱比率
        _egg2EggRate: 0,  //鸡蛋换鸡蛋比率
        _egg2MoneyRate: 0,  //鸡蛋换钱比率

        _panelReady: false,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.load();
        // this.onTab(this,0);
    },

    start() {

    },
    /**选择
     */
    onTab(event, customerData) {
        console.log("点击按钮" + customerData);

        var tabBtn = [this.btnTabExchange, this.btnTabExchangeList];
        var svNode = [this.ndSvExchange, this.ndSvExchangeList];

        let idx = parseInt(customerData);

        for (var i = 0; i < tabBtn.length; i++) {
            let me = i == idx;
            tabBtn[i].node.getChildByName("honghengxian").active = me;
            tabBtn[i].interactable = !me;
            svNode[i].active = me;
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
                this.node.destroy();
            })
        ));
    },
    onEnable() {
        this.onShow();
    },

    //加载
    load() {

        var self = this;

        Network.getExchangeList2((res) => {
            if (res.result) {
                var data = res.data;
                for (var i = 0; i < data.length; i++) {
                    let item = cc.instantiate(self.preItemExchangeList);
                    item.parent = self.ndSvExchangeList.getComponent(cc.ScrollView).content;

                    let itemScr=item.getComponent("ItemDetailExchange2");
                    itemScr.fill(data[i].isCmplt,data[i].time,data[i].count,data[i].no,data[i].expritydate,data[i].dealTime, data[i].servicenet);
                }
            }
        });

        Network.exchangeEgg2MoneyInfo((res) => {
            if (res.result) {
                let data=res.data;
                self.setEggCount(data.selfEggCount);
                self.setStealEggCount(data.otherEggCount);
                self.setEgg2EggRate(data.egg2eggRatio);
                self.setEgg2MoneyRate(data.selfEggPrice);
                self.setStealEgg2MoneyRate(data.otherEggPrice);
            }
        });

    },
    //设置鸡蛋个数
    setEggCount(num) {
        this._eggCount = num;
        this.txtEgg2EggCount.string = num.toString();
        this.txtEgg2MoneyCount.string = num.toString();
    },
    //设置偷来鸡蛋的数量
    setStealEggCount(num) {
        this._stealEggCount = num;
        this.txtStealEgg2MoneyCount.string = num.toString();
    },
    //设置鸡蛋兑换鸡蛋的比率
    setEgg2EggRate(num) {
        this._egg2EggRate = num;
        this.txtEgg2EggRate.string = (1/num).toString()+"个游戏鸡蛋兑换1个鸡蛋";
    },
    //设置鸡蛋兑换钱的比率
    setEgg2MoneyRate(num) {
        this._egg2MoneyRate = num;
        this.txtEgg2MoneyRate.string ="1个兑换"+num.toString()+"金币" ;
    },
    //设置偷来鸡蛋兑换金币的比率
    setStealEgg2MoneyRate(num) {
        this._stealEgg2MoneyRate = num;
        this.txtStealEgg2MoneyRate.string = "1个兑换"+num.toString()+"金币" ;
    },

    //鸡蛋换钱
    exchangeEgg2Money() {
        this.openPanelExchangeBuy(this._eggCount,this._egg2MoneyRate,0);
    },
    //被人的蛋兑钱
    exchangeOtherEgg2Money(){
        this.openPanelExchangeBuy(this._stealEggCount,this._stealEgg2MoneyRate,2);
    },
    //鸡蛋兑鸡蛋
    exchangeEgg2Egg(){
        var self=this;
        Network.getIsShowUnsafeData((res)=>{
            if(res.result){
                self.openPanelExchangeBuy(this._eggCount,this._egg2EggRate,1);
            }
        });
        
    },
    openPanelExchangeBuy(eggCount,rate,type){
        this.onClose();

        let panelBuy=cc.instantiate(this.prePanelExchangeBuy);
        panelBuy.getComponent("PanelExchangeBuy2").setData(eggCount,rate,type);
        panelBuy.parent=cc.find("Canvas/UICanvas");
    },

});
