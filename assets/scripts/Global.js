window.Global={
    id:-1,
    openid:"",
    game:null,
    user:{
        nickName:"123",
        avatar:"",
        level:-1,
    },
    money:0,
    scene:{
        nextSceneName:"Main2",  //下一个场景名称
        otherUid:-1,  //其他人的用户id
        lastPanel:"",  //上一个面板
    },
            /*
            game.json中添加
            "navigateToMiniProgramAppIdList": [
                "wxeedb326f283fe740",
                "wx415ce4b5e3c4121d"
            ]
        */
    miniProgramAppIdList:["wxeedb326f283fe740",//中原惠生活
        "wx415ce4b5e3c4121d",  //中原银行信用卡申请
    ],
    
    
    otherPersonId:-1,  //其它人的ID
};
