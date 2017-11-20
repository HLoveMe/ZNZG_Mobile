/**
 * Created by zhuzihao on 2017/11/8.
 */

import {Component,ViewContainerRef,Renderer2,AfterContentInit} from "@angular/core";
import { MapNavigationManager } from "../../../app/tools/Map/MapNavigationManager"

@Component({
  selector:"route-plan",
  templateUrl:"./RoutePlanView.html"
})
export  class RoutePlanView implements AfterContentInit{ 
  dismiss:Function;
  private start:any = null;
  private end:any = null;
  constructor(
    private template:ViewContainerRef,
    private rander:Renderer2,
    private MapS:MapNavigationManager
  ){}
  ngAfterContentInit(){
    this.rander.setStyle(this.template.element.nativeElement.parentElement,"bottom","0px");
  }
  closePlan(event:MouseEvent){
    //关闭
    this.rander.setStyle(this.template.element.nativeElement.parentElement,"bottom","-170px");
    this.MapS.clearNavigationRoute();
    setTimeout(()=>{
      if(null != this.dismiss){
        this.dismiss.apply(this,event);
      }
    }, 1500);
  }
  setPointValue(value:any){
      if(this.start != null && this.end != null){
          this.MapS.clearNavigationRoute();
          this.start = null;
          this.end = null; 
      }
      console.log(value)
      let content:string = "";
      let point:any;
      if(value.nodeType == fengmap.FMNodeType.MODEL){
        content = value.name;
        point = value.mapCoord;
      }else{
        if(this.start == null){
          content = "从这里出发";
        }else{
          content = "到这里去";
        }
        point = value.eventInfo.coord;
      }
      point.groupID = value.groupID;
      if(this.start == null){
        this.start = {name:content,value:point}
      }else{
        this.end = {name:content,value:point}
      }
      if(this.start != null && this.end != null){
        console.log(this.start,this.end)
        this.MapS.showNavigationRoute(this.start.value,this.end.value,false);
      }
  }
}
