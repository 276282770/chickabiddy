
var Network = require("Network");
const { ccclass, property } = cc._decorator;

@ccclass
export default class PanelExchangeBuy2 extends cc.Component {

    @property(cc.Label)
    txtTitle: cc.Label = null;

    @property(cc.SpriteFrame)
    spMoney: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    spEgg: cc.SpriteFrame = null;
    @property(cc.Sprite)
    imgFlag: cc.Sprite = null;
    @property(cc.Label)
    txtSeriNo: cc.Label = null;
    @property(cc.Node)
    ndBuy: cc.Node = null;
    @property(cc.Node)
    ndSeriNo: cc.Node = null;
    @property(cc.Label)
    txtNum: cc.Label = null;
    @property(cc.Label)
    txtExNum: cc.Label = null;

    _type: ExchangeType = ExchangeType.egg2money;  //0:鸡蛋兑换钱  1鸡蛋兑鸡蛋
    _totalEggCount: number = 0;
    _rate: number = 0;
    _num: number = 0;


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {

    }

    // update (dt) {

    // }
    setData(totalEggCount: number, rate: number, type: ExchangeType): void {

        this._type = type;
        this._rate = rate;
        this._totalEggCount = totalEggCount;


        if (type == ExchangeType.egg2egg) {
            this.imgFlag.spriteFrame = this.spEgg;
            this.txtTitle.string = "共可以兑换" + Math.floor(totalEggCount * rate).toString() + "个真鸡蛋";
            this.txtExNum.node.parent.active=false;
        } else {
            this.txtTitle.string = "共可以兑换" + Math.floor(totalEggCount * rate).toString() + "金币";
        }
    }
    //增加
    onAdd() {
        // if (this._type == ExchangeType.egg2money) {
        // let addNum=this._rate>=1?1:1/this._rate;
        // let targetNum=this._num+addNum;
        // if (targetNum <= this._totalEggCount) {
        //     this.setNum(targetNum);
        // }else{
        //     this.showTip("已到达兑换极限了");
        // }
        // }
        let maxNum = this._totalEggCount;
        if (this._type == ExchangeType.egg2egg) {
            maxNum = Math.floor(this._totalEggCount * this._rate);
        }

        let targetNum = this._num + 1;
        if (targetNum <= maxNum) {
            this.setNum(targetNum);
        } else {
            this.showTip("已到达兑换极限了");
        }
    }

    //减少
    onReduce() {
        // let redNum = this._rate >= 1 ? 1 : 1 / this._rate;
        // let targetNum = this._num - redNum;
        // if (targetNum >= 0) {
        //     this.setNum(targetNum);
        // } else {
        //     this.showTip("再减就没有了");
        // }
        let targetNum = this._num - 1;
        if (targetNum >= 0) {
            this.setNum(targetNum);
        } else {
            this.showTip("再减就没有了");
        }
    }
    setNum(num: number) {
        this._num = num;
        this.txtNum.string = num.toString();
        this.txtExNum.string = (num * this._rate).toString();
    }

    /**确定 */
    onConfirm() {
        if (this._num == 0) {
            return;
        }
        var self = this;
        switch (this._type) {
            case ExchangeType.egg2money: {
                Network.exchangeSelfEgg2Money(this._num, (res) => {
                    if (res.result) {
                        self.showTip("兑换成功");
                    } else {
                        self.showTip("兑换失败");
                    }
                    self.onClose();
                })
            }; break;
            case ExchangeType.otherEgg2money: {
                Network.exchageOtherEgg2Money(this._num, (res) => {
                    if (res.result) {
                        self.showTip("兑换成功");
                    } else {
                        self.showTip("兑换失败");
                    }
                    self.onClose();
                });
            }; break;
            case ExchangeType.egg2egg: {

                Network.exchangeEgg2Egg2(this._num, (res) => {
                    if (res.result) {
                        self.txtSeriNo.string = res.data;
                        self.ndBuy.active = false;
                        self.ndSeriNo.active = true;
                        self.showTip("兑换成功");
                    } else {
                        self.showTip("兑换失败");
                        self.onClose();
                    }

                })

            }; break;
        }

    }
    onClose() {
        this.node.destroy();
    }
    showTip(txt) {
        Global.game.showTip(txt);
    }

}
enum ExchangeType {
    /**鸡蛋兑钱 */
    egg2money,
    /**鸡蛋兑鸡蛋 */
    egg2egg,
    /**偷来的鸡蛋兑换钱 */
    otherEgg2money
}