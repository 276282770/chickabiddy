// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html


cc.Class({
    extends: cc.Component,

    properties: {

        imgGoods:cc.Sprite,  //物品
        txtName:cc.Label,  //物品名称
        txtPrice:cc.Label,  //数量

        prePanelBuy:cc.Prefab,  //购买界面

        _tId:-1,
        _type:-1,
        _desc:"",
        _parent:null,
        _isUse:false,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},

    init(data){
        var self=this;
        this._tId=data.id;
        this._type=data.type;
        this._desc=data.desc,
        this._price=data.price,

        this.txtPrice.string=data.price.toString();
        this.txtName.string=data.name;
        cc.loader.loadRes("Shop2/shop_"+data.id.toString(),function(err,tex){
            if(!err){
                self.imgGoods.spriteFrame=new cc.SpriteFrame(tex);
            }
        });
        // if(data.isUse){
        //     data.isUse=true;
        //     this.onSel();
        // }
    },
    //选中
    onSel(){
        this.imgBg.spriteFrame=this.spBgs[1];
        this._isUse=true;
    },
    //未选中
    unSel(){
        this.imgBg.spriteFrame=this.spBgs[0];
        this._isUse=false;
    },
    onClick(){
        // this._isUse=!this._isUse;
        // if(this._isUse){
        //     this.onSel();
        // }else{
        //     this.unSel();
        // }
        // this._parent.onSelect(this._type,this._tId,this._isUse);
        var item=cc.instantiate(this.prePanelBuy);
        item.getComponent("PanelBuy2").fill(this._tId,this._name,this._desc,this._price);
        item.parent=cc.find("Canvas/UICanvas");
    }
});
