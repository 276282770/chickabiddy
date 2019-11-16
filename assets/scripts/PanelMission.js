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
        ndBg:cc.Node,  //背景节点
        prePanelAnswer:cc.Prefab,  //答题
        ndMiss0:cc.Node,  //任务0
        ndMiss1:cc.Node,  //任务1
        spMissShareGray:cc.SpriteFrame,  //分享灰色
        spMissAnswerGray:cc.SpriteFrame,  //答题灰色
        _panelReady:false,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.load();
    },
    onShow(){
        var self=this;
        let h=this.ndBg.height;
        let x=this.ndBg.position.x;
        this.ndBg.runAction(cc.sequence(
            cc.moveTo(0.5,x,h),
            cc.callFunc(function(){
                self._panelReady=true;
            })
        ));
    },
    onClose(){
        if(!this._panelReady)
            return;
        let x=this.ndBg.position.x;
        var self=this;
        this.ndBg.runAction(cc.sequence(
            cc.moveTo(0.5,x,0),
            cc.callFunc(function(){

                //引导
                Global.game.guide.showPic(0);

                self.node.destroy();
            })
        ));
    },
    onEnable(){
        this.onShow();
    },
    //分享任务
    onShare(){
        Global.game.onShare("tp=af&id="+Global.id);
        this.onClose();
    },
    //答题
    onAnswer(){
        var self=this;
        let panel=cc.instantiate(self.prePanelAnswer);
        // panel.parent=cc.find("Canvas");
        // Global.game.panels.createPanel(self.prePanelAnswer,"PanelAnswer");
        panel.parent=Global.game.panels.node;

        this.node.destroy();
    },
    load(){
        var self=this;
        Network.requestMission((res)=>{
            if(res.result){
                if(res.data.miss0Cmplt){
                    // self.ndMiss0.getChildByName("txtComplete").active=true;
                    self.ndMiss0.getChildByName("btnOK").getComponent(cc.Sprite).spriteFrame=this.spMissShareGray;
                }
                if(res.data.miss1Cmplt){
                    // self.ndMiss1.getChildByName("txtComplete").active=true;
                    self.ndMiss1.getChildByName("btnOK").getComponent(cc.Sprite).spriteFrame=this.spMissAnswerGray;
                    self.ndMiss1.getComponent(cc.Button).interactable=false;
                }
            }
        });
    },
});
