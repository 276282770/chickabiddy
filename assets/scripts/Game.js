// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
var WX = require("WX");
var Network = require("Network");
var Common = require("Common");
var PanelManager = require("PanelManager");
var Player = require("Player");
var Thief = require("Thief");
var Guid=require("Guid");
// var OtherHome=require("OtherHome");

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
        imgBg:cc.Sprite,  //背景

        spBgs:[cc.SpriteFrame],  //背景 0 正常背景，1有小偷时

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
        ndCloud:cc.Node,  //云彩节点
        ndEgg:cc.Node,  //鸡蛋节点
        ndTV:cc.Node,  //TV节点

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
        prePanelExchange:cc.Prefab,  //鸡蛋兑换界面
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
        guide:Guid,  //指引



        display: cc.Sprite,  //子域显示


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
        _buyCount:0,  //买东西的个数


    },

    // LIFE-CYCLE CALLBACKS:

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
        // this.setDark();

        // if (cc.sys.platform == cc.sys.WECHAT_GAME) {
        //     this.tex = new cc.Texture2D();
        //     var openDataContext = wx.getOpenDataContext();
        //     this.sharedCanvas = openDataContext.canvas;
        // this.sharedCanvas.width=cc.find("Canvas").width;
        // this.sharedCanvas.height=cc.find("Canvas").height;
        // this.sharedCanvas.height=538;
        // }

        this._rqstTm = this._rqstRate;
        // this._openSubDomain=true;


        this.openLastPanel();

    },


    update(dt) {
        // this.setDark();
        // if (cc.sys.platform == cc.sys.WECHAT_GAME && this._openSubDomain) {

        //     this._subUpdateTime += dt;
        //     if(this._subUpdateTime>=0.2){

        //     this._updaetSubDomainCanvas();
        //     this._subUpdateTime = 0;
        //     }

        // }
        if (this._rqstTm > 0) {
            this._rqstTm -= dt;

        } else {

            this._rqstTm = this._rqstRate;
            // this.updateIndex();
        }
    },
    _updaetSubDomainCanvas() {

        if (!this.tex) {
            return;
        }

        this.tex.initWithElement(this.sharedCanvas);
        this.tex.handleLoadedTexture();
        this.display.spriteFrame = new cc.SpriteFrame(this.tex);
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
                if(res.data.isNewPlayer){
                    if(!this.guide._isGuid){
                        this.guide._isGuid=true;
                    this.guide.step();
                    }
                }
                self.updateState(res.data);
                self.ndWaitting.active = false;
            }
        });
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
    //初始化节点
    iniNode() {
        let playerNode = cc.instantiate(this.prePlayer);
        playerNode.parent = this.ndPlayerRoot;
        this.player = playerNode.getComponent("Player");
        this.player.setId(Global.id);
        this.ndThief = cc.instantiate(this.preThief);
        this.ndThief.parent = this.ndThiefRoot;
        this.thief = this.ndThief.getComponent("Thief");
        this._ndLeftPos = this.ndLeft.position;
        this._ndRightPos = this.ndRight.position;
    },
    //更新首页
    updateIndex() {
        if (Global.id == -1)
            return;
        console.log("【更新首页】");
        var self = this;
        Network.requestIndexInfo((res) => {
            if (res.result) {
                let data = res.data;
                self.updateState(data);
            }
        });
        // this.openLastPanel();
        // this.setDark();

    },
    updateState(data) {
        var self = this;
        self.setScore(data.lvl);
        self.setSelfEgg(data.selfEggNum);
        self.setOtherEgg(data.otherEggNum);
        self.setMoney(data.money);
        self.txtLvl.string = data.lvl.toString();
        self.proLvl.progress = data.lvlExp / data.lvlFullExp;
        self.ndLvlUp.active = data.lvlUp;

        self.txtEgg.string = data.eggNum.toString();

        self.proClean.progress = data.cleanProgCurr / data.cleanProgFull;
        if (data.foodRemain < 0) {
            self.proFood.progress = 0;
        } else {
            self.proFood.progress = data.foodRemain / data.foodProgFull;
        }
        self.setProEgg(data.eggProgCurr / data.eggProgFull);

        if (data.thiefs != null) {
            let currentThiefsCount=0;  //现在小偷数量
            let originalThiefsCount=self.thief._lastThiefCount;  //原来小偷数量
            //计算现在小偷数量
            if(data.thiefs[0]!=null)
             currentThiefsCount++;
            if(data.thiefs[1]!=null)
                currentThiefsCount++;
            
                console.log("【设置小偷】本次小偷数量{"+currentThiefsCount+"},上次小偷数量{"+originalThiefsCount+"}");
            //如果小偷被弄完时
            if(currentThiefsCount==0&&originalThiefsCount>0){
            
                self.onCloudClose();
                self.scheduleOnce(function(){
                  self.backgroundScale("normal");
                  self.onCloudOpen();
                },2);

            }
            //如果进来小偷时
            if(currentThiefsCount>0&&originalThiefsCount<=0){

                if(originalThiefsCount==-1){
                    self.backgroundScale("small");
                }else{

                self.onCloudClose();
                self.scheduleOnce(function(){
                  self.backgroundScale("small");
                  self.onCloudOpen();
                },2);
                }
            }
            self.thief.setThief(data.thiefs);
            // self.setPanelThief(data.thiefs);
            if (data.thiefs[0] != null || data.thiefs[1] != null) {
                //有小偷
     
                // self.ndRight.y=0;
                // self.ndLeft.y=0;
                // self.player.node.y = -200;
                // self.ndThief.active=true;
            } else {
                //没有小偷
   
                // self.ndRight.y=349;
                // self.ndLeft.y=274;
                // self.player.node.y = 0;
                // self.ndRight.setPosition(self._ndRightPos);
                // self.ndLeft.setPosition(self._ndLeftPos);
                
                // self.showCtrl(true);
                // self.ndThief.active=false;
            }

        }

        //如果有新公告自动弹出显示
        if (data.newAnnouncement) {
            this.onShowPanelAnnouncement();
        }



        // if(data.playerState==0){
        //     self.player.setState(0);
        // }
        // if (data.playerState == 1) {

        //     self.player.setState(3);
        // } else if (data.playerState == 2) {
        //     self.player.node.active = false;
        //     Global.scene.otherUid = data.otherId;
        //     self.ndFindPlayer.active = true;
        // }

        //更新角色
        if (data.outHome) {
            Global.scene.otherUid = data.otherId;
        }
        self.ndFindPlayer.active = data.outHome;
        self.player.setPlayerCondition(data.foodRemain, data.cleanProgCurr, data.bateu, data.outHome);

        //更新头像
        if (Global.user.avatar != "") {
            cc.loader.load({ url: Global.user.avatar, type: "png" }, function (err, tex) {
                if (!err) {
                    self.imgAvatar.spriteFrame = new cc.SpriteFrame(tex);
                }
            });
        }

        //更新升级
        if (Global.user.level != -1 && Global.user.level != data.lvl) {
            self.onPlayLevelUp();
        }
        Global.user.level = data.lvl;

    },
    //打开上一次面板
    openLastPanel() {
        let panelName = Global.scene.lastPanel;
        if (panelName == "")
            return;
        switch (panelName) {
            case "PanelFriends": {
                this.onShowPanelFriends();
            }; break;
        }
    },

    //更新吃饭
    updateDine(res) {

        if (res.result) {
            this.updateIndex();

            this.onPlayPlayerDine(res.data.id, res.data.say);
        } else {
            this.player.openSay(res.data.say);
        }
    },


    //设置钱
    setMoney(num) {
        this._money = num;
        this.txtMoney.string = this._money.toString();
    },
    setMoneyEff(num) {
        this.setMoney(num);
        this.txtMoney.node.getComponent(cc.Animation).play();
    },
    //添加钱
    addMoneyEff(num) {
        this._money += num;
        this.txtMoney.string = this._money.toString();
        this.txtMoney.node.getComponent(cc.Animation).play();
    },
    //设置自己的鸡蛋
    setSelfEgg(num) {
        this.txtSelfEgg.string = num.toString();
    },
    //设置自己的鸡蛋和效果
    setSelfEggEff(num) {
        //eff
        this.setSelfEgg(num);
    },
    //设置偷来的鸡蛋
    setOtherEgg(num) {
        this.txtOtherEgg.string = num.toString();
    },
    //设置偷来的鸡蛋和效果
    setOtherEggEff(num) {
        //eff
        this.setOtherEgg(num);
    },
    //设置头像
    setAvatar(avatar) {
        var self = this;
        cc.loader.load({ url: avatar, type: jpg }, function (err, tex) {
            if (!err) {
                self.imgAvatar.spriteFrame = tex;
            }
        });
    },
    //显示小偷界面
    setPanelThief(data) {
        if (data[0] == null && data[1] == null)
            return;
        // this.ndThief.active=true;
        // let thiefScr = this.ndThief.getComponent("Thief");
        // thiefScr.setThief(data);
        this.thief.setThief(data);

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
        this.proEgg.node.getChildByName("text").getComponent(cc.Label).string = parseInt(pro * 100).toString();
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
    //显示朋友面板
    onShowPanelFriends() {
        this.panels.createPanel(this.prePanelFriends, "PanelFriends");
        this.panels.show();
    },
    //显示朋友面板
    onShowFxPanelFriends() {
        this.panels.createPanel(this.prePanelFriends, "PanelFriends");
        this.panels.showFx();
        //引导
        this.guide.hidePoint();
    },
    /**显示链接面板
     */
    onShowPanelLink() {
        this.panels.createPanel(this.prePanelLink, "PanelLink");
    },
    /**显示装扮面板
     */
    onShowPanelTittivate() {
        this.panels.createPanel(this.prePanelTittivate, "PanelTittivate");
    },
    /**显示任务面板
     */
    onShowPanelMission() {
        this.panels.createPanel(this.prePanelMission, "PanelMission");
        //引导
        if(this.guide._isGuid){
            this.guide.hidePoint();
            this.guide._isGuid=false;
        }
    },
    /**显示背包面板
     */
    onShowPanelPackage() {
        this.panels.createPanel(this.prePanelPackage, "PanelPackage");
        //引导
        this.guide.hidePoint();
    },
    onShowPanelAnnouncement() {
        this.panels.createPanel(this.prePanelAnnouncement, "PanelAnnouncement");
    },
    onShowPanelPersonal() {

        this.panels.createPanel(this.prePanelPersonal, "PanelPersonal");
    },
    //显示个人日志信息
    onShowPanelDetail() {
        this.panels.createPanel(this.prePanelDetail, "PanelDetail");
    },
    //显示道具界面
    onShowPanelProp() {
        this.panels.createPanel(this.prePanelProp, "PanelProp");
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
    //显示说明攻略界面
    onShowPanelInstruction() {
        this.panels.createPanel(this.prePanelInstruction, "PanelInstruction");
    },
    //显示鸡蛋兑换鸡蛋界面
    onShowPanelExchangeEgg2Egg() {
        //this.panels.createPanel(this.prePanelExchangeEgg2Egg, "PanelExchangeEgg2Egg");
        var newPanel= cc.instantiate(this.prePanelExchangeEgg2Egg);
        newPanel.parent=cc.find("Canvas");
    },
    //显示鸡蛋兑换钱界面
    onShowPanelExchangeEgg2Money(event,customerData) {
        this.panels.createPanel(this.prePanelExchangeEgg2Money, "PanelExchangeEgg2Money");  
        console.log(this.panels._panelScr.name);
        this.panels._panelScr.fill(customerData);
    },
    //显示兑换面板
    onShowPanelExchange(){
        this.panels.createPanel(this.prePanelExchange, "PanelExchange");
    },
    // //显示别人家
    // onShowOtherHome(id){

    //     this.otherHome.node.active=true;
    //     this.otherHome.load(id);
    // },

    //播放吃饭动画
    onPlayPlayerDine(id, sayText) {
        let dine = cc.instantiate(this.prePlayerDine);
        dine.parent = this.node;
        let dineScr = dine.getComponent("PlayerDine");
        dineScr.fill(id, sayText);
    },
    //播放洗澡
    onPlayPlayerBath(data) {
        let bath = cc.instantiate(this.prePlayerBath);
        bath.parent = this.node;
        let bathScr = bath.getComponent("PlayerBath");
        bathScr.fill(data.say, data.tip);
    },
    //播放升级动画
    onPlayLevelUp() {
        this.node.getChildByName("PanelLevelUp").getComponent("PanelLevelUp").show();
    },
    /**洗澡
     *
     *
     */
    onBath() {
        var self = this;
        this.guide.hidePoint();
        Network.requestBath((res) => {
            if (res.result) {
                //播放洗澡动画
                self.onPlayPlayerBath(res.data);
                // self.player.openSay(res.data);
                self.updateIndex();
            } else {
                if (res.data.say != "") {
                    self.player.openSay(res.data.say);
                }
                if (res.data.tip != "") {
                    self.showTip(res.data.tip);
                }

            }
        });
    },
    //收鸡蛋
    onPickEgg() {
        var self = this;
        Network.requestPickEgg((res) => {
            if (res.result) {
                //播放收鸡蛋动画

            }

            self.showTip(res.data.tip);
            self.player.openSay(res.data.say);
            self.updateIndex();
        });
        //引导
        this.guide.hidePoint();
    },
    //寻找小鸡
    onFindPlayer() {
        Global.scene.nextSceneName = "OtherHome";
        cc.director.loadScene("Loading");
    },
    //链接微信小程序 中原银行惠生活
    onLink_HuiShenghuo() {
        // let appid="wxeedb326f283fe740";
        // let appid = Global.miniProgramAppIdList[0];
        // WX.navigateToMiniProgram(appid);
        Network.getLinkAppid("zhongyuanyinhanghuishenghuo",(res)=>{
            if(res.result){
                WX.navigateToMiniProgram(res.data);
            }
        })
    },
    //链接微信小程序  中原银行信用卡
    onLink_XinYongKa() {
        // WX.navigateToMiniProgram(Global.miniProgramAppIdList[1]);
        Network.getLinkAppid("zhongyuanyinhanghuishenghuo",(res)=>{
            if(res.result){
                WX.navigateToMiniProgram(res.data);
            }
        })
    },

    /** 显示控制按钮
     *
     *
     * @param {*} isShow  是否显示
     */
    showCtrl(isShow) {
        this.ndLeft.active = isShow;
        this.ndRight.active = isShow;
        // this.ndDown.active=isShow;
    },
    //云彩关闭
    onCloudClose(){
        let _cloud=this.ndCloud.getComponent("Cloud");
        _cloud.playClose();
    },
    //云彩显示
    onCloudOpen(){
        let _cloud=this.ndCloud.getComponent("Cloud");
        _cloud.playOpen();
    },
    //背景缩放
    backgroundScale(para){
        switch(para){
            case "normal":{
                this.imgBg.spriteFrame=this.spBgs[0];
                this.player.setPlayerScale(para);
                this.ndEgg.setScale(1.2);
                this.ndEgg.setPosition(-242,-446);
                this.ndTV.active=true;
                this.ndThiefRoot.active=false;
            };break;
            case "small":{
                this.imgBg.spriteFrame=this.spBgs[1];
                this.player.setPlayerScale(para);
                this.ndEgg.setScale(0.7);
                this.ndEgg.setPosition(-186,-480);
                this.ndTV.active=false;
                this.ndThiefRoot.active=true;
            };break;
        }
    },


    //测试
    test() {

        // let imgA=cc.find("Canvas/New Sprite").getComponent(cc.Sprite);
        // let imgB=cc.find("Canvas/New Sprite(Splash)").getComponent(cc.Sprite);
        // let path="Shop/shop_"+5;
        // cc.loader.loadRes(path,function(err,tex){
        //     if(!err){
        //         imgA.spriteFrame=new cc.SpriteFrame(tex);
        //         imgB.spriteFrame=new cc.SpriteFrame(tex);
        //     }

        // });

        // this.onPlayPlayerDine(4,"你好，你好");
        // this.onPlayPlayerBath();
        // this.player.playCry();
        // this.onShowOtherHome(22);
        let thiefScr=this.ndThief.getComponent("Thief");
            thiefScr.setThief([{id:0,name:""},null]);
        // this.player.playCry();

        // this.ndRight.position.Y=0;
        //    this.showTip("你好你好");
        // this.onPlayLevelUp();
        // this.onCloudClose();

    },
    //设置天黑天亮
    setDark() {
        let hour = new Date().getHours();
        if (hour == this._hour)
            return;
        this._hour = hour;
        if (hour >= 6 && hour < 20) {
            // this.ndHomeMask.active = false;
        } else {
            // this.ndHomeMask.active = true;
        }
        console.log("现在时刻：" + hour + "点");
    },
    //显示敬请期待提示
    onShowTipExpect() {
        this.showTip("正在完善中,敬请期待.");
    },
});
