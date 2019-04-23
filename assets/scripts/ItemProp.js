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
        // ndUse:cc.Node,  //使用按钮节点
        prePanelBuy:cc.Prefab,  //购买界面预制体
        _cid:-1,  //道具ID
        _had:false,  //是否拥有
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},
    //使用
    onClick(){
        if(this._had){
        Network.requestUseProp((res)=>{
            if(!res.result){
                Global.game.showTip(res.data);
            }
            
        });
        }else{
            let newPanel= cc.instantiate(this.prePanelBuy);
        newPanel.parent=cc.find("Canvas");
        let newPanelScr=newPanel.getComponent("PanelBuy");
        newPanelScr.load(this._cid);
        }
        Global.game.panels.deletePanel();
    },

    fill(id,had){
        var self=this;
        this._had=had;
        this._cid=id;
        if(id){
            let path;
            if(had){
                path="Prop/prop_"+id;
            }
            else{
                // this.ndUse.active=false;
                path="Prop/prop_"+id+"_g";
            }
            cc.loader.loadRes(path,function(err,tex){
                if(!err){
                    self.node.getComponent(cc.Sprite).spriteFrame=new cc.SpriteFrame(tex);
                }
            });
        }
    }
});
