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
        txtUserId:cc.EditBox,  //用户ID
        svFriend:cc.ScrollView,  //滚动视图
        _page:0,  //分页
        _isPanelReady:false,
        _inc:0,
        _lstFriendData:[],  //好友数据
        _partCount:7,  //每次加载几个数据
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        Global.scene.lastPanel="PanelFriends";

        this.svFriend.node.on('scroll-to-bottom', this.updatePanelPart, this);
        
        this.loadFriends();
    },
    
    show(){
        this.ndBg.y=this.ndBg.height;
        this._isPanelReady=true;
        this.loadFriends();
    },
    //显示面板（动画）
    showFx(){
        var self=this;
    this.ndBg.runAction(cc.sequence( cc.moveTo(0.5,new cc.Vec2(this.ndBg.position.x,this.ndBg.height)),
        cc.callFunc(function(){self._isPanelReady=true;})
        ));
        
    },

    //隐藏面板
    onHide(){
        var self=this;
        if(!this._isPanelReady)
        return;
        this.ndBg.runAction(cc.sequence( 
            cc.moveTo(0.5,new cc.Vec2(this.ndBg.position.x,0)),
            cc.callFunc(function(){
                self.node.active=false;
                Global.scene.lastPanel="";
                console.log("隐藏面板");
                //引导5
                let guide=cc.find("Canvas/Guid").getComponent("Guid");
                if(guide._isGuid){
                    guide.stepSchedule(5);
                }
            })));
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
                Global.scene.lastPanel="";
                console.log("删除面板");
                //引导5
                let guide=cc.find("Canvas/Guid").getComponent("Guid");
                if(guide._isGuid){
                    guide.stepSchedule(5);
                }
            })));
    },
    // onEnable(){
    //     this.show();
    // },
    //添加好友
    onShare(){
        Global.game.onShare("tp=af&id="+Global.id);
    },
    //加载好友
    loadFriends(){
        var self=this;
        Network.requestFriendList(this._page,(res)=>{
            if(res.result){
                self._lstFriendData=res.data.friends;
                // self.updatePanel(res.data);
                self.updatePanelPart();
            }else{
                //Global.game.showTip(res.data);
            }
        });

    },
    updatePanel()
    {
        
                        let friends=data.friends;
                for(var i=0;i<friends.length;i++){
                    let newItem= cc.instantiate(this.preItem);
                    if(!newItem)
                        continue;
                    newItem.parent=this.ndCtnt;
                    let newItemScr= newItem.getComponent("ItemFriend");
                    newItemScr.fillItem(friends[i].id,friends[i].lvl,friends[i].nickName,friends[i].avatar,
                        friends[i].isHelpBath,friends[i].isStealFood,friends[i].isStealEgg,friends[i].isOtherStealFood,this._inc);
                    this._inc++;
                }
                this._page++;
    },
    updatePanelPart(){
        console.log("【更新好友数据】");
        let data=this._lstFriendData;
        let length=this._partCount;
        if(length>this._lstFriendData.length-this.ndCtnt.childrenCount){
            length=this._lstFriendData.length-this.ndCtnt.childrenCount;
        }
        let idx=this.ndCtnt.childrenCount;
        for(var i=idx;i<idx+length;i++){
            console.log(JSON.stringify(data[i]));
            let newItem= cc.instantiate(this.preItem);
            if(!newItem)
                continue;
            newItem.parent=this.ndCtnt;
            let newItemScr= newItem.getComponent("ItemFriend");
            newItemScr.fillItem(data[i].id,data[i].lvl,data[i].nickName,data[i].avatar,
                data[i].isHelpBath,data[i].isStealFood,data[i].isStealEgg,data[i].isOtherStealFood,0);
        }
    },


    /**添加好友
     *
     *
     */
    onAddFriend(){
        var self=this;
        if(this.txtUserId.string!=""){
        let id=this.txtUserId.string;
        console.log("【添加好友】");
        Network.requestAddFriend(id,(res)=>{
            if(res.result){
            Global.game.showTip("添加好友成功");
            }else{
                Global.game.showTip("添加好友失败");
            }
            self.onClose();
        });
        }
        else{
            this.onShare();
        }
    },
});
