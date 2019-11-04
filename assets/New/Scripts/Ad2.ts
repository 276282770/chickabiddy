var Common=require("Common");
var Network=require("Network");

const {ccclass, property} = cc._decorator;

@ccclass
export default class Ad2 extends cc.Component {

    @property
    speed: number = 10;

    @property
    adUrl: string = '';
    @property(cc.Sprite)
    imgAD:cc.Sprite=null;

    @property(cc.Vec2)
    _pos:cc.Vec2=new cc.Vec2(0,0);

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        var self=this;
        // Common.load(this.adUrl,this.imgAD);
        Network.getIsShowUnsafeData((res)=>{
            if(!res.result){
                self.node.destroy();
            }
        });
        // Common.load("",this.imgAD);
    }

    update (dt) {
        this._pos=this.node.position;
        if(this._pos.x>-1400){
            this.node.setPosition(this._pos.x-dt*this.speed,this._pos.y);
        }else{
            this._pos.x=1400+Math.random()*1400;
            this.node.setPosition(this._pos);
        }
    }
}
