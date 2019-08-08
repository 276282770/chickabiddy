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
        imgAvatar:{default:null,type:cc.Sprite,tooltip:"头像"},
        txtNo:{default:null,type:cc.Label,tooltip:"排名"},
        txtNickname:{default:null,type:cc.Label,tooltip:"昵称"},
        txtLevel:{default:null,type:cc.Label,tooltip:"等级"},
        imgLevel:cc.Sprite,  //等级图
        spLevels:[cc.SpriteFrame],  //头三名等级图片精灵
        

        _openid:"",  //openId
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},
    
    /**填充
     *
     *
     * @param {*} no  排名
     * @param {*} nickname  昵称
     * @param {*} avatar  头像
     * @param {*} level  等级
     */
    fill(no,nickname,avatar,level,openId){
        var self=this;
        if(no<4){
            if(this.imgLevel!=null)
            this.imgLevel.spriteFrame=this.spLevels[no-1];
        }else{
            if(this.txtNo!=null)
            this.txtNo.string=no.toString();
        }
        if(this.txtNickname!=null)
        this.txtNickname.string=nickname;
        if(this.txtLevel!=null)
        this.txtLevel.string=level.toString();
        if(avatar!=null&&avatar!=""){
            cc.loader.load({url:avatar,type:'png'},function(err,tex){
                if(!err){
                    if(self.imgAvatar!=null)
                    self.imgAvatar.spriteFrame=new cc.SpriteFrame(tex);
                }
            });
        }
    },
});
