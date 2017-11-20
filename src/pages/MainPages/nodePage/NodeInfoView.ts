/**
 * Created by zhuzihao on 2017/11/6.
 */
import {Component,ElementRef} from '@angular/core';
import {ViewController,NavController} from "ionic-angular/index";
import {NodeExhibition} from "../../../app/tools/SourceManager/NodeExhibitionManager";
import { NavFuncManager } from '../base/BaseProtocol';
import { LeaveMessageView } from './LeaveMessageView';
import { SourceDownloadView } from './SourceDownloadView';
import { NodeDetailView } from './NodeStatus/NodeDetailView';

export interface NodeShowStatus{
  func:number;
  node:NodeExhibition;
}

@Component({
  selector:"info-view",
  templateUrl:"./NodeInfoView.html"
})
export class NodeInfoView{
  node:NodeExhibition;
  funcs:any[] = [{img:"assets/images/my_message@2x.png", title:"留言"}, {img:"assets/images/Select_Icon_Voice@2x.png", title:"解说"},{img:"assets/images/Select_Icon_download@2x.png", title:"下载"}];
  constructor(
      private viewC:ViewController,
      private ele:ElementRef,
      private navM:NavFuncManager,
      private navC:NavController
    ){}
  ionViewDidLoad(){
    this.node = this.viewC.data as NodeExhibition;
    let scroll_ele = this.ele.nativeElement.querySelector(".base_main");
    scroll_ele.style.backgroundColor = "rgba(0,0,0,0)";
  }
  ionViewDidEnter(){
    let scroll_ele = this.ele.nativeElement.querySelector(".scroll-content");
    scroll_ele.style.backgroundColor = "rgba(100,100,100,0.3)";
  }
  nodeDetail(){
    this.navM.push(this.navC,this.viewC,NodeDetailView,{node:this.node});
  }
  FuncClick(index:number){
    console.log(index)
    if(index == 1){
      //播放音乐
      this.viewC.dismiss({func:1,node:this.node} as NodeShowStatus)
    }else if(index == 0){
      //留言
      this.navM.push(this.navC,this.viewC,LeaveMessageView);
    }else{
      //下载
      this.navM.push(this.navC,this.viewC,SourceDownloadView,{"node":this.node})
    }
  }
  goZG(){
    //到这个展馆
    this.viewC.dismiss({func:2,node:this.node} as NodeShowStatus)
  }
  dismiss(event:Event,flag:boolean){
    if(flag){
      let scroll_ele = this.ele.nativeElement.querySelector(".scroll-content");
      scroll_ele.style.backgroundColor = "rgba(100,100,100,0)";
      this.viewC.dismiss();
    }
    event.stopPropagation();
    event.preventDefault();
  }
}
