

const { ccclass, property } = cc._decorator;

@ccclass
export default class ItemBG2 extends cc.Component {

    @property(cc.Sprite)
    imgGoods: cc.Sprite=null;

    @property(cc.Sprite)
    imgBg: cc.Sprite=null;

    @property(cc.SpriteFrame)
    spBgs: cc.SpriteFrame[] = [];

    _tId: -1;
    _type: -1;
    _parent: any;
    _isUse: boolean = false;
    _index: number = -1;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {

    }

    // update (dt) {}

    init(data, parent, index) {
        var self = this;
        this._tId = data.id;
        this._type = data.type;
        this._parent = parent;

        this._index = index;

        // this.txtName.string=data.name;
        cc.loader.loadRes("Shop2/shop_" + data.id.toString()+"_1", cc.SpriteFrame, function (err, tex) {
            if (!err) {
                self.imgGoods.spriteFrame = tex;
            }
        });
        // if (data.isUse) {
        //     data.isUse = true;
        //     this.onSel();
        // }
        let homeCtrl=cc.find("Canvas").getComponent("HomeCtrl");
        let useId=homeCtrl._bgId[homeCtrl._bg];
        if(data.id==useId){
            this.onSel();
        }
        
    }
    //选中
    onSel() {
        this.imgBg.spriteFrame = this.spBgs[1];
        this._isUse = true;
    }
    //未选中
    unSel() {
        this.imgBg.spriteFrame = this.spBgs[0];
        this._isUse = false;
        console.log("未选中");
    }
    onClick() {
        // this._isUse = !this._isUse;
        // if (this._isUse) {
        //     this.onSel();
        // } else {
        //     this.unSel();
        // }
        this.onSel();
        // this._parent.onSelect(this._type, this._tId, this._isUse);
        this._parent.onSelectBG(this._index);
    }
}
