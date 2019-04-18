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
        ndBg:cc.Node,  //背景节点
        preItem:cc.Prefab,  //好友项预制体
        ndCtnt:cc.Node,  //好友列表根节点
        _page:0,  //分页
        _isPanelReady:false,
        _inc:0,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },
    
    //显示面板
    show(){
        var self=this;
    this.ndBg.runAction(cc.sequence( cc.moveTo(0.5,new cc.Vec2(this.ndBg.position.x,this.ndBg.height)),
        cc.callFunc(function(){self._isPanelReady=true;})
        ));
        this.loadFriends();
    },
    //隐藏面板
    hide(){

    },
    //删除面板
    onClose(){
        var self=this;
        if(!this._isPanelReady)
        return;
        this.ndBg.runAction(cc.sequence( 
            cc.moveTo(0.5,new cc.Vec2(this.ndBg.position.x,0)),
            cc.callFunc(function(){
                self.node.destroy();
                console.log("删除面板");
            })));
    },
    onEnable(){
        this.show();
    },
    //添加好友
    onAddFriend(){
        Global.game.onShare("tp=af&id="+Global.id);
    },
    //加载好友
    loadFriends(){
        var self=this;
        Network.requestFriendList(this._page,(res)=>{
            if(res.result){
                self.updatePanel(res.data);
            }else{
                Global.game.showTip(res.data);
            }
        });
        // let backData={};
        // backData.result=true;
        // backData.data={};
        // backData.data.friends=[{
        //     id:1,
        //     nickName:"ふ液飮颩",
        //     lvl:2,
        //     avatar:"https://wx.qlogo.cn/mmopen/vi_32/oUicWDFmZmf8Khf6uEh7pt7uvEPiaQCibGqeJWOWHrdICRevRxUG4niawH7c7qyM80iciaSia5qdflU85RB7WM0gtTbuA/132",
        //     isHelpBath:true,
        //     isStealEgg:false,
        //     isStealFood:true,
        //     isOtherStealFood:false
        // },{
        //     id:2,
        //     nickName:"aabbxx",
        //     lvl:2,
        //     avatar:"https://wx.qlogo.cn/mmopen/vi_32/oUicWDFmZmf8Khf6uEh7pt7uvEPiaQCibGqeJWOWHrdICRevRxUG4niawH7c7qyM80iciaSia5qdflU85RB7WM0gtTbuA/132",
        //     isHelpBath:false,
        //     isStealEgg:true,
        //     isStealFood:false,
        //     isOtherStealFood:true
        // },
        // {
        //     id:2,
        //     nickName:"aabbxx",
        //     lvl:2,
        //     avatar:"https://wx.qlogo.cn/mmopen/vi_32/oUicWDFmZmf8Khf6uEh7pt7uvEPiaQCibGqeJWOWHrdICRevRxUG4niawH7c7qyM80iciaSia5qdflU85RB7WM0gtTbuA/132",
        //     isHelpBath:true,
        //     isStealEgg:true,
        //     isStealFood:true,
        //     isOtherStealFood:true
        // },
        // {
        //     id:2,
        //     nickName:"aabbxx",
        //     lvl:2,
        //     avatar:"https://wx.qlogo.cn/mmopen/vi_32/oUicWDFmZmf8Khf6uEh7pt7uvEPiaQCibGqeJWOWHrdICRevRxUG4niawH7c7qyM80iciaSia5qdflU85RB7WM0gtTbuA/132",
        //     isHelpBath:false,
        //     isStealEgg:false,
        //     isStealFood:false,
        //     isOtherStealFood:false
        // },
        // ];
        // this.updatePanel(backData.data);
    },
    updatePanel(data){
                        let friends=data.friends;
                for(var i=0;i<friends.length;i++){
                    let newItem= cc.instantiate(this.preItem);
                    newItem.parent=this.ndCtnt;
                    let newItemScr= newItem.getComponent("ItemFriend");
                    newItemScr.fillItem(friends[i].id,friends[i].lvl,friends[i].nickName,friends[i].avatar,
                        friends[i].isHelpBath,friends[i].isStealFood,friends[i].isStealEgg,friends[i].isOtherStealFood,this._inc);
                    this._inc++;
                }
                this._page++;
    },
});
