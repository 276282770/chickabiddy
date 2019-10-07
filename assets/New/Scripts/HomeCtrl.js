var Network = require("Network");
cc.Class({
    extends: cc.Component,

    properties: {
        ndLeft: cc.Node,
        ndRight: cc.Node,
        ndDown: cc.Node,
        ndInnerLoading: cc.Node,  //内部加载屏
        ndPanelFriend: cc.Node,  //好友面板

        ndProgEgg: cc.Node,  //生鸡蛋进度节点
        ndProgLunchBox: cc.Node,  //饭缸节点
        ndProgExp: cc.Node,  //经验条节点

        btnAvatar: cc.Button,  //头像按钮

        // prePanelPackage:cc.Prefab,  //背包预制体

        _uid: 0,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    // update (dt) {},

    //去被人家
    gotoOtherHome() {
        var self = this;
        this._uid = Global.scene.otherUid;
        self.ndInnerLoading.active = true;
        Global.game.player.resetPostion();

        Network.requestPersonInfo(this._uid, (res) => {
            if (res.result) {
                Global.sceneCode = 1;

                self.changeNode(false);

                Global.game.updateOtherState(res.data);
            } else {
                Global.game.showTip(res.data);
            }
            self.ndInnerLoading.active = false;
        });
    },
    //回家
    backHome() {
        var self = this;
        self.ndInnerLoading.active = true;
        Global.game.player.resetPostion();

        Network.requestIndexInfo((res) => {
            if (res.result) {
                Global.sceneCode = 0;
                self.changeNode(true);
                Global.game.updateState(res.data);
            } else {
                Global.game.showTip(res.data);
            }
            self.ndInnerLoading.active = false;
        });
    },
    changeNode(isBackHome) {

        this.ndLeft.active = isBackHome;
        this.ndRight.active = isBackHome;
        this.ndDown.getChildByName("Mine").active = isBackHome;
        this.ndDown.getChildByName("Other").active = !isBackHome;
        this.ndPanelFriend.active = isBackHome;
        this.ndProgEgg.active = isBackHome;
        this.ndProgExp.active = isBackHome;
        this.ndProgLunchBox.active = isBackHome;
        this.btnAvatar.interactable = isBackHome;
    },
    //蹭饭
    onStealingFood() {
        var self = this;
        Network.stealingFood(this._uid, (res) => {
            if (res.result) {
                // Global.game.onDine();
                self.updateIndex();
            }
        });
    },
    //请客吃饭
    onTreatFood() {
        var self = this;
        Network.treatFood(this._uid, (res) => {
            if (res.result) {
                self.backHome();
            }else{
                Global.game.showTip(res.data);
            }
        });
    },
    //给别人喂食
    onGiveOtherFood() {
        Global.game.onShowPanelPackage();
    },
    //给被人洗澡
    onGiveOtherBath() {
        // Network.requestBathHelp(this._uid, (res) => {
        //     if (res.result) {
        //         Global.game.onBath();
        //     }
        //     Global.game.showTip(res.data.tip);
        //     Global.game.player.openSay(res.data.say);

        // });
        Global.game.onBath();
    },

    //更新
    updateIndex() {
        Network.requestPersonInfo(this._uid, (res) => {
            if (res.result) {
                Global.game.updateState(res.data);
            }
        });
    },
});
