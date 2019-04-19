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
        ndSel0:cc.Node,  //选择0节点
        ndSel1:cc.Node,  //选择1节点
        ndAnswer:cc.Node,  //答题外框
        ndGoOn:cc.Node,  //答题阶段
        ndResult:cc.Node,  //结果阶段
        spBtnSeled:cc.SpriteFrame,  //选中背景
        spBtnNormal:cc.SpriteFrame,  //默认选择按钮背景

        txtQuestion:cc.Label,   //问题
        txtAns0:cc.Label,  //答案1
        txtAns1:cc.Label,  //答案2
        spAnswerRight:cc.SpriteFrame,  //回答正确
        spAnswerWrong:cc.SpriteFrame,  //回答错误
        txtAward:cc.Label,  //获得的奖励

        _answer:-1,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},

    //提交答案
    onSubmit(){
        if(this._answer==-1)
            return;
        
    },
    //选择0
    onSel0(){
        this._answer=0;
        this.ndSel0.getComponent(cc.Sprite).spriteFrame=this.spBtnSeled;
        this.ndSel1.getComponent(cc.Sprite).spriteFrame=this.spBtnNormal;
    },
        //选择1
        onSel1(){
            this._answer=1;
            this.ndSel1.getComponent(cc.Sprite).spriteFrame=this.spBtnSeled;
            this.ndSel0.getComponent(cc.Sprite).spriteFrame=this.spBtnNormal;
        },
    onClose(){
        this.node.destroy();
    },
    playBottom(){
        let h=cc.find("Canvas").height;
        this.ndAnswer.runAction(cc.moveBy(2,0,h/2));
        console.log(h);
    },
    onEnable(){
        this.onShow();
    },
    onShow(){
        this.playBottom();
    }
});
