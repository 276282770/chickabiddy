
var Common={
    vector2Subtract(vec1,vec2){
        let result=new cc.Vec2(0,0);
        result.x=vec1.x-vec2.x;
        result.y=vec1.y-vec2.y;
        return result;
    },
    vector2Add(vec1,vec2){
        let result=new cc.Vec2(0,0);
        result.x=vec1.x+vec2.x;
        result.y=vec1.y+vec2.y;
        return result;
    },
};

module.exports=Common;