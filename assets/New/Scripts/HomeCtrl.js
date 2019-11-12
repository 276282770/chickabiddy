var Network = require("Network");
var WX=require("WX");
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

        imgBg:cc.Sprite,  //背景
        spBgs:[cc.SpriteFrame],  //背景
        ndLunchbox:cc.Node,  //饭盒
        ndPool:cc.Node,  //池塘
        ndFalls:cc.Node, //瀑布

        // prePanelPackage:cc.Prefab,  //背包预制体

        _isShowPanelFriend: false,

        _uid: 0,

        _bg:0,  //默认   999.树林  14.海边 

        _bgId:[],
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this._bgId=[999,14];
    },

     update (dt) {
         
     },

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
                Global.game.player.openSay(res.data.say);
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
        Global.game.camera.setDefault();

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

        this.ndProgEgg.active = isBackHome;
        this.ndProgExp.active = isBackHome;
        // this.ndProgLunchBox.active = isBackHome;
        this.btnAvatar.interactable = isBackHome;


        if (isBackHome) {
            //回到家
            if (this._isShowPanelFriend) {
                this.ndPanelFriend.active = isBackHome;
            }
            WX.gameClubButton.show();
        } else {
            //去被人家
            this._isShowPanelFriend = this.ndPanelFriend.active;
            this.ndPanelFriend.active = isBackHome;
            WX.gameClubButton.hide();
        }
    },
    //蹭饭
    onStealingFood() {
        var self = this;
        Network.stealingFood(this._uid, (res) => {
            if (res.result) {
                // Global.game.onDine();
                self.updateIndex();
                Global.game.showTip("蹭吃成功");
            }else{
                Global.game.showTip(res.data);
            }
        });
    },
    //请客吃饭
    onTreatFood() {
        var self = this;
        Network.treatFood(this._uid, (res) => {
            if (res.result) {
                self.backHome();
            } else {
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
                Global.game.updateOtherState(res.data);
            }
        });
    },  
    //改变背景
    changeBG(bg){
        if(bg==this._bg){
            return;
        }
        this._bg=bg;
        console.log("【更改背景】#"+bg);
        this.imgBg.spriteFrame=this.spBgs[bg];
        this.ndLunchbox.getComponent("LunchBox2").changeStyle(bg);
        this.ndPool.getComponent("Pool").changeStyle(bg);

        if(this._bgId[bg]==this._bgId[0]){
            this.ndFalls.active=true;
        }else{
            this.ndFalls.active=false;
        }
    },

    changeBGById(id){
        let bgIdx=0;
        if(id==this._bgId[0]){
            bgIdx=0;
        }else if(id==this._bgId[1]){
            bgIdx=1;
        }
        this.changeBG(bgIdx);
    },
    test(){
        
        this._bg=1-this._bg;
        
        this.changeBG(this._bg);
    }
});
