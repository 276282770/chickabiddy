// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
var WX=require("WX");
var Network=require("Network");
var Common=require("Common");
var PanelManager=require("PanelManager");
var Player=require("Player");
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
        txtSelfEgg:cc.Label,  //自己的鸡蛋
        txtOtherEgg:cc.Label,  //偷来的鸡蛋
        txtMoney:cc.Label,  //钱
        txtLvl:cc.Label,  //等级
        txtEgg:cc.Label,  //鸡蛋个数
        proLvl:cc.ProgressBar,  //等级进度
        proEgg:cc.ProgressBar,  //鸡蛋进度
        proFood:cc.ProgressBar,  //饥饿进度
        proClean:cc.ProgressBar,  //清洁进度

        imgAvatar:cc.Sprite,  //头像
        
        preMsgBox:cc.Prefab,  //消息框预制体
        ndHomeMask:cc.Node,  //主页遮罩

        panels:PanelManager,  //面板管理
        prePanelFriends:cc.Prefab,  //朋友面板预制体
        prePanelLink:cc.Prefab,  //链接面板预制体
        prePanelTittivate:cc.Prefab,  //装扮面板预制体
        prePanelMission:cc.Prefab,  //任务面板预制体
        prePanelPackage:cc.Prefab,  //背包面板预制体
        prePanelAnnouncement:cc.Prefab,  //公告面板预制体
        prePanelPersonal:cc.Prefab,  //个人信息面板预制体
        prePanelDetail:cc.Prefab,  //个人记录
        prePanelProp:cc.Prefab,  //道具预制体
        prePanelShop:cc.Prefab,  //商店预制体
        prePanelRank:cc.Prefab,  //排行榜预制体
        prePanelInstruction:cc.Prefab,  //说明界面预制体
        prePanelThief:cc.Prefab,  //小偷预制体
        prePlayerDine:cc.Prefab,  //吃东西预制体

        player:Player,  //玩家


        display:cc.Sprite,  //子域显示


        _hour:0,
        _money:0,  //钱
        _thiefCount:0,  //小偷个数
        _OpenSubDomain:false,  //打开开放数据域

        _hungry:0,  //饥饿值
        _drity:0,  //清洁值
        _grow:0,  //成熟值

        _rqstTm:0,  //请求倒计时
        _rqstRate:60,  //请求频率

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        Global.game=this;
        var self=this;
        let query=WX.getLaunchOptionsSync();
        WX.login(code=>{
            let avatar;
            let nickName;
            // code="aaa";
            WX.getSetting((isAuth)=>{if(!isAuth){WX.createUserInfoButton(
                function(data){
                    avatar=data.avatarUrl;
                    nickName=data.nickName;
                    if(query.tp!=null&&query.tp=="af"){
                        self.login(code,avatar,nickName,query.id);
                    }else{
                    self.login(code,avatar,nickName);
                    }
                }
            );}
                else{
                    WX.getUserInfo((res)=>{
                        avatar=res.avatarUrl;
                        nickName=res.nickName;
                        if(query.tp!=null&&query.tp=="af"){
                            self.login(code,avatar,nickName,query.id);
                        }else{
                        self.login(code,avatar,nickName);
                        }
                    });
                }
            });
            
        });
       
        WX.onShow((res)=>{

            if(res.tp){

                //添加好友
                if(res.tp=="af"){

                    Network.requestAddFriend(res.id,function(res){});
                }
            }
        });




    },

    start () {
        this.setDark();

        if(cc.sys.platform==cc.sys.WECHAT_GAME){
            this.tex = new cc.Texture2D();
            var openDataContext = wx.getOpenDataContext();
            this.sharedCanvas = openDataContext.canvas;
            // this.sharedCanvas.width=cc.find("Canvas").width;
            // this.sharedCanvas.height=cc.find("Canvas").height;
            }
        this._rqstTm=this._rqstRate;
    },


    update (dt) {
        // this.setDark();
        if(cc.sys.platform==cc.sys.WECHAT_GAME&&this._openSubDomain){
            this._subUpdateTime+=dt;
            //if(this._subUpdateTime>=0.2){
            this._updaetSubDomainCanvas();
            this._subUpdateTime=0;
            //}

            }
        if(this._rqstTm>0){
            this._rqstTm-=dt;
        }else{
            this._rqstTm=this._rqstRate;
            this.updateIndex();
        }
    },
    _updaetSubDomainCanvas () {
        if (!this.tex) {
            return;
        }
        this.tex.initWithElement(this.sharedCanvas);
        this.tex.handleLoadedTexture();
        this.display.spriteFrame = new cc.SpriteFrame(this.tex);
    },
    
    login(code,avatar,nickName,fid){
        var self=this;
        cc.loader.load({url:avatar,type:"png"},function(err,tex){
            if(!err){
                self.imgAvatar.spriteFrame=new cc.SpriteFrame(tex);
            }
        });
        Network.requestLogin(code,avatar,nickName,(res)=>{
            if(res.result){
                if(fid!=null){
                    Network.requestAddFriend(fid,function(res){});
                }
                self.updateState(res.data);
                
            }            
        });
    },
    //分享
    onShare(tp){
        var self=this;
        Network.requestShare((res)=>{
            
                let title=res.data.title;
                let imageUrl=res.data.imageUrl;
                WX.shareAppMessage(title,imageUrl,tp);
            
        });
        
    },
    //更新首页
    updateIndex(){
        if(Global.id==-1)
            return;
        console.log("【更新首页】");
        var self=this;
        Network.requestIndexInfo((res)=>{
            if(res.result){
                let data=res.data;
                self.updateState(data);
            }
        });
    },
    updateState(data){
        var self=this;
        self.setSelfEgg(data.selfEggNum);
        self.setOtherEgg(data.otherEggNum);
        self.setMoney(data.money);
        self.txtLvl.string=data.lvl.toString();
        self.proLvl.progress=data.lvlExp/data.lvlFullExp;

        self.txtEgg.string=data.eggNum.toString();
        
        self.proClean.progress=data.cleanProgCurr/data.cleanProgFull;
        if(data.foodRemain<0){
            self.proFood.progress=0;
        }else{
            self.proFood.progress=data.foodRemain/data.foodProgFull;
        }
        self.setProEgg(data.eggProgCurr/data.eggProgFull);
    },

    //更新吃饭
    updateDine(res){
        console.log("更新吃饭");
        if(res.result){
            this.updateIndex();
            console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
            console.log(JSON.stringify(res));
            this.onPlayPlayerDine(res.data.id);
        }else{
            this.player.openSay(res.data);
        }
    },


    //设置钱
    setMoney(num){
        this._money=num;
        this.txtMoney.string=this._money.toString();
    },
    setMoneyEff(num){
        this.setMoney(num);
        this.txtMoney.node.getComponent(cc.Animation).play();
    },
    //添加钱
    addMoneyEff(num){
        this._money+=num;
        this.txtMoney.string=this._money.toString();
        this.txtMoney.node.getComponent(cc.Animation).play();
    },
    //设置自己的鸡蛋
    setSelfEgg(num){
        this.txtSelfEgg.string=num.toString();
    },
    //设置自己的鸡蛋和效果
    setSelfEggEff(num){
        //eff
        this.setSelfEgg(num);
    },
    //设置偷来的鸡蛋
    setOtherEgg(num){
        this.txtOtherEgg.string=num.toString();
    },
    //设置偷来的鸡蛋和效果
    setOtherEggEff(num){
        //eff
        this.setOtherEgg(num);
    },
    //设置头像
    setAvatar(avatar){
        var self=this;
        cc.loader.load({url:avatar,type:jpg},function(err,tex){
            if(!err){
                self.imgAvatar.spriteFrame=tex;
            }
        });
    },
    setPanelThief(data){
        if(data.length>0){
            
        }
    },

    //设置分数
    setScore(score){
        WX.postMessage({cmd:"SETSCORE",para:score});
    },
    //获取自己分数
    getScore(){
        WX.postMessage({cmd:"GETSCORE"});
    },
    //设置鸡蛋进度
    setProEgg(pro){
        this.proEgg.progress=pro;
        this.proEgg.node.getChildByName("text").getComponent(cc.Label).string=parseInt(pro*100).toString();
    },
    //显示提示框
    showTip(txt){
        if(txt==null||txt=="")
            return;
        let msgBox= cc.instantiate(this.preMsgBox);
        msgBox.parent=this.node;
        let msgBoxScr=msgBox.getComponent("MsgBox");
        msgBoxScr.show(txt);
    },

    //显示朋友面板
    onShowPanelFriends(){
        this.panels.createPanel(this.prePanelFriends,"PanelFriends");
    },
    /**显示链接面板
     */
    onShowPanelLink(){
        this.panels.createPanel(this.prePanelLink,"PanelLink");
    },
    /**显示装扮面板
     */
    onShowPanelTittivate(){
        this.panels.createPanel(this.prePanelTittivate,"PanelTittivate");
    },
    /**显示任务面板
     */
    onShowPanelMission(){
        this.panels.createPanel(this.prePanelMission,"PanelMission");
    },
    /**显示背包面板
     */
    onShowPanelPackage(){
        this.panels.createPanel(this.prePanelPackage,"PanelPackage");
    },
    onShowPanelAnnouncement(){
        this.panels.createPanel(this.prePanelAnnouncement,"PanelAnnouncement");
    },
    onShowPanelPersonal(){
        this.panels.createPanel(this.prePanelPersonal,"PanelPersonal");
    },
    //显示个人日志信息
    onShowPanelDetail(){
        this.panels.createPanel(this.prePanelDetail,"PanelDetail");
    },
    //显示道具界面
    onShowPanelProp(){
        this.panels.createPanel(this.prePanelProp,"PanelProp");
    },
    //显示商店界面
    onShowPanelShop(){
        this.panels.createPanel(this.prePanelShop,"PanelShop");
    },
    //显示排行榜界面
    onShowPanelRank(){
        this.panels.createPanel(this.prePanelRank,"PanelRank");
    },
    //显示说明攻略界面
    onShowPanelInstruction(){
        this.panels.createPanel(this.prePanelInstruction,"PanelInstruction");
    },
    //播放吃饭动画
    onPlayPlayerDine(id){
        let dine=cc.instantiate(this.prePlayerDine);
        dine.parent=this.node;
        let dineScr=dine.getComponent("PlayerDine");
        dineScr.fill(id);
    },
    /**洗澡
     *
     *
     */
    onBath(){
        var self=this;
        Network.requestBath((res)=>{
            if(res.result){
                //播放洗澡动画
                self.player.openSay(res.data);
                self.updateIndex();
            }else{
                self.showTip(res.data);
            }
        });
    },
    //收鸡蛋
    onPickEgg(){
        var self=this;
        Network.requestPickEgg((res)=>{
            if(res.result){
                //播放收鸡蛋动画
                self.updateIndex();
            }else{
                self.showTip(res.data);
            }
        });
    },

    //测试
    test(){

        // let imgA=cc.find("Canvas/New Sprite").getComponent(cc.Sprite);
        // let imgB=cc.find("Canvas/New Sprite(Splash)").getComponent(cc.Sprite);
        // let path="Shop/shop_"+5;
        // cc.loader.loadRes(path,function(err,tex){
        //     if(!err){
        //         imgA.spriteFrame=new cc.SpriteFrame(tex);
        //         imgB.spriteFrame=new cc.SpriteFrame(tex);
        //     }

        // });
        this.onPlayPlayerDine(4);
 
    },
    //设置天黑天亮
    setDark(){
        let hour=new Date().getHours();
        if(hour==this._hour)
            return;
        this._hour=hour;
        if(hour>=6&&hour<=20){
            this.ndHomeMask.active=false;
        }else{
            this.ndHomeMask.active=true;
        }
        console.log("现在时刻："+hour+"点");
    },
    //显示敬请期待提示
    onShowTipExpect(){
        this.showTip("正在完善中,敬请期待.");
    },
});
