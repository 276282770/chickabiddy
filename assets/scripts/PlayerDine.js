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
        txtSay:cc.Label ,  //说话
        imgFood:cc.Sprite,  //食物图片
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.scheduleOnce(this.onClose,10);
    },
    onClose(){
        this.node.destroy();
        //引导4
        let guide=cc.find("Canvas/Guid").getComponent("Guid");
        if(guide._isGuid){
            guide.stepSchedule(4);
        }
    },
    fill(id,sayText){
        var self=this;
        if(sayText!=null&&sayText!=""){
            this.txtSay.node.parent.getComponent(cc.Animation).play("say_open");
            self.txtSay.string=sayText;
        }
        cc.loader.loadRes("Shop/shop_"+id,function(err,tex){
            if(!err){
                self.imgFood.spriteFrame=new cc.SpriteFrame(tex);
            }
        });
    },

    // update (dt) {},
});
