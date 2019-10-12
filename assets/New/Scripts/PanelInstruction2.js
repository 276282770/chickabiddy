
cc.Class({
    extends: cc.Component,

    properties: {
        ndScrollView:cc.Node,  //滚动
        _ctnt:null,
        _ctntOriPosX:0,
        _currScrollX:-1,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.ndScrollView.on('scroll-ended', this.scrollEnded, this);
        this._ctnt=this.ndScrollView.getComponent(cc.ScrollView).content
        this._ctntOriPosX=this._ctnt.position.x;

        // this.ndScrollView.getComponent(cc.ScrollView).scrollTo(new cc.v2(0.25,0),1);
    },

    // update (dt) {},

    onClose(){
        this.node.destroy();
    },
    scrollEnded(sv){
        let curr=this.getCtntOffsetX()/this._ctnt.children[0].width/(this._ctnt.childrenCount-1);
        if(Math.abs( curr-this._currScrollX)<0.01){
            // console.log("跳过 "+Math.abs( curr-this._currScrollX));
            return;
        }
        let x=Math.round(this.getCtntOffsetX()/this._ctnt.children[0].width)/(this._ctnt.childrenCount-1);
        sv.scrollTo(new cc.v2(x,0),0.2);
        // console.log(curr+" "+ x );
        this._currScrollX=x;
    },
    getCtntOffsetX(){
        return this._ctntOriPosX-this._ctnt.position.x;
    },
});
