/**
 * Created by zhuzihao on 2017/10/28.
 */
import {MainFunView, MapSeachResultView} from "./MainFunView"
import {Renderer2} from "@angular/core/core";
import {BehaviorSubject} from "rxjs/Rx";
import { MainSeacherView } from "../Seacher/MainSeacherView"
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/debounceTime';

export  enum MainFunType{
  ShowStatus, //
  PlannRoute,//路线规划
  HotMap,//
  Location,
  USer,
  Scan,
  Panorama,
  RouteGroom,
  MeetHall,
  Floor, //
  Seacher,
  Result,// 点击搜索结果
}

export class MainFunTypeInstance{

  Show:MainFunType = MainFunType.ShowStatus;
  plannRoute:MainFunType = MainFunType.PlannRoute;
  hotMap:MainFunType = MainFunType.HotMap;
  Location:MainFunType = MainFunType.Location;

  USer:MainFunType = MainFunType.USer;

  Scan:MainFunType = MainFunType.Scan;
  Panorama:MainFunType = MainFunType.Panorama;
  RouteGroom:MainFunType = MainFunType.RouteGroom;
  MeetHall:MainFunType = MainFunType.MeetHall;

  Floor:MainFunType = MainFunType.Floor;
  constructor(){}
}

export class MainFuncMessage{
  type:MainFunType;
  content?:any;
  constructor(type:MainFunType,content?:any){
    this.type = type;
    this.content = content;
  }
}

export class MainFunViewManager{
  selectSubject:BehaviorSubject<[MainFuncMessage]>;
  funcViews:MainFunView[];
  inputView:MainSeacherView;
  seachView:MapSeachResultView;
  floor_index = 1;
  show_status_3d:Boolean = false;
  private floors:MainFunView[] = [];
  constructor(){
    this.selectSubject = new BehaviorSubject<[MainFuncMessage]>([
      new MainFuncMessage(MainFunType.ShowStatus,this.show_status_3d),
      new MainFuncMessage(MainFunType.Floor,this.floor_index)
    ])
  }
  /**
   * 显示搜索结果
   * */
  showSeachResults(results:any[]){
    this.seachView.setContent(results);
  }
  /**
   * 注册按钮事件
   * */
  setOperation(render:Renderer2){
    //输入
    this.inputView.inputSubject.delay(300).debounceTime(500).distinctUntilChanged().subscribe((text)=>{
      this.selectSubject.next([new MainFuncMessage(MainFunType.Seacher,text)])
    });
    //搜索结果
    this.seachView.clickFunc = (res)=>{
      this.selectSubject.next([new MainFuncMessage(MainFunType.Result,res)]);
    };

    //功能按钮
      for (var one of this.funcViews){
          let target = one as MainFunView;
          switch (target.status){
            case MainFunType.ShowStatus:
              render.listen(target.content.nativeElement,"click",(event:MouseEvent)=>{
                  this.show_status_3d = !this.show_status_3d;
                  let message = new MainFuncMessage(MainFunType.ShowStatus,this.show_status_3d);
                  this.selectSubject.next([message]);
                  event.stopPropagation();
              });
              break;
            case MainFunType.PlannRoute:
              render.listen(target.content.nativeElement,"click",(event:MouseEvent)=>{
                let message = new MainFuncMessage(MainFunType.PlannRoute);
                this.selectSubject.next([message]);
                event.stopPropagation();
              });
              break;
            case MainFunType.HotMap:
              render.listen(target.content.nativeElement,"click",(event:MouseEvent)=>{
                let message = new MainFuncMessage(MainFunType.HotMap);
                this.selectSubject.next([message]);
                event.stopPropagation();
              });
              break;
            case MainFunType.Location:
              render.listen(target.content.nativeElement,"click",(event:MouseEvent)=>{
                let message = new MainFuncMessage(MainFunType.Location);
                this.selectSubject.next([message]);
                event.stopPropagation();
              });
              break;
            case MainFunType.USer:
              this.floors.push(target);
              render.listen(target.content.nativeElement,"click",(event:MouseEvent)=>{
                let message = new MainFuncMessage(MainFunType.USer);
                this.selectSubject.next([message]);
                event.stopPropagation();
              });
              break;
            case MainFunType.Floor:
              this.floors.push(target);
              render.listen(target.content.nativeElement,"click",(event:MouseEvent)=>{
                let floor = event.srcElement.innerHTML;
                this.floor_index = parseInt(floor);
                let message = new MainFuncMessage(MainFunType.Floor,this.floor_index);
                this.selectSubject.next([message]);
                event.stopPropagation();
              });
              break;
            case MainFunType.Scan:
              render.listen(target.content.nativeElement,"click",(event:MouseEvent)=>{
                let message = new MainFuncMessage(MainFunType.Scan);
                this.selectSubject.next([message]);
                event.stopPropagation();
              });
              break;
            case MainFunType.Panorama:
              render.listen(target.content.nativeElement,"click",(event:MouseEvent)=>{
                let message = new MainFuncMessage(MainFunType.Panorama);
                this.selectSubject.next([message]);
                event.stopPropagation();
              });
              break;
            case MainFunType.RouteGroom:
              render.listen(target.content.nativeElement,"click",(event:MouseEvent)=>{
                let message = new MainFuncMessage(MainFunType.RouteGroom);
                this.selectSubject.next([message]);
                event.stopPropagation();
              });
              break;
            case MainFunType.MeetHall:
              render.listen(target.content.nativeElement,"click",(event:MouseEvent)=>{
                let message = new MainFuncMessage(MainFunType.MeetHall);
                this.selectSubject.next([message]);
                event.stopPropagation();
              });
              break;
          }
      }
    for (var i = 0 ;i<this.floors.length;i++){
      let _target = this.floors[i] as MainFunView;
      _target.showFloorSelect(i == this.floor_index - 1)
    }
  }

  hiddenOrShow(show:boolean = true){

  }
}

