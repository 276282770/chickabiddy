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
        ndThiefRoot: cc.Node,
        ndFindPlayer: cc.Node,  //寻找小鸡
        ndPlayerRoot: cc.Node,
        ndEgg: cc.Node,  //鸡蛋节点
        ndTV: cc.Node,  //电视
        ndCloud: cc.Node,  //云彩节点

        player: Player,  //

        thief: Thief,  //小偷
        preMsgBox: cc.Prefab,  //消息框预制体
        prePlayerBath: cc.Prefab,  //洗澡预制体
        prePlayerDine: cc.Prefab,  //吃饭预制体

        prePlayer: cc.Prefab,  //小鸡预制体
        preThief: cc.Prefab,  //小偷预制体

        prePanelPackage: cc.Prefab,  //背包
        prePanelShop: cc.Prefab,  //商店

        ndTipEgg: cc.Node,  //偷蛋提示
        ndTipBath: cc.Node,  //洗澡提示


        imgBg: cc.Sprite,  //背景

        spBgs: [cc.SpriteFrame],  //背景 0 正常背景，1有小偷时


        _uid: -1,  //用户ID
        _eggCount: 0,  //鸡蛋数量
        _state: 0,


    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        Global.game = this;
        // this.iniNode();
    },

    start() {
        Global.sceneCode = 1;
        this.updateIndex();
    },
    iniNode() {
        let playerNode = cc.instantiate(this.prePlayer);
        playerNode.parent = this.ndPlayerRoot;
        this.player = playerNode.getComponent("Player");
        this.player.setId(Global.otherPersonId);
        this.ndThief = cc.instantiate(this.preThief);
        this.ndThief.parent = this.ndThiefRoot;
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
                // self.ndThief.getComponent("Thief").setThief(data.thiefs);

                if (data.say != "") {
                    self.player.openSay(data.say);
                }


                // if (data.playerState == 0) {
                //     self.player.setState(0);
                // }
                // if (data.playerState == 1) {

                //     self.player.setState(3);
                // } else if (data.playerState == 2) {
                //     self.player.node.active = false;
                //     Global.scene.otherUid = data.otherId;
                //     self.ndFindPlayer.active = true;
                // }
                self.player.setState(data.playerState);
                if (data.playerState == 7) {
                    self.ndFindPlayer.active = true;
                }
                //更新鸡蛋进度
                self.proEgg.progress = data.eggProgress;

                // self.setTip(data.canPickupEgg, data.canBath);

                //小偷方法
                if (data.thiefs != null) {
                    let currentThiefsCount = 0;  //现在小偷数量
                    let originalThiefsCount = self.thief._lastThiefCount;  //原来小偷数量
                    //计算现在小偷数量
                    if (data.thiefs[0] != null)
                        currentThiefsCount++;
                    if (data.thiefs[1] != null)
                        currentThiefsCount++;

                    //如果小偷被弄完时
                    if (currentThiefsCount == 0 && originalThiefsCount > 0) {
                        self.onCloudClose();
                        self.scheduleOnce(function () {
                            self.backgroundScale("normal");
                            self.onCloudOpen();
                        }, 2);
                    }
                    //如果进来小偷时
                    if (currentThiefsCount > 0 && originalThiefsCount <= 0) {
                        if (originalThiefsCount == -1) {
                            self.backgroundScale("small");
                        } else {
                            self.onCloudClose();
                            self.scheduleOnce(function () {
                                self.backgroundScale("small");
                                self.onCloudOpen();
                            }, 2);
                        }
                    }
                    if (data.thiefs[0] != null || data.thiefs[1] != null) {
                        //有小偷


                    } else {
                        //没有小偷

                    }
                    self.thief.setThief(data.thiefs);
                }

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
    showCtrl() {

    },
    //背景缩放
    backgroundScale(para) {
        switch (para) {
            case "normal": {
                this.imgBg.spriteFrame = this.spBgs[0];
                this.player.setPlayerScale(para);
                this.ndEgg.setScale(1.2);
                this.ndEgg.setPosition(-242, -446);
                this.ndTV.active = true;
                this.ndThiefRoot.active = false;
            }; break;
            case "small": {
                this.imgBg.spriteFrame = this.spBgs[1];
                this.player.setPlayerScale(para);
                this.ndEgg.setScale(0.7);
                this.ndEgg.setPosition(-186, -480);
                this.ndTV.active = false;
                this.ndThiefRoot.active = true;
            }; break;
        }
    },
    //云彩关闭
    onCloudClose() {
        let _cloud = this.ndCloud.getComponent("Cloud");
        _cloud.playClose();
    },
    //云彩显示
    onCloudOpen() {
        let _cloud = this.ndCloud.getComponent("Cloud");
        _cloud.playOpen();
    },
    //链接微信小程序  中原银行信用卡
    onLink_XinYongKa() {
        WX.navigateToMiniProgram(Global.miniProgramAppIdList[1]);
    },




    //蹭饭
    onStealingFood() {
        var self = this;
        Network.stealingFood(this._uid, (res) => {
            if (res.result) {
                // Global.game.onDine();
                self.updateIndex();
                Global.game.showTip("蹭吃成功");
            } else {
                Global.game.showTip(res.data);
            }
        });
    },
    //请客吃饭
    onTreatFood() {
        var self = this;
        Network.treatFood(this._uid, (res) => {
            if (res.result) {
                self.onBack();
            } else {
                Global.game.showTip(res.data);
            }
        });
    },
    //给别人喂食
    onGiveOtherFood() {
        Global.game.onShowPanelPackage();
    },
    //显示背包
    onShowPanelPackage() {
        // this.panels.createPanel(this.prePanelPackage, "PanelPackage");
        let panel = cc.instantiate(this.prePanelPackage);
        panel.parent = cc.find("Canvas");

    },
    //播放吃饭动画
    onPlayPlayerDine(id, sayText) {
        let dine = cc.instantiate(this.prePlayerDine);
        dine.parent = this.node;
        let dineScr = dine.getComponent("PlayerDine");
        dineScr.fill(id, sayText);

        this.updateIndex();
    },

    // //更新吃饭
    // updateDine(res) {

    //     if (res.result) {
    //         this.updateIndex();

    //         this.onPlayPlayerDine(res.data.id, res.data.say);
    //     } else {
    //         this.player.openSay(res.data.say);
    //     }
    // },
    onShowPanelShop() {
        let panel = cc.instantiate(this.prePanelShop);
        panel.parent = cc.find("Canvas");
    }

});
