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
        ndMask:cc.Node,  //背景
        _panel:null,  //当前面板
        _panelScr:null,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },
    //创建面板
    createPanel(pref,scrName){
        if(!pref)
            return;
        if(this.node.childrenCount>1){
            return;
        }
        var newPanel= cc.instantiate(pref);
        newPanel.parent=this.node;
        this._panel=newPanel;
        if(scrName)
        this._panelScr=this._panel.getComponent(scrName);
        // this.ndMask.active=true;
    },
    /**删除当前面板
     */
    deletePanel(){
        if(this._panel!=null){
            if(this._panelScr!=null){
                this._panelScr.onClose();
            }else{
                this._panel.destroy();
            }
            this._panel=null;
            this._panelScr=null;
            // this.ndMask.active=false;
        }
    },
    
    /**显示面板（加动画）
     *
     *
     */
    showFx(){
        this._panelScr.showFx();
    },
    /**  显示面板
     *
     *
     */
    show(){
        this._panelScr.show();
    },
});
