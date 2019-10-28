var WX = require("WX");
var Network = require("Network");
var Common = require("Common");
var Player = require("Player2");
var PanelManager = require("PanelManager");
var Thief = require("ThiefController2");
var Guid = require("Guid");
var CameraController = require("CameraController2");
cc.Class({
    extends: cc.Component,

    properties: {
        txtSelfEgg: cc.Label,  //自己的鸡蛋
        txtOtherEgg: cc.Label,  //偷来的鸡蛋
        txtMoney: cc.Label,  //钱
        txtLvl: cc.Label,  //等级
        txtNickname: cc.Label,  //昵称
        imgLvl: cc.Sprite,  //等级图片
        spLvls: [cc.SpriteFrame],//等级外框精灵
        ndLvlUp: cc.Node,  //等级加速
        txtEgg: cc.Label,  //鸡蛋个数
        proLvl: cc.ProgressBar,  //等级进度
        proEgg: cc.ProgressBar,  //鸡蛋进度
        proFood: cc.ProgressBar,  //饥饿进度
        proClean: cc.ProgressBar,  //清洁进度

        imgAvatar: cc.Sprite,  //头像
        imgBg: cc.Sprite,  //背景

        spBgs: [cc.SpriteFrame],  //背景 0 正常背景，1有小偷时

        preMsgBox: cc.Prefab,  //消息框预制体
        // ndHomeMask: cc.Node,  //主页遮罩
        ndThief: cc.Node,  //小偷界面
        ndWaitting: cc.Node,  //等待画面
        ndFindPlayer: cc.Node,  //寻找小鸡节点
        ndRight: cc.Node,  //右边按钮根节点
        ndLeft: cc.Node,  //左边按钮根节点
        ndDown: cc.Node,  //下按钮
        ndPanelRank: cc.Node,  //排行榜面板节点
        ndPanelFriends: cc.Node,  //好友面板节点
        ndPlayerRoot: cc.Node,  //玩家根节点
        ndThiefRoot: cc.Node,  //小偷根节点
        ndCloud: cc.Node,  //云彩节点
        ndEgg: cc.Node,  //鸡蛋节点
        ndTV: cc.Node,  //TV节点
        ndPanelLevelUp: cc.Node,  //升级节点
        ndLevelUpFront: cc.Node,  //升级前节点


        panels: PanelManager,  //面板管理
        prePanelFriends: cc.Prefab,  //朋友面板预制体
        prePanelLink: cc.Prefab,  //链接面板预制体
        prePanelTittivate: cc.Prefab,  //装扮面板预制体
        prePanelMission: cc.Prefab,  //任务面板预制体
        prePanelPackage: cc.Prefab,  //背包面板预制体
        prePanelAnnouncement: cc.Prefab,  //公告面板预制体
        prePanelPersonal: cc.Prefab,  //个人信息面板预制体
        prePanelDetail: cc.Prefab,  //个人记录
        prePanelProp: cc.Prefab,  //道具预制体
        prePanelShop: cc.Prefab,  //商店预制体
        prePanelRank: cc.Prefab,  //排行榜预制体
        prePanelInstruction: cc.Prefab,  //说明界面预制体
        prePanelExchange: cc.Prefab,  //鸡蛋兑换界面
        prePanelExchangeEgg2Egg: cc.Prefab,  //鸡蛋兑换鸡蛋面板预制体
        prePanelExchangeEgg2Money: cc.Prefab,  //鸡蛋兑换钱面板预制体
        prePanelSignin: cc.Prefab,  //签到界面
        // prePanelThief:cc.Prefab,  //小偷预制体
        prePlayerDine: cc.Prefab,  //吃东西预制体
        prePlayerBath: cc.Prefab,  //洗澡动画预制体
        prePlayer: cc.Prefab,  //玩家预制体
        preThief: cc.Prefab,  //小偷预制体
        // preCloud:cc.Prefab,  //云彩预制体
        preAD:cc.Prefab,  //广告


        player: Player,  //玩家
        thief: Thief,  //小偷
        // otherHome:OtherHome,  //别人家
        guide: Guid,  //指引



        display: cc.Sprite,  //子域显示

        preBuy: cc.Prefab,//临时 购买
        camera: CameraController,//摄像机控制


        _hour: 0,
        _money: 0,  //钱
        _thiefCount: 0,  //小偷个数
        // _OpenSubDomain: false,  //打开开放数据域
        _subUpdateTime: 0,  //子域更新时间

        _hungry: 0,  //饥饿值
        _drity: 0,  //清洁值
        _grow: 0,  //成熟值

        _rqstTm: 0,  //请求倒计时
        _rqstRate: 5,  //请求频率

        _ndLeftPos: new cc.Vec2(0, 0),  //左边按钮坐标
        _ndRightPos: new cc.Vec2(0, 0),  //右边按钮坐标

        //分享用
        _shareFlag: false,  //是否调用了分享接口
        _shareTime: null,  //分享前的时间
        _shareDelay: 2,  //分享关键延迟

        //引导用
        _buyCount: 0,  //买东西的个数



    },


    onLoad() {
        var self = this;
        Global.game = this;


        this.iniNode();

        if (Global.id != -1) {
            this.updateIndex();
            return;
        }

        let query = WX.getLaunchOptionsSync();
        WX.login(code => {

            self.ndWaitting.active = true;

            let avatar;
            let nickName;
            // code="aaa";
            WX.getSetting((isAuth) => {
                if (!isAuth) {
                    WX.createUserInfoButton(
                        function (data) {
                            avatar = data.avatarUrl;
                            nickName = data.nickName;
                            if (query.tp != null && query.tp == "af") {
                                self.login(code, avatar, nickName, query.id);
                            } else {
                                self.login(code, avatar, nickName);
                            }
                        }
                    );
                }
                else {
                    WX.getUserInfo((res) => {
                        avatar = res.avatarUrl;
                        nickName = res.nickName;
                        if (query.tp != null && query.tp == "af") {
                            self.login(code, avatar, nickName, query.id);
                        } else {
                            self.login(code, avatar, nickName);
                        }
                    });
                }
            });

        });

        WX.onShow((res) => {

            if (res.tp) {

                //添加好友
                if (res.tp == "af") {

                    Network.requestAddFriend(res.id, function (res) { });
                }
            }

            this.checkShareSuccess();

        });
        WX.createGameClubButton();
    },
    login(code, avatar, nickName, fid) {
        var self = this;
        // cc.loader.load({ url: avatar, type: "png" }, function (err, tex) {
        //     if (!err) {
        //         self.imgAvatar.spriteFrame = new cc.SpriteFrame(tex);
        //     }
        // });
        Global.user.nickName = nickName;
        Global.user.avatar = avatar;
        console.log("设置全局函数‘头像’和‘昵称’");
        Network.requestLogin(code, avatar, nickName, (res) => {
            if (res.result) {
                if (fid != null) {
                    Network.requestAddFriend(fid, function (res) { });
                }
                if (res.data.isNewPlayer) {
                    if (!self.guide._isGuid) {
                        // self.guide._isGuid = true;
                        // self.guide.step();
                    }
                }
                self.createScene(res.data);
                self.updateState(res.data);
                self.ndWaitting.active = false;



            }
        });
    },
    //更新首页
    updateIndex() {
        if (Global.id == -1 || Global.sceneCode != 0)
            return;
        console.log("【更新首页】");
        var self = this;
        Network.requestIndexInfo((res) => {
            if (res.result) {
                let data = res.data;
                self.updateState(data);
                if (res.data.isFirstLayingEgg) {
                    self.guide.step_egg();
                }

            }
        });
        // this.openLastPanel();
        // this.setDark();

    },
    updateState(data) {
        var self = this;
        self.setScore(data.lvl);
        // self.setSelfEgg(data.selfEggNum);
        // self.setOtherEgg(data.otherEggNum);
        self.setMoney(data.money);
        self.txtLvl.string = data.lvl.toString();
        self.imgLvl.spriteFrame = self.spLvls[Math.min(self.spLvls.length - 1, parseInt(data.lvl / 10))];
        self.proLvl.progress = data.lvlExp / data.lvlFullExp;
        self.ndLvlUp.active = data.lvlUp;

        self.txtEgg.string = data.eggNum.toString();

        // self.proClean.progress = data.cleanProgCurr / data.cleanProgFull;
        // if (data.foodRemain < 0) {
        //     self.proFood.progress = 0;
        //     self.proFood.node.parent.getChildByName("full").active = false;
        // } else {
        //     self.proFood.progress = data.foodRemain / data.foodProgFull;
        //     self.proFood.node.parent.getChildByName("full").active = true;
        // }
        self.setLunchBox(data.foodRemain, data.foodProgFull);

        self.setProEgg(data.eggProgCurr / data.eggProgFull);


        self.thief.setThief(data.thiefs);

        //如果有新公告自动弹出显示
        if (data.newAnnouncement) {
            this.onShowPanelAnnouncement();
        }


        //更新角色
        if (data.outHome) {
            Global.scene.otherUid = data.otherId;
        }
        self.ndFindPlayer.active = data.outHome;
        self.player.setPlayerCondition(data.foodRemain, data.cleanProgCurr, data.bateu, data.outHome);
        self.player.setPlayerData(data.id, "", data.lvl, null, null);
        self.player.getTitti();
        //更新头像
        if (Global.user.avatar != "") {
            self.setAvatar(Global.user.avatar);
        }
        self.txtNickname.string = "";

        cc.find("Canvas").getComponent("HomeCtrl").changeBGById(data.BG);//更换背景

        //更新升级
        if (Global.user.level > 0 && Global.user.level != data.lvl) {
            if (!this.player._isAction) {
                self.ndLevelUpFront.active = true;
                self.scheduleOnce(function () {
                    self.ndLevelUpFront.active = false;
                    self.onPlayLevelUp();
                }, 2);
            }
            // self.onPlayLevelUp();
        }
        Global.user.level = data.lvl;

    },
    //更新别人家里
    updateOtherIndex() {
        var self = this;
        Network.requestPersonInfo(Global.scene.otherUid, (res) => {
            if (res.result) {
                let data = res.data;
                self.updateOtherState(data);
                self.player.openSay(data.say);
            }
        })
    },
    updateOtherState(data) {
        var self = this;
        self.txtLvl.string = data.lvl.toString();
        self.imgLvl.spriteFrame = self.spLvls[Math.min(self.spLvls.length - 1, parseInt(data.lvl / 10))];
        self.txtEgg.string = data.eggCount.toString();
        self.thief.setData(data.thiefs);

        //更新角色
        // Global.scene.otherUid = data.otherId;
        self.ndFindPlayer.active = data.outHome;
        // self.player.setPlayerCondition(data.foodRemain, data.cleanProgCurr, data.bateu, data.outHome);
        self.player.setPlayerData(data.id, data.nickName, data.lvl, data.titti, data.playerState);

        //更新头像
        self.setAvatar(data.avatar);
        self.txtNickname.string = data.nickName + "的家";

        self.setLunchBox(data.foodRemain, data.foodProgFull);//更新饭桶

        cc.find("Canvas").getComponent("HomeCtrl").changeBGById(data.BG);//更换背景

    },


    start() {
        this._rqstTm = this._rqstRate;

    },
    //初始化节点
    iniNode() {
        // let playerNode = cc.instantiate(this.prePlayer);
        // playerNode.parent = this.ndPlayerRoot;
        // this.player = playerNode.getComponent("Player");
        // this.player.setId(Global.id);
        // this.ndThief = cc.instantiate(this.preThief);
        // this.ndThief.parent = this.ndThiefRoot;
        // this.thief = this.ndThief.getComponent("Thief");
        // this._ndLeftPos = this.ndLeft.position;
        // this._ndRightPos = this.ndRight.position;
    },
    //创建场景
    createScene(data) {

        //背景
        // let newPlayer=cc.instantiate(this.prePlayer);
        // newPlayer.parent=cc.find("Canvas/PlayerRoot");
        // let newPlayerSrc=newPlayer.getComponent("Player2");
        // newPlayerSrc.setPlayerData(data.id,"",data.lvl,null,data.playerState);
        // this.player=newPlayerSrc;

    },

    update(dt) {
        if (this._rqstTm > 0) {
            this._rqstTm -= dt;

        } else {

            this._rqstTm = this._rqstRate;
            this.updateIndex();
        }
    },

    //设置钱
    setMoney(num) {
        this._money = num;
        // this.txtMoney.string = this._money.toString();
    },
    //设置分数
    setScore(score) {
        WX.postMessage({ cmd: "SETSCORE", para: score });
    },
    //获取自己分数
    getScore() {
        WX.postMessage({ cmd: "GETSCORE" });
    },
    //设置鸡蛋进度
    setProEgg(pro) {
        this.proEgg.progress = pro;
        // this.proEgg.node.getChildByName("text").getComponent(cc.Label).string = parseInt(pro * 100).toString();
    },
    //设置饭盒
    setLunchBox(curr, full) {
        let percent = 0;
        if (curr > 0) {
            percent = curr / full;
        }
        this.proFood.progress = percent;
        this.proFood.node.parent.getChildByName("full").getComponent(cc.ProgressBar).progress = percent;
    },
    //添加钱
    addMoneyEff(num) {
        // this._money += num;
        // this.txtMoney.string = this._money.toString();
        // this.txtMoney.node.getComponent(cc.Animation).play();
    },

    //洗澡
    bath() {
        // player.setActive(false);
        // cc.find("Canvas/Pool").getComponent(cc.Animation).play("Bath");
    },
    //洗澡完毕
    bathOver() {
        // player.setActive(true);

    },
    //洗澡
    onBath() {
        var self = this;
        if (Global.sceneCode == 0) {
            Network.requestBath((res) => {
                if (res.result) {
                    self.player.goBath();

                    self.scheduleOnce(function () {
                        // self.showTip(res.data.tip);
                        self.player.openSay(res.data.say);
                    }, 5);
                } else {
                    self.player.openSay(res.data.say);
                }
            });
        } else if (Global.sceneCode == 1) {
            Network.requestBathHelp(Global.scene.otherUid, (res) => {
                if (res.result) {
                    self.player.goBath();

                    self.scheduleOnce(function () {
                        // self.showTip(res.data.tip);
                        self.player.openSay(res.data.say);
                    }, 5);
                } else {
                    self.player.openSay(res.data.say);
                }
            });
        }
    },

    //吃饭
    onDine() {
        this.setLunchBox(100, 100);
        this.player.goDine();
    },
    //设置头像
    setAvatar(avatarUrl) {
        Common.load(avatarUrl, this.imgAvatar);
    },

    /**显示个人面板 */
    onShowPanelPersonal() {
        this.panels.createPanel(this.prePanelPersonal, "PanelPersonal2");
    },
    //显示道具界面
    onShowPanelProp() {
        this.panels.createPanel(this.prePanelProp, "PanelProp");
    },
    //显示朋友面板
    onShowFxPanelFriends() {
        this.panels.createPanel(this.prePanelFriends, "PanelFriends");
        this.panels.showFx();
        //引导
        this.guide.hidePoint();
    },
    //显示朋友面板
    onShowPanelFriends() {
        this.ndPanelFriends.active = true;
        this.ndPanelFriends.getComponent("PanelFriends2").showFx();
    },
    /**显示任务面板
    */
    onShowPanelMission() {
        this.panels.createPanel(this.prePanelMission, "PanelMission");
        //引导
        if (this.guide._isGuid) {
            this.guide.hidePoint();
            this.guide._isGuid = false;
        }
    },
    //显示商店界面
    onShowPanelShop() {
        this.panels.createPanel(this.prePanelShop, "PanelShop");
        //引导
        if (this.guide != null)
            this.guide.hidePoint();
    },
    //显示排行榜界面
    onShowPanelRank() {
        // this.panels.createPanel(this.prePanelRank, "PanelRank");
        this.ndPanelRank.getComponent("PanelRank2").onShow();
    },
    /**显示装扮面板
    */
    onShowPanelTittivate() {
        this.panels.createPanel(this.prePanelTittivate, "PanelTittivate2");
    },
    //显示签到界面
    onShowPanelSignin() {
        this.panels.createPanel(this.prePanelSignin, "PanelSignin");
    },
    //显示公告
    onShowPanelAnnouncement() {
        this.panels.createPanel(this.prePanelAnnouncement, "PanelAnnouncement");
    },
    /**显示背包面板
    */
    onShowPanelPackage() {
        this.panels.createPanel(this.prePanelPackage, "PanelPackage");
        //引导
        if (this.guide != null)
            this.guide.hidePoint();
    },
    /**显示链接面板
    */
    onShowPanelLink() {
        this.panels.createPanel(this.prePanelLink, "PanelLink");
    },
    //显示说明攻略界面
    onShowPanelInstruction() {
        this.panels.createPanel(this.prePanelInstruction, "PanelInstruction2");
    },
    //显示个人日志信息
    onShowPanelDetail() {
        this.panels.createPanel(this.prePanelDetail, "PanelDetail");
    },
    //显示提示框
    showTip(txt) {
        if (txt == null || txt == "")
            return;
        let msgBox = cc.instantiate(this.preMsgBox);
        msgBox.parent = cc.find("Canvas/UICanvas");
        let msgBoxScr = msgBox.getComponent("MsgBox");
        msgBoxScr.show(txt);

    },

    //播放升级动画
    onPlayLevelUp() {
        this.ndPanelLevelUp.active = true;
        // this.ndPanelLevelUp.getComponent("PanelLevelUp2").show();
    },
    //收鸡蛋
    onPickEgg() {
        var self = this;
        if (Global.sceneCode == 0) {
            Network.requestPickEgg((res) => {
                if (res.result) {
                    //播放收鸡蛋动画

                }

                self.showTip(res.data.tip);
                self.player.openSay(res.data.say);
                self.updateIndex();
            });
            //引导
            if (this.guide != null)
                this.guide.hidePoint();
        } else if (Global.sceneCode == 1) {
            Network.requestPickupOtherEgg(Global.scene.otherUid, (res) => {
                if (res.result) {
                    self.showTip("偷取鸡蛋成功");
                    self.updateOtherIndex();
                } else {
                    self.player.openSay(res.data.say);
                    self.showTip(res.data.tip);
                }
            })
        }
    },
    //分享
    onShare(tp) {
        var self = this;
        Network.requestShare((res) => {

            let title = res.data.title;
            let imageUrl = res.data.imageUrl;
            WX.shareAppMessage(title, imageUrl, tp);

            self._shareFlag = true;
            self._shareTime = new Date();
        });

    },
    //分享成功
    shareSuccess() {
        var self = this;
        Network.requestShareSuccess((res) => {
            if (res.result) {
                self.addMoneyEff(res.data.money);
            }
            self.showTip(res.data.tip);
        });
    },

    /** 检查是否分享成功
     *
     *
     * @returns
     */
    checkShareSuccess() {
        if (!this._shareFlag) {
            return;
        }
        this._shareFlag = false;
        let tm = (new Date().getTime() - this._shareTime.getTime()) / 1000;
        console.log("【分享延迟时间】" + tm + "s");
        if (tm < this._shareDelay) {
            this.showTip("分享失败");
            return;
        }
        this.shareSuccess();
    },
    //显示敬请期待提示
    onShowTipExpect() {
        this.showTip("小编正在抓紧制作中...");
    },
    //链接微信小程序 中原银行惠生活
    onLink_HuiShenghuo() {
        // let appid="wxeedb326f283fe740";
        let appid = Global.miniProgramAppIdList[0];
        WX.navigateToMiniProgram(appid);
        // Network.getLinkAppid("zhongyuanyinhanghuishenghuo", (res) => {
        //     if (res.result) {
        //         WX.navigateToMiniProgram(res.data);
        //     }
        // })
    },
    //链接微信小程序  中原银行信用卡
    onLink_XinYongKa() {
        WX.navigateToMiniProgram(Global.miniProgramAppIdList[1]);
        // Network.getLinkAppid("zhongyuanyinhanghuishenghuo", (res) => {
        //     if (res.result) {
        //         WX.navigateToMiniProgram(res.data);
        //     }
        // })
    },
    //寻找小鸡
    onFindPlayer() {
        if (Global.sceneCode == 0) {
            cc.find("Canvas").getComponent("HomeCtrl").gotoOtherHome();
        }
    },
    //是否显示控制按钮
    showCtrl(yes) {
        if (Global.user.sceneCode == 0) {
            this.ndLeft.active = yes;
            this.ndRight.active = yes;
        }
        this.ndDown.active = yes;
    },

});
