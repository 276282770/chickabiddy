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
        spTipOtherBath:cc.AnimationClip, //别人洗澡提示精灵
        spTipFriend: cc.AnimationClip,  //好友提示精灵
        spTipMission: cc.AnimationClip,  //任务提示精灵
        spTipShop: cc.AnimationClip,//商店提示精灵
        spTipFood: cc.AnimationClip,//食物提示精灵
        spTipPickupEgg: cc.AnimationClip,//收鸡蛋提示精灵
        spTipOtherPickupEgg: cc.AnimationClip,//收别人鸡蛋提示精灵
        spTipOtherBath: cc.AnimationClip,//别人洗澡提示精灵

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    // update (dt) {},
});
