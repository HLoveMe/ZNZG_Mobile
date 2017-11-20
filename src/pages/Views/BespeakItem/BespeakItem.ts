
import { Component ,Input} from "@angular/core";
import { Observable } from "rxjs/Observable";
import { NetWorkManager, URLFactory, ResponseResult } from "../../../app/tools/NetWorkManager";
@Component({
    templateUrl:"./BespeakItem.html",
    selector:"bespeak-item"

})
export class BespeakItem{
    //得到提交模型
    @Input() info:BespeakBaseModel;
    //导入模型
    @Input() status:BespeakStutas;
    //针对验证码
    codeText:string = "获取验证码"
    codeEdit:boolean = true;
    constructor(
        private netM:NetWorkManager,
        private fanc:URLFactory
    ){}
    getCode(){
        let url  = this.fanc.URL("exhibition/send-pre-smscode");
        this.netM.POST(url,{"mobile":this.info.phone}).subscribe((res:ResponseResult)=>{
            if(res.ok){
                this.codeEdit = false;
                this.codeText = "60s后,重新获取";
                Observable.interval(1000).take(61).map((index)=>{
                    return (60 - index) + "s后,重新获取"
                }).subscribe((text)=>{
                    this.codeText = text;
                },null,()=>{
                    this.codeEdit = true;
                    this.codeText = "获取验证码";
                })
            }
        })
        
    }
    modelExchange(event){
        this.status.default = event;
        if(this.info != null){
            this.info[this.status.property] = event;
        }
    }
}

export enum BespeakType{
    Content = 0, //文本输入
    Time = 1,  //时间
    Number = 2, //数组
    Code = 3 //验证码
}
export class BespeakStutas{
    type:BespeakType; //类型
    requird:boolean; //是否必须
    name:string ;//名称
    icon:string;//图标
    placeContent:string; //占位文字
    default:string;  //默认值
    canEdit:boolean = true; //是否可以编辑
    property:string;  //指向模型 属性名称
}

export class BespeakBaseModel{
    name:string;
    phone:string;
    code:string;
}