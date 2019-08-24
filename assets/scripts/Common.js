
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
    /**向量相减 */
    vector2Subtract(vec1,vec2){
        let result=new cc.Vec2(0,0);
        result.x=vec1.x-vec2.x;
        result.y=vec1.y-vec2.y;
        return result;
    },
    /**向量相加 */
    vector2Add(vec1,vec2){
        let result=new cc.Vec2(0,0);
        result.x=vec1.x+vec2.x;
        result.y=vec1.y+vec2.y;
        return result;
    },
    /**向量相乘 */
    vector2Multiply(vec,num){
        let result=new cc.vec2(0,0);
        result.x=vec.x*num;
        result.y=vec.y*num;
        return result;
    },
};


module.exports=Common;