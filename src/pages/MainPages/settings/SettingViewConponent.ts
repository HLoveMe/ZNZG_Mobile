/**
 * Created by zhuzihao on 2017/10/31.
 */

import {Component, ViewChild} from "@angular/core";
import { ModalBaseView } from "../base/ModalBaseView"
import {ViewController, NavController} from "ionic-angular";
import {UserManager, UserInfo} from "../../../app/tools/UserManager";
import {MyBespokeComponent} from "./Components/MyBespokeComponent";
import { NavFuncManager} from "../base/BaseProtocol";
import {UserInfoComponent} from "./Components/UserInfoComponent";

@Component({
  templateUrl:"SettingViewConponent.html"
})

export  class  SettingViewConponent{
  title:string = "我的";
  user?:UserInfo;
  data:any[] = [{rows:[{icon:"my_time@2x.png", title:"预约"}, {icon:"my_message@2x.png", title:"消息"}, {icon:"my_books@2x.png", title:"资料"}],footer:true},{rows:[{icon:"my_spoor@2x.png", title:"足迹"}],footer:true},{rows:[{icon:"my_setting@2x.png", title:"设置"},{icon:"my_about@2x.png", title:"关于"}],footer:false}];
  @ViewChild(ModalBaseView) base:ModalBaseView;
  constructor(private viewCtrl:ViewController,
              private navC:NavController,
              private navManager:NavFuncManager,
              private userManager:UserManager,
  ){}
  ionViewWillEnter(){

    //账号控制
    this.userManager.userSubject.subscribe((user?:UserInfo)=>{
      if(user != null){
        this.user = user;
        this.title = user.nickname;
      }
    });
  }
  userDetail(event:Event){
    console.log(event);
    this.navManager.push(this.navC,this.viewCtrl,UserInfoComponent);
    event.stopPropagation()
  }
  /***/
  itemClick(group,row){
    if (group == 0){
      if (row == 0){
        this.navManager.push(this.navC,this.viewCtrl,MyBespokeComponent)
      }
    }
  }
  //退出
  downBack(){
    this.viewCtrl.dismiss();
  }
}
