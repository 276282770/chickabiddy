var Common=require("Common");
cc.Class({
    extends: cc.Component,

    properties: {
        txtPrice:cc.Label,  //价格
        prePanelBuy:cc.Prefab,  //

        _tId:-1,
        _nm:"",
        _desc:"",
        _price:0,
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
        item.getComponent("PanelBuy2").fill(this._tId,this._nm,this._desc,this._price,5);
        item.parent=cc.find("Canvas/UICanvas");

    },
    setData(id,name,desc,price){



        this._tId=id;
        this._name=name;
        this._desc=desc;
        this._price=price;


        
        this.txtPrice.string=price.toString();

        Common.loadRes("Shop2/shop_"+id.toString()+"_2",this.node.getComponent(cc.Sprite));

    },
    
});
