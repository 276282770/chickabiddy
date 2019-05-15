
var Network=require("Network");
var Common={

    //现在时刻是否是夜晚
    isDarkNow(){
        let hour=new Date().getHours();
        let result=true;
        console.log("现在时刻："+hour);
        if(hour>=6&&hour<=20)
            result=false;
        return result;
    },
    //分享
    onShare(){
        Network.requestShare((res) => {

            let title = res.data.title;
            let imageUrl = res.data.imageUrl;
            WX.shareAppMessage(title, imageUrl, tp);

        });
    },
    //分享成功
    shareSuccess(){
        Network.requestShareSuccess((res) => {
            

        });
    },
};


module.exports=Common;