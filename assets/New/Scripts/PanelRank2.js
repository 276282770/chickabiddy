
var Network = require("Network");
var WX = require("WX");
cc.Class({
    extends: cc.Component,

    properties: {

        ndBg: cc.Node,  //背景
        tabBtnWorld: cc.Button,  //世界排行榜按钮
        tabBtnWechat: cc.Button,  //微信排行榜
        ndCtntWorld: cc.Node,  //世界排行榜内容根节点
        ndCtntWechat: cc.Node,  //微信排行榜根节点
        ndSvWorldRank: cc.Node,  //sv世界排行榜根节点
        ndSvWechatRank: cc.Node,  //sv微信排行榜根节点
        preItem: cc.Prefab,  //项预制体

        oriPosY: -1,

        _isPanelReady: true,

        _display: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        var self = this;
        this.ndCtntWechat.on(cc.Node.EventType.TOUCH_MOVE, self.onMouseMove, self);
        this.ndCtntWechat.on(cc.Node.EventType.TOUCH_START, self.onMouseDown, self);
        this.ndCtntWechat.on(cc.Node.EventType.TOUCH_END, self.onTouchEnd, self);
        this._display = this.ndCtntWechat.getChildByName("display");

    },

    start() {
        this.changeToType2();
        this.loadData();

        
    },
    onTab(event, customData) {
        switch (customData) {
            case "WorldRank": {
                console.log("切换到世界排行榜");
                this.tabBtnWorld.interactable = false;
                this.tabBtnWechat.interactable = true;
                this.ndSvWechatRank.active = false;
                this.ndSvWorldRank.active = true;
                this.tabBtnWorld.node.children[0].active = true;
                this.tabBtnWechat.node.children[0].active = false;
            }; break;
            case "WechatRank": {
                console.log("切换到微信排行榜");
                this.tabBtnWorld.interactable = true;
                this.tabBtnWechat.interactable = false;
                this.ndSvWechatRank.active = true;
                this.ndSvWorldRank.active = false;
                this.tabBtnWorld.node.children[0].active = false;
                this.tabBtnWechat.node.children[0].active = true;
            }; break;
        }
    },

    // update (dt) {},

    //显示面板
    onShow() {


        var self = this;
        if (!this._isPanelReady)
            return;
        this.node.active = true;
        self._isPanelReady = false;
        this.ndBg.runAction(cc.sequence(cc.moveTo(0.5, new cc.Vec2(this.ndBg.position.x, this.ndBg.height)),
            cc.callFunc(function () {
                self._isPanelReady = true;
                // Global.game._OpenSubDomain=true;

                // self._display.getComponent("WXSubContextView").enabled=true;
            })
        ));
        // this.load();
    },
    //删除面板
    onClose() {
        var self = this;
        if (!this._isPanelReady)
            return;
        this.ndBg.runAction(cc.sequence(
            cc.moveTo(0.5, new cc.Vec2(this.ndBg.position.x, 0)),
            cc.callFunc(function () {
                self.node.destroy();
                console.log("删除面板");
            })));
    },
    //隐藏面板
    onHide() {
        var self = this;
        if (!this._isPanelReady)
            return;
        this._isPanelReady = false;
        console.log("【隐藏排行面板】");
        this.ndBg.runAction(cc.sequence(
            cc.moveTo(0.5, new cc.Vec2(this.ndBg.position.x, 0)),
            cc.callFunc(function () {
                self.node.active = false;

                self._isPanelReady = true;
                // Global.game._OpenSubDomain=false;
                // self._display.getComponent("WXSubContextView").enabled=false;
            })));
    },
    onEnable() {
        // this.onShow();
    },
    onMouseMove(event) {

        let offY = event.getLocationY() - this.oriPosY;
        this.oriPosY = event.getLocationY();
        //if(offY>10)
        WX.postMessage({ cmd: "scroll", y: offY });
    },
    onMouseDown(event) {
        this.oriPosY = event.getLocationY();
    },
    onTouchEnd(event) {
        WX.postMessage({ cmd: "scrollTouchEnd" });
    },
    changeToType2() {
        WX.postMessage({ cmd: "SETSTYLE", para: 1 });
    },
    loadData() {
        var self = this;
        //加载世界排行榜数据
        Network.getWorldRank((res) => {
            if (res.result) {
                let data = res.data;
                for (var i = 0; i < res.data.length; i++) {
                    var item = cc.instantiate(self.preItem);
                    // item.parent=self.ndCtntWorld;
                    self.ndCtntWorld.addChild(item);
                    var itemScr = item.getComponent("ItemRank2");
                    itemScr.init(i,data[i].level,data[i].avatarUrl,data[i].nickname);
                }
            } else {
                Gloabl.game.showTip(res.data);
            }
        })
    },
});
