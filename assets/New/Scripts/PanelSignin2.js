var Network=require("Network");
cc.Class({
    extends: cc.Component,

    properties: {

        items:[cc.Node],

        _signinData:null,
    },



    start () {
        this.loadData();
    },

    //加载数据
    loadData(){
        var self=this;
        Network.getSignin((res)=>{
            if(res.result){
                let data=res.data;
                self._signinData=data;
                for(var i=0;i<self.items.length;i++){
                    if(data[i]!=null){
                        self.items[i].getChildByName("signined").active=data[i].isFinish;
                        self.items[i].getChildByName("txtCount").getComponent(cc.Label).string=data[i].num.toString()+"+?";
                    }
                }
            }else{
                Global.game.showTip("加载签到数据失败");
            }
        });
    },
    //签到  
    onSignin(){
        var self=this;
        Network.signin((res)=>{
            if(res.result){
                Global.game.showTip("签到成功,增加"+res.data.toString()+"金币");
                self.showSignin();
            }else{
                Global.game.showTip(res.data);
            }
        });
    },
    onClose() {
        this.node.destroy();
    },
    showSignin(){
        let idx=0;
        for(var i=0;i<this._signinData.length;i++){
            if(this._signinData[i].isFinish){
                idx=i+1;
            }else{
                break;
            }
        }
        this.items[idx].getChildByName("signined").active=true;
    }
});
