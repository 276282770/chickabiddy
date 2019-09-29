
var WX=require("WX");
var Network=require("Network");
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
        ndBg:cc.Node,  //背景节点
        _panelReady:false,  //是否准备好
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        var self=this;
        Network.getIsShowUnsafeData((res)=>{
            if(!res.result){
                self.ndBg.getChildByName("New ScrollView").active=false;
            }
        })
    },

    // update (dt) {},
    
    /**链接到中原银行小程序
     * "navigateToMiniProgramAppIdList": [
                "wxeedb326f283fe740"
            ]
     */
    onLinkBank(){
        let appid="wxeedb326f283fe740";
        WX.navigateToMiniProgram(appid);
    },
    //链接到中原银行惠生活app
    onLink_HuiShenghuo(){
        Global.game.onLink_HuiShenghuo();
    },
    //链接到中原银行信用卡app
    onLink_XinYongKa(){
        Global.game.onLink_XinYongKa();
    },

    onShow(){
        var self=this;
        let h=this.ndBg.height;
        let x=this.ndBg.position.x;
        this.ndBg.runAction(cc.sequence(
            cc.moveTo(0.5,x,h),
            cc.callFunc(function(){
                self._panelReady=true;
            })
        ));
    },
    onClose(){
        if(!this._panelReady)
            return;
        let x=this.ndBg.position.x;
        var self=this;
        this.ndBg.runAction(cc.sequence(
            cc.moveTo(0.5,x,0),
            cc.callFunc(function(){
                self.node.destroy();
            })
        ));
    },
    onEnable(){
        this.onShow();
    },
});
