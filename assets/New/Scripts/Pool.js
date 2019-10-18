var Player=require("Player2");
var CameraController=require("CameraController2");
cc.Class({
    extends: cc.Component,

    properties: {
        player:Player,  //玩家
        camera:CameraController,  //摄像机控制
        animBath:cc.Animation,  //洗澡动画

        ndClothBucket:cc.Node,  //衣服篓

        spBgs:[cc.SpriteFrame],  //背景列表
        



        _anim:cc.Animation,  //动画
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this._anim=this.node.getComponent(cc.Animation);
    },

    // update (dt) {},
    //播放洗澡
    playBath(){
        this.player.node.active=false;
        this.animBath.play("Player2_poolBath");
        this.scheduleOnce();
    },
    controlCamPlayer(isCtrl){
        if(isCtrl){
            this.player.node.active=false;
            this.camera._isFollow=false;
            // this.camera.node.setPosition(new cc.Vec2(this.));
        }
    },
    //停止洗澡
    stopBath(){
        this.node.getChildByName("bath2").active=false;
    },
    onBath(){
        var self=this;
        this.node.getChildByName("bath2").active=true;
        this.scheduleOnce(function(){
            self.stopBath();
            Global.game.player.goBathBack();
        },5);
    },

    changeStyle(st){
        this.node.getComponent(cc.Sprite).spriteFrame=this.spBgs[st];
        this.ndClothBucket.getComponent("ClothBucket2").changeStyle(st);
    }
});
