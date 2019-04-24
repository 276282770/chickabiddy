
var Network=require("Network");
cc.Class({
    extends: cc.Component,

    properties: {

        ndBg:cc.Node,  //背景
        tabBtnWorld:cc.Button,  //世界排行榜按钮
        tabBtnWechat:cc.Button,  //微信排行榜
        ndCtntWorld:cc.Node,  //世界排行榜内容根节点
        ndCtntWechat:cc.Node,  //微信排行榜根节点
        ndSvWorldRank:cc.Node,  //sv世界排行榜根节点
        ndSvWechatRank:cc.Node,  //sv微信排行榜根节点

        _isPanelReady:false,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },
    onTab(event,customData){
        switch(customData){
            case "WorldRank":{
                this.tabBtnWorld.interactable=true;
                this.tabBtnWechat.interactable=false;
                this.ndSvWechatRank.active=true;
                this.ndSvWorldRank.active=false;
            };break;
            case "WechatRank":{
                this.tabBtnWorld.interactable=true;
                this.tabBtnWechat.interactable=false;
                this.ndSvWechatRank.active=true;
                this.ndSvWorldRank.active=false;
            };break;
        }
    },

    // update (dt) {},

    //显示面板
    show(){
        var self=this;
    this.ndBg.runAction(cc.sequence( cc.moveTo(0.5,new cc.Vec2(this.ndBg.position.x,this.ndBg.height)),
        cc.callFunc(function(){self._isPanelReady=true;})
        ));
        // this.load();
    },
        //删除面板
        onClose(){
            var self=this;
            if(!this._isPanelReady)
            return;
            this.ndBg.runAction(cc.sequence( 
                cc.moveTo(0.5,new cc.Vec2(this.ndBg.position.x,0)),
                cc.callFunc(function(){
                    self.node.destroy();
                    console.log("删除面板");
                })));
        },
    onEnable(){
        this.show();
    },
});
