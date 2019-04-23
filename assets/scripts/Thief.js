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
        txtName:cc.Label,  //名字
        ndBg:cc.Node,  //背景
        ndExtend:cc.Node,  //扩展
        ndThief:cc.Node,  //角色

        

        _cid:-1,  //id
        _pos0:{default:new cc.Vec2(-121,-293)},
        _pos1:{default:new cc.Vec2(156,-293)},
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},
    onClick(){
        this.ndBg.active=true;
        this.ndThief.getComponent(cc.Button).interactable=false;
        this.ndExtend.getComponent(cc.Animation).play("player_extend_open");
    },
    onClickBg(){
        var self=this;
        
        this.ndExtend.getComponent(cc.Animation).play("player_extend_open");
        this.scheduleOnce(function(){
        this.ndBg.active=false;
        this.ndThief.getComponent(cc.Button).interactable=true;
        },0.2);
    },
    //揍他
    onFight(){

    },
    //赶走
    onOut(){

    },
    fill(id,name){
        this._cid=id;
        this.txtName.string=name;
    },
});
