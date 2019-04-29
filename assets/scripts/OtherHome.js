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
        animCloud:cc.Animation,  //遮挡云
        txtEggCount:cc.Label,  //鸡蛋个数
        imgAvatar:cc.Sprite,  //头像
        txtLvl:cc.Label,  //等级
        txtNickname:cc.Label,  //昵称
        _uid:-1,  //用户ID
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},

    //填充
    load(id){
        var self=this;
        this._uid=id;
        Network.requestPersonInfo((res)=>{
            if(res.result){
                let data=res.data;
                cc.loader.load({url:data.avatar,type:"png"},function(err,tex){
                    if(!err){
                        self.imgAvatar.spriteFrame=new cc.SpriteFrame(tex);
                    }
                });
                self.txtEggCount.string=data.eggCount.toString();
                self.txtLvl.string=data.lvl.toString();
                self.txtNickname.string=data.nickName;
            }
        });
    },

    //拾鸡蛋
    onPickupEgg(){
        var self=this;
        Network.requestPickupOtherEgg(this._uid,(res)=>{
            if(res.result){
                let data=res.data;
                this.txtEggCount.string=data.eggCount;
            }
        });
    },

    //返回
    onBack(){
        // animCloud.play("curtain_close");
        this.scheduleOnce(function(){
            this.node.active=false;
        },)
    },
    //给它的小鸡洗澡
    onBath(){
        var self=this;
        Network.requestBathHelp(this._uid,(res)=>{
            if(res.result){
                var data=res.data;
                Global.game.onPlayPlayerBath(data.say);
            }
        });
    },
});
