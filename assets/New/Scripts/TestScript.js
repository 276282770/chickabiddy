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
        ndXiaoJi:cc.Node, //小鸡
        camera:cc.Camera,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        
        //  var action=cc.moveTo(5,new cc.Vec2(100,2));
        //  this.ndXiaoJi.runAction(action);
         cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
         node.on(cc.Node.EventType.MOUSE_DOWN, function (event) {
            console.log('Mouse down');
          }, this);
    },

    update (dt) {
        this.followXJ();
    },
    followXJ(){
        var pos=this.ndXiaoJi.position;
        if(pos<)
        this.camera.node.position=pos;
    },

});
