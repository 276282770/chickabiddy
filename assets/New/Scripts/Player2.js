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
        animBody:cc.Animation,  //身体动画

        _horizontal:0,
        _vertical:0,
        _rigid:cc.RigidBody,  //刚体
        _isBath:false,

        _isMoveToTargetX:false,
        _originalPosition:new cc.Vec2(0,0),  //小鸡原始坐标
        _pool:cc.Node,  //水池节点
        _lunchBox:cc.Node,  //饭盒节点
        _cam:null,
        _tittivate:null,  //装扮
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
        this._originalPosition=this.node.position;
        // this.node.position=new cc.Vec2(0,0);
        // this.node.position=Common.vector2Add(this.node.position,new cc.Vec2(0,50));
        this._cam=cc.find("Canvas/Main Camera").getComponent("CameraController2");

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
        // console.log("按下"+this._horizontal+" "+this._vertical);
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
    //移动小鸡到指定位置
    moveTo(targetPos,callback){
        var self=this;
        this.node.stopAllActions();
        this.animBody.node.scaleX=this.getDirectionX(targetPos);

        this.animBody.play("player2_walk");
         this.node.runAction(cc.sequence(cc.moveTo(Common.getDistance(this.node.position,targetPos)/150,targetPos),
         cc.callFunc(function(){
             self.animBody.play("player2_idle");
             self.animBody.node.scaleX=1;
             callback();
            })
         ));
         
    },
    //移动小鸡到指定X坐标
    moveToX(){

    },
    //获取小鸡要去的方向
    getDirectionX(targetPos){
        var result=targetPos.x-this.node.x;
        result=Common.clamp(result,-1,1);
        console.log(result);
        return result;
    },
    //检测洗澡
    checkBath(){
        if(!this._isBath&&this.getPositionX()<=-700){

        }
    },
    //获取x坐标
    getPositionX(){
        return this.node.position.x;
    },
    //设置是否显示
    setActive(show){
        this.node.active=show;
    },
    //去洗澡
    goBath(){
        var self=this;
        this._cam._isFollow=true;
        self.getPool();
        let targetPos=Common.vector2Add(this._pool.position,this._pool.getChildByName("playerPos").position);
        this.moveTo(targetPos,function(){
            console.log("走完了");
            // self.node.active=false;
            self._pool.getComponent(cc.Animation).play("bath");
            
        })
    },
    //获取pool
    getPool(){
        this._pool=cc.find("Canvas/Pool");
        return this._pool;
    },
    //获取饭盒节点
    getLunchBox(){
        this._lunchBox=cc.find("Canvas/LunchBox");
        return this._lunchBox;
    },
    //回到原点
    goBack(){
        this._cam._isFollow=true;
        this.moveTo(this._originalPosition,function(){
            console.log("走完了");
        });
    },
    //去吃饭
    goDine(){
        var self=this;
        this._cam._isFollow=true;
        self.getLunchBox();
        let targetPos=Common.vector2Add(this._lunchBox.position,this._lunchBox.getChildByName("playerPos").position);
        this.moveTo(targetPos,function(){
            console.log("走完了");
            // self.node.active=false;
            // self._pool.getComponent(cc.Animation).play("bath");
            
        })
    },
    onClick(){
        this.goBack();
    },
    //装扮
    setTittivate(data){
        this._tittivate=data;
    },
    setPlayerCondition(){

    },
});
