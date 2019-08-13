// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

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
        spAllow:[cc.SpriteFrame],  //箭头
        ndAllow:cc.Node,  
        _isShow:false,  //是否在显示
        _ready:true,  //是否准备好
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
 
    },

    // update (dt) {},

    onToggleShow(){
        if(this._isShow){
            this.onHide();
        }else{
            this.onShow();
        }
        //引导
        
        let guide=cc.find("Canvas/Guid").getComponent("Guid");
        guide.hidePoint();
        if(guide._isGuid){
            guide.background_onClick();
        }
    },
    onHide(){
        var self=this;

        if(!this._ready)
        return;
        this._ready=false;
        this.node.runAction(cc.sequence(
            cc.moveBy(0.5,-this.node.width,0),
            cc.callFunc(function(){
                console.log("aaa");
                self._ready=true;
                self.ndAllow.getComponent(cc.Sprite).spriteFrame=self.spAllow[0];
            })
        ));
        this._isShow=false;
    },
    onShow(){
        var self=this;

        if(!this._ready)
        return;
        this._ready=false;
        this.node.runAction(cc.sequence(
            cc.moveBy(0.5,this.node.width,0),
            cc.callFunc(function(){
                console.log("aaa");
                self._ready=true;
                self.ndAllow.getComponent(cc.Sprite).spriteFrame=self.spAllow[1];
            })
        ));
        this._isShow=true
    }
});
