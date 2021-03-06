
var WX = require("WX");
var Common = require("Common");
var Network = {
    domain: "https://xj.xiajiwangluo.com/chicken",  //域名
    // domain: "http://192.168.0.39:8080",
    // domain: "http://192.168.0.4:8080/chicken",


    backData: { result: false, data: {} },

    //封装微信http协议
    request(url, data, success) {
        if (Global.id > 0) {
            data.uid = Global.id;
        }
        WX.request(url, data, "POST", success);
    },
    /**  统计
     *
     *
     * @param {*} data  任务
     */
    requestStatistics(key, value) {
        let url = this.domain + "/tongji/tongji_shop.action";
        let data = { key: value }
    },
    /**登录
     * @param  {string} code 微信code
     * @param  {function} callback 回调函数
     */
    requestLogin(code, avatar, nickName, callback) {
        let url = this.domain + "/load/load.action";
        let data;
        if (code != null) {
            data = { code: code, url: avatar, nickName: nickName };
            // Global.user.nickName=nickName;
            // Global.user.avatar=avatar;

        } else {
            data = { uid: Global.id };
        }
        let backData = { result: false, data: {} };



        this.request(url, data, (res) => {
            if (res.state == 200 || res.state == 199 || res.state == 198) {
                backData.result = true;

                backData.data.isNewPlayer = false;
                backData.data.isFirstLayingEgg = false;
                if (res.state == 198) {
                    backData.data.isNewPlayer = true;
                } else if (res.state == 199) {
                    backData.data.isFirstLayingEgg = true;
                }
                // backData.data={};
                backData.data.id = res.data.uid;  //id
                backData.data.lvl = res.data.level;  //等级
                backData.data.lvlExp = res.data.currentExp;  //经验
                backData.data.lvlFullExp = res.data.maxExp;  //升级所需经验
                // backData.data.lvlProg=res.data.currentExp/res.data.maxExp;  //下一等级进度
                backData.data.lvlUp = res.data.styleA > 0;

                backData.data.selfEggNum = res.data.goodEgg;  //自己鸡蛋个数
                backData.data.totalEggCount = res.data.totalEgg;  //自己鸡蛋总数
                backData.data.otherEggNum = res.data.badEgg;  //别人鸡蛋个数
                backData.data.totalOtherEggCount = res.data.totalBadEgg;  //收别人鸡蛋总数
                backData.data.totalLoseEggCount = res.data.totalLoseEgg;  //鸡蛋丢失（被偷数）
                backData.data.eggNum = res.data.waitGetEgg;  //未收鸡蛋个数
                // backData.data.eggProg=res.data.age_pre;  //下一个鸡蛋出生进度
                backData.data.eggProgCurr = res.data.eggTime;  //鸡蛋已经成熟时间
                backData.data.eggProgFull = res.data.totalEggTime;  //鸡蛋成熟总时间
                backData.data.money = res.data.money;  //钱
                // backData.data.cleanProg=res.data.clean_pre;  //干净进度
                backData.data.cleanProgCurr = res.data.clean;
                backData.data.cleanProgFull = 86400;

                backData.data.foodRemain = Math.max(0, res.data.resEatTime);  //食物剩余可以吃的时间
                backData.data.foodProgFull = res.data.totalEatTime;  //食物进度
                // backData.data.foodProg=res.data.howLongEat_pre;  //食物进度
                backData.data.newDetail = res.data.unRead_dongtai > 0;  //新动态
                backData.data.newAnnouncement = res.data.unRead_gonggao > 0;  //新公告
                // backData.data.newWorldMsg=res.data.unRead_world>0;




                // backData.data.thiefs=res.data.badMan;  //小偷
                //设置小偷信息
                let thiefs = res.data.badMan;
                backData.data.thiefs = [];
                for (var i = 0; i < thiefs.length; i++) {
                    if (thiefs[i] == null) {
                        backData.data.thiefs.push(null);
                    } else {
                        backData.data.thiefs.push({ id: thiefs[i].id, name: thiefs[i].name, level: thiefs[i].level, avatarUrl: thiefs[i].url, comeFrom: thiefs[i].chicken_style });

                    }

                }

                backData.data.playerState = 0;  //正常
                if (res.data.die > 0)
                    backData.data.playerState = 3; //挨揍了
                if (res.data.where > 0) {
                    backData.data.playerState = 7;  //去别人家了
                }
                backData.data.bateu = res.data.die > 0;
                backData.data.outHome = res.data.where > 0;
                backData.data.otherId = res.data.where;

                backData.data.BG = res.data.background;  //背景

                Global.id = backData.data.id;
                Global.openid = res.data.openid;


            } else {
                backData.data = "";
            }
            if (callback)
                callback(backData);
        });
    },
    //请求个人信息
    requestPersonInfo(id, callback) {
        let url = this.domain + "/friend/toFriendHome.action";
        let data = { uid: Global.id, fid: id };
        let backData = { result: false, data: {} };
        this.request(url, data, (res) => {
            if (res.state == 200) {
                backData.result = true;
                backData.data.id = id;
                backData.data.avatar = res.data.url;
                backData.data.nickName = res.data.nickName;
                backData.data.lvl = res.data.level;
                //设置小偷信息
                let thiefs = res.data.badMan;
                backData.data.thiefs = [];
                for (var i = 0; i < thiefs.length; i++) {
                    if (thiefs[i] == null) {
                        backData.data.thiefs.push(null);
                    } else {
                        backData.data.thiefs.push({ id: thiefs[i].id, name: thiefs[i].name, level: thiefs[i].level, avatarUrl: thiefs[i].url, comeFrom: thiefs[i].chicken_style });

                    }

                }

                backData.data.eggCount = res.data.egg;
                backData.data.canBath = res.data.xizao == 0;
                backData.data.canPickupEgg = res.data.toudan == 1;
                backData.data.say = res.tips.tips;

                backData.data.BG = res.data.background;  //背景
                backData.data.playerState = 0;  //正常
                if (res.currentPage < 0) backData.data.playerState = 4;
                if (res.data.xizao == 0) backData.data.playerState = 6;
                if (res.data.die > 0)
                    backData.data.playerState = 3; //挨揍了
                if (res.data.where > 0) {
                    backData.data.playerState = 7;  //去别人家了
                }
                backData.data.otherId = res.data.where;
                backData.data.outHome = res.data.where > 0;
                backData.data.eggProgress = res.data.eggTime / res.data.totalEggTime;

                backData.data.foodRemain = res.currentPage;
                backData.data.titti = {
                    hat: res.replenish.styleB,
                    glass: res.replenish.styleD,
                    hornor: res.replenish.styleC
                }
            } else {
                backData.data = "";
            }
            if (callback)
                callback(backData);
        });
    },
    //请求首页信息
    requestIndexInfo: function (callback) {

        this.requestLogin(null, "", "", callback);

        // let data={uid:Global.id};
        // let url=this.domain+"/load/load.action";
        // let backData={result:false,data:{}};
        // this.request(url,data,(res)=>{
        //     if(res.state==200){
        //         backData.result=true;
        //         // backData.data={};
        //         backData.data.id=res.data.uid;  //id
        //         backData.data.lvl=res.data.level;  //等级
        //         backData.data.lvlExp=res.data.currentExp;  //经验
        //         backData.data.lvlFullExp=res.data.maxExp;  //升级所需经验
        //         // backData.data.lvlProg=res.data.currentExp/res.data.maxExp;  //下一等级进度
        //         backData.data.lvlUp=res.data.double_exp>0;   

        //         backData.data.selfEggNum=res.data.goodEgg;  //自己鸡蛋个数
        //         backData.data.otherEggNum=res.data.badEgg;  //别人鸡蛋个数
        //         backData.data.eggNum=res.data.waitGetEgg;  //未收鸡蛋个数
        //         // backData.data.eggProg=res.data.age_pre;  //下一个鸡蛋出生进度
        //         backData.data.eggProgCurr=res.data.eggTime;  //鸡蛋已经成熟时间
        //         backData.data.eggProgFull=res.data.totalEggTime;  //鸡蛋成熟总时间
        //         backData.data.money=res.data.money;  //钱
        //         // backData.data.cleanProg=res.data.clean_pre;  //干净进度
        //         backData.data.cleanProgCurr=res.data.clean;
        //         backData.data.cleanProgFull=86400;

        //         backData.data.foodRemain=res.data.totalEatTime;  //食物剩余可以吃的时间
        //         backData.data.foodProgFull=res.data.resEatTime;  //食物进度
        //         // backData.data.foodProg=res.data.howLongEat_pre;  //食物进度
        //         backData.data.newDetail=res.data.unRead_dongtai;  //新动态
        //         backData.data.newAnnouncement=res.data.unRead_gonggao;  //新公告
        //         // backData.data.newWorldMsg=res.data.unRead_world;

        //         backData.data.thiefs=res.data.badMan;
        //         backData.data.state=0;
        //         if(res.data.die==1)
        //         backData.data.state=1;

        //         Global.id=backData.data.id;
        //     }else{
        //         backData.data="";
        //     }
        //     if(callback)
        //         callback(backData);
        // });
    },
    //请求公告信息
    requestAnnouncement: function (callback) {
        let url = this.domain + "/gonggao/getGonggao.action";
        let data = { uid: Global.id };
        let backData = { result: false, data: {} };
        this.request(url, data, (res) => {
            if (res.state == 200) {
                backData.result = true;
                backData.data = {};
                backData.data.date = res.data.time;
                backData.data.text = res.data.text;
                backData.data.imgUrl = res.data.url;
            } else {
                backData.data = "";
            }
            if (callback)
                callback(backData);
        });
    },
    //请求好友信息
    requestFriendList: function (page, callback) {
        let url = this.domain + "/friend/getFriendList.action";
        let data = { uid: Global.id, currentPage: page };
        var self = this;
        this.request(url, data, (res) => {
            let backData = {};
            if (res.state == 200) {
                backData.result = true;
                backData.data = {};
                backData.data.friends = [];
                for (var i = 0; i < res.data.length; i++) {
                    let friend = {};
                    friend.id = res.data[i].uid;
                    friend.nickName = res.data[i].nickName;
                    friend.lvl = res.data[i].level;  //等级
                    friend.avatar = res.data[i].url;  //头像
                    friend.isHelpBath = res.data[i].xizao == 0; //是否可以洗澡
                    friend.isStealEgg = res.data[i].toudan == 1;  //是否可以偷蛋
                    friend.isStealFood = res.data[i].food == 1;  //是否可以偷饭
                    friend.isOtherStealFood = res.data[i].qugan == 1;  //是否被人正在偷饭
                    backData.data.friends.push(friend);
                }
                backData.data.page = res.currentPage;
            } else {
                backData.result = false;
                backData.data = "";  //以后更改
            }
            callback(backData);
        });
    },
    //添加好友
    requestAddFriend(id, callback) {
        let url = this.domain + "/friend/addFriend.action";
        let data = { uid: Global.id, fid: id };
        var backData = { result: false, data: {} };
        this.request(url, data, (res) => {
            if (res.state == 200) {
                backData.result = true;
                backData.data = true;
            } else {
                backData.data = "";  //
            }
            callback(backData);
        });
    },
    //删除好友
    requestDelFriend(id, callback) {
        let url = this.domain + "/friend/delFriend.action";
        let data = { uid: Global.id, fid: id };
        var backData = { result: false, data: {} };
        this.request(url, data, (res) => {
            if (res.state == 200) {
                backData.result = true;
                backData.data = true;
            } else {
                backData.data = "";
            }
            callback(backData);
        });
    },
    //查询指定用户是否是自己好友
    requestIsFriend(id, callback) {
        let url = this.domain + "/friend/findFriend.action";
        let data = { uid: Global.id, fid: id };
        this.request(url, data, (res) => {
            var backData = {};
            backData.result = false;
            backData.data = false;
            if (res.state == 200) {
                backData.result = true;
                if (res.data == 1) {

                    backData.data = true;
                }
            }
            callback(backData);
        });
    },
    //收鸡蛋
    requestPickEgg(callback) {
        let url = this.domain + "/egg/shoudan.action";
        let data = { uid: Global.id };
        this.request(url, data, (res) => {
            var backData = {};
            backData.result = false;
            backData.data = {};
            if (res.state == 200) {
                backData.result = true;
            }
            backData.data.say = res.tips.tips;
            backData.data.tip = res.tips.text;
            if (callback)
                callback(backData);
        });
    },
    //收别人的鸡蛋
    requestPickupOtherEgg(id, callback) {
        let url = this.domain + "/egg/toudan.action";
        let data = { uid: Global.id, fid: id };
        this.request(url, data, (res) => {
            var backData = {};
            backData.result = false;
            backData.data = {};
            if (res.state == 200) {
                backData.result = true;
            } else {
                switch (res.state) {
                    case 213: backData.data.say = "没有多少蛋了，你就别下手了."; break;
                    case 225: backData.data.tip = "传入ID用户不存在"; break;
                    case 224: backData.data.tip = "不能重复偷蛋(一波只能偷一个蛋)"; break;
                    case 226: backData.data.tip = "不能偷自己"; break;
                }

            }
            if (callback)
                callback(backData);
        });
    },
    //吃饭
    requestDine(id, callback) {
        let url = this.domain + "/chicken/checkEat.action";
        let data = { uid: Global.id, pid: id };
        let backData = { result: false, data: {} };
        this.request(url, data, (res) => {
            if (res.state == 200) {
                backData.result = true;
                backData.data.id = id;

            }
            backData.data.say = res.tips.tips;
            // }else{
            //     backData.data.say=res.data.tips;

            //     switch(res.state){
            //         case 214:backData.data.say="喂食失败 清洁度不够";break;
            //     }
            // }
            if (callback)
                callback(backData);
        });
    },
    //洗澡
    requestBath(callback) {
        let url = this.domain + "/xizao/userself.action";
        let data = { uid: Global.id };
        let backData = { result: false, data: {} };
        this.request(url, data, (res) => {
            if (res.state == 200) {
                backData.result = true;
            }
            backData.data.say = res.tips.tips;
            backData.data.tip = "";
            if (res.tips.text != "" && res.tips.text != "空")
                backData.data.tip = res.tips.text;

            if (callback)
                callback(backData);
        });
    },
    //帮别人洗澡
    requestBathHelp(id, callback) {
        let url = this.domain + "/xizao/help.action";
        let data = { uid: Global.id, fid: id };
        let backData = { result: false, data: {} };
        this.request(url, data, (res) => {
            if (res.state == 200) {
                backData.result = true;
            }
            backData.data.tip = res.tips.text;
            backData.data.say = res.tips.tips;
            if (callback)
                callback(backData);
        });
    },
    //饭被偷吃，揍一顿
    //@id  被揍id
    requestHit(id, callback) {
        let url = this.domain + "/chicken/Hit.action";
        let data = { uid: Global.id, fid: id };
        let backData = { result: false, data: { beizou: "", xiapao: "", zouren: "" } };
        this.request(url, data, (res) => {
            if (res.state == 200) {
                backData.result = true;

                backData.data.awardTxt = res.data.zouren.text;
            }
            if (res.data.beizou)
                backData.data.say = res.data.beizou.tips;
            if (res.data.xiapao)
                backData.data.otherSay = res.data.xiapao.tips;
            if (res.data.zouren)
                backData.data.playerSay = res.data.zouren.tips;
            if (callback)
                callback(backData);
        });
    },


    //饭被偷吃，赶走
    //@id  偷吃者id
    requestDriveOff(id, callback) {
        let url = this.domain + "/chicken/Qugan.action";
        let data = { uid: Global.id, fid: id };
        let backData = { result: false, data: {} };
        this.request(url, data, (res) => {
            if (res.state == 200) {
                backData.result = true;
                backData.data.say = res.data.beiqugan.tips;
                backData.data.playerSay = res.data.qugan.tips;
                backData.data.awardTxt = res.data.qugan.text;
            } else {
                backData.data = "";
            }
            if (callback)
                callback(backData);
        });
    },
    //点击小鸡说的话
    requestClickPlayer(callback) {
        let url = this.domain + "/load/click.action";
        let data = { uid: Global.id };
        let backData = { result: false, data: {} };
        this.request(url, data, (res) => {
            if (res.state == 200) {
                backData.result = true;
                backData.data.text = res.tips.tips;
            }
            if (callback)
                callback(backData);
        });
    },

    /**召回（找回）小鸡
     *
     *
     * @param {*} callback  回调函数
     */
    requestGoBackPlayer(callback) {
        let url = this.domain + "/chicken/comeback.action";
        let data = { uid: Global.id };
        let backData = { result: false, data: {} };
        this.request(url, data, (res) => {
            if (res.state == 200) {
                backData.result = true;
                // backData.data.text=res.tips.tips;
            }
            if (callback)
                callback(backData);
        });
    },
    //买鸡蛋
    //@selfEggNum  自己的鸡蛋
    //@otherEggNum  偷来的鸡蛋
    requestSaleEgg(selfEggNum, otherEggNum, callback) {
        let url = this.domain + "/age/sellAge.action";
        let data = { uid: Global.id, goodAge: selfEggNum, badAge: otherEggNum };
        let backData = { result: false, data: {} };
        this.request(url, data, (res) => {
            if (res.state == 200) {
                backData.result = true;
                backData.data = "";
            } else {
                backData.data = "";
            }
            if (callback)
                callback(backData);
        });
    },
    /**洗澡
     * @param  {} callback  返回
     */
    requestTackABath(callback) {
        let url = this.domain + "/xizao/userself.action";
        let data = { uid: Global.id };
        let backData = { result: false, data: {} };
        this.request(url, data, (res) => {
            if (res.state == 200) {
                backData.result = true;
            } else {
                backData.data = "";
            }
            if (callback)
                callback(backData);
        });
    },
    /**帮别人洗澡
     * @param  {int} id  被洗澡id
     * @param  {Function} callback  返回
     */
    requestHelpTackABath(id, callback) {
        let url = this.domain + "/xizao/help.action";
        let data = { uid: Global.id, fid: id };
        let backData = { result: false, data: {} };
        this.request(url, data, (res) => {
            if (res.state == 200) {
                backData.result = true;
                backData.data = "";
            } else {
                backData.data = "";
            }
            if (callback)
                callback(backData);
        });
    },
    /**查看世界排行榜
     * @param  {int} page  页
     * @param  {function} callback  返回
     */
    requestWorldRankList(page, callback) {
        let url = this.domain + "/rank/getWorldRank.action";
        let data = { data: "worldRank", currentPage: page };
        let backData = { result: false, data: {} };
        this.request(url, data, (res) => {
            if (res.state == 200) {
                backData.result = true;
                backData.data = {};
                for (var i = 0; i < res.data.length; i++) {
                    let item = {};
                    item.num = res.data[i].rank;  //名次
                    item.lvl = res.data[i].level;  //用户等级
                    item.id = res.data[i].rid;  //用户id
                    item.name = res.data[i].nickName;  //昵称
                    item.avatar = res.data[i].url;  //头像地址
                    backData.data.push(item);
                }
            } else {
                backData.data = "";
            }
            if (callback)
                callback(backData);
        });
    },
    /**获取世界排行榜 */
    getWorldRank(callback) {
        let url = this.domain + "/tongji/worldRank.action";
        let data = {};
        let backData = { result: false };
        this.request(url, data, (res) => {
            if (res.state == 200) {
                backData.result = true;
                backData.data = [];
                let data = res.data;
                for (var i = 0; i < data.length; i++) {
                    backData.data.push({
                        id: data[i].user.id,
                        avatarUrl: data[i].user.url,
                        nickname: data[i].user.nickname,
                        level: data[i].user.level
                    });
                }
            } else {
                backData.data = res.data;
            }
            callback(backData);
        });
    },



    //查看世界消息
    //@page 分页
    //@mid  消息ID
    requestWorldMsg(page, mid, callback) {
        let url = this.domain + "/msg/getWorldMsg.action";
        let data = { msg: "getWorldMsg", currentPage: page, worldId: mid };
        var backData = { result: false, data: {} };
        this.request(url, data, (res) => {
            if (res.state == 200) {
                //有问题
            }
        });
    },
    /**购买商品
     * @param  {int} id 商品id
     * @param  {int} count 商品数量
     * @param  {function} callback  返回
     */
    requestBuy(id, count, callback) {
        let url = this.domain + "/shop/buyProp.action";
        let data = { uid: Global.id, pid: id, num: count };
        let backData = { result: false, data: {} };
        this.request(url, data, (res) => {
            if (res.state == 200) {
                backData.result = true;
                backData.result = "购买成功";
            } else {
                // let err = "";
                // switch (res.state) {
                //     case 222: err = "购买商品不存在"; break;
                //     default: err = res.data; break;
                // }

                backData.data = res.tips.tips;
            }
            if (callback)
                callback(backData);
        });
    },
    /**商店
     * @param  {function} callback 返回
     */
    requestShop(tp, callback) {
        let url = this.domain + "/shop/shop.action";
        let data = { uid: Global.id, cls: tp };
        let backData = { result: false, data: {} };
        this.request(url, data, (res) => {
            if (res.state == 200) {
                backData.result = true;
                backData.data = [];
                for (var i = 0; i < res.data.length; i++) {
                    let item = {};
                    item.id = res.data[i].id;
                    item.name = res.data[i].name;
                    item.price = res.data[i].price;
                    item.durable = res.data[i].time;
                    item.description = res.data[i].des;
                    backData.data.push(item);
                }
            } else {
                backData.data = "";
            }
            if (callback)
                callback(backData);
        });
    },
    /**
     *获取单个商品详情
     *
     * @param {*} id  商品ID
     * @param {*} callback  回调
     */
    requestShopGoodsById(id, callback) {
        let url = this.domain + "/shop/selectOne.action";
        let data = { pid: id };
        let backData = { result: false, data: {} };
        this.request(url, data, (res) => {
            if (res.state == 200) {
                backData.result = true;
                backData.data.id = res.data.id;
                backData.data.name = res.data.name;
                backData.data.price = res.data.price;
                backData.data.durable = res.data.time;
                backData.data.description = res.data.des;
                backData.data.had = res.data.num > 0;

            } else {
                backData.data = "";
            }
            if (callback)
                callback(backData);
        });
    },
    //获取道具
    requestGetPropLst(callback) {
        let url = this.domain + "/shop/prop.action";
        let data = { uid: Global.id, cls: 2 };
        var backData = { result: false, data: [] };
        this.request(url, data, (res) => {
            if (res.state == 200) {
                backData.result = true;
                for (var i = 0; i < res.data.length; i++) {
                    let item = {};
                    item.id = res.data[i].pid;
                    item.name = res.data[i].name;
                    item.desc = res.data[i].desc;
                    item.price = res.data[i].price;
                    item.count = res.data[i].num;
                    item.percent = 0;
                    if (res.data[i].url >= 0) {
                        item.percent = res.data[i].url / res.data[i].time;
                    }
                    backData.data.push(item);
                }

            } else {
                backData.data = "";
            }
            if (callback)
                callback(backData);
        });
    },
    //使用道具
    requestUseProp(id, callback) {
        let url = this.domain + "/chicken/use.action";
        let data = { uid: Global.id, pid: id };
        var backData = { result: false, data: {} };
        this.request(url, data, (res) => {
            if (res.state == 200) {
                backData.result = true;
                backData.data = res.tips.tips;
            } else {
                backData.data = "";
            }
            if (callback)
                callback(backData);
        });
    },
    /**请求背包列表
     * @param  {function} callback 回调函数
     */
    requestPackage(callback) {
        let url = this.domain + "/shop/back.action";
        let data = { uid: Global.id, cls: 1 };
        let backData = { result: false, data: {} };
        this.request(url, data, (res) => {
            if (res.state == 200) {
                backData.result = true;
                backData.data = [];
                for (var i = 0; i < res.data.length; i++) {
                    let item = {};
                    item.id = res.data[i].pid;
                    item.name = res.data[i].name;
                    item.descript = res.data[i].des;
                    item.count = res.data[i].num;
                    backData.data.push(item);
                }
            } else {
                backData.data = "";
            }
            if (callback)
                callback(backData);
        });
    },
    //发送世界消息
    requestSendWorldMsg(msg, callback) {
        let url = this.domain + "/msg/sendWorldMsg.action";
        let data = { uid: Global.id, msg: msg };
        var backData = { result: false, data: {} };
        this.request(url, data, (res) => {
            if (res.state == 200) {
                backData.result = true;
                backData.data = true;
            } else {
                backData.data = "";
            }
            if (callback)
                callback(backData);
        });
    },
    //发送消息
    requestSendMsg(id, msg, callback) {
        let url = this.domain + "/msg/sendMsg.action";
        let data = { uid: Global.id, fid: id, msg: msg };
        var backData = { result: false, data: {} };
        this.request(url, data, (res) => {
            if (res.state == 200) {
                backData.result = true;
                backData.data = true;
            } else {
                backData.data = "";
            }
            if (callback)
                callback(backData);
        });
    },
    //查看消息
    requestQueryMsglst(id, page, callback) {

    },
    //获取动态（日志）
    requestDetailLog(callback) {
        let url = this.domain + "/dongtai/getdongtai.action";
        let data = { uid: Global.id };
        var backData = { result: false, data: {} };
        this.request(url, data, (res) => {
            if (res.state == 200) {
                backData.result = true;
                backData.data = res.data;
            } else {
                backData.data = "";
            }
            if (callback)
                callback(backData);
        });
    },
    //获取问题题目
    requestAnswerLst(callback) {
        let url = this.domain + "/question/question.action";
        let data = { uid: Global.id };
        var backData = { result: false, data: {} };
        this.request(url, data, (res) => {
            if (res.state == 200) {
                backData.result = true;
                backData.data.id = res.data.id;
                backData.data.q = res.data.title;
                backData.data.a0 = res.data.answera;
                backData.data.a1 = res.data.answerb;
                backData.data.a2 = res.data.answerc;
                backData.data.a3 = res.data.answerd;
            } else {

                backData.data = "";
            }
            if (callback)
                callback(backData);
        });
    },
    //答题
    requestAnswer(id, a, callback) {
        let url = this.domain + "/question/userAnswer.action";
        let s = ['A', 'B', 'C', 'D'];
        let data = { uid: Global.id, qid: id, choice: s[a] };
        var backData = { result: false, data: {} };
        this.request(url, data, (res) => {
            if (res.state == 200) {
                backData.result = true;

            }
            backData.data.say = res.tips.tips;
            backData.data.award = res.tips.text;
            if (callback)
                callback(backData);
        });
    },
    /**
     *查看任务
     *
     * @param {*} callback 回调函数
     */
    requestMission(callback) {
        let url = this.domain + "/share/task.action";
        let data = { uid: Global.id };
        let backData = { result: false, data: {} };
        this.request(url, data, (res) => {
            if (res.state == 200) {
                backData.result = true;
                backData.data.miss0Cmplt = res.data.share == 1;
                backData.data.miss1Cmplt = res.data.question == 1;
            }
            if (callback) {
                callback(backData);
            }
        });
    },
    /**
     *分享
     *
     * @param {*} callback 回调函数
     */
    requestShare(callback) {
        let url = this.domain + "/share/share.action";
        let data = { uid: Global.id };
        let backData = { result: false, data: {} };
        this.request(url, data, (res) => {
            if (res.state == 200) {
                backData.result = true;

            }
            backData.data.title = res.data.text;
            backData.data.imageUrl = res.data.url;
            if (callback)
                callback(backData);
        });
    },

    /** 分享成功
     *
     *
     * @param {*} callback  回调函数
     */
    requestShareSuccess(callback) {
        let url = this.domain + "/share/share.action";
        let data = { uid: Global.id, cls: 1 };
        let backData = { result: false, data: {} };
        this.request(url, data, (res) => {
            if (res.state == 200) {
                backData.result = true;
                backData.data.money = res.data.url;
            }
            backData.data.tip = res.data.text;
            if (callback)
                callback(backData);
        });
    },



    //获取链接小程序appid
    getLinkAppid(tp, callback) {
        let backData = { result: false, data: {} };
        callback(backData);
    },

    /** 鸡蛋兑换金币信息
     *
     *
     * @param {*} callback  回调函数
     */
    exchangeEgg2MoneyInfo(callback) {
        let url = this.domain + "/egg/bili.action";
        let data = { uid: Global.id };
        let backData = { result: false, data: {} };
        this.request(url, data, function (res) {
            if (res.state == 200) {
                backData.result = true;
                let data = backData.data;
                data.selfEggCount = res.data.goodegg;
                data.otherEggCount = res.data.badegg;
                data.selfEggPrice = res.data.pergoodegg;
                data.otherEggPrice = res.data.perbadegg;
                data.egg2eggRatio = 1 / res.data.exchangeegg;
            }
            if (callback)
                callback(backData);
        });
    },
    /** 鸡蛋兑换钱
     * 
     *
     * @param {*} count 数量
     * @param {*} where 鸡蛋来源
     * @param {*} callback 回调函数
     */
    exchangeEgg2Money(count, where, callback) {
        let url = this.domain + "/egg/sell.action";
        let data = { uid: Global.id, goodEgg: 0, badEgg: 0 };
        if (where == "self") {
            data.goodEgg = count;
        } else if (where == "other") {
            data.badEgg = count;
        }
        let backData = { result: false, data: {} };
        this.request(url, data, function (res) {

            if (res.state == 200) {

                backData.result = true;

            } if (callback) {
                callback(backData);

            }
        });


    },
    /**自己的鸡蛋兑换金币
     *
     *
     * @param {*} count  自己鸡蛋的数量
     * @param {*} callback  回调函数
     */
    exchangeSelfEgg2Money(count, callback) {
        this.exchangeEgg2Money(count, "self", callback);
    },
    /**别人的鸡蛋兑换金币
     *
     *
     * @param {*} count  别人鸡蛋数量
     * @param {*} callback  回调函数
     */
    exchageOtherEgg2Money(count, callback) {
        this.exchangeEgg2Money(count, "other", callback);
    },

    /**兑换真鸡蛋
     *
     *
     * @param {*} count  数量
     * @param {*} callback  回调函数
     */
    exchangeEgg2Egg(code, count, callback) {
        let url = this.domain + "/exchange/exchangeEgg.action";
        let data = { uid: Global.id, num: count, code: code };
        let backData = { result: false, data: {} };
        this.request(url, data, (res) => {
            if (res.state == 200) {
                backData.result = true;
            } else {
                if (res.state == 234) {
                    backData.data = "兑换传入code不存在";
                }
            }
            if (callback)
                callback(backData);
        });
    },

    /** 兑换鸡蛋日志
     *
     *
     * @param {*} callback  回调函数
     */
    exchangeEggLog(callback) {
        let url = this.domain + "/exchange/exchangeHis.action";
        let data = { uid: Global.id };
        let backData = { result: false, data: {} };
        this.request(url, data, (res) => {
            if (res.state == 200) {
                backData.result = true;
                backData.data = [];
                for (var i = 0; i < res.data.length; i++) {
                    let item = {};
                    item.count = res.data.num;
                    item.site = res.data.addr;
                    item.time = res.data.dates;
                    backData.data.push(item);
                }
            }
            if (callback) {
                callback(backData);
            }
        });
    },
    /**获取我的装扮 */
    getMyTittivate(callback) {
        let uri = this.domain + "/shop/GetAllYourDressUp.action";
        let backData = { result: false, data: {} };
        this.request(uri, {}, (res) => {
            if (res.state == 200) {
                backData.result = true;
                backData.data.had = [];
                let data = res.data;
                if (data != null) {
                    for (var i = 0; i < data.length; i++) {
                        backData.data.had.push({
                            id: data[i].id,
                            type: data[i].clas,
                            name: data[i].name
                        });
                    }
                }
                backData.data.use = {};
                backData.data.use.hat = res.replenish[0];
                backData.data.use.glass = res.replenish[1];
                backData.data.use.hornor = res.replenish[2];
            } else {
                backData.data = res.data;
            }
            callback(backData);
        });
        // this.backData.result=true;
        // this.backData.data={had:[
        //     {id:7,type:0,name:"小帽子"},
        //     {id:10,type:0,name:"小帽子1"},
        //     {id:9,type:1,name:"小眼睛"},
        //     {id:11,type:1,name:"小眼睛2"},
        //     {id:12,type:1,name:"小眼睛3"},
        //     {id:100,type:2,name:"腰带1"},
        //     {id:101,type:2,name:"腰带2"},
        //     {id:102,type:2,name:"腰带3"},
        //     {id:103,type:2,name:"腰带4"},
        // ],use:{hat:10,glass:12,hornor:103}};

    },
    /**保存装扮 */
    saveMyTittivate(idArr, callback) {
        let url = this.domain + "/chicken/changeClothes.action";
        let data = { parameterCollection: idArr };
        let backData = { result: false };
        this.request(url, data, (res) => {
            if (res.state == 200) {
                backData.result = true;
            } else {
                backData.data = res.data;
            }
            callback(backData);
        })
    },
    /**获取所有装扮 */
    getTittivate(callback) {
        let url = this.domain + "/shop/allClothes.action";
        let backData = {};
        this.request(url, {}, (res) => {
            if (res.state == 200) {
                backData.result = true;
                backData.data = [];
                for (var i = 0; i < res.data.length; i++) {
                    backData.data.push({
                        id: res.data[i].id,
                        name: res.data[i].name,
                        desc: res.data[i].des,
                        type: res.data[i].clas,
                        price: res.data[i].price,
                    });
                }
            } else {
                backData.result = false;
                backData.data = res.data;
            }
            callback(backData);
        });
    },
    /**根据类别获取装扮 */
    getTittivateByType(type, callback) {
    },
    /**获取签到信息 */
    getSignin(callback) {
        let url = this.domain + "/signin.action";
        let backData = { result: false, data: {} };
        this.request(url, {}, (res) => {
            if (res.state == 200) {
                backData.result = true;
                backData.data = [];
                for (var i = 0; i < res.data.length; i++) {
                    if (i < res.currentPage) {
                        backData.data.push({ isFinish: true, num: res.data[i] });
                    } else {
                        backData.data.push({ isFinish: false, num: res.data[i] });
                    }
                }
            } else {
                backData.data = res.tips;
            }
            callback(backData);
        });
    },
    /**签到 */
    signin(callback) {
        let url = this.domain + "/daySignin.action";

        let backData = { result: false, data: {} };
        this.request(url, {}, (res) => {
            if (res.state == 200) {
                backData.result = true;
                backData.data = res.currentPage;
            } else {
                backData.data = res.data;
            }
            callback(backData);
        });


    },
    //给别人喂食
    giveOtherFood(targetId, goodsId, callback) {
        let url = this.domain + "/chicken/feedTheOtherChickens.action";
        let data = { fid: targetId, pid: goodsId };
        let backData = { result: false };
        this.request(url, data, (res) => {
            if (res.state == 200) {
                backData.result = true;
            }
            backData.data = res.tips.tips;

            callback(backData);
        });
    },
    /**使用蹭饭卡 */
    stealingFood(targetId, callback) {
        let url = this.domain + "/chicken/useCengMealCard.action";
        let data = { fid: targetId };
        let backData = { result: false };
        this.request(url, data, (res) => {
            if (res.state == 200) {
                backData.result = true;
            } else {
                backData.data = res.data;
            }
            callback(backData);
        });
    },
    /**请客吃饭 */
    treatFood(targetId, callback) {
        let url = this.domain + "/chicken/invite.action";
        let data = { fid: targetId };
        let backData = { result: false };
        this.request(url, data, (res) => {
            if (res.state == 200) {
                backData.result = true;
            } else {
                backData.data = res.data;
            }
            callback(backData);
        });
    },
    /**改变小鸡游戏的风格 */
    changeGameStyle(type, id, callback) {
        let url = this.domain + "/chicken/changeStyle.action";
        let data = { style: type, uid: id };
        let backData = { result: false };
        // if (type == 1) {
        //     data.style = 'B';
        // }
        this.request(url, data, (res) => {
            if (res.state == 200) {
                backData.result = true;
            } else {
                backData.data = res.data;
            }
            callback(backData);
        })
    },
    /**获取小鸡的荣誉 */
    getHornor(callback) {
        let url = this.domain + "/ChickenMeadl.action";
        let data = {};
        let backData = { result: false };
        this.request(url, data, (res) => {
            if (res.state == 200) {
                backData.result = true;
                let data = res.data;
                backData.data = {
                    isRichEgg: data.largeChicken,
                    richEggNum: data.numberOfEggs,
                    isBeautiful: data.fashionInsider,
                    beautifulNum: data.numberOfClothes,
                    isOverlap: data.helpingOthers,
                    overlapNum: data.numberOfHelpingOthers,
                    isStealEgg: data.stealAnEggExpert,
                    stealEggNum: data.stealEggCount
                };
            } else {
                backData.data = res.data;
            }
            callback(backData);
        })
    },
    //获取游戏风格
    getStyle(code, callback) {
        let url = this.domain + "/chicken/getStyle.action";
        let data = { code: code };
        let backData = { result: false, data: {} };
        this.request(url, data, (res) => {
            if (res.state == 200) {
                backData.result = true;
                backData.data.type = res.data;
                backData.data.id = res.replenish;
            }
            callback(backData);
        })



    },
    //设置游戏风格
    setStyle(style, id, callback) {
        let url = this.domain + "/chicken/SwitchToStyle.action";
        let data = { style: style, uid: id };
        let backData = { result: false, data: {} };
        this.request(url, data, (res) => {
            backData.result = true;
            if (callback)
                callback(backData);
        });

    },
    //获取是否显示不安全内容
    getIsShowUnsafeData(callback) {
        let url = this.domain + "/load/kaiguan.action";
        let data = {};
        let backData = { result: false };
        this.request(url, data, (res) => {
            if (res == 1) {
                backData.result = true;
            }
            callback(backData);
        })

    },
    /**获取背景 */
    getBGs(callback) {
        let url = this.domain + "/shop/allBackground.action";
        let data = {};
        let backData = { result: false, data: {} };
        this.request(url, data, (res) => {
            if (res.state == 200) {
                backData.result = true;
                backData.data = [];
                for (var i = 0; i < res.data.length; i++) {
                    backData.data.push({
                        id: res.data[i].id,
                        name: res.data[i].name,
                        type: res.data[i].clas,
                        description: res.data[i].des,
                        price: res.data[i].price
                    });
                }
            }
            callback(backData);
        })
    },
    getSelfBgs(callback) {
        let url = this.domain + "/shop/getBackground.action";
        let data = {};
        let backData = { result: false, data: {} };
        this.request(url, data, (res) => {
            if (res.state == 200) {
                backData.result = true;
                backData.data = [];
                if (typeof (res.data) == 'object') {
                    for (var i = 0; i < res.data.length; i++) {
                        backData.data.push({
                            id: res.data[i].id,
                            name: res.data[i].name,
                            type: res.data[i].clas,
                            description: res.data[i].des,
                            price: res.data[i].price
                        });
                    }
                }
            }
            callback(backData);
        });
    },
    /**保存场景 */
    saveBG(id, callback) {
        let url = this.domain + "/chicken/changeBackground.action";
        let data = { pid: id };
        let backData = { result: false, data: {} };
        this.request(url, data, (res) => {
            if (res.state == 200) {
                backData.result = true;
            } else {
                backData.data = res.data;
            }
            callback(backData);
        });
    },
    /**鸡蛋兑换鸡蛋2 */
    exchangeEgg2Egg2(num, callback) {
        let url = this.domain + "/exchangeEggs/createExchangeEggCode.action";
        let data = { num: num };
        let backData = { result: false, data: {} };
        this.request(url, data, (res) => {
            if (res.state == 200) {
                backData.result = true;
                backData.data = res.replenish.codes;
            }
            else {

            }
            callback(backData);
        });
    },
    getExchangeList2(callback) {
        let url = this.domain + "/exchangeEggs/exchangeHis.action";
        let data = {};
        let backData = { result: false, data: {} };
        this.request(url, data, (res) => {
            if (res.state == 200) {
                backData.result = true;
                backData.data = [];
                let sData = res.data;
                for (var i = 0; i < sData.length; i++) {
                    let item = {
                        no: sData[i].codes,
                        isCmplt: sData[i].whetherToChange,
                        time: sData[i].exchangeDate,
                        count: sData[i].exchangeNumber,
                        expritydate: sData[i].overTime,
                        servicenet: sData[i].exchangeAddr,
                        dealTime: sData[i].exchangeDate,
                    }
                    backData.data.push(item);
                }
            }
            callback(backData);
        });
    },



    //测试
    test(callback) {
        let url = this.domain + "ssm/tt.action";
        let data = { name: "张三" };
        let backData = { result: false, data: {} };
        this.request(url, data, (res) => {
            if (res.state == 200) {
                backData.result = true;
            }
            if (callback)
                callback(backData);
        });
    }
};
module.exports = Network;