var Network = require("Network");
cc.Class({
    extends: cc.Component,

    properties: {
        txtQuestion: cc.Label,  //问题
        ndAnswer: [cc.Node],  //答案
        spSelAnswer: cc.SpriteFrame,  //选中精灵
        spNorAnswer: cc.SpriteFrame,  //正常精灵

        ndRight: cc.Node,  //回答正确
        ndWrong: cc.Node,  //回答错误

        btnSubmit:cc.Button,  //提交按钮

        ndBg:cc.Node,  //答题背框

        _answer: -1,
    },

    start() {
        this.load();

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
                self.ndRight.active = true;
                Global.game.updateIndex();
            } else {
                self.ndWrong.active = true;
            }
            self.btnSubmit.interactable=false;
            self.ndBg.active=false;
            // self.txtAward.string = res.data.award;
            // self.txtQuestion.string = res.data.say;
        });
    },

    onSel(event, customer) {
        let idx = parseInt(customer);
        this._answer = idx;
        for (var i = 0; i < this.ndAnswer.length; i++) {
            if (i == idx) {
                this.ndAnswer[i].getComponent(cc.Sprite).spriteFrame = this.spSelAnswer;
            } else {
                this.ndAnswer[i].getComponent(cc.Sprite).spriteFrame = this.spNorAnswer;
            }
        }

    },
    onClose() {
        this.node.destroy();
    },

    //网络加载题目
    load() {
        console.log("加载题目");
        var self = this;
        Network.requestAnswerLst((res) => {
            if (res.result) {
                self._qId = res.data.id;
                self.txtQuestion.string = res.data.q;

                self.ndAnswer[0].getChildByName("txtAnswer").getComponent(cc.Label).string = res.data.a0;
                self.ndAnswer[1].getChildByName("txtAnswer").getComponent(cc.Label).string = res.data.a1;
                self.ndAnswer[2].getChildByName("txtAnswer").getComponent(cc.Label).string = res.data.a2;
                self.ndAnswer[3].getChildByName("txtAnswer").getComponent(cc.Label).string = res.data.a3;
            } else {

                self.txtQuestion.string = "今天测试已经结束，请明天再过来吧";
            }
        });
    },
    onEnable() {

    },
    onShow() {

    }
});
