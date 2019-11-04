
var Common=require("Common");
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    txtDate: cc.Label = null;

    @property(cc.Label)
    txtCtnt1: cc.Label = null;
    @property(cc.Label)
    txtCtnt2: cc.Label = null;
    @property(cc.Label)
    txtCount: cc.Label = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    // update (dt) {}

    fill(isExchanged:boolean,date:string,count:number,seriNo:string,expritydate:string,exTime:string,servicenet:string):void{
        this.txtDate.string= date;
        this.txtCount.string="数量："+count;
        if(isExchanged){
            this.txtCtnt1.string="已在【"+servicenet+"】兑换";
            this.txtCtnt2.string="兑换日期："+ exTime;
        }else{
            this.txtCtnt1.string=seriNo;
            this.txtCtnt2.string="有效期至"+expritydate;
        }
    }
}
