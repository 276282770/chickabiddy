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
        spTipBath: cc.SpriteFrame, //洗澡提示精灵
        spTipFriend: cc.SpriteFrame,  //好友提示精灵
        spTipMission: cc.SpriteFrame,  //任务提示精灵
        spTipShop: cc.SpriteFrame,//商店提示精灵
        spTipFood: cc.SpriteFrame,//食物提示精灵
        spTipPickupEgg: cc.SpriteFrame,//收鸡蛋提示精灵
        spTipOtherPickupEgg: cc.SpriteFrame,//收别人鸡蛋提示精灵
        spTipOtherBath: cc.SpriteFrame,//别人洗澡提示精灵

        ndPointoutBath: cc.Node,  //指出洗澡节点
        ndPointoutFriend: cc.Node,  //指出好友节点
        ndPointoutMission: cc.Node,  //指出任务节点
        ndPointoutAllow: cc.Node,  //指出箭头节点
        ndPointoutShop: cc.Node,  //指出商店节点
        ndPointoutPickupEgg: cc.Node,  //指出拾取鸡蛋节点
        ndPointoutFood: cc.Node,  //指出食物节点

        ndBackground: cc.Node,  //背景节点


        imgBase: cc.Sprite,  //基础图
        controllButtons: [cc.Button],  //控制按钮

        _animBase: cc.Animation,
        _currentSteps: 1,
        _showTipboxTime: 0,

        _isGuid: false,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    //1.洗澡->2.商城->3.吃饭->4.好友->5.任务
    //收鸡蛋

    start() {
        if (this.imgBase != null)
            this._animBase = this.imgBase.getComponent(cc.Animation);

    },


    // update (dt) {},

    /**显示朋友提示
     */
    showTipFriend() {
        this.showTipBox(this.spTipFriend);
    },
    /**显示背景节点 */
    showBackground() {
        if (this.ndBackground == null)
            return;
        this.ndBackground.active = true;
    },
    /** 关闭
     */
    closeImage() {
        this.ndBackground.active = false;
    },
    //第一步
    step1() {
        this.showTipBox(this.spTipBath);
    },
    step1_pointout() {
        this.ndPointoutBath.active = true;
    },
    //点击背景
    background_onClick() {
        console.log("-【引导】点击背景");
        let sec = new Date().getSeconds();
        if (Math.abs(sec - this._showTipboxTime) < 2) {
            return;
        }
        this.hideTipBox();
        switch (this._currentSteps) {
            case 1: {
                //显示洗澡小手
                this.enableButton(8);
                this.ndPointoutBath.active = true;
            }; break;
            case 2: {
                this.enableButton(0);
                this.enableButton(3);
                let isShow = cc.find("Canvas/Right").getComponent("AutoHide")._isShow;
                if (isShow) {
                    this.ndPointoutShop.active = true;
                } else {
                    this.ndPointoutAllow.active = true;
                }
            }; break;
            case 3: {
                this.enableButton(7);
                this.ndPointoutFood.active = true;
            }; break
            case 4: {
                this.enableButton(6);
                this.ndPointoutFriend.active = true;
            }; break;
            case 5: {
                this.enableButton(9);
                this.ndPointoutMission.active = true;
            }; break;
            case 8: {
                this.ndPointoutPickupEgg.active = true;
            }; break;
        }
    },
    step(num) {
        if (!this._isGuid)
            return;
        if (num) {
            this._currentSteps = num;
        }
        console.log("【引导】执行步骤#" + this._currentSteps);
        this.disableAllButton();
        switch (this._currentSteps) {
            case 1: {
                this.step1();

            }; break;//提示洗澡
            case 2: this.showTipBox(this.spTipShop); break;//提示商店
            case 3: this.showTipBox(this.spTipFood); break;//提示吃饭
            case 4: this.showTipBox(this.spTipFriend); break;//提示好友
            case 5: this.showTipBox(this.spTipMission); break;//提示任务
        }
    },
    stepDefault() {
        if (!this._isGuid)
            return;
        console.log("【引导】延迟执行步骤#" + this._currentSteps);
        this.disableAllButton();
        switch (this._currentSteps) {
            case 1: {
                this.step1();

            }; break;//提示洗澡
            case 2: this.showTipBox(this.spTipShop); break;//提示商店
            case 3: this.showTipBox(this.spTipFood); break;//提示吃饭
            case 4: this.showTipBox(this.spTipFriend); break;//提示好友
            case 5: this.showTipBox(this.spTipMission); break;//提示任务
        }
    },
    //延迟执行步骤
    stepSchedule(num) {
        console.log("【引导】传入参数：" + num);
        this._currentSteps = num;
        this.scheduleOnce(this.stepDefault, 2);
    },
    //显示提示框
    showTipBox(sprite) {
        if (this._isGuid) {
            this._showTipboxTime = new Date().getSeconds();
            this.showBackground();
            this.imgBase.spriteFrame = sprite;
            this._animBase.play();
        }
    },
    //隐藏提示框
    hideTipBox() {
        this.ndBackground.active = false;
    },
    //隐藏所有手指
    hidePoint() {
        if (this.ndPointoutBath == null) {
            return;
        }
        // if(this._isGuid){
        this.ndPointoutBath.active = false;
        this.ndPointoutFriend.active = false;
        this.ndPointoutMission.active = false;
        this.ndPointoutAllow.active = false;
        this.ndPointoutShop.active = false;
        this.ndPointoutPickupEgg.active = false;
        this.ndPointoutFood.active = false;
        // }
    },

    //启用指定按钮
    enableButton(idx) {
        this.controllButtons[idx].interactable = true;
    },
    //禁用所有按钮
    disableAllButton() {
        for (var i = 0; i < this.controllButtons.length; i++) {
            this.controllButtons[i].interactable = false;
        }
    },
    // 测试
    runStep(obj, customerEventData) {
        console.log(customerEventData);
        this._isGuid = true;
        this.step(parseInt(customerEventData));
    },
    //提示收鸡蛋
    step_egg() {
        this._currentSteps = 8;
        this.showTipBox(this.spTipPickupEgg);
    },
});
