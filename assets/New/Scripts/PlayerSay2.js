
var Common=require("Common");
cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},

    onEnable(){
        this.node.getComponent(cc.Animation).play("fadeIn");
    },

    openSay(text){
        if(Common.isNullOrEmpty(text))
            return;
        this.node.active=true;
        this.node.getChildByName("Text").getComponent(cc.Label).string=text;
        this.unscheduleAllCallbacks();
        this.scheduleOnce(this.onHide, 2);
    },
    onHide(){
        this.node.active=false;
    }
});
