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
        txtInfo:cc.Label,  //内容
        txtDate:cc.Label,  //时间
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.fill();
    },

    fill(){
        var self=this;
        Network.requestAnnouncement((res)=>{
            if(res.result){
                self.updatePanel(res.data);
            }else{
                Global.game.showTip(res.data);
            }
        });
        this.updatePanel({date:"2018-03-01",text:"测试测试测试测试测试测试测试测试测试测试"});
    },
    updatePanel(data){
        this.txtInfo.string=data.text;
        this.txtDate.string=data.date;
    },

    onShow(){

    },
    onClose(){
        this.node.destroy();
    },
    onEnable(){
        
        this.onShow();
    },
});
