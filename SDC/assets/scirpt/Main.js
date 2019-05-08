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

    },

    start () {
        var self=this;
        WX.onMessage((data)=>self.rsvMessage(data));
  
    },

    // update (dt) {},
    
    //接受主域消息
    rsvMessage(data){

        switch(data.cmd){
            case "SETSCORE":this.setScore(data.para);break;
            case "GETSCORE":this.getScore();break;
            case "SETOPENID":this.setOpenId(data.para);break;
        }
    },
    //发送分数
    setScore(score){
        WX.setUserCloudStorage(score);
    },
    //获取自己的分数
    getScore(){
        WX.getUserCloudStorage();
    },
    //设置用户的openid
    setOpenId(data){
        Global.openid=data;
    },
    test(){
        console.log("test");
    },
});
