var WX=require("WX");
var Network={
    // domain:"http://47.101.172.239:8080/",
    domain:"https://lbdh.quanbaoma.com/",
 //发送微信Code
 sendCode(code,fid,type,callback){
    let url=this.domain+"wx/code2token";
    let data={Code:code,Fid:fid,Type:type};
    
    WX.request(url,data,"POST",function(data){
        if(data.Result===0){
            Global.id=data.Data.Uid;
            Global.isNew=data.Data.IsNew;
           
            if(callback)
                callback(true);
        }else{
            if(callback)
                callback(false);
        }
    })
},
    //发送自己的信息
    sendUserInfo:function(userInfo){
        //nickname,avatar,gender,fid,uid
        let url=this.domain+"wx/login";
        let data={Nickname:userInfo.nickName,Avatar:userInfo.avatarUrl,Gender:userInfo.gender,Uid:Global.id};
        WX.request(url,data,"POST",function(res){});
    },
     //更新玩家信息
     requestPlayerInfo:function(callback){
        let url=this.domain+"userInfo";
        let data={Uid:Global.id};
        WX.request(url,data,"POST",function(data){
            if(data.Result===0){
                if(callback)
                callback(data.Data);
            }
            
        });
    },
    //作物卖出
    sellCrop:function(callback){
        let url=this.domain+"vegetable/sell-all";
        let data={Uid:Global.id};
        WX.request(url,data,"POST",function(data){
            if(callback)
            callback(data);
        });
    },
    //购买物品
    buyGoods(goodsId,count,callback){
        let url=this.domain+"goods/buy";
        let data={Uid:Global.id,GoodsId:goodsId,Num:count};
        WX.request(url,data,"POST",function(data){
            if(callback){
                callback({result:data.Result==0,err:data.Description});
            }
        })
    },
    //开垦土地
    buyLand(landId,callback){
        let url=this.domain+"reclaimland";
        let data={Uid:Global.id,Lid:landId};
        WX.request(url,data,"POST",function(data){
            let err=data.Description;
            if(callback){
                callback({result:data.Result==0,err:err});
            }
        });
    },
    //土地升级
    upLand(landNo,callback){
        let url=this.domain+"landLvUp";
        let data={Uid:Global.id,LandNo:landNo};
        WX.request(url,data,"POST",function(data){
            if(callback){
                callback(data);
            }
        });
    },
    //种下种子
    plantSeed(seedId,landId,callback){
        let url=this.domain+"plant2";
        let data={UId:Global.id,LandId:landId,GoodsId:seedId};
        WX.request(url,data,"POST",function(data){
            if(callback){
                
                    callback(data);
                // callback({speed:1/data.Data.GrowTimes,
                // times:data.Data.LastGetCount,
                // growCount:data.Data.GetTotalNum,
                // id:data.Data.VegetableId,
            // });
        
            }
        });
    },
    //种子升级
    seedUp(seedId,callback){
        let url=this.domain+"goods/up";
        let data={Uid:Global.id,GoodsId:seedId};
        WX.request(url,data,"POST",function(data){
            if(callback){
                callback(data);
            }
        });
    },

    //收获
    requestHarvest(landId,callback){
        let url=this.domain+"harvest2";
        let data={UId:Global.id,Lno:landId};
        WX.request(url,data,"POST",function(data){
            if(callback){
                callback({result:data.Result,des:data.Description,data:data.Data});
            }
        });
    },
    //请求物品
    requestGoods(typeId,callback){
        let url=this.domain+"goods/shop";
        let data={GoodsLanmuId:typeId};
        WX.request(url,data,"POST",function(data){
            if(data.Result===0){
                callback(data.Data);
            }
        })
    },
       //请求土地状态**名字都不知道该咋取了，不光更新地了，其它也更新了**
       requestLandState(landId,callback){
        let url=this.domain+"update/land";
        let data={Uid:Global.id,Lno:landId};
        WX.request(url,data,"POST",function(data){
            if(data.Result===0){
                if(callback){
                    callback(data.Data);
                }
            }
        });
    },
    //请求当前状态
    requestMainState(callback){
        let url=this.domain+"index2";
        let data={Uid:Global.id};
        WX.request(url,data,"POST",function(data){
            if(data.Result===0){
                if(callback){
                    callback(data.Data);
                }
            }
        });
    },

     //请求冷却时间
     requestTime(callback){
        let url=this.domain+"shop";
        let data={Uid:Global.id};
        WX.request(url,data,"POST",function(data){
            if(data.Result===0){
                if(callback){
                    callback(data.Data);
                }
            }
        });
    },
    //请求仓库
    requestStorage(typeId,callback){
        let tpId="v";
        if(typeId==Global.config.type_seed_id){
            tpId="g1";
        }else if(typeId==Global.config.type_manure_id){
            tpId="g2";
        }
        
        let url=this.domain+"warehouse";
        let data={Uid:Global.id,Type:tpId};
        WX.request(url,data,"POST",function(data1){
            if(callback){
                callback(data1.Data);
            }
        });
    },
    //请求签到信息
    requestSignInfo(callback){
        let url=this.domain+"sign";
        let data={Uid:Global.id};
        WX.request(url,data,"POST",function(data){
            if(data.Result===0){
                if(callback){
                    callback(data.Data);
                }
            }
           
        });
    },
//请求签到
    requestSign(callback){
        let url=this.domain+"sign/reward-get";
        let data={Uid:Global.id};
        WX.request(url,data,"POST",function(data){
            if(data.Result===0){
                if(callback){
                    callback(data.Data);
                }
            }
           
        });
    },
    //打到地鼠
    HitMouse(callback){
        let url=this.domain+"mouse";
        let data={Uid:Global.id};
        WX.request(url,data,"POST",function(data){
            if(data.Result===0){
                //todo，用于该接口通用处理
            }
            if(callback){
                    callback(data);
            }
        });
    },
    //祈福
    requestPray(callback){
        let url=this.domain+"blees";
        let data={Uid:Global.id};
        WX.request(url,data,"POST",function(data){
           
                if(callback){
                    callback(data);
                }
            
           
        });
    },

     //获取祈福信息
     requestPrayInfo(callback){
        let url=this.domain+"friend/bless";
        let data={Uid:Global.id};
        WX.request(url,data,"POST",function(data){
            if(data.Result===0){
                //todo，用于该接口通用处理
                if(callback){
                    callback(data.Data);
                }
            }
  
        });
    },
     //获取好友信息
     requestFriendInfo(idx,callback){
        let url=this.domain+"friend/list";
        let data={Uid:Global.id,Offset:idx};
        WX.request(url,data,"POST",function(data){
            if(data.Result===0){
                //todo，用于该接口通用处理
                if(callback){
                    callback(data.Data.List);
                }
            }
  
        });
    },


    //通知服务器土地施肥
    requestUseManure(landId,callback){
        let url=this.domain+"fertilize";
        let data={UId:Global.id,LandId:landId,GoodsId:10};
        WX.request(url,data,"POST",function(data){
            if(callback){
                callback(data);
            }
        })
    },

    //获取邮件列表
    requestMailList(callback){
        let url=this.domain+"mail/list";
        let data={Uid:Global.id};
        WX.request(url,data,"POST",function(data){
            if(data.Result===0){
                //todo，用于该接口通用处理
                if(callback){
                    callback(data.Data);
                }
            }
  
        });
    },

     //读取邮件
     requestReadMail(mailId,callback){
        let url=this.domain+"mail/getReward";
        let data={Uid:Global.id,MId:mailId};
        WX.request(url,data,"POST",function(data){
           
                //todo，用于该接口通用处理
                if(callback){
                    callback(data.Result);
                }
            
        });
    },
    //雇佣请求
    requestHire(friendId,callback){
        let url=this.domain+"job/send";
        let sendData={Uid:Global.id,Fid:friendId};
        WX.request(url,sendData,"POST",function(data){
            if(callback){
                callback(data);
            }
        });
    },
    //总收益请求
    requestTotalGain(callback){
        let url=this.domain+"plantup/show";
        let sendData={Uid:Global.id,UpType:'all'};
        WX.request(url,sendData,"POST",function(data){
            if(callback){
                callback(data.Data);
            }
        });
    },
    //兑换（兔币兑换萝卜币）
    requestExchangeRabbitToRadishMoney(count,callback){
        let url=this.domain+"exchange";
        let sendData={UId:Global.id,Radish:count};
        WX.request(url,sendData,"POST",function(data){
            if(callback){
                callback(data);
            }
        });
    }
};
module.exports=Network;