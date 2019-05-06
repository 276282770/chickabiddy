// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

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
        ndBg:cc.Node,  //背景
        spTabNormal:cc.SpriteFrame, //正常按钮的背景
        spTabSelected:cc.SpriteFrame,  //当前按钮的背景
        btnTabAll:cc.Button,  //套装按钮
        btnTabHat:cc.Button,  //帽子按钮
        btnTabGlasses:cc.Button, //眼镜按钮
        btnTabClothes:cc.Button,  //衣服按钮
        ndSvAll:cc.Node,
        ndSvHat:cc.Node,
        ndSvGlasses:cc.Node,
        ndSvClothes:cc.Node,

        _panelReady:false,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        // this.onTab(null,"all");
    },
    /**选择
     */
    onTab(event,name){
        console.log("点击按钮"+name);
        switch(name){
            case "all":{
                this.btnTabAll.interactable=false;
                this.btnTabHat.interactable=true;
                this.btnTabClothes.interactable=true;
                this.btnTabGlasses.interactable=true;
                this.btnTabAll.node.getComponent(cc.Sprite).spriteFrame=this.spTabSelected;
                this.btnTabHat.node.getComponent(cc.Sprite).spriteFrame=this.spTabNormal;
                this.btnTabClothes.node.getComponent(cc.Sprite).spriteFrame=this.spTabNormal;
                this.btnTabGlasses.node.getComponent(cc.Sprite).spriteFrame=this.spTabNormal;

                this.ndSvAll.active=true;
                this.ndSvHat.active=false;
                this.ndSvGlasses.active=false;
                this.ndSvClothes.active=false;
            };break;
            case "hat":{
                this.btnTabAll.interactable=true;
                this.btnTabHat.interactable=false;
                this.btnTabClothes.interactable=true;
                this.btnTabGlasses.interactable=true;
                this.btnTabAll.node.getComponent(cc.Sprite).spriteFrame=this.spTabNormal;
                this.btnTabHat.node.getComponent(cc.Sprite).spriteFrame=this.spTabSelected;
                this.btnTabClothes.node.getComponent(cc.Sprite).spriteFrame=this.spTabNormal;
                this.btnTabGlasses.node.getComponent(cc.Sprite).spriteFrame=this.spTabNormal;

                this.ndSvAll.active=false;
                this.ndSvHat.active=true;
                this.ndSvGlasses.active=false;
                this.ndSvClothes.active=false;
            };break;
            case "glasses":{
                this.btnTabAll.interactable=true;
                this.btnTabHat.interactable=true;
                this.btnTabClothes.interactable=true;
                this.btnTabGlasses.interactable=false;
                this.btnTabAll.node.getComponent(cc.Sprite).spriteFrame=this.spTabNormal;
                this.btnTabHat.node.getComponent(cc.Sprite).spriteFrame=this.spTabNormal;
                this.btnTabClothes.node.getComponent(cc.Sprite).spriteFrame=this.spTabNormal;
                this.btnTabGlasses.node.getComponent(cc.Sprite).spriteFrame=this.spTabSelected;

                this.ndSvAll.active=false;
                this.ndSvHat.active=false;
                this.ndSvGlasses.active=true;
                this.ndSvClothes.active=false;
            };break;
            case "clothes":{
                this.btnTabAll.interactable=true;
                this.btnTabHat.interactable=true;
                this.btnTabClothes.interactable=false;
                this.btnTabGlasses.interactable=true;
                this.btnTabAll.node.getComponent(cc.Sprite).spriteFrame=this.spTabNormal;
                this.btnTabHat.node.getComponent(cc.Sprite).spriteFrame=this.spTabNormal;
                this.btnTabClothes.node.getComponent(cc.Sprite).spriteFrame=this.spTabSelected;
                this.btnTabGlasses.node.getComponent(cc.Sprite).spriteFrame=this.spTabNormal;

                this.ndSvAll.active=false;
                this.ndSvHat.active=false;
                this.ndSvGlasses.active=false;
                this.ndSvClothes.active=true;
            };break;
        }
    },

    onTabBtn(name){
        switch(name){
            case "all":{
                this.btnTabAll.interactable=false;
                this.btnTabHat.interactable=true;
                this.btnTabClothes.interactable=true;
                this.btnTabGlasses.interactable=true;
                this.btnTabAll.node.getComponent(cc.Sprite).spriteFrame=this.spTabSelected;
                this.btnTabHat.node.getComponent(cc.Sprite).spriteFrame=this.spTabNormal;
                this.btnTabClothes.node.getComponent(cc.Sprite).spriteFrame=this.spTabNormal;
                this.btnTabGlasses.node.getComponent(cc.Sprite).spriteFrame=this.spTabNormal;
            };break;
            case "hat":{
                this.btnTabAll.interactable=true;
                this.btnTabHat.interactable=false;
                this.btnTabClothes.interactable=true;
                this.btnTabGlasses.interactable=true;
                this.btnTabAll.node.getComponent(cc.Sprite).spriteFrame=this.spTabNormal;
                this.btnTabHat.node.getComponent(cc.Sprite).spriteFrame=this.spTabSelected;
                this.btnTabClothes.node.getComponent(cc.Sprite).spriteFrame=this.spTabNormal;
                this.btnTabGlasses.node.getComponent(cc.Sprite).spriteFrame=this.spTabNormal;
            };break;
            case "glasses":{
                this.btnTabAll.interactable=true;
                this.btnTabHat.interactable=true;
                this.btnTabClothes.interactable=true;
                this.btnTabGlasses.interactable=false;
                this.btnTabAll.node.getComponent(cc.Sprite).spriteFrame=this.spTabNormal;
                this.btnTabHat.node.getComponent(cc.Sprite).spriteFrame=this.spTabNormal;
                this.btnTabClothes.node.getComponent(cc.Sprite).spriteFrame=this.spTabNormal;
                this.btnTabGlasses.node.getComponent(cc.Sprite).spriteFrame=this.spTabSelected;
            };break;
            case "clothes":{
                this.btnTabAll.interactable=true;
                this.btnTabHat.interactable=true;
                this.btnTabClothes.interactable=false;
                this.btnTabGlasses.interactable=true;
                this.btnTabAll.node.getComponent(cc.Sprite).spriteFrame=this.spTabNormal;
                this.btnTabHat.node.getComponent(cc.Sprite).spriteFrame=this.spTabNormal;
                this.btnTabClothes.node.getComponent(cc.Sprite).spriteFrame=this.spTabSelected;
                this.btnTabGlasses.node.getComponent(cc.Sprite).spriteFrame=this.spTabNormal;
            };break;
        }
    },
    onShow(){
        let h=this.ndBg.height;
        let x=this.ndBg.position.x;
        this.ndBg.runAction(cc.sequence(
            cc.moveTo(0.5,x,h),
            cc.callFunc(()=>{
                this._panelReady=true;
            })
        ));
    },
    onClose(){
        if(!this._panelReady)
            return;
        let x=this.ndBg.position.x;
            this.ndBg.runAction(cc.sequence(
                cc.moveTo(0.5,x,0),
                cc.callFunc(()=>{
                    this.node.destroy();
                })
            ));
    },
    onEnable(){
        this.onShow();
    },
});
