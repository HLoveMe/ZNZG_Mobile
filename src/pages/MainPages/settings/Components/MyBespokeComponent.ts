/**
 * Created by zhuzihao on 2017/10/31.
 */

import {Component} from "@angular/core";
import {NavController, LoadingController, Loading} from "ionic-angular/index";
import {UserManager} from "../../../../app/tools/UserManager";
import {NetWorkManager, URLFactory, ResponseResult} from "../../../../app/tools/NetWorkManager";
import {Observable, Subject} from "rxjs/Rx";
class MeetHall{
  id:string;
  title:string;
  status:number = 0 ;   // 0 未开始 1 进行中 2 已结束
  cancel:string;//0 未取消  1 已取消
  type:number = -1; //0 会议  1 展会
  time:string;
  _status:string;
  _color:string;
  constructor(info:{[name:string]:any}){
    this.id = info.id;
    this.title = info.title;
    this.status = info.status;
    this.cancel = info.is_cancel;
  }
}
class MeetDataModel extends  MeetHall{
   join:string; // 0 未参加  1 已参加
   constructor(info:{[name:string]:any}){
     super(info);
     this.type = 0;
     this.time = info.time_start;
     this.join = info.is_joined;
     if(this.status == 0){
       this._status = "未开始";
       this._color = "green";
     }else if(this.status == 0){
       this._status = "进行中...";
       this._color = "#4c8dfc";
     }else{
       this.join == "0" ? this._status="未参加" :  this._status="已参加";
       this._color = "#999999";
     }
   }
}
class HallDataModel extends  MeetHall{
   signup:string;// 0 签到  1 未签到
  constructor(info:{[name:string]:any}){
    super(info);
    this.type = 1;
    this.time = info.pre_time;
    this.signup = info.signup_status;
    if(this.status == 0){
      this._status = "未开始";
      this._color = "green";
    }else if(this.status == 0){
      this._status = "进行中...";
      this._color = "#4c8dfc";
    }else{
      this.join == "0" ? this._status="签到" :  this._status="未签到";
      this._color = "#999999";
    }
  }
}


  @Component({
  selector:'MyBespoke',
  templateUrl:"./MyBespokeComponent.html",
})
export  class MyBespokeComponent{
  title:string = "预约";
  private load:Loading;
  constructor(
    private  navC:NavController,
    private userM:UserManager,
    private netM:NetWorkManager,
    private loadC:LoadingController,
    private fanC:URLFactory,
  ){}
  datas:MeetHall[] = [];
  ionViewDidLoad(){
    this.load = this.loadC.create({
      enableBackdropDismiss:true,
      showBackdrop:false
    });
    this.load.present();
    //家在本地  true 网络数据
    this.loadDatas(false);
  }
  loadDatas(location:boolean = false){
    //模拟数据
    //加载预约数据数据
    if(!location){
      console.log("加载模拟数据")
    }
    let one = Observable.create((obs:Subject<MeetHall[]>)=>{
      this.netM.Get(location ? this.fanC.URL("exhibition/prelist") : "./assets/jsons/halls.json").subscribe((res:ResponseResult)=>{
        if(res.ok){
          obs.next((res.result as Array).map((one)=>{
            return new HallDataModel(one)
          }));
          obs.complete()
        }else{
          obs.error(res.error);
        }
      })
    });
    let two = Observable.create((obs:Subject<MeetHall[]>)=>{
      this.netM.Get(location ? this.fanC.URL("meeting/signups") : "./assets/jsons/meets.json").subscribe((res:ResponseResult)=>{
        if(res.ok){
          obs.next((res.result as Array).map((one)=>{
            return new MeetDataModel(one)
          }));
          obs.complete()
        }else{
          obs.error(res.error);
        }
      })
    });
    Observable.zip(one,two,(oneV:any[],twoV:any[])=>{
      return oneV.concat(twoV);
    }).do(()=>{
      this.load.dismiss();
    }).subscribe((value)=>{
      this.datas = value;
      console.log(value);
    })
  }
  downBack(){
    this.navC.pop();
  }
  ionViewCanEnter(){
    // return true
     return this.userM.isAble()
  }
}
