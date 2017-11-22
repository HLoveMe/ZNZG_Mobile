/**
 * Created by zhuzihao on 2017/11/21.
 */


import {Component} from "@angular/core";
import {NavController, AlertController, LoadingController} from "ionic-angular/index";
import {Storage} from "@ionic/storage";


@Component({
  selector:"",
  templateUrl:"./UserSettingView.html"
})
export  class  UserSettingView{
  private NotifacationToggle:string = "NotifacationToggle";
  toggle:boolean = true;
  constructor(
    private navC:NavController,
    private storge:Storage,
    private alertC:AlertController,
    private loadC:LoadingController
  ){}
  ionViewDidLoad(){
    this.storge.ready().then(()=>{
      this.storge.get(this.NotifacationToggle).then((toggle)=>{
          this.toggle = toggle && true;
      })
    })
  }
  ionViewWillLeave(){
      this.storge.set(this.NotifacationToggle,this.toggle);
  }
  clearCache(){
    this.alertC.create({
      title:"清除缓存",
      enableBackdropDismiss:false,
      buttons:[{
        text:"清除",
        role:"cancel",
        cssClass:"clearButton",
        handler:()=>{
          this.loadC.create({
            content:"假装在删除",
            dismissOnPageChange:true,
            enableBackdropDismiss:false,
            showBackdrop:false,
            duration:4
          }).present()
        }
      },{
        text:"取消",
      }]
    }).present();
  }
  downBack(){
    this.navC.pop();
  }
}
