// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

var Network=require("Network");
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

        txtOwnEggCount:cc.Label, //拥有的鸡蛋数
        txtRatio:cc.Label,  //比率
        txtCount:cc.Label,  //兑换数量
        txtResultCount:cc.Label,  //结果数量
        mode:0,  //模式，0 被人鸡蛋兑换金币，1 自己鸡蛋兑换金币 ，2自己鸡蛋兑换真鸡蛋

        _ownCount:0,  //拥有数量
        _count:0,  //数量
        _ratio:0,  //兑换比率
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.load();
    },

    // update (dt) {},

    //兑换
    onExchange(){
        var self=this;
        switch(this.mode){
            case 0:{
                Network.exchageOtherEgg2Money(this._count,(res)=>{
                    if(res.result){
                        Global.game.showTip("兑换成功");
                        Global.game.updateIndex();
                    }else{
                        Global.game.showTip("兑换失败");
                    }
                })
            };break;
            case 1:{
                Network.exchangeSelfEgg2Money(this._count,(res)=>{
                    console.log("0000000000000000000000"+JSON.res);
                    if(res.result){
                        Global.game.showTip("兑换成功");
                        Global.game.updateIndex();
                    }else{
                        Global.game.showTip("兑换失败");
                    }
                })
            };break;
            case 2:{
                Network.exchangeEgg2Egg(this._count,(res)=>{
                    if(res.result){
                        Global.game.showTip("兑换成功");
                        Global.game.updateIndex();
                    }else{
                        Global.game.showTip("兑换失败");
                    }
                })
            };break;
        }
        Global.game.panels.deletePanel();
    },
    //
    fill(OwnCount,ratio){
        this.setOwnCount(OwnCount);
        this.setRatio(ratio);
        
    },
    //设置自己的鸡蛋
    setOwnCount(num){
        this._ownCount=num;
        this.txtOwnEggCount.string=num.toString();
    },
    //设置比率
    setRatio(num){
        this._ratio=num;
        this.txtRatio.string=num.toString();
    },
    //设置兑换数量和结果数量
    setCount(num){
        if(num>this._ownCount)
            return;
        this._count=num;
        this.txtCount.string=num.toString();
        this.txtResultCount.string=parseInt(this._count*this._ratio);
    },
    //添加数量
    addCount(){
        let num=this._count+1;
        if(num>this._ownCount)
            return;
        this.setCount(num);
    },
    //减少数量
    decCount(){
        let num=this._count-1;
        if(num<0)
            return;
        this.setCount(num);
    },
    //加载
    load(){
        var self=this;
        Network.exchangeEgg2MoneyInfo((res)=>{
            if(res.result){
                let data=res.data;
                switch(this.mode){
                    case 0:{   
                        self.fill(data.otherEggCount,data.otherEggPrice);
                    };break;
                    case 1:{   
                        self.fill(data.selfEggCount,data.selfEggPrice);
                    };break;
                    case 2:{   
                        // self.fill(data.otherEggCount,data.selfEggPrice);
                    };break;
                }
                self.setCount(1);
            }
        });
    },
});
