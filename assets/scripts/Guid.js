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
        spTipOtherBath:cc.SpriteFrame, //别人洗澡提示精灵
        spTipFriend: cc.SpriteFrame,  //好友提示精灵
        spTipMission: cc.SpriteFrame,  //任务提示精灵
        spTipShop: cc.SpriteFrame,//商店提示精灵
        spTipFood: cc.SpriteFrame,//食物提示精灵
        spTipPickupEgg: cc.SpriteFrame,//收鸡蛋提示精灵
        spTipOtherPickupEgg: cc.SpriteFrame,//收别人鸡蛋提示精灵
        spTipOtherBath: cc.SpriteFrame,//别人洗澡提示精灵

        ndPointoutBath:cc.Node,  //指出洗澡节点
        ndPointoutFriend:cc.Node,  //指出好友节点
        ndPointoutMission:cc.Node,  //指出任务节点
        ndPointoutAllow:cc.Node,  //指出箭头节点
        ndPointoutShop:cc.Node,  //指出商店节点
        ndPointoutPickupEgg:cc.Node,  //指出拾取鸡蛋节点
        ndPointoutFood:cc.Node,  //指出食物节点

        ndBackground:cc.Node,  //背景节点


        imgBase:cc.Sprite,  //基础图
        controllButtons:[cc.Button],  //控制按钮

        _animBase:cc.Animation,
        _currentStep:1,
        _showTipboxTime:0,

        
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        if(this.imgBase!=null)
        this._animBase=this.imgBase.getComponent(cc.Animation);
    },

    // update (dt) {},

    /**显示朋友提示
     */
    showTipFriend(){
        this.showBackground();
        this.imgBase.spriteFrame=this.spTipFriend;
        this._animBase.play();
    },
    /**显示背景节点 */
    showBackground(){
        this.ndBackground.active=true;
    },
    /** 关闭
     */
    closeImage(){
        this.ndBackground.active=false;
    },
    //第一步
    step1(){
        this.showTipFriend();
    },
    step1_pointout(){
        this.ndPointoutBath.active=true;
    },
    //点击背景
    background_onClick(){
        let sec=new Date().getSeconds();
        if(Math.abs(sec-this._showTipboxTime<2)){
            return;
        }
        switch(_currentStep){
            case 1:{
                
            };break;
        }
    },
    //显示提示框
    showTipBox(sprite){
        this._showTipboxTime=new Date().getSeconds();
        this.showBackground();
        this.imgBase.spriteFrame=sprite;
        this._animBase.play();
    },

    //启用指定按钮
    enableButton(idx){
        this.controllButtons[idx].interactable=true;
    },
    //禁用所有按钮
    disableAllButton(){
        for(var i=0;i<this.controllButtons.length;i++){
            this.controllButtons[i].interactable=false;
        }
    },
    runStep(){

    }
});
