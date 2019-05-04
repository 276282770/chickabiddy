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
var Player=require("Player");
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

        txtEggCount:cc.Label,  //鸡蛋个数
        imgAvatar:cc.Sprite,  //头像
        txtLvl:cc.Label,  //等级
        txtNickname:cc.Label,  //昵称
        ndThief:cc.Node,  //小偷

        player:Player,  //
        preMsgBox:cc.Prefab,  //消息框预制体
        prePlayerBath:cc.Prefab,  //洗澡预制体

        _uid:-1,  //用户ID
        _eggCount:0,  //鸡蛋数量
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        Global.game=this;
    },

    start () {
        
        this.load();
    },

    // update (dt) {},

    //填充
    load(){

        var self=this;
        this._uid=Global.otherPersonId;
  
        Network.requestPersonInfo(this._uid,(res)=>{
            if(res.result){
                let data=res.data;
        if(data.avatar!=""){
                cc.loader.load({url:data.avatar,type:"png"},function(err,tex){
                    if(!err){
                        self.imgAvatar.spriteFrame=new cc.SpriteFrame(tex);
                    }
                });
            }
                self.txtEggCount.string=data.eggCount.toString();
                self._eggCount=data.eggCount;
                self.txtLvl.string=data.lvl.toString();
                self.txtNickname.string=data.nickName+"家的小鸡";
                self.ndThief.getComponent("Thief").setThief(data.thiefs);
                
                if(data.say!=""){
                    self.player.openSay(data.say);
                }
            }
        });
    },

    //拾鸡蛋
    onPickupEgg(){
        var self=this;
        Network.requestPickupOtherEgg(this._uid,(res)=>{
            let data=res.data;
            if(res.result){
                
                self._eggCount--;
                // this.txtEggCount.string=data.eggCount;
                self.txtEggCount.string=self._eggCount.toString();
                self.showTip("成功偷取了鸡蛋");
            }else{
                if(data.tip){
                    self.showTip(data.tip);
                }
                if(data.say)
                    self.player.openSay(data.say);
            }
        });
    },

    //返回
    onBack(){
        Global.nextScene="Main";
        cc.director.loadScene("Loading");
    },
        // //回家
        // goHome(){
        //     Global.nextScene="Main";
        //     cc.director.loadScene("Loading");
        // },
    //给它的小鸡洗澡
    onBath(){
        var self=this;
        Network.requestBathHelp(this._uid,(res)=>{
            var data=res.data;
            if(res.result){
                
                self.onPlayBath(data.say);
            }
            else{
                self.player.openSay(data.say);
            }
            if(data.tip)
                self.showTip(data.tip);
        });
    },

        //显示提示框
        showTip(txt){
            if(txt==null||txt=="")
                return;
            let msgBox= cc.instantiate(this.preMsgBox);
            msgBox.parent=this.node;
            let msgBoxScr=msgBox.getComponent("MsgBox");
            msgBoxScr.show(txt);
        },  
    //播放洗澡
    onPlayBath(sayText){
        let bath=cc.instantiate(this.prePlayerBath);
        bath.parent=this.node;
        let bathScr= bath.getComponent("PlayerBath");
        bathScr.fill(sayText);
    },
    test(){
        this.player.openSay("你好");
    },

});
