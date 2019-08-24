var Common=require("Common");

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
        speed:1,  //移动速度
        jumpSpeed:200000,  //跳跃速度

        _horizontal:0,
        _vertical:0,
        _rigid:cc.RigidBody,  //刚体
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.director.getPhysicsManager().enabled = true;
        cc.director.getCollisionManager().enabled=true;
        cc.director.getCollisionManager().enabledDebugDraw = true;
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },

    start () {
        this._rigid=this.node.getComponent(cc.RigidBody);
        // this.node.position=new cc.Vec2(0,0);
        // this.node.position=Common.vector2Add(this.node.position,new cc.Vec2(0,50));

    },

    update (dt) {
        // this.move(dt);
        // console.log(JSON.stringify( this.node.position));
        // this._rigid.applyForceToCenter(new cc.v2(10000,0));
    },
    onKeyDown: function (event) {
        switch(event.keyCode) {
            case cc.macro.KEY.right:
                this._horizontal=1;
                break;
                case cc.macro.KEY.left:this._horizontal=-1;break;
                case cc.macro.KEY.up:this._vertical=1;break;
                case cc.macro.KEY.down:this._vertical=-1;break;
        }
        console.log("按下"+this._horizontal+" "+this._vertical);
        this.move();
        // this.node.position=new cc.Vec2(this.node.position.x+1,this.node.position.y+this._vertical*this.speed*dt);
        // this._rigid.applyForceToCenter(new cc.Vec2(10000,0));
        // this._rigid.applyForceToCenter(new cc.v2(100000,0));
    },
    onKeyUp: function (event) {
        switch(event.keyCode) {
            case cc.macro.KEY.a:
                this._horizontal=0;
                break;
                case cc.macro.KEY.left:this._horizontal=0;break;
                case cc.macro.KEY.up:this._vertical=0;break;
                case cc.macro.KEY.down:this._vertical=0;break;
        }
        // console.log("松开"+this._horizontal+" "+this._vertical);
        // this.move(0.02);
    },
    //移动
    move(){
        if(this._horizontal!=0||this._vertical!=0){
            // this.node.position=new cc.Vec2(this.node.position.x+this.speed*this._horizontal,this.node.position.y+this._vertical*this.speed);
            // console.log("【移动】#"+JSON.stringify(this.node.position));
            // this._rigid.linearVelocity =0;
            this._rigid.applyForceToCenter(new cc.Vec2(this._horizontal*this.speed,this._vertical*this.jumpSpeed));
        }
    },

});
