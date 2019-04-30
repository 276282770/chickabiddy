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

        

        _thiefData:{default:[]},

        _isExtendOpen0:false,
        _isExtendOpen1:false,
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
        if(data[0]!=null){
            this.ndThief0.active=true;
            this.ndThief0.getChildByName("txtName").getComponent(cc.Label).string=data[0].name;
        }else{
            this.ndThief0.active=false;
        }
        if(data[1]!=null){
            this.ndThief1.active=true;
            this.ndThief1.getChildByName("txtName").getComponent(cc.Label).string=data[1].name;
        }else{
            this.ndThief1.active=false;
        }
        this._thiefData=data;

        if(this.thiefCount()>0){
            this.onShow();
        }else{
            this.onHide();
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
    onHide(){
        this.node.runAction(cc.moveBy(1,0,1300));
    },
    onShow(){
        this.node.position=new cc.Vec2(0,0);
    },

    // update (dt) {},
    onThiefClick(event,customerData){
        if(customerData=="0"){
            console.log("【点击第一个小鸡】");
        // this.ndBg.active=true;
         this.showExtend(0,!this._isExtendOpen0);
        }else{
            console.log("【点击第二个小鸡】");
            this.showExtend(1,!this._isExtendOpen1);
        }
    },
    //显示扩展
    showExtend(idx,show){
        if(idx==0){
            if(show){
                if(this._isExtendOpen0)
                    return;
                this.ndThief0.getChildByName("Extend").getComponent(cc.Animation).play("player_extend_open");
                this._isExtendOpen0=true;
            }else{
                if(!this._isExtendOpen0)
                    return;
                this.ndThief0.getChildByName("Extend").getComponent(cc.Animation).play("player_extend_close");
                this._isExtendOpen0=false;
            }
        }else{
            if(show){
                if(this._isExtendOpen1)
                    return;
                this.ndThief1.getChildByName("Extend").getComponent(cc.Animation).play("player_extend_open");
                this._isExtendOpen1=true;
            }else{
                if(!this._isExtendOpen1)
                    return;
                this.ndThief1.getChildByName("Extend").getComponent(cc.Animation).play("player_extend_close");
                this._isExtendOpen1=false;
            }
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
    onFight(event,customerData){
        var self=this;
        let idx;
        let thief0,thief1;
        if(customerData=="0"){
            idx=0;
            thief0=this.ndThief0;
            thief1=this.ndThief1;
        }else{
            idx=1;
            thief0=this.ndThief1;
            thief1=this.ndThief0;
        }
        Network.requestHit(self._thiefData[idx].id,(res)=>{
            if(res.result){
                let data=res.data;
                self.showExtend(idx,false);
                self.showExtend(idx,false);
                self.openSay(idx,data.say);
                self.openSay(idx,data.otherSay);
                   Global.game.player.openSay(data.playerSay);
                   thief1.getComponent(cc.Animation).play("thief_out");
                   thief0.getComponent(cc.Animation).play("thief_hit");

                   self.scheduleOnce(function(){
                    thief0.active=false;
                    thief1.active=false;
                    Global.game.showTip(data.awardTxt);
                    self.onHide();
                   },2);
            }
        });
        
    },
    //赶走
    onOut(event,customerData){
        var self=this;
        let idx;
        let thiefNode;
        if(customerData==0){
            idx=0;
            thiefNode=this.ndThief0;
        }else{
            idx=1;
            thiefNode=this.ndThief1;
        }

        this.showExtend(idx,false);
        Network.requestDriveOff(self._thiefData[idx].id,(res)=>{
            if(res.result){
                self._thiefData[idx]=null;
                let data=res.data;
                   self.openSay(idx,data.say);
                   Global.game.player.openSay(data.playerSay);
                    thiefNode.getComponent(cc.Animation).play("thief_out");

                    self.scheduleOnce(function(){
                        thiefNode.active=false;
                        Global.game.showTip(data.awardTxt);
            if(self.thiefCount()==0){
                self.onHide();
                
            }
        },2);
        }
        });

    },
    //小偷说
    openSay(idx,txt){
        if(txt==null||txt=="")
            return;
            let thiefNode;
        if(idx==0){
            thiefNode=this.ndThief0;
        }else{
            thiefNode=this.ndThief1;
        }
        let ndThiefSay=thiefNode.getChildByName("Say");
        ndThiefSay.active=true;
        ndThiefSay.getChildByName("txtSay").getComponent(cc.Label).string=txt;
        this.scheduleOnce(function(){
            ndThiefSay.active=false;
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
    //小偷数量
    thiefCount(){
       let result=0;
       if(this._thiefData[0]!=null)
        result++;
        if(this._thiefData[1]!=null)
        result++;
        return result;  
    },
});
