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
        imgAvatar:cc.Sprite,  //头像 
        txtNickname:cc.Label,  //昵称
        txtLvl:cc.Label,  //等级
        ndCanHelpBath:cc.Node,  //是否可以帮助洗澡节点
        ndCanStealFood:cc.Node,  //是否可以偷吃食物节点
        ndCanStealEgg:cc.Node,  //是否可以偷蛋节点
        ndIsOtherStealFood:cc.Node,  //是否被别人偷饭节点
        spBg2:cc.SpriteFrame,  //背景2
        _uid:-1,

        spFronts:[cc.SpriteFrame],  //头像前部图片集
        imgAvatarFront:cc.Sprite,  //头像前部
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },
    /**
     * @param  {int} id  用户id
     * @param  {int} lvl 等级
     * @param  {string} nickname  昵称
     * @param  {string} avatar  头像
     * @param  {bool} canHelpBath  是否可以帮助洗澡
     * @param  {bool} canStealFood  是否可以偷取食物
     * @param  {bool} canStealEgg  是否可以偷蛋
     * @param  {boolean} isOtherStealFood  是否有他人正在偷吃食物
     * @param  {int}  inc  索引
     */
    fillItem(id,lvl,nickname,avatar,canHelpBath,canStealFood,canStealEgg,isOtherStealFood,inc){

        var self=this;
        this._uid=id;
        this.txtLvl.string=lvl.toString();
        this.txtNickname.string=nickname;
        this.ndCanHelpBath.active=canHelpBath;
        this.ndCanStealEgg.active=canStealEgg;
        // this.ndCanStealFood.active=canStealFood;
        this.ndIsOtherStealFood.active=isOtherStealFood;
        // if(inc!=null&&inc%2==0){
        //     this.node.getComponent(cc.Sprite).spriteFrame=this.spBg2;
        // }
        cc.loader.load({url:avatar,type:"png"},function(err,tex){
            if(tex){
                self.imgAvatar.spriteFrame=new cc.SpriteFrame(tex);
            }
        });
        let frontIdx= Math.min(3,parseInt(lvl/10));
        this.imgAvatarFront.spriteFrame=this.spFronts[frontIdx];
    },
    //点击
    onClick(){
        Global.scene.otherUid=this._uid;
        
        // Global.scene.nextSceneName="OtherHome";
        // cc.director.loadScene("Loading");
       cc.find("Canvas").getComponent("HomeCtrl").gotoOtherHome();
    },
    // update (dt) {},
});
