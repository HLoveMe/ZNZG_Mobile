/**
 * Created by zhuzihao on 2017/11/22.
 */
import {Component} from "@angular/core";
import {NavController} from "ionic-angular/index";
import {NetWorkManager, URLFactory, ResponseResult} from "../../../../app/tools/NetWorkManager";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";

@Component({
  templateUrl:'./AppAboutView.html'
})
export  class  AppAboutView{
    info:{[name:string]:any} = {};
    html:SafeHtml;
    constructor(
      private  navC:NavController,
      private  netM:NetWorkManager,
      private  fanC:URLFactory,
      private  san:DomSanitizer
    ){}
    ionViewDidLoad(){
        this.netM.Get(this.fanC.URL("hall/info")).subscribe((res:ResponseResult)=>{
            if(res.ok){
              this.info = res.result;
              this.html = this.san.bypassSecurityTrustHtml(this.info.about);
            }
        })
    }
    downBack(){
      this.navC.pop();
    }
}

