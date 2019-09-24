var Common=require("Common2");

cc.Class({
    extends: cc.Component,

    properties: {
        minX: 0,  //最小x值
        minY: 0,  //最小Y值
        maxX: 0,  //最大x值
        maxY: 0,  //最大y值
        ndTarget: cc.Node,  //玩家
        moveSpeed:2,//移动速度

        rebackTime:5,
        _offset: cc.Vec2(0, 0),

        _isFollow: true,
        _canBack:true,  //是否可以回位
    },


    // onLoad () {},

    start() {
        if(this.ndTarget==null){
        // this.ndTarget = cc.find("Canvas/Player");
            if(Global.game.player!=null)
            this.ndTarget=Global.game.player.node;
        }
        // this._offset = new cc.Vec2(this.node.position.x - this.ndTarget.position.x,this.node.position.y - this.ndTarget.position.y);
        if(this.ndTarget!=null)
        this._offset=Common.vector2Subtract(this.node.position,this.ndTarget.position);

    },

    update(dt) {
        if (this._isFollow&&this.ndTarget!=null) {
            this.node.position = this.followTarget();
        }
    },
    setTarget(target){
        this.ndTarget=target;
        this._offset=Common.vector2Subtract(this.node.position,this.ndTarget.position);
    },
    //跟踪目标
    followTarget() {
        let pos = Common.vector2Add( this.ndTarget.position , this._offset);
        if (pos.x > 0) {
            pos.x = Math.min(this.maxX, pos.x);
        } else {
            pos.x = Math.max(this.minX, pos.x);
        }
        if(pos.y>0){
            pos.y=Math.min(this.maxY,pos.y);
        }else{
            pos.y=Math.max(this.minY,pos.y);
        }

        return pos;
    },
    //应该的位置
    offsetPos(){
        return Common.vector2Add( this.ndTarget.position , this._offset);
    },
    //移动摄像机
    move(horizontal,vertical){
        this._isFollow=false;
        let x=this.node.position.x+horizontal*moveSpeed;
        let y=this.node.position.y+vertical*moveSpeed;
        this.node.position=new cc.Vec2(x,y);
    },
    //移动距离
    moveBy(pos){
        this._isFollow=false;
        let targetPos = new cc.Vec2(this.node.position.x-pos.x,this.node.position.y-pos.y);
        // console.log(JSON.stringify( targetPos));
        targetPos=this.clampPos(targetPos);
        // console.log(JSON.stringify( targetPos));
        this.node.position=targetPos;
        // this.node.position=new cc.Vec2(this.node.position.x+100,this.node.position.y);
        this.node.stopAllActions();
        this.scheduleOnce(this.backAuto,2);
    },
    //自动回位
    backAuto(){
        let self=this;
        this.node.stopAllActions();
        let pos=this.clampPos(this.offsetPos());
        if(!this._canBack)
            return;
        this.node.runAction(cc.moveTo(0.8,pos),cc.callFunc(
            function(){
                self._isFollow=true;
            }
        ));
    },
    clampPos(posSour){
        // console.log(this.minX+" "+this.minY+" "+this.maxX+" "+this.maxY);
        let pos = posSour;
        if (pos.x > 0) {
            pos.x = Math.min(this.maxX, pos.x);
        } else {
            pos.x = Math.max(this.minX, pos.x);
        }
        if(pos.y>0){
            pos.y=Math.min(this.maxY,pos.y);
        }else{
            pos.y=Math.max(this.minY,pos.y);
        }

        return pos;
    },
});
