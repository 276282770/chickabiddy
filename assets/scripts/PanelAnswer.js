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
        ndSel0: cc.Node,  //选择0节点
        ndSel1: cc.Node,  //选择1节点
        ndSel2: cc.Node,  //选择2节点
        ndSel3: cc.Node,  //选择3节点
        ndAnswer: cc.Node,  //答题外框
        ndGoOn: cc.Node,  //答题阶段
        ndResult: cc.Node,  //结果阶段
        spBtnSeled: cc.SpriteFrame,  //选中背景
        spBtnNormal: cc.SpriteFrame,  //默认选择按钮背景

        txtQuestion: cc.Label,   //问题
        // txtAns0:cc.Label,  //答案1
        // txtAns1:cc.Label,  //答案2
        // txtAns2:cc.Label,  //答案3
        // txtAns3:cc.Label,   //答案4
        spAnswerRight: cc.SpriteFrame,  //回答正确
        spAnswerWrong: cc.SpriteFrame,  //回答错误
        txtAward: cc.Label,  //获得的奖励

        ndOpen0: cc.Node,  //
        ndOpen1: cc.Node,


        _answer: -1,
        _qId: -1,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.load();
        this.playOpen0();
    },

    // update (dt) {},

    //提交答案
    onSubmit() {

        if (this._answer == -1) {
            Global.game.showTip("请选择一个答案");
            return;
        }
        var self = this;
        Network.requestAnswer(this._qId, this._answer, (res) => {
            if (res.result) {
                self.ndGoOn.active = false;
                self.ndResult.active = true;
                self.ndResult.getComponent(cc.Sprite).spriteFrame = self.spAnswerRight;
                Global.game.updateIndex();
            } else {
                self.ndGoOn.active = false;
                self.ndResult.active = true;
                self.ndResult.getComponent(cc.Sprite).spriteFrame = self.spAnswerWrong;
            }
            self.txtAward.string = res.data.award;
            self.txtQuestion.string = res.data.say;
        });
    },
    //选择0
    onSel0() {
        this._answer = 0;
        this.ndSel0.getComponent(cc.Sprite).spriteFrame = this.spBtnSeled;
        this.ndSel1.getComponent(cc.Sprite).spriteFrame = this.spBtnNormal;
    },
    //选择1
    onSel1() {
        this._answer = 1;
        this.ndSel1.getComponent(cc.Sprite).spriteFrame = this.spBtnSeled;
        this.ndSel0.getComponent(cc.Sprite).spriteFrame = this.spBtnNormal;
    },
    onSel(event, customer) {
        switch (customer) {
            case "0": {
                this.ndSel0.getComponent(cc.Sprite).spriteFrame = this.spBtnSeled;
                this.ndSel1.getComponent(cc.Sprite).spriteFrame = this.spBtnNormal;
                this.ndSel2.getComponent(cc.Sprite).spriteFrame = this.spBtnNormal;
                this.ndSel3.getComponent(cc.Sprite).spriteFrame = this.spBtnNormal;
                this._answer = 0;
            }; break;
            case "1": {
                this.ndSel0.getComponent(cc.Sprite).spriteFrame = this.spBtnNormal;
                this.ndSel1.getComponent(cc.Sprite).spriteFrame = this.spBtnSeled;
                this.ndSel2.getComponent(cc.Sprite).spriteFrame = this.spBtnNormal;
                this.ndSel3.getComponent(cc.Sprite).spriteFrame = this.spBtnNormal;
                this._answer = 1;
            }; break;
            case "2": {
                this.ndSel0.getComponent(cc.Sprite).spriteFrame = this.spBtnNormal;
                this.ndSel1.getComponent(cc.Sprite).spriteFrame = this.spBtnNormal;
                this.ndSel2.getComponent(cc.Sprite).spriteFrame = this.spBtnSeled;
                this.ndSel3.getComponent(cc.Sprite).spriteFrame = this.spBtnNormal;
                this._answer = 2;
            }; break;
            case "3": {
                this.ndSel0.getComponent(cc.Sprite).spriteFrame = this.spBtnNormal;
                this.ndSel1.getComponent(cc.Sprite).spriteFrame = this.spBtnNormal;
                this.ndSel2.getComponent(cc.Sprite).spriteFrame = this.spBtnNormal;
                this.ndSel3.getComponent(cc.Sprite).spriteFrame = this.spBtnSeled;
                this._answer = 3;
            }; break;
        }

    },
    onClose() {
        this.node.destroy();
    },
    playBottom() {
        let h = cc.find("Canvas").height;
        this.ndAnswer.runAction(cc.moveTo(1, 0, 0));
        console.log(h);
    },
    playOpen0() {
        var self = this;
        let ndLeft = this.ndOpen0.getChildByName("left");
        let ndRight = this.ndOpen0.getChildByName("right");
        ndLeft.runAction(cc.moveTo(1, -400, 0));
        // ndRight.runAction(cc.sequence( cc.moveTo(5,400,0),
        //     cc.callFunc(self.playOpen1())
        // ));
        ndRight.runAction(cc.moveTo(1, 400, 0));
        this.scheduleOnce(this.playOpen1, 1);
    },
    playOpen1() {
        var self = this;
        let ndLeft = this.ndOpen1.getChildByName("left");
        let ndRight = this.ndOpen1.getChildByName("right");
        ndLeft.runAction(cc.moveTo(1, -400, 0));
        ndRight.runAction(cc.moveTo(1, 400, 0));
    },
    //网络加载题目
    load() {
        console.log("加载题目");
        var self = this;
        Network.requestAnswerLst((res) => {
            if (res.result) {
                self._qId = res.data.id;
                self.txtQuestion.string = res.data.q;
                if (res.data.a0)
                    self.ndSel0.getChildByName("text").getComponent(cc.Label).string = res.data.a0;
                if (res.data.a1)
                    self.ndSel1.getChildByName("text").getComponent(cc.Label).string = res.data.a1;
                if (res.data.a2)
                    self.ndSel2.getChildByName("text").getComponent(cc.Label).string = res.data.a2;
                else
                    self.ndSel2.active = false;
                if (res.data.a3)
                    self.ndSel3.getChildByName("text").getComponent(cc.Label).string = res.data.a3;
                else
                    self.ndSel3.active = false;

                self.playBottom();
            } else {

                self.txtQuestion.string = "今天测试已经结束，请明天再过来吧";
            }
        });
    },
    onEnable() {

    },
    onShow() {
        this.playBottom();
        this.playOpen0();
    }
});
