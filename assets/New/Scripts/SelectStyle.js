var WX = require("WX");
var Network = require("Network");
var Common = require("Common");
cc.Class({
    extends: cc.Component,

    properties: {
        ndStyle: [cc.Node],//画面选择节点

        _style: "",
        _uid:-1,  //用户ID
    },

    //A/B (A拟人B卡通)
    onLoad() {
  
        this.getStyle();
    },

    start() {

        var self = this;
        WX.getSetting((isAuth) => {
            if (!isAuth) {
                WX.createUserInfoButton();
            }
        });
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
        var self=this;
        WX.login(function (code) {
    
            Network.getStyle(code, (res) => {
                if (res.result) {
                    self._uid=res.data.id
                    if (!Common.isNullOrEmpty(res.data)) {
                        if (res.data.type == 'A') {
                            Global.scene.nextSceneName = "Main";
                        }
                        else if(res.data.type=='B'){
                            Global.scene.nextSceneName = 'Main2';
                        }
                        cc.director.loadScene("Loading");
                    }
                }
            });
        });

    },
    //设置游戏风格
    setStyle() {
        Network.setStyle(this._style,this._uid,(res)=>{
            if(res.result)
            cc.director.loadScene('Loading');
        });
        
    },

});
