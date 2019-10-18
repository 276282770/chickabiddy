

const {ccclass, property} = cc._decorator;

@ccclass
export default class LunchBox2 extends cc.Component {

    @property(cc.SpriteFrame)
    spBgs:cc.SpriteFrame[]=[];

    _style:number=0;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    // update (dt) {}
    changeStyle(st:number){
        // if(st===this._style)
        // return;
        this._style=st;
        this.node.getComponent(cc.Sprite).spriteFrame=this.spBgs[st];
    }
}
