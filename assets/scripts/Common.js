
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
    /**之间 */
    clamp(x,min,max){
        if(x<min){
            return min;
        }else if(x>max){
            return max;
        }else{
            return x;
        }
    },

    /**获取两个向量之间的距离 */
    getDistance(vec1,vec2){
        return Math.sqrt(Math.pow(vec2.x-vec1.x,2)+Math.pow(vec2.y-vec1.y,2));
    },
    /**加载资源图片 */
    loadRes(path,image){
        if(path==null){
            image.spriteFrame=null;
            return;
        }
        cc.loader.loadRes(path,cc.SpriteFrame,function(err,tex){
            if(!err){
                image.spriteFrame=tex;
            }
        });
    },
    /**加载图片 */
    load(url,image){
        if(url==null){
            image.spriteFrame=null;
            return;
        }
        
        cc.loader.load({url:url,type:'png'},function(err,tex){
            if(!err)
                image.spriteFrame=new cc.SpriteFrame(tex);
            
        });
    },
    /**是否为空 */
    isNullOrEmpty(str){
        if(str==null||str=="")
        return true;
        return false;
    },
    /**转换时间 */
    parseTime(ms){
        let tm=new Date(ms);
        return tm.getFullYear()+"-"+(tm.getMonth()+1)+"-"+tm.getDate()+" "+tm.getHours()+":"+tm.getMinutes()+":"+tm.getSeconds();
    },

};


module.exports=Common;