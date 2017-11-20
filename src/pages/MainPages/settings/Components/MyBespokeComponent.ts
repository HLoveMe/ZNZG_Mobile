/**
 * Created by zhuzihao on 2017/10/31.
 */

import {Component} from "@angular/core";
import {NavController} from "ionic-angular/index";
import {UserManager} from "../../../../app/tools/UserManager";

@Component({
  selector:'MyBespoke',
  templateUrl:"./MyBespokeComponent.html",
})
export  class MyBespokeComponent{
  title:string = "预约";
  constructor(private  navC:NavController,private userM:UserManager){}
  downBack(){
    console.log(this.navC);
    this.navC.pop();
  }
  ionViewCanEnter(){
    // return true
     return this.userM.isAble()
  }
}
