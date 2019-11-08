
var Common = require("Common");
cc.Class({
    extends: cc.Component,

    properties: {
        imgBg: cc.Sprite,  //背景
        spBg: [cc.SpriteFrame],  //背景图片精灵
        stepsRoot: [cc.Node],  //阶梯集合
        ndPlayer: cc.Node,  //角色
        ndSteps: cc.Node,  //阶段节点

        yAsixThreshold: 30,  //y轴阈值

        _canSlide: true,//是否可以滑动
        _animPlayer: cc.Animation,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this);
    },

    start() {
        // this.ndPlaye=this.node.getChildByName("Player");
        this._animPlayer = this.ndPlayer.getComponent(cc.Animation);

        this.scheduleOnce(this.resetSizeAndPosition, 0.5);



        


        
    },

    update(dt) {
        // console.log(this.ndSteps.height);
    },
    resetSizeAndPosition() {

      
        for (var i = 0; i < this.stepsRoot.length; i++) {

            this.stepsRoot[i].position = new cc.Vec2(0, i * this.ndSteps.height);
            
        }

        
        // Global.user.level=11;
    
        this.ndSteps.position=new cc.v2(0,-this.getPage()*this.ndSteps.height);


        // let curr=10;
        // let bgIdx = parseInt(curr / 10);
        // let modIdx = parseInt((curr - 1) % 10);
        // let preStep = Common.vector2Add(this.stepsRoot[bgIdx].children[modIdx].position, this.stepsRoot[bgIdx].position);
        // let tarStep = Common.vector2Add(this.stepsRoot[bgIdx].children[modIdx + 1 > 9 ? 0 : modIdx + 1].position, this.stepsRoot[bgIdx].position);
        // let midLayer = Common.vector2Add(this.stepsRoot[bgIdx].getChildByName("bottomcenter").position, this.stepsRoot[bgIdx].position);
        // this.ndPlayer.position = preStep;
        // this.jumpTo(midLayer);
    },

    init(curr) {
        console.log("等级"+curr);
        curr-=1;
        var self = this;
        let bgIdx = parseInt((curr-1) / 10);
        let modIdx = parseInt((curr - 1) % 10);
        // console.log(curr+" "+bgIdx+" "+modIdx);
        // this.imgBg.spriteFrame=this.spBg[bgIdx];
        let preStep = Common.vector2Add(this.stepsRoot[bgIdx].children[modIdx].position, this.stepsRoot[bgIdx].position);
        let tarStep = Common.vector2Add(this.stepsRoot[modIdx==9?bgIdx+1:bgIdx].children[modIdx + 1 > 9 ? 0 : modIdx + 1].position, this.stepsRoot[modIdx==9?bgIdx+1:bgIdx].position);
        let midLayer = Common.vector2Add(this.stepsRoot[modIdx==9?bgIdx+1:bgIdx].getChildByName("bottomcenter").position, this.stepsRoot[modIdx==9?bgIdx+1:bgIdx].position);

        // console.log(JSON.stringify(midLayer)+" "+JSON.stringify(tarStep));
        // console.log(this.ndSteps.position+" ::");
        this.ndSteps.position=new cc.v2(0,-bgIdx*this.ndSteps.height);
        // console.log(this.ndSteps.position+" :::");
        this.ndPlayer.position = preStep;
        if (modIdx != 9) {
            this.jumpTo(tarStep);
        } else {
            // this.jumpTo(midLayer);
            // this.jumpTo(midLayer,self.slide(-1,self.jumpTo(tarStep)));
            this.jumpTo(midLayer, function () {
                self.slide(-1, function () {
                    self.jumpTo(tarStep);
                })
            })
        }
    },
    jumpTo(target, callback) {
        var self = this;
        this._animPlayer.play("player2_jump");
        this.ndPlayer.runAction(cc.sequence(cc.jumpTo(0.6, target, 100, 1),
            cc.callFunc(
                function () {
                    // self._animPlayer.play("player2_idle");
                    if (callback)
                        callback();
                }
            )
        ));
    },
    jumpToProx() {

    },
    show() {


        this.init(Global.user.level);
    },
    onHide() {
        this.node.active = false;
    },
    onAddLevel() {
        // Global.user.level++;
        // this.show();

    },
    slide(vertial, callback) {
  
        var self = this;
        let x = 0;
        let y = this.ndSteps.height * vertial;

        let page = 0 - parseInt(parseInt(this.ndSteps.position.y) / parseInt(this.ndSteps.height));
        // console.log(this.ndSteps.position.y + " " + this.ndSteps.height + " " + page + " " + vertial);
        // console.log(page - vertial);
        if (page - vertial < 0 || page - vertial == this.stepsRoot.length) {
            // console.log(page-vertial);
            
            return;
        }
        // else {
            self._canSlide = false;
            this.ndSteps.runAction(cc.sequence(cc.moveBy(1, new cc.v2(x, y)), cc.callFunc(function () {
                // console.log("滑动完毕");
                self._canSlide = true;
                if (callback)
                    callback();

            })));
        // }
    },
    touchMove(event) {
        return;
   
        if (!this._canSlide)
            return;
        let y = event.touch.getDelta().y;
        let director = 0;

        if (Math.abs(y) < this.yAsixThreshold) {
            return;
        }
  
        
        director = y / Math.abs(y);
        this.slide(director);
    },
    onEnable(){

        if(this._animPlayer==null){
            this._animPlayer = this.ndPlayer.getComponent(cc.Animation);
        }
        this.scheduleOnce(this.show,1);
        
    },
    getPage(){
       return parseInt((Global.user.level-1)/10);
    }
});
