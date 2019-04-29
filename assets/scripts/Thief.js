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
        txtName:cc.Label,  //名字
        ndBg:cc.Node,  //背景

        ndThief0:cc.Node,  //角色0
        ndThief1:cc.Node,  //角色1

        

        _thiefData:{},

        _isExtendOpen:false,
        _cid:-1,  //id
        _pos0:{default:new cc.Vec2(-121,-293)},
        _pos1:{default:new cc.Vec2(156,-293)},
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },
    setThief(data){
        if(data.length>2)
            return;
        if(data.length==1){
            this._thiefData[0]=data;
            this.ndThief0.active=true;
            this.ndThief0.getChildByName("txtName").getComponent(cc.Label).string=data.name;
        }
        else if(data.length==2){
            this._thiefData=data;
            this.ndThief1.active=true;
            this.ndThief1.getChildByName("txtName").getComponent(cc.Label).string=data[1].name;
            this.ndThief0.active=true;
            this.ndThief0.getChildByName("txtName").getComponent(cc.Label).string=data[0].name;

        }
        
    },
    addThief(data){
        if(!this.ndThief0.active){
            this.ndThief0.active=true;
            this._thiefData[0]=data;
            return;
        }
        if(!this.ndThief1.active){
            this.ndThief1.active=true;
            this._thiefData[1]=data;
        }
    },
    onClose(){
        var self=this;
        this.node.runAction(cc.sequence( cc.moveBy(1,0,1300),cc.callFunc(function(){
            self.node.destroy();
        })));
    },
    onShow(){

    },

    // update (dt) {},
    onClick0(){
        // this.ndBg.active=true;
        if(!this._isExtendOpen){
        // this.ndThief.getComponent(cc.Button).interactable=false;
        this.ndThief0.getChildByName("Extend").getComponent(cc.Animation).play("player_extend_open");
        this._isExtendOpen=true;
        }else{
            this.ndThief0.getChildByName("Extend").getComponent(cc.Animation).play("player_extend_close");
            this._isExtendOpen=false;
        }
    },
    onClickBg(){
        var self=this;
        
        this.ndExtend.getComponent(cc.Animation).play("player_extend_open");
        this.scheduleOnce(function(){
        this.ndBg.active=false;
        this.ndThief.getComponent(cc.Button).interactable=true;
        },0.2);
    },
    //揍他
    onFight0(){
        var self=this;
        this.ndThief0.getChildByName("Extend").getComponent(cc.Animation).play("player_extend_close");
        Network.requestThiefOut(self._thiefData[0].id,(res)=>{
            if(res.result){
                let data=res.result.data;
                self.openSay0(data.say);
                self.openSay1(data.otherSay);
                   Global.game.player.openSay(data.playerSay);
                   self.ndThief1.getComponent(cc.Animation).play("thief_out");
                   self.ndThief0.getComponent(cc.Animation).play("thief_fit");

                   self.scheduleOnce(function(){
                    self.ndThief0.active=false;
                    self.ndThief1.active=false;
                    Global.game.showTip(data.awardTxt);
                    self.onClose();
                   },1);
            }
        });
    },
    //赶走
    onOut0(){
        var self=this;
        this.ndThief0.getChildByName("Extend").getComponent(cc.Animation).play("player_extend_close");
        Network.requestThiefOut(self._thiefData[0].id,(res)=>{
            if(res.result){
                let data=res.result.data;
                   self.openSay0(data.say);
                   Global.game.player.openSay(data.playerSay);
                    self.ndThief0.getComponent(cc.Animation).play("thief_out");

                    self.scheduleOnce(function(){
                        self.ndThief0.active=false;
                        Global.game.showTip(data.awardTxt);
            if(!self.ndThief1.active){
                self.onClose();
                
            }
        },1);
        }
        });

    },
    openSay0(txt){
        if(txt==null||txt=="")
            return;
        let ndThiefSay0=self.ndThief0.getChildByName("Say");
        this.ndThiefSay0.active=true;
        ndThiefSay0.getChildByName("txtSay").getComponent(cc.Label).string=txt;
        this.scheduleOnce(function(){
            this.ndThiefSay0.active=false;
        },2);
    },
    //播放吃动画
    playEat(){
        this.ndThief.getComponent(cc.Animation).play("thief_eat");
    },
    fill(id,name){
        this._cid=id;
        this.txtName.string=name;
    },
    thiefCount(){
        
    },
});
