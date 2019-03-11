var WX=require("WX");
var Network={
    // domain:"",
    domain:"45.40.247.177/",  //域名

    //封装微信http协议
    request(url,data,success){
        WX.request(url,data,"POST",success);
    },
    //请求首页信息
    requestIndexInfo:function(callback){
        let data={eggSelf:-1,eggOther:-1};
        let url="";

        callback(data);
    },
    //请求公告信息
    requestAnnouncement:function(callback){

    },
    //请求好友信息
    requestFriendList:function(page,callback){
        let url=domain+"friend/getFriendList.action";
        let data={uid:Global.id,currentPage:page};
        var self=this;
        request(url,data,(res)=>{
            let backData={};
            if(res.state==200){
                backData.result=true;
                backData.data={};
                backData.data.friends=[];
                for(var i=0;i<res.data.length;i++){
                    let friend={};
                    friend.id=res.data[i].fid;
                    friend.nickName=res.data[i].nickName;
                    friend.avatar=res.data[i].logoUrl;
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
        let url=domain+"friend/addFriend.action";
        let data={uid:Global.id,fid:id};
        var backData={result:false,data:null};
        request(url,data,(res)=>{
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
        let url=domain+"friend/delFriend.action";
        let data={uid:Global.id,fid:id};
        var backData={result:false,data:null};
        request(url,data,(res)=>{
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
        let url=domain+"friend/findFriend.action";
        let data={uid:Global.id,fid:id};
        request(url,data,(res)=>{
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

    //查看世界消息
    //@page 分页
    //@mid  消息ID
    requestWorldMsg(page,mid,callback){
        let url=domain+"msg/getWorldMsg.action";
        let data={msg:"getWorldMsg",currentPage:page,worldId:mid};
        var backData={result:false,data:null};
        request(url,data,(res)=>{
            if(res.state==200){
                //有问题
            }
        });
    },
    //发送世界消息
    requestSendWorldMsg(msg,callback){
        let url=domain+"msg/sendWorldMsg.action";
        let data={uid:Global.id,msg:msg};
        var backData={result:false,data:null};
        request(url,data,(res)=>{
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
        let url=domain+"msg/sendMsg.action";
        let data={uid:Global.id,fid:id,msg:msg};
        var backData={result:false,data:null};
        request(url,data,(res)=>{
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
        
    }
};
module.exports=Network;