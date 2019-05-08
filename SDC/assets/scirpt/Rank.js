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
        preItem:{default:null,type:cc.Prefab,tooltip:"项预制体"},
        ndCtnt:{default:null,type:cc.Node,tooltip:"项目根节点"},
    },

    // LIFE-CYCLE CALLBACKS:

    start(){

        this.load();

    },

    load(){
        var self=this;
        var dataLst=[];
        WX.getFriendCloudStorage((res)=>{
            for(var i=0;i<res.length;i++){
            let openid=res[i].openid;
            let nickname=res[i].nickname;
            let avatarUrl=res[i].avatarUrl;
            let KVDataValue=JSON.parse( res[i].KVDataList[0].value);
            let score=KVDataValue.wxgame.score;

            dataLst.push({nickname:nickname,avatar:avatarUrl,level:score,openId:openid});
            }
            self.sortList(dataLst);
            for(var i=0;i<dataLst.length;i++){
                let newItem=cc.instantiate(self.preItem);
                newItem.getComponent("Item").fill((i+1).toString(),dataLst[i].nickname,dataLst[i].avatar,dataLst[i].level,dataLst[i].openId);
                newItem.parent=self.ndCtnt;
            }
        });
    },

    sortList(lstData){
        for(var i=0;i<lstData.length;i++){
            for(var j=i+1;j<lstData.length;j++){
                if(lstData[j].level>lstData[i].level){
                    let tmpData=lstData[i];
                    lstData[i]=lstData[j];
                    lstData[j]=tmpData;
                }
            }
        }
    },
    
});
