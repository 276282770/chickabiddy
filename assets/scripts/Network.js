var WX=require("WX");
var Network={
    // domain:"",
    domain:"http://132.232.211.116/",  //域名

    //封装微信http协议
    request(url,data,success){
        WX.request(url,data,"POST",success);
    },
    /**登录
     * @param  {string} code 微信code
     * @param  {function} callback 回调函数
     */
    requestLogin(code,avatar,nickName,callback){
        let url=this.domain+"load/load.action";
        let data={code:code,url:avatar,nickName:nickName};
        let backData={result:false,data:null};
        this.request(url,data,(res)=>{
            if(res.state==200){
                backData.result=true;
                backData.data={};
                backData.data.id=res.data.uid;  //id
                backData.data.lvl=res.data.level;  //等级
                backData.data.lvlProg=res.data.exp_pre;  //下一等级进度
                backData.data.selfEggNum=res.data.ouerself;  //自己鸡蛋个数
                backData.data.otherEggNum=res.data.steal;  //别人鸡蛋个数
                backData.data.eggNum=res.data.waitGet;  //未收鸡蛋个数
                backData.data.eggProg=res.data.age_pre;  //下一个鸡蛋出生进度
                backData.data.money=res.data.money;  //钱
                backData.data.cleanProg=res.data.clean_pre;  //干净进度
                backData.data.foodRemain=res.data.howLongEat;  //食物剩余可以吃的时间
                backData.data.foodProg=res.data.howLongEat_pre;  //食物进度
                backData.data.newDetail=res.data.unRead_dongtai;  //新动态
                backData.data.newAnnouncement=res.data.unRead_gonggao;  //新公告
                // backData.data.newWorldMsg=res.data.unRead_world;

                Global.id=backData.data.id;
            }
        });
    },
    //请求首页信息
    requestIndexInfo:function(callback){
        let data={eggSelf:-1,eggOther:-1};
        let url="";

        callback(data);
    },
    //请求公告信息
    requestAnnouncement:function(callback){
        let url=this.domain+"gonggao/getGonggao.action";
        let data={data:"getGonggao"};
        let backData={result:false,data:null};
        this.request(url,data,(res)=>{
            if(res.state==200){
                backData.result=true;
                backData.data={};
                backData.data.date=res.data.time;
                backData.data.text=res.data.text;
            }else{
                backData.data="";
            }
            if(callback)
                callback(backData);
        });
    },
    //请求好友信息
    requestFriendList:function(page,callback){
        let url=this.domain+"friend/getFriendList.action";
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
                    friend.avatar=res.data[i].logoUrl;  //头像
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
        let url=this.domain+"friend/addFriend.action";
        let data={uid:Global.id,fid:id};
        var backData={result:false,data:null};
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
        let url=this.domain+"friend/delFriend.action";
        let data={uid:Global.id,fid:id};
        var backData={result:false,data:null};
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
        let url=this.domain+"friend/findFriend.action";
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
        let backData=-1;

        callback(backData);
    },
    //吃饭
    requestDine(id,callback){
        let url=this.domain+"chicken/checkEat.action";
        let data={uid:Global.id,pid:id};
        let backData={result:false,data:null};
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
    //饭被偷吃，揍一顿
    //@id  被揍id
    requestHit(id,callback){
        let url=this.domain+"chicken/Hit.action";
        let data={uid:Global.id,fid:id};
        let backData={result:false,data:null};
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
        let url=this.domain+"chicken/Qugan.action";
        let data={uid:Global.id,fid:id};
        let backData={result:false,data:null};
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
        let url=this.domain+"age/sellAge.action";
        let data={uid:Global.id,goodAge:selfEggNum,badAge:otherEggNum};
        let backData={result:false,data:null};
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
        let url=this.domain+"xizao/userself.action";
        let data={uid:Global.id};
        let backData={result:false,data:null};
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
        let url=this.domain+"xizao/help.action";
        let data={uid:Global.id,fid:id};
        let backData={result:false,data:null};
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
        let url=this.domain+"rank/getWorldRank.action";
        let data={data:"worldRank",currentPage:page};
        let backData={result:false,data:null};
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
        let url=this.domain+"msg/getWorldMsg.action";
        let data={msg:"getWorldMsg",currentPage:page,worldId:mid};
        var backData={result:false,data:null};
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
        let url=this.domain+"shop/buyProp.action";
        let data={uid:Global.id,propId:id,num:count};
        let backData={result:false,data:null};
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
    /**商店
     * @param  {function} callback 返回
     */
    requestShop(callback){
        let url=this.domain+"shop/shop.action";
        let data={data:"shop"};
        let backData={result:false,data:null};
        this.request(url,data,(res)=>{
            if(res.state==200){
                backData.result=true;
                backData.data=[];
                for(var i=0;i<res.data.length;i++){
                    let item={};
                    item.id=res.data[i].sid;
                    item.name=res.data[i].name;
                    item.price=res.data[i].price;
                    item.durable=res.data[i].time;
                    item.description=res.data[i].describe;
                    backData.data.push(item);
                }
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
        let url=this.domain+"";
        let data={uid:Global.id};
        let backData={result:false,data:null};
        this.request(url,data,(res)=>{
            if(res.state==200){
                backData.result=true;
                backData.data=[];

            }else{
                backData.data="";
            }
            if(callback)
                callback(backData);
        });
    },
    //发送世界消息
    requestSendWorldMsg(msg,callback){
        let url=this.domain+"msg/sendWorldMsg.action";
        let data={uid:Global.id,msg:msg};
        var backData={result:false,data:null};
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
        let url=this.domain+"msg/sendMsg.action";
        let data={uid:Global.id,fid:id,msg:msg};
        var backData={result:false,data:null};
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
    //测试
    test(callback){
        let url=this.domain+"ssm/tt.action";
        let data={name:"张三"};
        let backData={result:false,data:null};
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