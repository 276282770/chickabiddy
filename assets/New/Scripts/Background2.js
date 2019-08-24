var CameraController=require("CameraController2");
cc.Class({
    extends: cc.Component,

    properties: {

        camera:CameraController,  //主相机控制
        _isMouseDown:false,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.on(cc.Node.EventType.MOUSE_DOWN,this.onMouseDown,this,true);
        this.node.on(cc.Node.EventType.MOUSE_MOVE,this.onMouseMove,this,true);
        this.node.on(cc.Node.EventType.MOUSE_UP,this.onMouseUp,this,true);
        this.node.on(cc.Node.EventType.TOUCH_START, this.onMouseDown, this, true);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onMouseMove, this, true);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onMouseUp, this, true);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onMouseUp, this, true);

    },

    start () {

        
    },

    // update (dt) {},
    onMouseDown(event){
        this._isMouseDown=true;
    },
    onMouseMove(event){
        if(!this._isMouseDown)
            return;
        let delta=event.getDelta()
        // console.log("[触摸]"+JSON.stringify( delta));
        this.camera.moveBy(delta);
    },
    onMouseUp(event){
        this._isMouseDown=false;
    },
});
