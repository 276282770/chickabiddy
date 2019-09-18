
var Common=require("Common");
cc.Class({
    extends: cc.Component,

    properties: {
        imgAvatar:cc.Sprite,  //头像
        imgLvl:cc.Sprite,  //等级
        spLvl:[cc.SpriteFrame],  //等级精灵集
        imgNo:cc.Sprite,//排行图片
        spNo:[cc.SpriteFrame],  //排行精灵集
        txtNo:cc.Label, //排名文本
        txtLvl:cc.Label,//等级
        txtName:cc.Label,//昵称
    },

    //初始化
    init(no,lvl,avatarUrl,nickname){
        this.txtName.string=nickname;
        this.txtLvl.string=lvl.toString();
        if(no>=3){
            this.txtNo.string=(no+1).toString();
        }else{
            this.imgNo.spriteFrame=this.spNo[no];
        }
        let lvlIdx=Math.min(parseInt(lvl/10),3);
        this.imgLvl.spriteFrame=this.spLvl[lvlIdx];
        Common.load(avatarUrl,this.imgAvatar);
    },
    
});
