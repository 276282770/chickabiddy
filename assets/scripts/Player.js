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
        ndBg:cc.Node,  //背景
        ndExtend:cc.Node,  //扩展节点
        animPlayer:cc.Animation,  //小鸡动画
        animExtend:cc.Animation,  //扩展动画
        txtSay:cc.Label,  //小鸡说话
        ndPlayer:cc.Node,  //小鸡节点

        _state:0,  //小鸡状态  0正常，1被点击，2空闲
        _remainChangeTime:0,  //改变状态小鸡时间
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.setRandomChangeTime();
    },

    update (dt) {
        if(this._state==0){
        if(this._remainChangeTime>0){
            this._remainChangeTime-=dt;
        }else{
            this.playIdle();
            this.setRandomChangeTime();
        }
        }
        if(this._state==2){
            if(this._remainChangeTime>0){
                this._remainChangeTime-=dt;
            }else{
                this.playNormal();
                this.setRandomChangeTime();
            }
        }
    },

    //点击小鸡
    onClick(){
        console.log("点击小鸡");
        if(Global.game._thiefCount>0){
            Global.game.showTip("我的食物都快被抢光了..");
            return;
        }
        var self=this;
        this._state=1;
        this.ndBg.active=true;
        this.ndExtend.active=true;
        this.animPlayer.play("player_click");
        this.animExtend.play("player_extend_open");
        this.ndPlayer.getComponent(cc.Button).interactable=false;
        Network.requestClickPlayer((res)=>{
            if(res.result){

                self.txtSay.node.parent.active=true;
                self.txtSay.string=res.data.text;
            }
        });
    },
    //点击背景
    onClickBg(){
        var self=this;
        this.animExtend.play("player_extend_close");
        self.txtSay.node.parent.active=false;
        this.scheduleOnce(function(){
        self._state=0;
        self.ndBg.active=false;
        self.animPlayer.play("player_normal");
        self.ndPlayer.getComponent(cc.Button).interactable=true;
        this.ndExtend.active=false;
        },0.2);
    },
    playIdle(){
        this._state=2;
        this.animPlayer.play("player_idle");
    },
    playNormal(){
        this._state=0;
        this.animPlayer.play("player_normal");
    },
    setRandomChangeTime(){
        let tm=Math.random()*15;
        if(tm<5)
            tm=5;
        this._remainChangeTime=tm;
    },
    //打开攻略说明界面
    onOpenInstruction(){
        this.onClickBg();
        Global.game.onShowPanelInstruction();
    },

});