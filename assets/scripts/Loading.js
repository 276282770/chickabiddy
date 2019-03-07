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
        progress:{default:null,type:cc.ProgressBar,tooltip:"加载进度条"},
        lblProgress:{default:null,type:cc.Label,tooltip:"加载进度显示"},
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

        
        cc.director.preloadScene("Main",(completedCount,totalCount,item)=>{
            var precent=completedCount/totalCount;
            this.progress=precent;
            this.lblProgress.string="加载中..."+ (parseInt(precent)*100).toString()+"%";
        },function(err,asset){
            if(err==null){
                cc.director.loadScene("Main");
            }
        });
    },

    // update (dt) {},
});
