
cc.Class({
    extends: cc.Component,

    properties: {
        txtPrice:cc.Label,  //价格
        prePanelBuy:cc.Prefab,  //

        _tId:-1,
        _name:"",
        _desc:"",
        _price:0,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this._tId=999;
    },
       

    // update (dt) {},

    setPrice(price){
        this.txtPrice.string=price.toString();
    },
    onClick(){
        
        var item=cc.instantiate(this.prePanelBuy);
        item.getComponent("PanelBuy2").fill(this._tId,this._name,this._desc,this._price,5);
        item.parent=cc.find("Canvas/UICanvas");

    }
});
