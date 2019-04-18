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
        preItem:cc.Prefab,  //项预制体
        ndCtnt:cc.Node,  //列表根节点
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
        this.loadItems();
    this.ndBg.runAction(cc.sequence( cc.moveTo(0.5,new cc.Vec2(this.ndBg.position.x,this.ndBg.height)),
        cc.callFunc(function(){self._isPanelReady=true;})
        ));
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

    //加载信息
    loadItems(){
        var self=this;
        Network.requestDetailLog((res)=>{
            if(res.result){
                this.updatePanel(res.data);

            }else{
                Global.game.showTip(res.data);
            }
        });
        
    },
    updatePanel(data){
                for(var i=0;i<data.length;i++){
                    let newItem= cc.instantiate(this.preItem);
                    newItem.parent=this.ndCtnt;
                    let newItemScr= newItem.getComponent("ItemDetail");
                    newItemScr.fill(data[i].date,data[i].text,this._inc);
                    this._inc++;
                }
    },
});
