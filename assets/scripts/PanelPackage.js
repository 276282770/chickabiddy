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
        ndCtnt:cc.Node,  //内容根
        preItemPackage:cc.Prefab,  //项预制体
        _panelReady:false
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    fill(){
        var self=this;
        Network.requestPackage((res)=>{
            if(res.result){
                for(var i=0;i<res.data.length;i++){
                    let data=res.data[i];
                    let newItem=cc.instantiate(this.preItemPackage);
                    newItem.parent=self.ndCtnt;
                    let newItemScr=newItem.getComponent("ItemPackage");
                    newItemScr.fill(data.id,data.name,data.descript,data.count);
                }
            }else{
                Global.game.showTip(res.data);
            }
        });
        // let res={result:true,data:[{id:1,name:"猪饲料",descript:"给猪猪吃的饲料",count:3},{id:1,name:"Niu饲料",descript:"给牛吃的饲料",count:4}]};
        // if(res.result){
        //     for(var i=0;i<res.data.length;i++){
        //         let data=res.data[i];
        //         let newItem=cc.instantiate(this.preItemPackage);
        //         newItem.parent=self.ndCtnt;
        //         let newItemScr=newItem.getComponent("ItemPackage");
        //         newItemScr.fill(data.id,data.name,data.descript,data.count);
        //     }
        // }else{
        //     Global.game.showTip(res.data);
        // }
    },
    onShow(){
        var self=this;
        let h=this.ndBg.height;
        let x=this.ndBg.position.x;
        this.ndBg.runAction(cc.sequence(
            cc.moveTo(0.5,x,h),
            cc.callFunc(function(){
                self._panelReady=true;
            })
        ));
    },
    onClose(){
        if(!this._panelReady)
            return;
        let x=this.ndBg.position.x;
        var self=this;
        this.ndBg.runAction(cc.sequence(
            cc.moveTo(0.5,x,0),
            cc.callFunc(function(){
                self.node.destroy();
            })
        ));
    },
    onEnable(){
        this.fill();
        this.onShow();
    },
});
