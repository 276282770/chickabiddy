var Common = require("Common");
var Network=require("Network");

cc.Class({
    extends: cc.Component,

    properties: {

        speed: 1,  //移动速度
        jumpSpeed: 200000,  //跳跃速度
        animBody: cc.Animation,  //身体动画
        ndSay: cc.Node,  //说话节点
        ndName:cc.Node,  //名字
        sayTime: 2,//说话停留时间
        ndTitti: cc.Node,  //装扮节点

        imgHat: cc.Sprite,  //帽子
        imgGlass: cc.Sprite,  //眼镜
        imgHornor: cc.Sprite,  //荣誉

        type:0,  //0 自己的小鸡， 1，小偷   2，别人的小鸡 

        _horizontal: 0,
        _vertical: 0,
        _rigid: cc.RigidBody,  //刚体
        _isBath: false,

        _state: 0,  //小鸡状态  0正常，1被点击，2空闲， 3哭泣(被揍)， 4 挨饿， 5吃饭， 6洗澡 7不在家
        _lastState: 0,  //上一个状态
        _remainChangeTime: 0,  //改变状态小鸡时间
        _isMoveToTargetX: false,
        _originalPosition: new cc.Vec2(0, 0),  //小鸡原始坐标
        _pool: cc.Node,  //水池节点
        _lunchBox: cc.Node,  //饭盒节点
        _cam: null,
        _tittivate: null,  //装扮
        _imgTitti: null,//装扮图片
        _lastState: -1,  //上一个状态

        _uid:-1,  //小鸡ID
        // _isMe:false,  //是否是本人,
        // _isThief:false,  //是否是小偷
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        cc.director.getPhysicsManager().enabled = true;
        cc.director.getCollisionManager().enabled = true;
        cc.director.getCollisionManager().enabledDebugDraw = true;
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },

    start() {
        this._tittivate = { hat: -1, glass: -1, hornor: -1 };
        this._rigid = this.node.getComponent(cc.RigidBody);
        this._originalPosition = this.node.position;
        // this.node.position=new cc.Vec2(0,0);
        // this.node.position=Common.vector2Add(this.node.position,new cc.Vec2(0,50));
        this._cam = cc.find("Canvas/Main Camera").getComponent("CameraController2");
        this._imgTitti = { hat: this.imgHat, glass: this.imgGlass, hornor: this.imgHornor };


        
    },

    //设置小鸡
    setPlayerData(id,name,level,tittiData,state) {

        this.setData(id,name,level,tittiData,state);
    },
    setThiefData(id,name,level,tittiData,state){
        // this._isThief=true;
        this.type=1;
        this.setData(id,name,level,tittiData,state);
    },
    setData(id,name,level,tittiData,state){

        if(id==Global.id){
            // this._isMe=true;
            this.type=0;
            name="我的小鸡";
            if(Global.sceneCode==0){
                this.ndName.active=false;
            }
        }
        this.ndName.getChildByName("txtLevel").string=level.toString();
        this.ndName.getChildByName("txtName").string=name;
        this.setState(state);
    },

    update(dt) {
        // this.move(dt);
        // console.log(JSON.stringify( this.node.position));
        // this._rigid.applyForceToCenter(new cc.v2(10000,0));

    },
    onKeyDown: function (event) {
        switch (event.keyCode) {
            case cc.macro.KEY.right:
                this._horizontal = 1;
                break;
            case cc.macro.KEY.left: this._horizontal = -1; break;
            case cc.macro.KEY.up: this._vertical = 1; break;
            case cc.macro.KEY.down: this._vertical = -1; break;
        }
        // console.log("按下"+this._horizontal+" "+this._vertical);
        this.move();
        // this.node.position=new cc.Vec2(this.node.position.x+1,this.node.position.y+this._vertical*this.speed*dt);
        // this._rigid.applyForceToCenter(new cc.Vec2(10000,0));
        // this._rigid.applyForceToCenter(new cc.v2(100000,0));
    },
    onKeyUp: function (event) {
        switch (event.keyCode) {
            case cc.macro.KEY.a:
                this._horizontal = 0;
                break;
            case cc.macro.KEY.left: this._horizontal = 0; break;
            case cc.macro.KEY.up: this._vertical = 0; break;
            case cc.macro.KEY.down: this._vertical = 0; break;
        }
        // console.log("松开"+this._horizontal+" "+this._vertical);
        // this.move(0.02);
    },
    //移动
    move() {
        if (this._horizontal != 0 || this._vertical != 0) {
            // this.node.position=new cc.Vec2(this.node.position.x+this.speed*this._horizontal,this.node.position.y+this._vertical*this.speed);
            // console.log("【移动】#"+JSON.stringify(this.node.position));
            // this._rigid.linearVelocity =0;
            this._rigid.applyForceToCenter(new cc.Vec2(this._horizontal * this.speed, this._vertical * this.jumpSpeed));
        }
    },
    //移动小鸡到指定位置
    moveTo(targetPos, callback) {
        var self = this;
        this.node.stopAllActions();
        this.animBody.node.scaleX = this.getDirectionX(targetPos);
        this.switchTittivateSide(false);
        this.animBody.play("player2_walk");
        this.node.runAction(cc.sequence(cc.moveTo(Common.getDistance(this.node.position, targetPos) / 150, targetPos),
            cc.callFunc(function () {
                self.animBody.play("player2_idle");
                self.animBody.node.scaleX = 1;
                self.switchTittivateSide(true);
                callback();
            })
        ));

    },
    //跳着走
    jumpBy(targetPos, callback) {
        var self = this;
        this.node.stopAllActions();
        this.animBody.node.scaleX = this.getDirectionX(targetPos);

        this.animBody.play("player2_walk");
        this.node.runAction(cc.sequence(cc.jumpBy(Common.getDistance(this.node.position, targetPos) / 150, targetPos),
            cc.callFunc(function () {
                self.animBody.play("player2_idle");
                self.animBody.node.scaleX = 1;
                callback();
            })
        ));
    },
    //跳到
    jumpTo(targetPos, callback) {
        this.node.runAction(cc.jumpTo(2, targetPos, 100, 1));
    },
    //移动小鸡到指定X坐标
    moveToX() {

    },
    //获取小鸡要去的方向
    getDirectionX(targetPos) {
        var result = targetPos.x - this.node.x;
        result = Common.clamp(result, -1, 1);
        console.log(result);
        return result;
    },
    //检测洗澡
    checkBath() {
        if (!this._isBath && this.getPositionX() <= -700) {

        }
    },
    //获取x坐标
    getPositionX() {
        return this.node.position.x;
    },
    //设置是否显示
    setActive(show) {
        this.node.active = show;
    },
    //去洗澡
    goBath() {
        var self = this;
        this._cam._isFollow = true;
        self.getPool();
        let targetPos = Common.vector2Add(this._pool.position, this._pool.getChildByName("playerPos").position);
        this.moveTo(targetPos, function () {
            console.log("走完了");
            // self.node.active=false;
            self._pool.getChildByName("Bath").getComponent(cc.Animation).play("Player2_poolBath");

        })
    },
    //获取pool
    getPool() {
        this._pool = cc.find("Canvas/Pool");
        return this._pool;
    },
    //获取饭盒节点
    getLunchBox() {
        this._lunchBox = cc.find("Canvas/LunchBox");
        return this._lunchBox;
    },
    //回到原点
    goBack() {
        var self=this;
        this._cam._isFollow = true;
        this.moveTo(this._originalPosition, function () {
            console.log("走完了");
            self.updateHomeState();
        });
    },
    //去吃饭
    goDine() {
        var self = this;
        this._cam._isFollow = true;
        self.getLunchBox();
        let targetPos = Common.vector2Add(this._lunchBox.position, this._lunchBox.getChildByName("playerPos").position);
        this.moveTo(targetPos, function () {
            console.log("走完了");
            // self.node.active=false;
            // self._pool.getComponent(cc.Animation).play("bath");
            self.playEatting();
            self.scheduleOnce(self.goBack, 5);
        })
    },
    onClick() {
        var self=this;
        if(this.type==0){
            if(Global.sceneCode==0){
                //在家
                Network.requestClickPlayer((res)=>{
                    if(res.result){
                        self.openSay(res.data.text);
                    }else{
                        // self.openSay(res.data);
                    }
                });
            }else if(Global.sceneCode==1){
                //在别人家
                
            }
        }
    },
    //装扮
    setTittivateData(data) {
        if (data.hat != this._tittivate.hat) {
            this._tittivate.hat = data.hat;
            this.setTittivate("hat", this._tittivate.hat);
        }
        if (data.glass != this._tittivate.glass) {
            this._tittivate.glass = data.glass;
            this.setTittivate("glass", this._tittivate.glass);
        }
        if (data.hornor != this._tittivate.hornor) {
            this._tittivate.hornor = data.hornor;
            this.setTittivate("hornor", this._tittivate.hornor);
        }
    },
    setTittivate(type, id) {
        let path = "Tittivate/" + type + "_" + id.toString();
        let image;
        // switch (type) {
        //     case "hat": {image = this.imgHat;}; break;
        //     case "glass":image=this.imgGlass;break;
        //     case "hornor":image=this.imgHornor;break;
        // }
        image = this._imgTitti[type];
        Common.loadRes(path, image);
    },
    //设置装扮侧面
    setTittivateSide(type, id) {
        let path = "Tittivate/" + type + "_" + id.toString();
        let image;
        switch (type) {
            // case "hat": {image = this.imgHat;}; break;
            case "glass": path += "_side"; break;
            case "hornor": path = null; break;
        }
        image = this._imgTitti[type];
        Common.loadRes(path, image);
    },
    //切换侧面和正面装扮
    switchTittivateSide(yes) {
        for (var i = 0; i < Global.tittiTypeString.length; i++) {
            let tittiType = Global.tittiTypeString[i];
            if (yes) {
                this.setTittivate(tittiType, this._tittivate[tittiType]);
            } else {
                this.setTittivateSide(tittiType, this._tittivate[tittiType]);
            }
        }
    },


    //设置小鸡的状态
    stateManager() {
        if (this._outHome) {
            this.setState(7);
        }
        else if (this._bateu) {
            this.setState(3);
        } else if (this._clean < 1) {
            this.setState(6);
        } else if (this._hungry < 1) {
            this.setState(4);
        } else {
            this.setState(0);
        }
    },
    setPlayerCondition(hungry, clean, beaten, outHome) {
        this._hungry = hungry;
        this._clean = clean;
        this._beaten = beaten;
        this._outHome = outHome;

        this.stateManager();
    },
    //设置小鸡的状态
    setState(num) {
        console.log("【设置小鸡状态】" + num.toString());
        this._lastState = this._state;
        this._state = num;

        this.node.active = true;
        switch (num) {
            case 0: this.playNormal(); break;
            case 2: this.playIdle(); break;
            case 3: this.playCry(); break;
            case 4: this.playHunger(); break;
            case 6: this.playNormal(); break;  //清洁========================缺动画
            case 7: this.node.active = false;
        }

    },

    //说话
    openSay(text) {
        this.ndSay.getComponent(cc.Animation).play("fadeIn");
        this.ndSay.getChildByName("Text").getComponent(cc.Label).string = text;
        this.unschedule(this.hideSay);
        this.scheduleOnce(this.hideSay, this.sayTime);
    },
    hideSay() {
        this.ndSay.opacity = 0;
    },
    //获取配置装扮
    getConfigTitti() {
        this.setTittivateData(Global.tittivate);
    },
    //播放被打动画
    playFighting() {
        this.ndTitti.active = false;
        this.animBody.play("player2_fighting");
        // this.scheduleOnce(function(){
        //     this.animBody.play
        // },2)
    },
    //播放吃饭动画
    playEatting() {
        this.animBody.play("player2_eatting");

    },
    playIdle() {

    },
    playNormal() {

    },
    playSmoke(){
        this.animBody.play("player2_smoke");
    },
    //延迟更新主页
    updateHomeState(delay) {
        if (!delay) {
            Global.game.updateIndex();
        } else {
            this.scheduleOnce(function () {
                Global.game.updateIndex();
            }, delay);
        }
    },
    //延迟清除本身
    destoryDelay(delay) {
        this.scheduleOnce(function () {
            this.node.destory();
        }, delay);
    },
});
