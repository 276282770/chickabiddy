var Network=require("Network");
cc.Class({
    extends: cc.Component,

    properties: {

        imgGoods:cc.Sprite,  //物品图片
        txtTotalPrice:cc.Label,  //总价
        txtNum:cc.Label,  //数量文本
        btnBuy:cc.Button,  //购买按钮

        _unitPrice:0,  //单价
        _num:0,  //数量
        _cid:-1,
    },


    start () {

    },
    //填充
    fill(id,name,desc,unitPrice){

        this._cid=id;
        var self=this;
        if(id!=null){
            cc.loader.loadRes("Shop2/shop_"+id,function(err,tex){
                if(!err){
                    self.imgGoods.spriteFrame=new cc.SpriteFrame(tex);
                }
            });
        }
        this._unitPrice=unitPrice;
        this.iniPrice();
    },
    onClose(){
        this.node.destroy();
    },
    //初始化数量和总价
    iniPrice(){
        if(Global.game._money>=this._unitPrice){
            this._num=1;
            this.txtNum.string=this._num.toString();
            this.txtTotalPrice.string=this._unitPrice.toString();
            this.btnBuy.interactable=true;
        }else{
            this.txtNum.string=this._num.toString();
            this.txtTotalPrice.string=this._unitPrice.toString();
            this.btnBuy.interactable=false;
        }
    },
    //加数量按钮
    onAdd(){
        let price=this._unitPrice*(this._num+1);
        if(price<=Global.game._money){
            this._num++;
            this.txtNum.string=this._num.toString();
            this.txtTotalPrice.string=price.toString();
            this.btnBuy.interactable=true;
        }
    },
    //减数量按钮
    onReduce(){
        if(this._num>0){
            this._num--;
            this.txtNum.string=this._num.toString();
            this.txtTotalPrice.string=(this._unitPrice*this._num).toString();
            if(this._num==0)
            this.btnBuy.interactable=false;
        }
    },
    //点击购买
    onBuy(){
        var self=this;
        Network.requestBuy(this._cid,this._num,(res)=>{
            if(res.result){
                Global.game.addMoneyEff(-self._num*self._unitPrice);
                Global.game.showTip("购买成功");

                //引导
                cc.find("Canvas").getComponent("Game")._buyCount=self._num;
            }else{
                Global.game.showTip(res.data);
            }
            self.onClose();
        });
    },
    //加载界面
    load(id){
        console.log("加载:"+id);
        var self=this;
        Network.requestShopGoodsById(id,(res)=>{
        
            if(res.result){
 
                self.fill(res.data.id,res.data.name,res.data.description,res.data.price);
            }
        });
    },
    onEnable(){
        this.onShow();
    },
    onShow(){
        this.node.getComponent(cc.Animation).play();
    },

    // update (dt) {},
});