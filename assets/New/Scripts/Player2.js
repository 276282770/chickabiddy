var Common = require("Common");
var Network = require("Network");

cc.Class({
    extends: cc.Component,

    properties: {

        speed: 1,  //移动速度
        jumpSpeed: 200000,  //跳跃速度
        animBody: cc.Animation,  //身体动画
        ndSay: cc.Node,  //说话节点
        ndName: cc.Node,  //名字
        sayTime: 2,//说话停留时间
        ndTitti: cc.Node,  //装扮节点

        imgHat: cc.Sprite,  //帽子
        imgGlass: cc.Sprite,  //眼镜
        imgHornor: cc.Sprite,  //荣誉

        type: 0,  //0 自己的小鸡， 1，小偷   2，别人的小鸡 

        ndEx: cc.Node,  //扩展节点



        _horizontal: 0,
        _vertical: 0,
        _rigid: cc.RigidBody,  //刚体
        _isBath: false,

        _state: 0,  //小鸡状态  0正常，1被点击，2空闲， 3哭泣(被揍)， 4 挨饿， 5吃饭， 6洗澡 7不在家  20.偷吃

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

        _uid: -1,  //小鸡ID
        // _isMe:false,  //是否是本人,
        // _isThief:false,  //是否是小偷

        _remainChangeTime: 20,
        _isAction: false,  //小鸡是否在行动
        // _canClick:true,  //是否可以点击
        _isShowExtend: false,  //是否显示扩展
        _thiefCtrl: null,
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
        this._cam = Global.game.camera;
        this._imgTitti = { hat: this.imgHat, glass: this.imgGlass, hornor: this.imgHornor };

        this._thiefCtrl = cc.find("Canvas/PlayerRoot").getComponent("ThiefController2");
        // this.setTittivateData({ hat: 10, glass: 9, hornor: 100 });

        this._remainChangeTime=20;
        
    },

    //设置小鸡
    setPlayerData(id, name, level, tittiData, state) {
        
        
        this.setData(id, name, level, tittiData, state);

        
    },
    setThiefData(id, name, level, tittiData, state) {
        // this._isThief=true;
        this.type = 1;
        this.ndEx = this.node.getChildByName("Extend2");
        this.setData(id, name, level, tittiData, state);
    },
    setData(id, name, level, tittiData, state) {
        

        this.ndName.active = true;

        if (id == Global.id) {
            name = "我的小鸡";
            this.type = 0;
            if (Global.sceneCode == 0) {
                this.ndName.active = false;
            }
        }

        this.ndName.getChildByName("txtLevel").getComponent(cc.Label).string = level.toString();
        this.ndName.getChildByName("txtName").getComponent(cc.Label).string = name;
        if(tittiData!=null)
        this.setTittivateData(tittiData);
        if (state != null)
            this.setState(state);
      

        
    },

    update(dt) {
        if (this.type == 0&&Global.sceneCode==0) {
            if (this._remainChangeTime <= 0) {
                this.randomChangeState_idle();
                this._remainChangeTime = Math.max(5, Math.random() * 20);
            } else {
                if (!this._isAction && !this._isShowExtend)
                    this._remainChangeTime -= dt;
            }
        }
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
        var self = this;
        this.node.stopAllActions();
        this.animBody.node.scaleX = this.getDirectionX(targetPos);
        this.animBody.play("player2_jumpTo");
        this.node.runAction(cc.sequence(cc.jumpTo(2, targetPos, 100, 1), cc.callFunc(
            function () {
                self.animBody.play("player2_idle");

                if (callback) {

                    callback();
                }
            }
        )));
    },
    //移动小鸡到指定X坐标
    moveToX() {

    },
    //获取小鸡要去的方向
    getDirectionX(targetPos) {
        var result = targetPos.x - this.node.x;
        result = Common.clamp(result, -1, 1);
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
        this._isAction = true;
        this._cam._isFollow = true;
        self.getPool();
        let targetPos = Common.vector2Add(this._pool.position, this._pool.getChildByName("playerPos").position);
        this.moveTo(targetPos, function () {
            console.log("走完了");
            // self.node.active=false;
            // self._pool.getChildByName("Bath").getComponent(cc.Animation).play("Player2_poolBath");

            self.playSmoke();  //播放泡沫
            self.scheduleOnce(function () {
                cc.find("Canvas/ClothBucket").getComponent("ClothBucket2").setFull(true);//衣服篓填满
                self.showTitti(false);
                let targ = Common.vector2Add(self._pool.position, new cc.Vec2(0, 100));
                self.jumpTo(targ, function () {
                    self._pool.getComponent("Pool").onBath();
                    self.node.active = false;
                });
            }, 1);
        })
    },
    //去洗澡回来
    goBathBack() {
        var self = this;
        this.node.active = true;
        let targetPos = Common.vector2Add(this._pool.position, this._pool.getChildByName("playerPos").position);
        this.jumpTo(targetPos, function () {
            self.playSmoke();
            self.scheduleOnce(function () {
                self.showTitti(true);
                cc.find("Canvas/ClothBucket").getComponent("ClothBucket2").setFull(false);//衣服篓填满
                self.goBack();
            }, 1)
        });
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
        var self = this;
        this._cam._isFollow = true;
        this.moveTo(this._originalPosition, function () {
            console.log("走完了");
            self.updateHomeState();
            self._isAction = false;
        });
    },
    //去吃饭
    goDine() {
        var self = this;
        this._isAction = true;
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


        if (this._isAction) {
            return;
        }


        var self = this;
        if (this.type == 0) {
            if (Global.sceneCode == 0) {
                //在家
                Network.requestClickPlayer((res) => {
                    if (res.result) {
                        self.openSay(res.data.text);
                    } else {
                        // self.openSay(res.data);
                    }
                });
                this.tollageExtend();
            } else if (Global.sceneCode == 1) {
                //在别人家

            }
        } else if (this.type == 1) {
            if (this.checkExtendState(this.ndEx) != 0) {
                this.tollageExtend();
                this._thiefCtrl.onClick(this);
            }
        }
    },
    //装扮
    setTittivateData(data) {
        
        if(data==null){
            this.setTittivate("hat", 0);
            this.setTittivate("glass", 0);
            this.setTittivate("hornor", 0);
            return;
        }
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
       

        if(id<=0){
            
            image.spriteFrame=null;
            return;
        }

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
            case 6: this.playDirty(); break;
            case 7: this.node.active = false; break;
            // case 20:
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
        console.log("【获取配置文件中小鸡的装饰】");
        this.setTittivateData(Global.tittivate);
    },
    //播放被打动画
    playFighting() {
        // this.ndTitti.active = false;
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
        this.switchTittivateSide(true);
        this.animBody.play("player2_idle");
    },
    playNormal() {
        this.switchTittivateSide(true);
        this.animBody.play("player2_normal");
    },
    //播放烟雾
    playSmoke() {
        this.animBody.node.getChildByName("front").getComponent(cc.Animation).play("player2_smoke");
    },
    //播放脏了动画
    playDirty() {
        this.animBody.play("player2_dirty");
    },
    //播放饿了动画
    playHunger() {
        this.animBody.play("player2_hungry");
    },
    //播放被打了的动画
    playCry() {
        this.animBody.play("player2_beaten");
    },

    cleanSmoke() {

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
    //是否显示装扮
    showTitti(isShow) {
        this.animBody.node.getChildByName("Titti").active = isShow;
    },
    randomChangeState_idle() {
        // let rnd=Math.max(5, Math.random()*20);
        this.node.stopAllActions();
        let rnd = Math.random() * 20;
        let nextState;   // 1.正常  2.空闲  3.行走

        if (rnd >= 14) {
            nextState = 3;
        } else if (rnd >= 7) {
            nextState = 2;
        } else {
            nextState = 1
        }
        switch (nextState) {
            case 1: this.playNormal(); break;
            case 2: this.playIdle(); break;
            case 3: this.randomWalk(); break;
        }
        this.openSay("发现来家里俩晕鸡儿...");
    },
    //随机行走
    randomWalk() {
        var self = this;
        let dir = new Date().getSeconds() % 2 == 0 ? 1 : -1;
        let rnd = parseInt(Math.random() * 400) * dir;
        let target = new cc.v2(rnd, this.node.position.y);
        this.moveTo(target, function () {
            // if (new Date().getSeconds() % 2 == 0) {
            //     self.randomWalk();
            // }
            // self.randomWalk();
        })
    },
    //显示扩展
    showExtend() {
        this.ndEx.active = true;
        this.node.stopAllActions();
        this._state = 1;
        this.switchTittivateSide(true);
        this._isShowExtend = true;
        this.ndEx.getComponent(cc.Animation).play("player2_extend");
    },
    hideExtend() {
        this.ndEx.getComponent(cc.Animation).play("player2_extend_close");
        this._state = 0;
        this._isShowExtend = false;
    },
    closeExtend() {
        this.ndEx.active = false;
    },
    tollageExtend() {
        if (this.ndEx.active && this.ndEx.children[0].opacity == 255) {
            this.hideExtend();
        } else {
            this.showExtend();
        }
    },
    //攻略
    onOpenInstruction() {
        this.closeExtend();
        Global.game.onShowPanelInstruction();
    },
    //敬请期待
    onExpect() {
        this.closeExtend();
        Global.game.onShowTipExpect();
    },
    getTitti() {
        console.log("获取小鸡网络装扮");
        var self = this;
        Network.getMyTittivate((res) => {
            if (res.result) {
                self.setTittivateData(res.data.use);
            }
        })
    },
    
    //重置位置
    resetPostion(){
        this.node.postion=this._originalPosition;
    },


    //小偷
    playEatting_thief() {
        this.animBody.play("thief2_eatting");
    },
    showExtend_thief() {
        if (this.checkExtendState(this.ndEx) != 1)
            this.node.getChildByName("Extend2").getComponent(cc.Animation).play("player2_extend");

    },
    hideExtend_thief() {
        if (this.checkExtendState(this.ndEx) != 2)
            this.node.getChildByName("Extend2").getComponent(cc.Animation).play("player2_extend_close");

    },

    onFightingSync() {
        this._thiefCtrl.onFighting();
    },
    onOutSync() {
        this._thiefCtrl.onOut();
    },

    //揍，格斗
    onFighting() {
        this.closeExtend();
        this.playFighting();
        this.scheduleOnce(this.onHide, 2);
    },
    //赶走
    onOut() {
        this.closeExtend();
        this.animBody.play("thief2_out");
        this.ndTitti.active = false;
        this.scheduleOnce(this.onHide, 2);
    },




    checkExtendState(ndEx) {
        //0.正在动画  1.扩展打开  2.扩展关闭
        let resultState = 0;
        if (ndEx.children[0].opacity == 255) {
            resultState = 1;
        } else if (ndEx.children[0].opacity == 0) {
            resultState = 2;
        }
        return resultState;
    },
    checkExtendState_thief() {
        return this.checkExtendState();
    },

    onHide() {
        this.node.active = false;
    }
});
