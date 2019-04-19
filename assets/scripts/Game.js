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
        txtLvl:cc.Label,  //等级
        proLvl:cc.ProgressBar,  //等级进度
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

        _hour:0,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        Global.game=this;
        var self=this;
        WX.login(code=>{
            let avatar;
            let nickName;
            // code="aaa";
            WX.getSetting((isAuth)=>{if(!isAuth){WX.createUserInfoButton(
                function(data){
                    avatar=data.avatarUrl;
                    nickName=data.nickName;
                    self.login(code,avatar,nickName);
                }
            );}
                else{
                    WX.getUserInfo((res)=>{
                        avatar=res.avatarUrl;
                        nickName=res.nickName;
                        self.login(code,avatar,nickName);
                    });
                }
            });
            
        });
        
        WX.onShow((res)=>{
            if(res.tp){
                //添加好友
                if(res.tp=="af"){
                    Network.requestAddFriend(res.id);
                }
            }
        });


    },

    start () {
        this.setDark();
    },


    update (dt) {
        // this.setDark();
    },
    
    login(code,avatar,nickName){
        var self=this;
        cc.loader.load({url:avatar,type:"png"},function(err,tex){
            if(!err){
                self.imgAvatar.spriteFrame=new cc.SpriteFrame(tex);
            }
        });
        Network.requestLogin(code,avatar,nickName,(res)=>{

            
        });
    },
    //分享
    onShare(tp){
        WX.shareAppMessage("","http://pic13.nipic.com/20110412/6759696_220922114000_2.jpg",tp);
    },
    onClick(){
        
    },
    //更新首页
    updateIndex(){
        var self=this;
        Network.requestIndexInfo((data)=>{
            self.setSelfEgg(data.eggSelf);
            self.setOtherEgg(data.eggOther);
        });
    },

    //更新吃饭
    updateDine(data){
        console.log("更新吃饭");
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

    //设置分数
    setScore(score){
        WX.postMessage({cmd:"SETSCORE",para:score});
    },
    //获取自己分数
    getScore(){
        WX.postMessage({cmd:"GETSCORE"});
    },

    //显示提示框
    showTip(txt){
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

    //测试
    test(){
        this.showTip("你好  300000000000000\r\n200");
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
