var Network=require("Network");
cc.Class({
    extends: cc.Component,

    properties: {
        ndLeft: cc.Node,
        ndRight: cc.Node,
        ndDown:cc.Node,
        ndInnerLoading: cc.Node,  //内部加载屏
        ndPanelFriend:cc.Node,  //好友面板
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    // update (dt) {},

    //去被人家
    gotoOtherHome() {
        var self=this;



        Network.requestPersonInfo(uid,(res)=>{
            if(res.result){
                Global.sceneCode=1;

                let uid=Global.scene.otherUid;
                self.ndInnerLoading.active = true;
                self.ndLeft.active = false;
                self.ndRight.active = false;
                self.ndDown.getChildByName("Mine").active = false;
                self.ndDown.getChildByName("Other").active = true;
                self.ndPanelFriend.active=false;

                Global.game.updateState(res.data);
            }else{
                Global.game.showTip(res.data);
            }
            self.ndInnerLoading.active=false;
        });
    },
    //回家
    backHome() {
        var self=this;



        Network.requestIndexInfo((res)=>{
            if(res.result){
                Global.sceneCode=0;

                self.ndInnerLoading.active=true;
                self.ndLeft.active=true;
                self.ndRight.active = true;
                self.ndDown.getChildByName("Mine").active = true;
                self.ndDown.getChildByName("Other").active = false;
                self.ndPanelFriend.active=true;

                Global.game.updateState(res.data);
            }else{
                Global.game.showTip(res.data);
            }
            self.ndInnerLoading.active=false;
        });
    },
});
