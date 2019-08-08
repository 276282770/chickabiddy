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
        sView:cc.ScrollView,
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
            if(self.preItem!=null){
            for(var i=0;i<dataLst.length;i++){
                
                let newItem=cc.instantiate(self.preItem);
                newItem.getComponent("Item").fill((i+1).toString(),dataLst[i].nickname,dataLst[i].avatar,dataLst[i].level,dataLst[i].openId);
                newItem.parent=self.ndCtnt;
                }
            }else{
                console.log("X好友排行项预制体预制体不能为空");
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
    scroll(data){
        let oriPos=this.sView.getScrollOffset();
                let speed = 80;
                let scrollTime = Math.abs(data.y/speed);
                let moveScale = 1;
                let movey = data.y*moveScale;
                
                if(!this.targetPos){
                     this.targetPos = data.y;
                     this.oriPosy = oriPos.y;
                }
                else{
                    if ((data.y * this.targetPos) > 0)
                    {
                        movey = this.targetPos - (oriPos.y - this.oriPosy) + data.y*moveScale;
                        this.targetPos = movey;
                        this.oriPosy = oriPos.y;
                    }
                    else{
                        this.targetPos = movey;
                        this.oriPosy = oriPos.y;
                    }
                }
                this.node.stopAllActions();
                this.sView.scrollToOffset(new cc.Vec2(oriPos.x,oriPos.y+movey),scrollTime);
    },
    scrollTouchEnd(){
        if(Math.abs(this.targetPos) > 50){
            let is_abs = this.targetPos >0?1:-1;
            let num =Math.floor( Math.abs(this.targetPos)/20);
            let addedPos = 20*(num+1)/2;
            this.isScrollEnded = true;
            this.onMessage({cmd:"scroll",y:addedPos*is_abs});
        }
    },
    
});
