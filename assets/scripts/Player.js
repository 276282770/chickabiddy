// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

var Network = require("Network");
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
        ndBg: cc.Node,  //背景
        ndExtend: cc.Node,  //扩展节点
        animPlayer: cc.Animation,  //小鸡动画
        animExtend: cc.Animation,  //扩展动画
        txtSay: cc.Label,  //小鸡说话
        ndPlayer: cc.Node,  //小鸡节点
        spBgNormal: cc.SpriteFrame,  //正常的背景
        spDine: cc.SpriteFrame,  //进餐的背景

        _state: 0,  //小鸡状态  0正常，1被点击，2空闲， 3哭泣(被揍)， 4 挨饿， 5吃饭， 6洗澡 7不在家
        _lastState: 0,  //上一个状态
        _remainChangeTime: 0,  //改变状态小鸡时间

        _hungry: 0,
        _clean: 0,
        _bateu: false,
        _outHome: false,
        _uid: -1,  //id
        _isMe: false,  //是本人吗？
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.setRandomChangeTime();
    },

    update(dt) {
        if (this._state == 0) {
            if (this._remainChangeTime > 0) {
                this._remainChangeTime -= dt;
            } else {
                this.playIdle();
                this.setRandomChangeTime();
            }
        }
        if (this._state == 2) {
            if (this._remainChangeTime > 0) {
                this._remainChangeTime -= dt;
            } else {
                this.playNormal();
                this.setRandomChangeTime();
            }
        }
    },

    //点击小鸡
    onClick() {
        console.log("点击小鸡");
        // let thiefcount=cc.find("Canvas/Thief").getComponent("Thief").thiefCount;
        if (!this._isMe)
            return;

        if (this.ndExtend.active) {
            this.onClickBg();

        } else {
            var self = this;
            this._state = 1;
            this.ndBg.active = true;
            this.ndExtend.active = true;
            this.animPlayer.play("player_click");
            this.animExtend.play("player_extend_open");
            // this.ndPlayer.getComponent(cc.Button).interactable=false;  


            let thiefcount = Global.game.thief.thiefCount
            if (thiefcount > 0) {
                Global.game.showTip("我的食物都快被抢光了..");
                return;
            }

            Network.requestClickPlayer((res) => {
                if (res.result) {

                    self.txtSay.node.parent.active = true;
                    self.txtSay.string = res.data.text;
                }
            });
        }
    },
    //点击背景
    onClickBg() {
        var self = this;
        this.animExtend.play("player_extend_close");
        self.txtSay.node.parent.active = false;
        this.scheduleOnce(function () {
            self._state = 0;
            self.ndBg.active = false;
            self.animPlayer.play("player_normal");
            // self.ndPlayer.getComponent(cc.Button).interactable=true;
            this.ndExtend.active = false;
        }, 0.2);
    },
    //设置小鸡的状态
    setState(num) {
        console.log("【设置小鸡状态】" + num.toString());
        this._lastState = this._state;
        this._state = num;

        this.ndPlayer.active = true;
        switch (num) {
            case 0: this.playNormal(); break;
            case 2: this.playIdle(); break;
            case 3: this.playCry(); break;
            case 4: this.playHunger(); break;
            case 6: this.playDirty(); break;  
            case 7: this.ndPlayer.active = false;
        }

    },
    playIdle() {
        // this._state=2;
        this.animPlayer.play("player_idle");
    },
    playNormal() {
        // this._state=0;
        this.animPlayer.play("player_normal");
    },
    //进餐
    playDine() {
        console.log("-播放进餐动画");

    },
    //播放哭动画
    playCry() {
        this.animPlayer.play("player_cry");
        // this._state=3;
    },
    //播放饥饿动画
    playHunger() {
        this.animPlayer.play("player_hunger");
    },
    //播放脏了动画
    playDirty() {
        this.animBody.play("player_dirty");
    },
    setRandomChangeTime() {
        let tm = Math.random() * 15;
        if (tm < 5)
            tm = 5;
        this._remainChangeTime = tm;
    },
    //打开攻略说明界面
    onOpenInstruction() {
        this.onClickBg();
        Global.game.onShowPanelInstruction();
    },
    //小鸡说话
    openSay(txt) {
        if (txt == null || txt == "")
            return;
        // if(cc.find("Canvas/Thief").getComponent("Thief").thiefCount>0){
        if (Global.game.thief.thiefCount > 0 || this._state == 7) {
            Global.game.showTip(txt);
            return;
        }
        var self = this;
        this.txtSay.string = txt;
        self.txtSay.node.parent.active = true;
        this.scheduleOnce(function () {
            self.txtSay.node.parent.active = false;
        }, 2)
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

    setPlayerCondition(hungry, clean, bateu, outHome) {
        this._hungry = hungry;
        this._clean = clean;
        this._bateu = bateu;
        this._outHome = outHome;

        this.stateManager();
    },
    /** 设置小鸡缩放
     * @param normal 正常，small 缩小
     */
    setPlayerScale(para) {

        switch (para) {
            case "normal": {
                this.ndPlayer.setScale(1);
                this.ndPlayer.y = -150;
                this.ndExtend.setScale(1);
                this.txtSay.node.parent.setScale(1);
            }; break;
            case "small": {
                this.ndPlayer.setScale(0.5);
                this.ndPlayer.y = -400;
                this.ndExtend.setScale(1.5);
                this.txtSay.node.parent.setScale(1.5);
            }; break;
        }
    },
    setId(id) {
        this._uid = id;
        if (id == Global.id) {
            this._isMe = true;
        }
    }
});
