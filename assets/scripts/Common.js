

var Common={

    //现在时刻是否是夜晚
    isDarkNow(){
        let hour=new Date().getHours();
        let result=true;
        console.log("现在时刻："+hour);
        if(hour>=6&&hour<=20)
            result=false;
        return result;
    }
};


module.exports=Common;