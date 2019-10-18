

const {ccclass, property} = cc._decorator;

@ccclass
export default class ItemBG2 extends cc.Component {

    @property(cc.SpriteFrame)
    spBGs:cc.SpriteFrame[]=[];
    
    @property(cc.SpriteFrame)
    spSels:cc.SpriteFrame[]=[];

    _tId:-1;
    _type:-1;
    _parent:null;
    _isUse:boolean=false;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    // update (dt) {}

    init(data,parent){
        var self=this;
        this._tId=data.id;
        this._type=data.type;
        this._parent=parent;
        // this.txtName.string=data.name;
        cc.loader.loadRes("Shop2/shop_"+data.id.toString(),function(err,tex){
            if(!err){
                self.imgGoods.spriteFrame=new cc.SpriteFrame(tex);
            }
        });
        if(data.isUse){
            data.isUse=true;
            this.onSel();
        }
    }
    //选中
    onSel(){
        this.imgBg.spriteFrame=this.spBgs[1];
        this._isUse=true;
    }
    //未选中
    unSel(){
        this.imgBg.spriteFrame=this.spBgs[0];
        this._isUse=false;
    }
    onClick(){
        this._isUse=!this._isUse;
        if(this._isUse){
            this.onSel();
        }else{
            this.unSel();
        }
        this._parent.onSelect(this._type,this._tId,this._isUse);
    }
}
