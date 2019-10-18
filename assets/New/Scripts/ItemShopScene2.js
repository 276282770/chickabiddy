
cc.Class({
    extends: cc.Component,

    properties: {
        txtPrice:cc.Label,  //价格
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

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
