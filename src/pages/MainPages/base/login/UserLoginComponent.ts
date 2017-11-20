/**
 * Created by zhuzihao on 2017/10/31.
 */

import {Component, Inject, Renderer2} from "@angular/core";
import {NavController, ViewController, Button, NavParams, LoadingController, Events} from "ionic-angular/index";
import {Page} from "ionic-angular/umd/navigation/nav-util";
import { NetMessageNotifacation} from "../../../../app/Constant";
import {NetWorkManager, ResponseResult, URLFactory} from "../../../../app/tools/NetWorkManager";
import {Observable} from "rxjs/Rx";
import {UserManager, UserInfo} from "../../../../app/tools/UserManager";



@Component({
  templateUrl:"./UserLoginComponent.html"
})
export  class UserLoginComponent{
  //JPUsh ID
  jpushID:string = "121c83f76021331008c";
  mobile:string = "17688938286";
  smscode:string = "";
  buttonString:string = "获取验证码";
  target:Page | string;
  constructor(
    private navC:NavController
    ,private viewC:ViewController,
    private netWork:NetWorkManager,
    private render:Renderer2,
    private pars:NavParams,
    private load:LoadingController,
    private event:Events,
    private userM:UserManager,
    private Factory:URLFactory
  ){}
  ionViewDidLoad(){
    this.target = this.pars.get("page") as Page;
  }

  getCode(code:Button,event){
    this.netWork.POST(this.Factory.URL("sys/send-login-smscode"),{mobile:this.mobile}).subscribe((res:ResponseResult)=>{
      console.log(res)
    });
    this.buttonString =  "60s后重试";
    const section:number = 59;

    Observable.interval(1000).take(60).subscribe((res)=>{
      this.buttonString = section -  (res as number)  +"s后重试";
    },null,()=>{
      this.render.removeAttribute(code.getNativeElement(),"disabled");
      this.buttonString = "获取验证码";
    });
    this.render.setAttribute(code.getNativeElement(),"disabled","");

  }
  //回退
  downBack(){
    console.log(this.navC);
    this.navC.pop();
  }
  //登入
  Login(type:number,event){
    if(1 == type){
      console.log("微信")
      //微信
    }else if(2 == type){
      //QQ
      console.log("QQ")
    }else{
      //手机号登入
      console.log("手机");
      if (this.mobile.length != 11 || this.smscode.length != 6){
        this.event.publish(NetMessageNotifacation,"正确输入手机号或验证码");
        return
      }
      const loading = this.load.create({
        content:"登入中",
        enableBackdropDismiss:true
      });
      loading.present();
      this.netWork.POST(this.Factory.URL("sys/mobile-login"),{"mobile":this.mobile,"smscode":this.smscode,"registration_id":this.jpushID}).subscribe((res:ResponseResult)=>{
        console.log(res);
        loading.dismiss();
        if(res.ok){
          this.userM.loginSucess(res.result as UserInfo);
          if(this.target != null){
              this.navC.push(this.target,this.pars.get("params"),this.pars.get("opts"),this.pars.get("done"));
              //导航栈中移除登入见面
              this.navC.remove(this.navC.length() - 1);
          }
        }else{
          this.event.publish(NetMessageNotifacation, "登入失败");
        }
      })
    }

  }
}
