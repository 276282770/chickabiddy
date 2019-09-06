
var Network = require("Network");
cc.Class({
    extends: cc.Component,

    properties: {

        ndBg: cc.Node,  //背景

        btnTabShop: cc.Button,  //商店按钮
        btnTabTittive: cc.Button,  //兑换按钮
        ndSvShop: cc.Node,
        ndSvTittive: cc.Node,


        preItemShop: cc.Prefab,   //项预制体
        preItemTittive:cc.Prefab,  //商店装扮项预制体



        _panelReady: false,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.load();
        this.onTab(this, 0);
    },

    start() {

    },
    /**选择
     */
    onTab(event, customerData) {
        console.log("点击按钮" + customerData);

        var tabBtn = [this.btnTabShop, this.btnTabTittive];
        var svNode = [this.ndSvShop, this.ndSvTittive];

        let idx = parseInt(customerData);

        for (var i = 0; i < tabBtn.length; i++) {
            let me = i == idx;
            tabBtn[i].node.getChildByName("honghengxian").active = me;
            tabBtn[i].interactable = !me;
            svNode[i].active = me;
        }
    },


    onShow() {
        let h = this.ndBg.height;
        let x = this.ndBg.position.x;
        this.ndBg.runAction(cc.sequence(
            cc.moveTo(0.5, x, h),
            cc.callFunc(() => {
                this._panelReady = true;
            })
        ));
    },
    onClose() {
        if (!this._panelReady)
            return;
        let x = this.ndBg.position.x;
        this.ndBg.runAction(cc.sequence(
            cc.moveTo(0.5, x, 0),
            cc.callFunc(() => {
                //引导3
                if(Global.game._buyCount>0){
                let guide=cc.find("Canvas/Guid").getComponent("Guid");
                if(guide._isGuid){
                    guide.stepSchedule(3);
                }
            }
             
            this.node.destroy();

            })
        ));
    },
    onEnable() {
        this.onShow();
    },

    //加载
    load() {

        var self = this;

        Network.requestShop(1, (res) => {
            if (res.result) {
                var data = res.data;
                for (var i = 0; i < data.length; i++) {
                    let item = cc.instantiate(self.preItemShop);
                    item.parent = self.ndSvShop.getChildByName("view").getChildByName("content");
                    let itemScr = item.getComponent("ItemShop2");
                    itemScr.fill(data[i].id, data[i].name, data[i].description, data[i].price);
                }
            }
        });

    },
});
