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
        txtName: cc.Label,  //名字
        ndBg: cc.Node,  //背景

        ndThief0: cc.Node,  //角色0
        ndThief1: cc.Node,  //角色1



        _thiefData: { default: [] },


        _isExtendOpen0: false,
        _isExtendOpen1: false,
        _cid: -1,  //id
        _pos0: { default: new cc.Vec2(-121, -293) },
        _pos1: { default: new cc.Vec2(156, -293) },
        _lastThiefCount:-1,  //上一次小偷的个数
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        console.log("======================="+this._lastThiefCount);
    },
    setThief(data) {
        if (data.length > 2)
            return;
        for (var i = 0; i < data.length; i++) {
            if (data[i] == null)
                continue;
            if (data[i].id == Global.id) {
                data[i].name = "我";
            }
            data[i].name += "的小鸡";
        }
        // if(data[0]!=null){
        //     this.ndThief0.active=true;
        //     this.ndThief0.getChildByName("txtName").getComponent(cc.Label).string=data[0].name;
        // }else{
        //     this.ndThief0.active=false;
        // }
        // if(data[1]!=null){
        //     this.ndThief1.active=true;
        //     this.ndThief1.getChildByName("txtName").getComponent(cc.Label).string=data[1].name;
        // }else{
        //     this.ndThief1.active=false;
        // }

        // this._thiefData=data;
        this.setThiefInfoAll(data);

        if (this.thiefCount() > 0) {
            this.onShow();
            let isExtendShowed=this._isExtendOpen0|this._isExtendOpen1;
            // if(isExtendShowed){
            //     Global.game.showCtrl(false);
            // }else{
            //     Global.game.showCtrl(true);
            // }
        } else {
            this.onHide();

            // Global.game.showCtrl(true);
        }
        this._lastThiefCount=this.thiefCount();
    },
    addThief(data) {
        if (!this.ndThief0.active) {
            this.ndThief0.active = true;
            this._thiefData[0] = data;
            return;
        }
        if (!this.ndThief1.active) {
            this.ndThief1.active = true;
            this._thiefData[1] = data;
        }
    },
    onClose() {
        var self = this;
        this.node.runAction(cc.sequence(cc.moveBy(1, 0, 1300), cc.callFunc(function () {
            self.node.destroy();
        })));
    },
    onHide() {
        // this.node.runAction(cc.moveBy(1, 0, 1300));
        this.node.active=false;
    },
    onShow() {
        this.node.active=true;
        // this.node.position = new cc.Vec2(0, 0);
        // console.log("Thief position=" + this.node.position);
    },

    // update (dt) {},
    onThiefClick(event, customerData) {
        if (customerData == null)
            return;
        let idx = parseInt(customerData);
        let _isExtendOpen;
        if (idx == 0)
            _isExtendOpen = this._isExtendOpen0;
        else if (idx == 1)
            _isExtendOpen = this._isExtendOpen1;

        console.log("【点击第" + idx + "个小鸡】");

        if (this._thiefData[idx].id == Global.id) {
            Network.requestGoBackPlayer((res) => {
                if (res.result) {
                    Global.game.onBack();
                }
            });

        } else {
            this.showExtend(idx, !_isExtendOpen);
            if (!_isExtendOpen)
                this.showExtend(1 - idx, _isExtendOpen);
        }


        // if(customerData=="0"){
        //     console.log("【点击第一个小鸡】");
        // // this.ndBg.active=true;
        // if(this._thiefData[0])
        //  this.showExtend(0,!this._isExtendOpen0);
        // }else{
        //     console.log("【点击第二个小鸡】");
        //     this.showExtend(1,!this._isExtendOpen1);
        // }
        this.isShowedExtend();
    },
    //显示扩展
    showExtend(idx, show) {

        if (idx == 0) {
            if (show) {
                if (this._isExtendOpen0)
                    return;
                this.ndThief0.getChildByName("Extend").getComponent(cc.Animation).play("thief_extend_open");
                this._isExtendOpen0 = true;
            } else {
                if (!this._isExtendOpen0)
                    return;
                this.ndThief0.getChildByName("Extend").getComponent(cc.Animation).play("thief_extend_close");
                this._isExtendOpen0 = false;
            }
        } else {
            if (show) {
                if (this._isExtendOpen1)
                    return;
                this.ndThief1.getChildByName("Extend").getComponent(cc.Animation).play("thief_extend_open");
                this._isExtendOpen1 = true;
            } else {
                if (!this._isExtendOpen1)
                    return;
                this.ndThief1.getChildByName("Extend").getComponent(cc.Animation).play("thief_extend_close");
                this._isExtendOpen1 = false;
            }
        }
    },
    /** 是否有显示的扩展
     *
     *
     * @returns
     */
    isShowedExtend(){
        let result=false;
        result=result|this._isExtendOpen0;
        result=result|this._isExtendOpen1;

        // Global.game.showCtrl(!result);

        return result;    
    },
    onClickBg() {
        var self = this;

        this.ndExtend.getComponent(cc.Animation).play("thief_extend_open");
        this.scheduleOnce(function () {
            this.ndBg.active = false;
            this.ndThief.getComponent(cc.Button).interactable = true;
        }, 0.2);
    },
    //揍他
    onFight(event, customerData) {
        var self = this;
        let idx;
        let thief0, thief1;
        if (customerData == "0") {
            idx = 0;
            thief0 = this.ndThief0;
            thief1 = this.ndThief1;
        } else {
            idx = 1;
            thief0 = this.ndThief1;
            thief1 = this.ndThief0;
        }
        Network.requestHit(self._thiefData[idx].id, (res) => {
            let data = res.data;
            if (res.result) {



                self.showExtend(idx, false);
                self.showExtend(idx, false);

                thief1.getComponent(cc.Animation).play("thief_out");
                thief0.getComponent(cc.Animation).play("thief_hit");

                self.scheduleOnce(function () {
                    thief0.active = false;
                    thief1.active = false;
                    Global.game.showTip(data.awardTxt);
                    self.onHide();
                    Global.game.updateIndex();
                }, 5);
            }

            self.openSay(idx, data.say);
            self.openSay(self._thiefData.length - 1 - idx, data.otherSay);
            Global.game.player.openSay(data.playerSay);
        });

    },
    //赶走
    onOut(event, customerData) {
        var self = this;
        let idx;
        let thiefNode;
        if (customerData == 0) {
            idx = 0;
            thiefNode = this.ndThief0;
        } else {
            idx = 1;
            thiefNode = this.ndThief1;
        }

        this.showExtend(idx, false);
        Network.requestDriveOff(self._thiefData[idx].id, (res) => {
            if (res.result) {
                self._thiefData[idx] = null;
                let data = res.data;
                self.openSay(idx, data.say);
                Global.game.player.openSay(data.playerSay);
                thiefNode.getComponent(cc.Animation).play("thief_out");

                self.scheduleOnce(function () {
                    thiefNode.active = false;
                    Global.game.showTip(data.awardTxt);
                    if (self.thiefCount() == 0) {
                        self.onHide();

                    }
                    Global.game.updateIndex();
                }, 2);
            }
        });

    },
    //小偷说
    openSay(idx, txt) {
        if (txt == null || txt == "")
            return;
        let thiefNode;
        if (idx == 0) {
            thiefNode = this.ndThief0;
        } else {
            thiefNode = this.ndThief1;
        }
        let ndThiefSay = thiefNode.getChildByName("Say");
        ndThiefSay.active = true;
        ndThiefSay.getChildByName("txtSay").getComponent(cc.Label).string = txt;
        this.scheduleOnce(function () {
            ndThiefSay.active = false;
        }, 3);
    },


    //播放吃动画
    playEat() {
        this.ndThief.getComponent(cc.Animation).play("thief_eat");
    },
    fill(id, name) {
        this._cid = id;
        this.txtName.string = name;
    },
    //小偷数量
    thiefCount() {
        let result = 0;
        if (this._thiefData[0] != null)
            result++;
        if (this._thiefData[1] != null)
            result++;
        return result;
    },

    /**设置小偷的信息
     *
     *
     * @param {*} idx  索引
     * @param {*} data  信息数据
     */
    setThiefInfo(idx, data) {
        let ndThief;
        if (idx == 0) {
            ndThief = this.ndThief0;
        } else {
            ndThief = this.ndThief1;
        }
        if (data == null) {
            ndThief.active = false;
        } else {
            ndThief.active = true;
            let ndInfo = ndThief.getChildByName("Info");
            ndInfo.getChildByName("txtName").getComponent(cc.Label).string = data.name;
            ndInfo.getChildByName("txtlvl").getComponent(cc.Label).string = "Lv." + data.level.toString();
            let imgAvatar = ndInfo.getChildByName("mask").getChildByName("imgAvatar").getComponent(cc.Sprite);
            cc.loader.load({ url: data.avatarUrl, type: "png" }, function (err, tex) {
                if (!err)
                    imgAvatar.spriteFrame = new cc.SpriteFrame(tex);
            });
            ndThief.getComponent(cc.Animation).play("thief_eat");
        }
    },
    /**设置小偷的信息
     *
     *
     * @param {*} data  信息数据
     */
    setThiefInfoAll(data) {
        this.setThiefInfo(0, data[0]);
        this.setThiefInfo(1, data[1]);
        this._thiefData = data;
    },
});
