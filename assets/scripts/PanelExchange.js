// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

var Network=require("Network");
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
        ndBg:cc.Node,  //背景
        // spTabNormal:cc.SpriteFrame, //正常按钮的背景
        // spTabSelected:cc.SpriteFrame,  //当前按钮的背景
        btnTabExchangeList:cc.Button,  //兑换记录按钮
        btnTabExchange:cc.Button,  //兑换按钮
        ndSvExchangeList:cc.Node,  //
        ndSvExchange:cc.Node,

   
        preItemExchangeList:cc.Prefab,   //兑换记录项预制体

        

        _panelReady:false,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.load();
        // this.onTab(this,0);
    },

    start () {
        
    },
    /**选择
     */
    onTab(event,customerData){
        console.log("点击按钮"+customerData);

        var tabBtn=[this.btnTabExchange,this.btnTabExchangeList];
        var svNode=[this.ndSvExchange,this.ndSvExchangeList];

        let idx=parseInt(customerData);

        for(var i=0;i<tabBtn.length;i++){
            let me=i==idx;
            tabBtn[i].node.getChildByName("honghengxian").active=me;
            tabBtn[i].interactable=!me;
            svNode[i].active=me;
        }
    },


    onShow(){
        let h=this.ndBg.height;
        let x=this.ndBg.position.x;
        this.ndBg.runAction(cc.sequence(
            cc.moveTo(0.5,x,h),
            cc.callFunc(()=>{
                this._panelReady=true;
            })
        ));
    },
    onClose(){
        if(!this._panelReady)
            return;
        let x=this.ndBg.position.x;
            this.ndBg.runAction(cc.sequence(
                cc.moveTo(0.5,x,0),
                cc.callFunc(()=>{
                    this.node.destroy();
                })
            ));
    },
    onEnable(){
        this.onShow();
    },

    //加载
    load(){
        
        var self=this;

        Network.exchangeEggLog((res)=>{
            if(res.result){
                var data=res.data;
                for(var i=0;i<data.length;i++){
                    let item=cc.instantiate(self.preItemExchangeList);
                    item.parent=self.ndSvExchangeList.getComponent(cc.ScrollView).content;
                    item.fill(data[i].count,data[i].site,data[i].time);
                }
            }
        });

    },
});
