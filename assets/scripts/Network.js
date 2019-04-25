var WX=require("WX");
var Network={
    // domain:"",
    domain:"http://xj.xiajiwangluo.com",  //域名

    //封装微信http协议
    request(url,data,success){
        WX.request(url,data,"POST",success);
    },
    /**登录
     * @param  {string} code 微信code
     * @param  {function} callback 回调函数
     */
    requestLogin(code,avatar,nickName,callback){
        let url=this.domain+":83/load/load.action";
        let data={code:code,url:avatar,nickName:nickName};
        let backData={result:false,data:{}};

        Global.user.nickName=nickName;
        Global.user.avatar=avatar;


        this.request(url,data,(res)=>{
            if(res.state==200){
                backData.result=true;
                // backData.data={};
                backData.data.id=res.data.uid;  //id
                backData.data.lvl=res.data.level;  //等级
                backData.data.lvlExp=res.data.currentExp;  //经验
                backData.data.lvlFullExp=res.data.maxExp;  //升级所需经验
                // backData.data.lvlProg=res.data.currentExp/res.data.maxExp;  //下一等级进度
                backData.data.selfEggNum=res.data.goodEgg;  //自己鸡蛋个数
                backData.data.otherEggNum=res.data.badEgg;  //别人鸡蛋个数
                backData.data.eggNum=res.data.waitGetEgg;  //未收鸡蛋个数
                // backData.data.eggProg=res.data.age_pre;  //下一个鸡蛋出生进度
                backData.data.eggProgCurr=res.data.eggTime;  //鸡蛋已经成熟时间
                backData.data.eggProgFull=res.data.totalEggTime;  //鸡蛋成熟总时间
                backData.data.money=res.data.money;  //钱
                // backData.data.cleanProg=res.data.clean_pre;  //干净进度
                backData.data.cleanProgCurr=res.data.clean;
                backData.data.cleanProgFull=86400;

                backData.data.foodRemain=res.data.totalEatTime;  //食物剩余可以吃的时间
                backData.data.foodProgFull=res.data.resEatTime;  //食物进度
                // backData.data.foodProg=res.data.howLongEat_pre;  //食物进度
                backData.data.newDetail=res.data.unRead_dongtai;  //新动态
                backData.data.newAnnouncement=res.data.unRead_gonggao;  //新公告
                // backData.data.newWorldMsg=res.data.unRead_world;
                backData.data.state=0;
                if(res.data.die==1)
                backData.data.state=1;

                Global.id=backData.data.id;
            }else{
                backData.data="";
            }
            if(callback)
                callback(backData);
        });
    },
    //请求首页信息
    requestIndexInfo:function(callback){
        let data={uid:Global.id};
        let url=this.domain+":83/load/load.action";
        let backData={result:false,data:{}};
        this.request(url,data,(res)=>{
            if(res.state==200){
                backData.result=true;
                // backData.data={};
                backData.data.id=res.data.uid;  //id
                backData.data.lvl=res.data.level;  //等级
                backData.data.lvlExp=res.data.currentExp;  //经验
                backData.data.lvlFullExp=res.data.maxExp;  //升级所需经验
                // backData.data.lvlProg=res.data.currentExp/res.data.maxExp;  //下一等级进度
                backData.data.selfEggNum=res.data.goodEgg;  //自己鸡蛋个数
                backData.data.otherEggNum=res.data.badEgg;  //别人鸡蛋个数
                backData.data.eggNum=res.data.waitGetEgg;  //未收鸡蛋个数
                // backData.data.eggProg=res.data.age_pre;  //下一个鸡蛋出生进度
                backData.data.eggProgCurr=res.data.eggTime;  //鸡蛋已经成熟时间
                backData.data.eggProgFull=res.data.totalEggTime;  //鸡蛋成熟总时间
                backData.data.money=res.data.money;  //钱
                // backData.data.cleanProg=res.data.clean_pre;  //干净进度
                backData.data.cleanProgCurr=res.data.clean;
                backData.data.cleanProgFull=86400;

                backData.data.foodRemain=res.data.totalEatTime;  //食物剩余可以吃的时间
                backData.data.foodProgFull=res.data.resEatTime;  //食物进度
                // backData.data.foodProg=res.data.howLongEat_pre;  //食物进度
                backData.data.newDetail=res.data.unRead_dongtai;  //新动态
                backData.data.newAnnouncement=res.data.unRead_gonggao;  //新公告
                // backData.data.newWorldMsg=res.data.unRead_world;
                backData.data.state=0;
                if(res.data.die==1)
                backData.data.state=1;

                Global.id=backData.data.id;
            }else{
                backData.data="";
            }
            if(callback)
                callback(backData);
        });
    },
    //请求公告信息
    requestAnnouncement:function(callback){
        let url=this.domain+"/gonggao/getGonggao.action";
        let data={uid:Global.id};
        let backData={result:false,data:{}};
        this.request(url,data,(res)=>{
            if(res.state==200){
                backData.result=true;
                backData.data={};
                backData.data.date=res.data.time;
                backData.data.text=res.data.text;
                backData.data.imgUrl=res.data.url;
            }else{
                backData.data="";
            }
            if(callback)
                callback(backData);
        });
    },
    //请求好友信息
    requestFriendList:function(page,callback){
        let url=this.domain+"/friend/getFriendList.action";
        let data={uid:Global.id,currentPage:page};
        var self=this;
        this.request(url,data,(res)=>{
            let backData={};
            if(res.state==200){
                backData.result=true;
                backData.data={};
                backData.data.friends=[];
                for(var i=0;i<res.data.length;i++){
                    let friend={};
                    friend.id=res.data[i].fid;
                    friend.nickName=res.data[i].nickName;  
                    friend.lvl=res.data[i].level;  //等级
                    friend.avatar=res.data[i].url;  //头像
                    friend.isHelpBath=res.data[i].xizao==1; //是否可以洗澡
                    friend.isStealEgg=res.data[i].toudan==1;  //是否可以偷蛋
                    friend.isStealFood=res.data[i].food==1;  //是否可以偷饭
                    friend.isOtherStealFood=res.data[i].qugan==1;  //是否被人正在偷饭
                    backData.data.friends.push(friend);
                }
                backData.data.page=res.currentPage;
            }else{
                backData.result=false;
                backData.data="";  //以后更改
            }
            callback(backData);
        });
    },
    //添加好友
    requestAddFriend(id,callback){
        let url=this.domain+"/friend/addFriend.action";
        let data={uid:Global.id,fid:id};
        var backData={result:false,data:{}};
        this.request(url,data,(res)=>{
            if(res.state==200){
                backData.result=true;
                backData.data=true;
            }else{
                backData.data="";  //
            }
            callback(backData);
        });
    },
    //删除好友
    requestDelFriend(id,callback){
        let url=this.domain+"/friend/delFriend.action";
        let data={uid:Global.id,fid:id};
        var backData={result:false,data:{}};
        this.request(url,data,(res)=>{
            if(res.state==200){
                backData.result=true;
                backData.data=true;
            }else{
                backData.data="";
            }
            callback(backData);
        });
    },
    //查询指定用户是否是自己好友
    requestIsFriend(id,callback){
        let url=this.domain+"/friend/findFriend.action";
        let data={uid:Global.id,fid:id};
        this.request(url,data,(res)=>{
            var backData={};
            backData.result=false;
            backData.data=false;
            if(res.state==200)
                {
                    backData.result=true;
            if(res.data==1){
                
                backData.data=true;
            }
            }
            callback(backData);
        });
    },
    //收鸡蛋
    requestPickEgg(callback){
        let url=this.domain+"/egg/shoudan.action";
        let data={uid:Global.id};
        this.request(url,data,(res)=>{
            var backData={};
            backData.result=false;
            backData.data=false;
            if(res.state==200){
                backData.result=true;
            }else{
                // switch(res.state){
                    
                // }
                backData.data=res.tips.tips;
            }
            if(callback)
            callback(backData);
        });
    },
    //吃饭
    requestDine(id,callback){
        let url=this.domain+":82/chicken/checkEat.action";
        let data={uid:Global.id,pid:id};
        let backData={result:false,data:{}};
        this.request(url,data,(res)=>{
            if(res.state==200){
                backData.result=true;
                backData.data.id=id;
                backData.data=res.tips.tips;
            }else{
                backData.data=res.tips.tips;

                switch(res.state){
                    case 214:backData.data="喂食失败 清洁度不够";break;
                }
            }
            if(callback)
                callback(backData);
        });
    },
    //洗澡
    requestBath(callback){
        let url=this.domain+":81/xizao/userself.action";
        let data={uid:Global.id};
        let backData={result:false,data:{}};
        this.request(url,data,(res)=>{
            if(res.state==200){
                backData.result=true;
            }else{
                backData.data=res.tips.tips;
            }
            if(callback)
                callback(backData);
        });
    },
    //帮别人洗澡
    requestBathHelp(id,callback){
        let url=this.domain+":81/xizao/help.action";
        let data={uid:Global.id,fid:id};
        let backData={result:false,data:{}};
        this.request(url,data,(res)=>{
            if(res.state==200){
                backData.result=true;
            }else{
                let tip="";
                // switch(res.state){
                //     case 214:tip="喂食失败 清洁度不够";break;
                // }
                backData.data=tip;
            }
            if(callback)
                callback(backData);
        });
    },
    //饭被偷吃，揍一顿
    //@id  被揍id
    requestHit(id,callback){
        let url=this.domain+":82/chicken/Hit.action";
        let data={uid:Global.id,fid:id};
        let backData={result:false,data:{}};
        this.request(url,data,(res)=>{
            if(res.state==200){
                backData.result=true;
                backData.data="";
            }else{
                backData.data="";
            }
            if(callback)
                callback(backData);
        });
    },
    //饭被偷吃，赶走
    //@id  偷吃者id
    requestDriveOff(id,callback){
        let url=this.domain+":82/chicken/Qugan.action";
        let data={uid:Global.id,fid:id};
        let backData={result:false,data:{}};
        this.request(url,data,(res)=>{
            if(res.state==200){
                backData.result=true;
            }else{
                backData.data="";
            }
            if(callback)
                callback(backData);
        });
    },
    //买鸡蛋
    //@selfEggNum  自己的鸡蛋
    //@otherEggNum  偷来的鸡蛋
    requestSaleEgg(selfEggNum,otherEggNum,callback){
        let url=this.domain+"/age/sellAge.action";
        let data={uid:Global.id,goodAge:selfEggNum,badAge:otherEggNum};
        let backData={result:false,data:{}};
        this.request(url,data,(res)=>{
            if(res.state==200){
                backData.result=true;
                backData.data="";
            }else{
                backData.data="";
            }
            if(callback)
                callback(backData);
        });
    },
    /**洗澡
     * @param  {} callback  返回
     */
    requestTackABath(callback){
        let url=this.domain+":81/xizao/userself.action";
        let data={uid:Global.id};
        let backData={result:false,data:{}};
        this.request(url,data,(res)=>{
            if(res.state==200){
                backData.result=true;
            }else{
                backData.data="";
            }
            if(callback)
                callback(backData);
        });
    },
    /**帮别人洗澡
     * @param  {int} id  被洗澡id
     * @param  {Function} callback  返回
     */
    requestHelpTackABath(id,callback){
        let url=this.domain+":81/xizao/help.action";
        let data={uid:Global.id,fid:id};
        let backData={result:false,data:{}};
        this.request(url,data,(res)=>{
            if(res.state==200){
                backData.result=true;
                backData.data="";
            }else{
                backData.data="";
            }
            if(callback)
                callback(backData);
        });
    },
    /**查看世界排行榜
     * @param  {int} page  页
     * @param  {function} callback  返回
     */
    requestWorldRankList(page,callback){
        let url=this.domain+"/rank/getWorldRank.action";
        let data={data:"worldRank",currentPage:page};
        let backData={result:false,data:{}};
        this.request(url,data,(res)=>{
            if(res.state==200){
                backData.result=true;
                backData.data={};
                for(var i=0;i<res.data.length;i++){
                    let item={};
                    item.num=res.data[i].rank;  //名次
                    item.lvl=res.data[i].level;  //用户等级
                    item.id=res.data[i].rid;  //用户id
                    item.name=res.data[i].nickName;  //昵称
                    item.avatar=res.data[i].url;  //头像地址
                    backData.data.push(item);
                }
            }else{
                backData.data="";
            }
            if(callback)
                callback(backData);
        });
    },



    //查看世界消息
    //@page 分页
    //@mid  消息ID
    requestWorldMsg(page,mid,callback){
        let url=this.domain+"/msg/getWorldMsg.action";
        let data={msg:"getWorldMsg",currentPage:page,worldId:mid};
        var backData={result:false,data:{}};
        this.request(url,data,(res)=>{
            if(res.state==200){
                //有问题
            }
        });
    },
    /**购买商品
     * @param  {int} id 商品id
     * @param  {int} count 商品数量
     * @param  {function} callback  返回
     */
    requestBuy(id,count,callback){
        let url=this.domain+":81/shop/buyProp.action";
        let data={uid:Global.id,pid:id,num:count};
        let backData={result:false,data:{}};
        this.request(url,data,(res)=>{
            if(res.state==200){
                backData.result=true;
                backData.result="购买成功";
            }else{
                let err="";
                switch(state){
                    case 222:err="购买商品不存在";break;
                }

                backData.data=err;
            }
            if(callback)
                callback(backData);
        });
    },
    /**商店
     * @param  {function} callback 返回
     */
    requestShop(tp,callback){
        let url=this.domain+":81/shop/shop.action";
        let data={uid:Global.id,cls:tp};
        let backData={result:false,data:{}};
        this.request(url,data,(res)=>{
            if(res.state==200){
                backData.result=true;
                backData.data=[];
                for(var i=0;i<res.data.length;i++){
                    let item={};
                    item.id=res.data[i].id;
                    item.name=res.data[i].name;
                    item.price=res.data[i].price;
                    item.durable=res.data[i].time;
                    item.description=res.data[i].des;
                    backData.data.push(item);
                }
            }else{
                backData.data="";
            }
            if(callback)
                callback(backData);
        });
    },
    /**
     *获取单个商品详情
     *
     * @param {*} id  商品ID
     * @param {*} callback  回调
     */
    requestShopGoodsById(id,callback){
        let url=this.domain+":81/shop/selectOne.action";
        let data={pid:id};
        let backData={result:false,data:{}};
        this.request(url,data,(res)=>{
            if(res.state==200){
                backData.result=true;
                backData.data.id=res.data.id;
                backData.data.name=res.data.name;
                backData.data.price=res.data.price;
                backData.data.durable=res.data.time;
                backData.data.description=res.data.des;
                backData.data.had=res.data.num>0;

            }else{
                backData.data="";
            }
            if(callback)
                callback(backData);
        });
    },
        //获取道具
        requestGetPropLst(callback){
            let url=this.domain+":81/shop/prop.action";
            let data={uid:Global.id,cls:2};
            var backData={result:false,data:[]};
            this.request(url,data,(res)=>{
                if(res.state==200){
                    backData.result=true;
                    for(var i=0;i<res.data.length;i++){
                        let item={};
                        item.id=res.data[i].pid;
                    item.name=res.data[i].name;
                    item.desc=res.data[i].desc;
                    item.price=res.data[i].price;
                    item.had=res.data[i].num>0;
                    backData.data.push(item);
                    }
                    
                }else{
                    backData.data="";
                }
                if(callback)
                    callback(backData);
            });
        },
        //使用道具
        requestUseProp(id,callback){
            let url=this.domain+":82/chicken/use.action";
            let data={uid:Global.id,pid:id};
            var backData={result:false,data:{}};
            this.request(url,data,(res)=>{
                if(res.state==200){
                    backData.result=true;
                    backData.data=res.tips.tips;
                }else{
                    backData.data="";
                }
                if(callback)
                    callback(backData);
            });
        },
    /**请求背包列表
     * @param  {function} callback 回调函数
     */
    requestPackage(callback){
        let url=this.domain+":81/shop/back.action";
        let data={uid:Global.id,cls:1};
        let backData={result:false,data:{}};
        this.request(url,data,(res)=>{
            if(res.state==200){
                backData.result=true;
                backData.data=[];
                for(var i=0;i<res.data.length;i++){
                    let item={};
                    item.id=res.data[i].pid;
                    item.name=res.data[i].name;
                    item.descript=res.data[i].des;
                    item.count=res.data[i].num;
                    backData.data.push(item);
                }
            }else{
                backData.data="";
            }
            if(callback)
                callback(backData);
        });
    },
    //发送世界消息
    requestSendWorldMsg(msg,callback){
        let url=this.domain+"/msg/sendWorldMsg.action";
        let data={uid:Global.id,msg:msg};
        var backData={result:false,data:{}};
        this.request(url,data,(res)=>{
            if(res.state==200){
                backData.result=true;
                backData.data=true;
            }else{
                backData.data="";
            }
            if(callback)
                callback(backData);
        });
    },
    //发送消息
    requestSendMsg(id,msg,callback){
        let url=this.domain+"/msg/sendMsg.action";
        let data={uid:Global.id,fid:id,msg:msg};
        var backData={result:false,data:{}};
        this.request(url,data,(res)=>{
            if(res.state==200){
                backData.result=true;
                backData.data=true;
            }else{
                backData.data="";
            }
            if(callback)
                callback(backData);
        });
    },
    //查看消息
    requestQueryMsglst(id,page,callback){
        
    },
    //获取动态（日志）
    requestDetailLog(callback){
        let url=this.domain+"/dongtai/getdongtai.action";
        let data={uid:Global.id};
        var backData={result:false,data:{}};
        this.request(url,data,(res)=>{
            if(res.state==200){
                backData.result=true;
                backData.data=res.data;
            }else{
                backData.data="";
            }
            if(callback)
                callback(backData);
        });
    },
    //获取问题题目
    requestAnswerLst(callback){
        let url=this.domain+":81/question/question.action";
        let data={uid:Global.id};
        var backData={result:false,data:{}};
        this.request(url,data,(res)=>{
            if(res.state==200){
                backData.result=true;
                backData.data.id=res.data.id;
                backData.data.q=res.data.title;
                backData.data.a0=res.data.answera;
                backData.data.a1=res.data.answerb;
                backData.data.a2=res.data.answerc;
                backData.data.a3=res.data.answerd;
            }else{

                backData.data="";
            }
            if(callback)
                callback(backData);
        });
    },
    //答题
    requestAnswer(id,a,callback){
        let url=this.domain+":81/question/userAnswer.action";
        let s=['A','B','C','D'];
        let data={uid:Global.id,qid:id,choice:s[a]};
        var backData={result:false,data:{}};
        this.request(url,data,(res)=>{
            if(res.state==200){
                backData.result=true;
                
            }
            backData.data.say=res.data.tips;
                backData.data.award=res.data.text;
            if(callback)
                callback(backData);
        });
    },
    /**
     *查看任务
     *
     * @param {*} callback 回调函数
     */
    requestMission(callback){
        let url=this.domain+":81/share/task.action";
        let data={uid:Global.id};
        let backData={result:false,data:{}};
        this.request(url,data,(res)=>{
            if(res.state==200){
                backData.result=true;
                backData.data.miss0Cmplt=res.data.share==1;
                backData.data.miss1Cmplt=res.data.question==1;
            }
            if(callback){
                callback(backData);
            }
        });
    },
    /**
     *分享
     *
     * @param {*} callback 回调函数
     */
    requestShare(callback){
        let url=this.domain+":81/share/share.action";
        let data={uid:Global.id};
        let backData={result:false,data:{}};
        this.request(url,data,(res)=>{
            if(res.state==200){
                backData.result=true;
                
            }
            backData.data.title=res.data.text;
            backData.data.imageUrl=res.data.url;
            if(callback)
                callback(backData);
        });
    },
    //点击小鸡说的话
    requestClickPlayer(callback){
        let url=this.domain+":83/load/click.action";
        let data={uid:Global.id};
        let backData={result:false,data:{}};
        this.request(url,data,(res)=>{
            if(res.state==200){
                backData.result=true;
                backData.data.text=res.tips.tips;
            }
            if(callback)
                callback(backData);
        });
    },

    /**
     *驱赶
     *
     * @param {*} id  小偷ID
     * @param {*} callback 回调函数
     */
    requestThiefOut(id,callback){
        let url=this.domain+":82/chicken/Qugan.action";
        let data={uid:Global.id,fid:id};
        let backData={result:false,data:{}};
        this.request(url,data,(res)=>{
            if(res.state==200){
                backData.result=true;
                backData.data.say=res.data.beiqugan.tips;
                backData.data.playerSay=res.qugan.tips;
                backData.data.awardTxt=res.qugan.text;
            }else{
                backData.data="";
            }
            if(callback)
                callback(backData);
        });
    },
    
    //测试
    test(callback){
        let url=this.domain+"ssm/tt.action";
        let data={name:"张三"};
        let backData={result:false,data:{}};
        this.request(url,data,(res)=>{
            if(res.state==200){
                backData.result=true;
            }
            if(callback)
                callback(backData);
        });
    }
};
module.exports=Network;