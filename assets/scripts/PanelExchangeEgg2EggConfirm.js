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
        code:"",  //验证码
        count:0, // 兑换数量
        txtSite:cc.Label,  //网点位置
        txtCount:cc.Label,  //兑换数量文本
        txtCode:cc.Label,  //兑换码
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},

    fill(code,count){
        this.code=code;
        this.count=count;
        this.txtCount.string=count.toString()+"个";
        this.txtCode.string=code;
    },
    onClose(){
        this.node.destroy();
    },

    /** 兑换
     *
     *
     */
    onExchange(){
        // var self=this;
        // Network.exchangeEgg2Egg(this.code,this.count,(res)=>{
        //     if(res.result){
        //         Global.game.updateIndex();
        //         Global.game.showTip("兑换成功");
        //     }else{
        //         Global.game.showTip("兑换失败 "+res.data);
        //     }
        //     self.onClose();
        // });
        this.onClose();
    },
});
