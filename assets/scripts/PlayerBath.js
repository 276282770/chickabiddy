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
        
        txtSay:cc.Label,  //说话
        animBath:cc.Animation,  //洗澡动画
        // animSay:cc.Animation,  //说话动画
        _awardTxt:"",
        _backTime:10,  //返回时间
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.scheduleOnce(function(){
            this.node.destroy();
            Global.game.showTip(this._awardTxt);
        },this._backTime);
        this.onPlayBath();
        // this.onPlaySay();
    },
    fill(txt,awardTxt){
        this._awardTxt=awardTxt;
        if(txt!=null&&txt!=""){
            this.txtSay.string=txt;
        }
    },
    //播放洗澡动画
    onPlayBath(){
        var self=this;
        this.animBath.play("player_bath0");
        this.scheduleOnce(function(){
            self.animBath.play("player_bath1");
        },0.4);
    },
    //播放说话动画
    onPlaySay(){
        this.animSay.play("say_open");
    },

    // update (dt) {},
});
