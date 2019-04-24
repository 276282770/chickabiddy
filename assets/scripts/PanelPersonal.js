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
        imgAvatar:cc.Sprite,   //头像
        txtNickName:cc.Label,  //昵称
        txtID:cc.Label,  //ID
        txtSelfEggCtnt:cc.Label,  //自己收获的蛋的个数
        txtOtherEggCtnt:cc.Label,  //收取别人蛋的个数
        proExp:cc.ProgressBar,  //经验进度
        proEgg:cc.ProgressBar,  //鸡蛋进度
        proFood:cc.ProgressBar,  //食物进度
        proClean:cc.ProgressBar,  //清洁进度
        txtExp:cc.Label,  //经验
        txtEgg:cc.Label,  
        txtFood:cc.Label,
        txtClean:cc.Label,
    },



    // onLoad () {},

    start () {

    },
    onClose(){
        var self=this;
        this.node.runAction(cc.sequence(
            cc.moveBy(0.3,-this.node.width,0),
            cc.callFunc(function(){
                self.node.destroy();
            })
        ));
        
    },
    onShow(){
        this.node.runAction(cc.moveTo(0.3,this.node.width/2,this.node.position.y));
        // this.node.runAction(cc.sequence(
        //     cc.moveTo(2,50,50)
        //     // cc.callFunc()
        // ));
        this.load();
    },
    onEnable(){
        this.onShow();
    },
    load(){
        var self=this;
        this.txtNickName.string=Global.user.nickName;
        this.txtID.string="ID："+Global.id.toString();
        if(Global.user.avatar!=""){
        cc.loader.load({url:Global.user.avatar,type:"png"},function(err,tex){
            if(!err){
                self.imgAvatar.spriteFrame=new cc.SpriteFrame(tex);
            }
        });
        }
        Network.requestIndexInfo((res)=>{
            if(res.result){
                console.log("-----------------");
                console.log(JSON.stringify(res.data));
                self.txtSelfEggCtnt.string="下蛋数："+res.data.selfEggNum.toString();
                self.txtOtherEggCtnt.string="偷蛋数："+res.data.otherEggNum.toString();
                self.proExp.progress=res.data.lvlExp/res.data.lvlFullExp; 
                self.txtExp.string=res.data.lvlExp.toString()+"/"+res.data.lvlFullExp.toString();
                if(res.data.eggProgCurr>=0){
                    self.proEgg.progress=res.data.eggProgCurr/res.data.eggProgFull;
                    self.txtEgg.string=res.data.eggProgCurr.toString()+"/"+res.data.eggProgFull.toString();
                }
                if(res.data.foodRemain>=0){
                    self.proFood.progress=res.data.foodRemain/res.data.foodProgFull;
                    self.txtFood.string=res.data.foodRemain.toString()+"/"+res.data.foodProgFull.toString();
                }
                if(res.data.cleanProgCurr>=0){
                    self.proClean.progress=res.data.cleanProgCurr/res.data.cleanProgFull;
                    self.txtClean.string=res.data.cleanProgCurr.toString()+"/"+res.data.cleanProgFull.toString();
                }
               
                
                
                

            }
        });
    },
});