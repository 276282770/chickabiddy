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

        panels:PanelManager,  //面板管理
        prePanelFriends:cc.Prefab,  //朋友面板预制体
        prePanelLink:cc.Prefab,  //链接面板预制体
        prePanelTittivate:cc.Prefab,  //装扮面板预制体
        prePanelMission:cc.Prefab,  //任务面板预制体
        prePanelPackage:cc.Prefab,  //背包面板预制体
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        Global.game=this;
        WX.login();
        WX.getUserInfo();
        WX.getSetting((isAuth)=>{if(!isAuth)WX.createUserInfoButton();});


    },

    start () {
        Network.test(function(res){
            console.log(JSON.stringify(res));
        });
    },

    // update (dt) {},
    
    //分享
    onShare(){
        WX.shareAppMessage("","http://pic13.nipic.com/20110412/6759696_220922114000_2.jpg","tp=222");
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
});
