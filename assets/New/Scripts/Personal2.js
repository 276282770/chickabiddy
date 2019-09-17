
var Network = require("Network");
cc.Class({
    extends: cc.Component,

    properties: {
        txtNickname: cc.Label,  //昵称
        imgAvatar: cc.Sprite,  //头像
        spAvatar: [cc.SpriteFrame],  //头像精灵
        imgAvatarFront: cc.Sprite,  //头像前部
        txtID: cc.Label,  //ID
        txtMoney: cc.Label,//钱
        txtLevel: cc.Label,  //等级
        txtExp: cc.Label,  //等级百分比
        proExp: cc.ProgressBar,//等级进度

        ndHonorRichEgg: cc.Node,  //鸡蛋多了荣誉
        ndHonorStealEgg: cc.Node,  //偷鸡蛋荣誉
        ndHonorBeautiful: cc.Node,  //漂亮荣誉
        ndHonorOverlap: cc.Node,  //交互荣誉
        txtHonorRichEggNum: cc.Label,  //鸡蛋多了荣誉文本
        txtHonorStealEggNum: cc.Label,  //偷鸡蛋荣誉文本
        txtHonorBeautifulNum: cc.Label,  //漂亮荣誉文本
        txtHonorOverlapNum: cc.Label,  //交互荣誉文本

        txtEggCount: cc.Label,  //鸡蛋个数
        txtTotalEggCount: cc.Label,  //鸡蛋总个数
        txtStealEggCount: cc.Label,  //偷蛋个数
        txtTotalStealEggCount: cc.Label,  //总偷蛋数
        txtLoseEggCount: cc.Label,  //丢失鸡蛋数

        proFood: cc.ProgressBar,  //食物进度
        proEgg: cc.ProgressBar,  //鸡蛋进度
        proClean: cc.ProgressBar,  //清洁进度
        txtFood: cc.Label,  //食物进度文本
        txtEgg: cc.Label,  //鸡蛋进度文本
        txtClean: cc.Label,  //清洁进度文本
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.onShow();
    },
    onClose() {
        var self = this;
        this.node.runAction(cc.sequence(
            cc.moveBy(0.3, -this.node.width, 0),
            cc.callFunc(function () {
                self.node.destroy();
            })
        ));

    },
    onShow() {
        this.node.runAction(cc.moveTo(0.3, this.node.width / 2, this.node.position.y));
        // this.node.runAction(cc.sequence(
        //     cc.moveTo(2,50,50)
        //     // cc.callFunc()
        // ));
        this.load();
    },
    load() {
        var self = this;
        this.txtNickname.string = Global.user.nickName;
        this.txtID.string = "ID：" + Global.id.toString();
        if (Global.user.avatar != "") {
            cc.loader.load({ url: Global.user.avatar, type: "png" }, function (err, tex) {
                if (!err) {
                    self.imgAvatar.spriteFrame = new cc.SpriteFrame(tex);
                }
            });
        }
        Network.requestIndexInfo((res) => {
            if (res.result) {
                console.log("-----------------");
                console.log(JSON.stringify(res.data));
                self.txtEggCount.string = res.data.selfEggNum.toString();
                self.txtStealEggCount.string = res.data.otherEggNum.toString();
                self.txtTotalEggCount.string = res.data.totalEggCount.toString();
                self.txtTotalStealEggCount.string = res.data.totalOtherEggCount.toString();
                self.txtLoseEggCount.string = res.data.totalLoseEggCount.toString();
                self.txtMoney.string = res.data.money.toString();

                self.proExp.progress = res.data.lvlExp / res.data.lvlFullExp;

                self.txtExp.string = res.data.lvlExp.toString() + "/" + res.data.lvlFullExp.toString();
                if (res.data.eggProgCurr >= 0) {
                    self.proEgg.progress = res.data.eggProgCurr / res.data.eggProgFull;
                    self.txtEgg.string = res.data.eggProgCurr.toString() + "/" + res.data.eggProgFull.toString();
                }
                if (res.data.foodRemain >= 0) {
                    self.proFood.progress = res.data.foodRemain / res.data.foodProgFull;
                    self.txtFood.string = res.data.foodRemain.toString() + "/" + res.data.foodProgFull.toString();
                }
                if (res.data.cleanProgCurr >= 0) {
                    self.proClean.progress = res.data.cleanProgCurr / res.data.cleanProgFull;
                    self.txtClean.string = res.data.cleanProgCurr.toString() + "/" + res.data.cleanProgFull.toString();
                }

                // self.txtLevel.string=
                // self.ndHonorRichEgg.active=
                // self.ndHonorBeautiful.active=
                // self.ndHonorOverlap.active=
                // self.ndHonorStealEgg.active=
                // self.txtHonorBeautifulNum.string=
                // self.txtHonorOverlapNum.string=
                // self.txtHonorRichEggNum.string=
                // self.txtHonorStealEggNum.string=
                // self.imgAvatarFront.spriteFrame=

            }
        });
        Network.getHornor((res) => {
            if (res.result) {

                self.ndHonorRichEgg.active=res.data.isRichEgg;
                self.ndHonorBeautiful.active=res.data.isBeautiful;
                self.ndHonorOverlap.active=res.data.isOverlap;
                self.ndHonorStealEgg.active=res.data.isStealEgg;
                self.txtHonorBeautifulNum.string=res.data.beautifulNum;
                self.txtHonorOverlapNum.string=res.data.overlapNum;
                self.txtHonorRichEggNum.string=res.data.richEggNum;
                self.txtHonorStealEggNum.string=res.data.stealEggNum;

            } else {
                Global.game.showTip(res.data);
            }
        });
    },

});
