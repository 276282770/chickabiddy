var WX = require("WX");
var Network = require("Network");
var Common = require("Common");
var Player = require("Player2");
var PanelManager = require("PanelManager");
var Thief = require("Thief");
var Guid = require("Guid");
cc.Class({
    extends: cc.Component,

    properties: {
        txtSelfEgg: cc.Label,  //自己的鸡蛋
        txtOtherEgg: cc.Label,  //偷来的鸡蛋
        txtMoney: cc.Label,  //钱
        txtLvl: cc.Label,  //等级
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
        ndPlayerRoot: cc.Node,  //玩家根节点
        ndThiefRoot: cc.Node,  //小偷根节点
        ndCloud: cc.Node,  //云彩节点
        ndEgg: cc.Node,  //鸡蛋节点
        ndTV: cc.Node,  //TV节点

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
        // prePanelThief:cc.Prefab,  //小偷预制体
        prePlayerDine: cc.Prefab,  //吃东西预制体
        prePlayerBath: cc.Prefab,  //洗澡动画预制体
        prePlayer: cc.Prefab,  //玩家预制体
        preThief: cc.Prefab,  //小偷预制体
        // preCloud:cc.Prefab,  //云彩预制体


        player: Player,  //玩家
        thief: Thief,  //小偷
        // otherHome:OtherHome,  //别人家
        guide: Guid,  //指引



        display: cc.Sprite,  //子域显示

        preBuy: cc.Prefab,//临时 购买


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

    },

    start() {

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

    // update (dt) {},

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
        this.player.goBath();
    },

    //吃饭
    onDine() {
        this.player.goDine();
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
        this.guide.hidePoint();
    },
    //显示排行榜界面
    onShowPanelRank() {
        // this.panels.createPanel(this.prePanelRank, "PanelRank");
        this.ndPanelRank.getComponent("PanelRank").onShow();
    },
    /**显示装扮面板
 */
    onShowPanelTittivate() {
        this.panels.createPanel(this.prePanelTittivate, "PanelTittivate2");
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
});