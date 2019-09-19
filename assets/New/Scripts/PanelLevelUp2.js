
cc.Class({
    extends: cc.Component,

    properties: {
        imgBg:cc.Sprite,  //背景
        spBg:[cc.SpriteFrame],  //背景图片精灵
        stepsRoot:[cc.Node],  //阶梯集合
        ndPlayer:cc.Node,  //角色
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        // this.ndPlaye=this.node.getChildByName("Player");
    },

    // update (dt) {},

    init(curr){
        let bgIdx=parseInt(curr/10);
        let modIdx=parseInt(curr%10);
        this.imgBg.spriteFrame=this.spBg[bgIdx];
        let preStep=this.stepsRoot[bgIdx].children[modIdx-1].position;
        let tarStep=this.stepsRoot[bgIdx].children[modIdx].position;

        this.ndPlayer.position=preStep;
        this.jumpTo(tarStep);
    },
    jumpTo(target){
        this.ndPlayer.runAction(cc.jumpTo(0.6,target,100,1));
    },
    show(){
        this.init(Global.user.level);
    },
    onHide(){
        this.node.active=false;
    },
    onAddLevel(){
        Global.user.level++;
        this.show();
    }
});
