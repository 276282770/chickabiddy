// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
var WX=require("WX");
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
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        WX.login();
        WX.getUserInfo();
        WX.getSetting((isAuth)=>{if(!isAuth)WX.createUserInfoButton();});

    },

    start () {

    },

    // update (dt) {},
    
    //分享
    onShare(){
        WX.shareAppMessage("","http://pic13.nipic.com/20110412/6759696_220922114000_2.jpg","tp=222");
    },
    onClick(){
        this.getScore();
    },
    onClick2(){
        this.setScore(20);
    },

    //设置分数
    setScore(score){
        WX.postMessage({cmd:"SETSCORE",para:score});
    },
    //获取自己分数
    getScore(){
        WX.postMessage({cmd:"GETSCORE"});
    },
});
