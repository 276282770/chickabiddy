
var WX={
    //登录
    login:function(callback){
        let code="";
        if(cc.sys.platform==cc.sys.WECHAT_GAME){
            wx.login({
                complete:function(res){
                    code=res.code;
                    console.log("-> 登录微信成功 #"+JSON.stringify(res.code));
                    if(callback){
                        callback(code);
                    }
                },
                fail:function(err){
                    console.log("->x 登录微信失败 #"+JSON.stringify(err));
                }
            })
        }else{
            console.log("-> 平台不是微信，不支持微信登录");
        }
        return code;
    },
    //HTTP发送
    request:function(url,data,method,success,fail){
        if(cc.sys.platform==cc.sys.WECHAT_GAME){
            console.log("*< URL:"+url+",data:"+JSON.stringify(data));
            wx.request({
                url:url,
                data:data,
                method:method,
                success:function(res){
                    var data=res.data;
                    console.log("*> "+JSON.stringify(data));
                    if(success)
                    success(data);
                },
                fail:function(err){
                    console.log("*>x "+JSON.stringify(err));
                    if(fail)
                    fail(err);
                }
            });
            
        }else{
            console.log("->平台不是微信，不支持微信Http方法");
        }
    },

    //创建用户信息按钮
    createUserInfoButton(callback){
        var userInfoButton;
        var userInfo;
        if(cc.sys.platform==cc.sys.WECHAT_GAME){
            userInfoButton= wx.createUserInfoButton({
                type:'image',
                text:'',
                image:'res/userInfoButton',
                style: {
                    left: 0,
                    top: 0,
                    width: 400,
                    height: 800,
                    lineHeight: 40,
                    backgroundColor: '#ff0000',
                    color: '#ffffff',
                    textAlign: 'center',
                    fontSize: 16,
                    borderRadius: 4,
                    borderWidth:2,
                }
            });
            userInfoButton.onTap((res)=>{
                userInfo=res.userInfo;
                userInfoButton.hide();
                console.log("->【获得用户信息】："+JSON.stringify(userInfo));
                if(callback){
                    callback(userInfo);
                }
            });
        }else{
            console.log("->平台不是微信，无法创建用户信息按钮");
        }
        return userInfo;
    },
    getUserInfo(callback){
        if(cc.sys.platform==cc.sys.WECHAT_GAME){
            wx.getUserInfo({
                success:function(res){
                    console.log("->【获取微信用户信息】"+JSON.stringify(res));
                    if(callback){
                        callback(res.userInfo);
                    }
                },
                fail:function(err){
                    console.log("-x>【获取微信用户信息】"+JSON.stringify(err));
                },
            });
        }
    },
    //获得授权信息
    getSetting(callback){
        var isAuthGetUserInfo=false;
        if(cc.sys.platform==cc.sys.WECHAT_GAME){
            wx.getSetting({
                success:function(res){
                    console.log(JSON.stringify(res.authSetting));
                    if(res.authSetting['scope.userInfo'])
                    isAuthGetUserInfo=res.authSetting['scope.userInfo'];
                    if(callback){
                        callback(isAuthGetUserInfo);
                    }
                   console.log("->【是否授权获得用户信息】:"+isAuthGetUserInfo );
                },
            });
        }else{
            console.log("->平台不是微信，无法获得授权用户信息");
        }
        return isAuthGetUserInfo;
    },
    //设置用户
    setUserStorage(){
        if(cc.sys.platform==cc.sys.WECHAT_GAME){
            
        }
    },
    //开放数据域接收主域消息
    onMessage(callback){
        if(cc.sys.platform==cc.sys.WECHAT_GAME){
        wx.onMessage((data)=>{
            callback(data);
            console.log("^> "+JSON.stringify(data));
        });
        
        }
    },
    //主域想开放数据域发送消息
    postMessage(data){
        if(cc.sys.platform==cc.sys.WECHAT_GAME){
        wx.postMessage(data);
        console.log("^< "+JSON.stringify(data));
        }
    },
    //设置自己的成绩
    setUserCloudStorage(num){
        let time=Date.now();
        var data={wxgame:{score:num,update_time:time}};
        var kvDataList=[{key:"score",value:JSON.stringify(data)}];
        // var kvDataList=[{key:"score",value:num}];
        if(cc.sys.platform==cc.sys.WECHAT_GAME){
        wx.setUserCloudStorage({
            KVDataList:kvDataList,
            success:function(res){
                console.log("->【设置自己成绩】"+JSON.stringify(res));
            },
            fail:function(err){
                console.log("-X>【设置自己成绩】"+JSON.stringify(err));
            }
        });
    }
    },
    //获得自己的成绩数据
    getUserCloudStorage(callback){
        if(cc.sys.platform==cc.sys.WECHAT_GAME){
            wx.getUserCloudStorage({
                keyList:["score"],
                success:function(res){
                    if(callback){
                        callback(res.KVDataList);
                    }
                    console.log("->【获取个人数据】"+JSON.stringify(res));
                },
                fail:function(err){
                    console.log("X->【获取个人数据】"+JSON.stringify(err));
                },
            });
        }
    },
    //获取好友数据
    getFriendCloudStorage(callback){
        if(cc.sys.platform==cc.sys.WECHAT_GAME){
            console.log("<- 获取好友数据");
            wx.getFriendCloudStorage({
                keyList:["score"],
                success:function(res){
                    if(callback){
                        callback(res.data);
                        console.log("-> 获取好友数据："+JSON.stringify(res));
                    }
                },
            });
        }
    },
    //分享
    shareAppMessage(title,imageUrl,query){
        if(cc.sys.platform==cc.sys.WECHAT_GAME){
        wx.shareAppMessage({
            title:title,
            imageUrl:imageUrl,
            query:query 
        });
        console.log("<-【分享】"+query);
        }
    },
    //回到前台
    onShow(callback){
        if(cc.sys.platform==cc.sys.WECHAT_GAME){
        wx.onShow(function(res){
            console.log("->【回到前台】"+JSON.stringify(res));
            if(callback){
                callback(res.query);
                
            }
           
        });
        }
    },

    //启动参数
    getLaunchOptionsSync(){
        if(cc.sys.platform==cc.sys.WECHAT_GAME){
            var obj=wx.getLaunchOptionsSync().query;
            console.log("->【微信启动参数】"+JSON.stringify(obj));
            return obj;
        }
    },
    //跳转到别的微信小程序
    navigateToMiniProgram(appid,success,fail){
        if(cc.sys.platform==cc.sys.WECHAT_GAME){
            console.log("<-【跳转小程序】appid："+appid);
            wx.navigateToMiniProgram({
                appId:appid,
                success:function(res){
                    if(success){
                        success(res);
                    }
                    console.log("->【跳转小程序】"+JSON.stringify(res));
                },
                fail:function(err){
                    if(fail){
                        fail(err);
                    }
                    console.log("-X>【跳转小程序】"+JSON.stringify(err));
                }
            });
        }else{
            console.log("^>不是微信平台，不可以跳转别的微信小程序");
        }
        /*
            game.json中添加
            "navigateToMiniProgramAppIdList": [
                "appid"
            ]
        */
    },
};

module.exports=WX;
