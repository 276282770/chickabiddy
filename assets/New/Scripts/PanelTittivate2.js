

var Network = require("Network");
var Common = require("Common");
cc.Class({
    extends: cc.Component,

    properties: {

        ndBg: cc.Node,  //背景

        ndTabControl: cc.Node,  //tab
        preItem: cc.Prefab,  //项预制体
        preItemBG: cc.Prefab,  //背景预制体

        imgModeFront: [cc.Sprite],//模型前
        ndMode: cc.Node,  //模型
        ndBtnOpenShop: cc.Node,  //打开商店
        ndBtnSave: cc.Node,  //保存按鈕




        _tabs: [cc.Button],
        _pages: [cc.ScrollView],
        _panelReady: false,

        _save: [],//装扮
        _tittCount: 0,  //装饰个数
    },


    onLoad() {
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
        this._save[0] = [0, 0, 0, -1];
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
                this.ndMode.active = true;
            })
        ));

        Global.game.player.node.active = false;
    },
    onClose() {
        if (!this._panelReady)
            return;
        let x = this.ndBg.position.x;
        this.ndBg.runAction(cc.sequence(
            cc.moveTo(0.5, x, 0),
            cc.callFunc(() => {
                Global.game.player.onShow();
                this.node.destroy();
            })
        ));

        Global.game.player.getTitti();
    },
    onEnable() {
        this.onShow();
    },
    //加载数据
    loadData() {
        var self = this;
        Network.getMyTittivate((res) => {

            if (res.result) {
                self.changeType(res.data);
                let data = res.data.had;

                self._save[0] = res.data.use.hat;
                self._save[1] = res.data.use.glass;
                self._save[2] = res.data.use.hornor;
                if (data.length != 0) {
                    for (var i = 0; i < data.length; i++) {
                        let item = cc.instantiate(self.preItem);
                        item.parent = self._pages[data[i].type].content;
                        if (data[i].id == self._save[data[i].type]) {
                            data[i].isUse = true;
                        }
                        item.getComponent("ItemTittivate2").init(data[i], this);
                        // if(data[i].isUse){
                        //     self._save[data[i].type]=data[i].id;
                        // }
                    }
                    self._tittCount=data.length;
                } else {
                    // self.ndBtnOpenShop.active = true;
                    // self.ndBtnSave.active = false;
                }


                self.updateMode();
            }
        });

        Network.getSelfBgs((res) => {
            if (res.result) {
                for (var i = 0; i < res.data.length; i++) {
                    let data = res.data[i];
                    let newItem = cc.instantiate(self.preItemBG);
                    let newItemScr=newItem.getComponent("ItemBG2");
                    newItem.parent = self._pages[3].content;
                    newItemScr.init(data, self,i);
                }
            } else {
                Global.game.showTip(res.data);
            }
        });

    },
    showShopButton(yes) {
        
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
            this._save[type] = id;
        } else {
            this._save[type] = 0;
        }

        this.updateMode();
    },
    onSelectBG(index) {
        console.log("选择:"+index);
        this._save[3] = index;
        let content=this._pages[3].content;
        for(var i=0;i<content.childrenCount.length;i++){
            if(i!=index){
                content.children[i].getComponent("ItemBG2").unSel();
            }
        }
    },
    //更新形象
    updateMode() {
        for (var i = 0; i < this._save.length; i++) {
            if (this._save[i] == 0) {
                this.imgModeFront[i].spriteFrame = null;
            } else {
                let path = "Tittivate/" + Global.tittiTypeString[i] + "_" + this._save[i].toString();
                Common.loadRes(path, this.imgModeFront[i]);
            }
        }
    },
    //保存装扮
    onSave() {
        var self = this;
        Network.saveMyTittivate(this._save, (res) => {
            if (res.result) {
                Global.game.player.setTittivateData(self.convertPlayerTittiData(self._save));
                Global.game.showTip("保存装扮成功");
                Global.game.updateIndex();
            } else {
                Global.game.showTip(res.data);
            }
        });

        if (this._save[3] != -1) {
            let bgId = this._pages[3].content.children[this._save[3]].getComponent("ItemBG2")._tId;
            Network.saveBG(bgId, (res) => {
                if (res.result) {
                    Global.game.updateIndex();
                } else {
                    Global.game.showTip(res.data);
                }
            });
        }
    },

    //辅助
    //改变装饰类型为本地类型
    changeType(data) {
        for (var i = 0; i < data.had.length; i++) {
            for (var j = 0; j < Global.serverTittivateTypeId.length; j++) {
                if (data.had[i].type == Global.serverTittivateTypeId[j]) {
                    data.had[i].type = j;
                    break;
                }
            }
        }
    },
    //返回小鸡身上使用的装扮数据
    convertPlayerTittiData(data) {
        let result = {};
        result.hat = data[0];
        result.glass = data[1];
        result.hornor = data[2];
        return result;
    },
    //打开商店
    onOpenShop() {
        Global.game.onShowPanelShop();
        this.node.destroy();
    }
});
