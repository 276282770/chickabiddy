// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

var Network=require("Network");
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
        imgGoods:cc.Sprite,  //物品图片
        txtName:cc.Label,  //物品名称
        txtDesc:cc.Label,  //物品说明
        txtTotalPrice:cc.Label,  //总价
        txtNum:cc.Label,  //数量文本
        btnBuy:cc.Button,  //购买按钮

        _unitPrice:0,  //单价
        _num:0,  //数量
        _cid:-1,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },
    //填充
    fill(id,name,desc,unitPrice){

        this._cid=id;
        var self=this;
        if(id!=null){
            cc.loader.loadRes("Shop/shop_"+id,function(err,tex){
                if(!err){
                    self.imgGoods.spriteFrame=new cc.SpriteFrame(tex);
                }
            });
        }
        this.txtName.string=name;
        this.txtDesc.string=desc;
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
            this.txtTotalPrice.string="￥"+this._unitPrice.toString();
            this.btnBuy.interactable=true;
        }else{
            this.txtNum.string=this._num.toString();
            this.txtTotalPrice.string="￥"+this._unitPrice.toString();
            this.btnBuy.interactable=false;
        }
    },
    //加数量按钮
    onAdd(){
        let price=this._unitPrice*(this._num+1);
        if(price<=Global.game._money){
            this._num++;
            this.txtNum.string=this._num.toString();
            this.txtTotalPrice.string="￥"+price.toString();
            this.btnBuy.interactable=true;
        }
    },
    //减数量按钮
    onReduce(){
        if(this._num>0){
            this._num--;
            this.txtNum.string=this._num.toString();
            this.txtTotalPrice.string="￥"+(this._unitPrice*this._num).toString();
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
 
                self.fill(res.data.id,res.data.name,res.data.desc,res.data.price);
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
