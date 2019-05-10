// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


var Network = require("Network");
var Player = require("Player");
var Thief = require("Thief");
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

        txtEggCount: cc.Label,  //鸡蛋个数
        proEgg: cc.ProgressBar,  //鸡蛋的进度
        imgAvatar: cc.Sprite,  //头像
        txtLvl: cc.Label,  //等级
        txtNickname: cc.Label,  //昵称
        ndThief: cc.Node,  //小偷
        ndFindPlayer: cc.Node,  //寻找小鸡

        player: Player,  //
        thief: Thief,  //小偷
        preMsgBox: cc.Prefab,  //消息框预制体
        prePlayerBath: cc.Prefab,  //洗澡预制体

        ndTipEgg: cc.Node,  //偷蛋提示
        ndTipBath: cc.Node,  //洗澡提示





        _uid: -1,  //用户ID
        _eggCount: 0,  //鸡蛋数量
        _state: 0,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        Global.game = this;
        this.iniNode();
    },

    start() {

        this.updateIndex();
    },
    iniNode() {
        this.thief = this.ndThief.getComponent("Thief");
    },

    // update (dt) {},

    //填充
    updateIndex() {

        var self = this;
        this._uid = Global.scene.otherUid;

        Network.requestPersonInfo(this._uid, (res) => {
            if (res.result) {
                let data = res.data;
                if (data.avatar != "") {
                    cc.loader.load({ url: data.avatar, type: "png" }, function (err, tex) {
                        if (!err) {
                            self.imgAvatar.spriteFrame = new cc.SpriteFrame(tex);
                        }
                    });
                }
                self.txtEggCount.string = data.eggCount.toString();
                self._eggCount = data.eggCount;
                self.txtLvl.string = data.lvl.toString();
                self.txtNickname.string = data.nickName;
                self.ndThief.getComponent("Thief").setThief(data.thiefs);

                if (data.say != "") {
                    self.player.openSay(data.say);
                }

                self.ndFindPlayer.active = false;
                if (data.playerState == 0) {
                    self.player.setState(0);
                }
                if (data.playerState == 1) {

                    self.player.setState(3);
                } else if (data.playerState == 2) {
                    self.player.node.active = false;
                    Global.scene.otherUid = data.otherId;
                    self.ndFindPlayer.active = true;
                }
                //更新鸡蛋进度
                self.proEgg.progress = data.eggProgress;

                console.log("====================="+data.canPickupEgg+" "+data.canBath);
                self.setTip(data.canPickupEgg,data.canBath);
            }
        });
    },

    //拾鸡蛋
    onPickupEgg() {
        var self = this;
        Network.requestPickupOtherEgg(this._uid, (res) => {
            let data = res.data;
            if (res.result) {

                self._eggCount--;
                // this.txtEggCount.string=data.eggCount;
                self.txtEggCount.string = self._eggCount.toString();
                self.showTip("成功偷取了鸡蛋");
                self.updateIndex();
            } else {
                if (data.tip) {
                    self.showTip(data.tip);
                }
                if (data.say)
                    self.player.openSay(data.say);
            }
        });
    },

    //返回
    onBack() {
        Global.scene.nextSceneName = "Main";
        cc.director.loadScene("Loading");
    },
    // //回家
    // goHome(){
    //     Global.nextScene="Main";
    //     cc.director.loadScene("Loading");
    // },
    //给它的小鸡洗澡
    onBath() {
        var self = this;
        Network.requestBathHelp(this._uid, (res) => {
            var data = res.data;
            if (res.result) {

                self.onPlayBath(data.say);
                self.updateIndex();
            }
            else {
                self.player.openSay(data.say);
            }
            if (data.tip)
                self.showTip(data.tip);
        });
    },

    //显示提示框
    showTip(txt) {
        if (txt == null || txt == "")
            return;
        let msgBox = cc.instantiate(this.preMsgBox);
        msgBox.parent = this.node;
        let msgBoxScr = msgBox.getComponent("MsgBox");
        msgBoxScr.show(txt);
    },
    //播放洗澡
    onPlayBath(sayText) {
        let bath = cc.instantiate(this.prePlayerBath);
        bath.parent = this.node;
        let bathScr = bath.getComponent("PlayerBath");
        bathScr.fill(sayText);
    },

    setTip(eggTip, cleanTip) {
        this.ndTipEgg.active = false;
        this.ndTipBath.active = false;
        if (eggTip) {
            this.ndTipEgg.active = true;
        } else if (cleanTip) {
            this.ndTipBath.active = true;
        }
    },

    test() {
        this.player.openSay("你好");
    },




});
