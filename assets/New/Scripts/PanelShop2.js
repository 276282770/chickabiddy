
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
        preItemTittive: cc.Prefab,  //商店装扮项预制体
        ndTittivateTabs: [cc.Node],  //装扮切换页

        _tittivate: [],  //装扮
        _serverTittivateTypeId: [],


        _panelReady: false,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

        this.onTab(this, 0);
    },

    start() {
        this._serverTittivateTypeId[0] = 5;
        this._serverTittivateTypeId[1] = 3;
        this.load();
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
    onSwitchTittivate(event, customerData) {
        let idx = parseInt(customerData);
        if (this._tittivate.length > 0) {
            for (var i = 0; i < this.ndTittivateTabs.length; i++) {
                if (idx == i) {
                    this.ndTittivateTabs[i].interactable = false;
                    this.ndTittivateTabs[i].children[0].active = true;
                } else {
                    this.ndTittivateTabs[i].interactable = true;
                    this.ndTittivateTabs[i].children[0].active = false;
                }
            }
            this.loadTittivate(idx);
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
                if (Global.game._buyCount > 0) {
                    let ndGuide = cc.find("Canvas/Guid");
                    if (ndGuide != null) {


                        let guide = ndGuide.getComponent("Guid");
                        if (guide._isGuid) {
                            guide.stepSchedule(3);
                        }
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

        Network.getTittivate((res) => {
            if (res.result) {
                self._tittivate = res.data;
                self.loadTittivate(0);
            } else {
                Global.game.showTip(res.data);
            }

        });

    },
    //加载装扮
    loadTittivate(type) {

        let content = this.ndSvTittive.getComponent(cc.ScrollView).content;
        content.removeAllChildren();

        for (var i = 0; i < this._tittivate.length; i++) {

            if (this._tittivate[i].type == this._serverTittivateTypeId[type]) {

                let item = cc.instantiate(this.preItemTittive);
                item.parent = content;
                item.getComponent("ItemShopTittivate2").init(this._tittivate[i]);
            }
        }
    },
});
