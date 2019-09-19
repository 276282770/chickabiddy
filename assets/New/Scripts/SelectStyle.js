
var Network = require("Network");
cc.Class({
    extends: cc.Component,

    properties: {
        ndStyle: [cc.Node],//画面选择节点

        _style: "",
    },

    //A/B (A拟人B卡通)
    load() {
        this.getStyle();
    },

    start() {
        this.onSelectStyle(null, 0);
    },

    //选择
    onSelectStyle(event, customerData) {
        let selIdx = parseInt(customerData);
        this._style = selIdx == 0 ? 'B' : 'A';
        for (var i = 0; i < this.ndStyle.length; i++) {
            if (i == selIdx) {
                this.ndStyle[i].color = cc.color(255, 255, 255);
            } else {
                this.ndStyle[i].color = cc.color(100, 100, 100);
            }
        }
        if (this._style == 'A') {
            Global.scene.nextSceneName = 'Main';
        }
        else {
            Global.scene.nextSceneName = 'Main2';
        }
    },
    //获取游戏风格
    getStyle() {
        Network.getStyle((res) => {
            if (res.result) {
                if (res.data != "") {
                    if (res.data == 'A')
                        Global.scene.nextSceneName = "Main";
                    cc.director.loadScene("Loading");
                }
            }
        });
    },
    //设置游戏风格
    setStyle() {
        Network.setStyle(this._style);
        cc.director.loadScene('Loading');
    },

});
