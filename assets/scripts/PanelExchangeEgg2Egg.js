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
        
        

        _exchangeCount:0,  //兑换数量
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    
    //兑换
    onExchange(){
        var self=this;
        Network.exchangeEgg2Egg(self._exchangeCount,(res)=>{
            if(res.result){
                Global.game.updateIndex();
            }
            self.onClose();
            Global.game.showTip(res.data);
        });
    },

    onClose(){
        this.node.destroy();
    },
    load(){

    },
});
