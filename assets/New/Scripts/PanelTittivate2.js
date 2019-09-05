

var Network = require("Network");
var Common=require("Common");
cc.Class({
    extends: cc.Component,

    properties: {

        ndBg: cc.Node,  //背景

        ndTabControl: cc.Node,  //tab
        preItem: cc.Prefab,  //项预制体

        imgModeFront:[cc.Sprite],//模型前
        ndMode:cc.Node,  //模型

        


        _tabs: [cc.Button],
        _pages: [cc.ScrollView],
        _panelReady: false,

        _save: [],//装扮
    },


    onLoad(){
        this.init();
    },
    start() {
        this.loadData();

    },
    init() {
        let ndTabs = this.ndTabControl.getChildByName("Tabs");
        let ndPages = this.ndTabControl.getChildByName("Pages");
        for (var i = 0; i < ndTabs.childrenCount; i++) {
            this._tabs[i] = ndTabs.children[i].getComponent(cc.Button);
            this._pages[i] = ndPages.children[i].getComponent(cc.ScrollView);
        }
        this._save[0]=-1;
        this._save[1]=-1;
    },
    /**选择
     */
    onTab(event, idx) {
        console.log("点击按钮" + idx);
        this.onTabBtn(idx);
    },

    onTabBtn(idx) {
        for (var i = 0; i < this._tabs.length; i++) {
            if (i == idx) {
                this._tabs[i].interactable = false;
                this._tabs[i].node.children[0].active = true;
                this._pages[i].node.active = true;
            } else {
                this._tabs[i].interactable = true;
                this._tabs[i].node.children[0].active = false;
                this._pages[i].node.active = false;
            }
        }
    },
    onShow() {
        let h = this.ndBg.height;
        let x = this.ndBg.position.x;
        this.ndBg.runAction(cc.sequence(
            cc.moveTo(0.5, x, h),
            cc.callFunc(() => {
                this._panelReady = true;
                this.ndMode.active=true;
            })
        ));
    },
    onClose() {
        if (!this._panelReady)
            return;
        let x = this.ndBg.position.x;
        this.ndBg.runAction(cc.sequence(
            cc.moveTo(0.5, x, 0),
            cc.callFunc(() => {
                this.node.destroy();
            })
        ));
    },
    onEnable() {
        this.onShow();
    },
    //加载数据
    loadData() {
        var self = this;
        Network.getMyTittivate((res) => {
            let data = res.data;
            if (res.result) {
                for (var i = 0; i < data.length; i++) {
                    let item = cc.instantiate(self.preItem);
                    item.parent = self._pages[data[i].type].content;
                    item.getComponent("ItemTittivate2").init(data[i], this);
                    if(data[i].isUse){
                        self._save[data[i].type]=data[i].id;
                    }
                }
                self.updateMode();
            }
        })

    },
    //选择
    onSelect(type, id, isUse) {
        let content = this._pages[type].content;
        if (isUse) {
            for (var i = 0; i < content.childrenCount; i++) {
                {
                    let item = content.children[i].getComponent("ItemTittivate2");
                    if (item._tId != id) {

                        item.unSel();
                    }
                }
            }
            this._save[type]=id;
        } else {
            this._save[type]=-1;
        }
        
        this.updateMode();
    },
    //更新形象
    updateMode(){
        for(var i=0;i<this._save.length;i++){
            if(this._save[i]==-1){
                this.imgModeFront[i].spriteFrame=null;
            }else{
                let path="Tittivate/"+i.toString()+"_"+this._save[i].toString();
                Common.loadRes(path,this.imgModeFront[i]);
            }
        }
    },
    //保存装扮
    onSave(){
        var self=this;
        Network.saveMyTittivate(this._save,(res)=>{
            if(res.result){
                Global.game.player.tittivate(self._save);
                Global.game.player.showTip("保存装扮成功");
            }else{
                Global.game.showTip(res.data);
            }
        });
    },
});
