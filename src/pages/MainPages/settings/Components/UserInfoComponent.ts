/**
 * Created by zhuzihao on 2017/10/31.
 */
/**
 * Created by zhuzihao on 2017/10/31.
 */

import {Component} from "@angular/core";
import {NavController} from "ionic-angular/index";
import {UserManager, UserInfo} from "../../../../app/tools/UserManager";
import {ImagePicker} from "@ionic-native/image-picker";

@Component({
  templateUrl:"./UserInfoComponent.html",
})
export  class UserInfoComponent{
  title:string = "个人信息";
  user?:UserInfo;
  constructor(private  navC:NavController,
              private userM:UserManager,
              private  imagePicker:ImagePicker
  ){}
  ionViewWillEnter(){
    this.userM.userSubject.subscribe((user:UserInfo)=>{
      this.user = user
    })
  }
  imageSelect(){
    this.imagePicker.getPictures({
      quality:50,
      outputType:1
    }).then((results)=>{
        console.log(results)
    })
  }
  // 后退
  downBack(){
    this.navC.pop();
  }
  ionViewCanEnter(){
    // return true
    return this.userM.isAble()
  }
}
