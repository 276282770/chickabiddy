var Player = require("Player2");
var Network = require("Network");
cc.Class({
    extends: cc.Component,

    properties: {
        thiefs: [Player],  //小偷集合
        positions: [cc.v2],  //原始坐标
        _action: 0,  //0.没有操作  1.揍  2.赶走
        _cam: null,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this._cam = Global.game.camera;
    },

    start() {

        // let data = [{ id: 2, name: "侠盗猎车手", level: 100 }, {
        //     id: 1,
        //     name: "小子别跑",
        //     level: 80,
        // }];
        // this.setData(data);
    },

    // update (dt) {},

    setData(datas) {
        console.log("==================="+JSON.stringify(datas));
        
        for (var i = 0; i < datas.length; i++) {
            if (i >= this.thiefs.length) {
                return;
            }
            if (datas[i] == null) {
                this.thiefs[i].node.active = false;
            } else {
                
                    // this.thiefs[i].node.position=this.positions[i];
                    this.thiefs[i].node.active = true;
                    this.thiefs[i].setThiefData(datas[i].id, datas[i].name, datas[i].level, null, 20);
                    this.thiefs[i].playEatting_thief();
                
            }
        }
    },
    setThief(data){
        this.setData(data);
    },
    showExtend(obj) {
        for (var i = 0; i < this.thiefs.length; i++) {
            if (obj != this.thiefs[i]) {
                this.thiefs[i].hideExtend_thief();
            }

        }
        this._cam._canBack = false;
    },
    hideExtend(obj) {
        if (this._action == 0) {

        }
    },
    onClick(obj) {
        if (obj._isShowExtend) {
            for (var i = 0; i < this.thiefs.length; i++) {
                if (obj != this.thiefs[i] && this.thiefs[i]._isShowExtend) {
                    this.thiefs[i].hideExtend();
                }
            }
            this._cam._canBack = false;
        } else {
            let allExHide = true;
            for (var i = 0; i < this.thiefs.length; i++) {
                if (this.thiefs[i]._isShowExtend) {
                    allExHide = false;
                    break;
                }
            }
            if (allExHide) {
                this._cam._canBack = true;
                this.scheduleOnce(function () {
                    this._cam.backAuto();
                }, 2)

            }
        }
    },
    onFighting(obj) {
        var self = this;
        Network.requestHit(obj._uid,(res)=>{
            if(res.result){
                let otherObj= self.getAnotherThief(obj);
                let player=Global.game.player;

                obj.onFighting();
                obj.openSay(res.data.say);

               otherObj.openSay(res.data.otherSay);
               otherObj.onOut();

               player.openSay(res.data.playerSay);

               self.scheduleOnce(function(){
                Global.game.showTip(res.data.awardTxt);
                    self._cam._canBack=true;
               },2)
            }else{
                Global.game.showTip(res.data);
            }
        })
    },
    onOut(obj){
        var self=this;
        Network.requestDriveOff(obj._uid,(res)=>{
            if(res.result){
                obj.onOut();
                obj.openSay(res.data.say);

                Global.game.player.openSay(res.data.playerSay);
                self.scheduleOnce(function(){
                    Global.game.showTip(res.data.awardTxt);
                    self._cam._canBack=true;
                   },2)
            }else{
                Global.game.showTip(res.data);
            }
        });
    },
    getIdx(obj) {

    },
    getAnotherThief(obj) {
        let resultObj = null;
        for (var i = 0; i < this.thiefs.length; i++) {
            if (this.thiefs[i] != obj) {
                resultObj = this.thiefs[i];
                break;
            }
        }
        return resultObj;
    }
});
