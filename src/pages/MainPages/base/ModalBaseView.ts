/**
 * Created by zhuzihao on 2017/10/31.
 */
/**
 * Created by zhuzihao on 2017/10/31.
 */

import {Component, Input, Output, EventEmitter, ViewChild,Directive,ElementRef} from "@angular/core";
import {Content} from "ionic-angular/index";


@Component({
  templateUrl:"ModalBaseView.html",
  styles:[
`
  .base_main{
    width: 100%;
    height: 100%;
    background-color: #999999;
  }
  .base_content{
    background-color: white;
    
    margin: 34px 10px 10px 10px;
    height: -webkit-calc(100% - 44px);
    height: calc(100% - 44px);
    position: relative;
    
    border-radius: 10px;
    display: block;
    overflow-x: hidden ;
  }
  .base_title{
    position: absolute;
    height: 60px;
    right: 10px;   
    left: 22px;
    top: 10px;
    font-size: 3rem;
    line-height: 60px;
    z-index: 10;
  }
  .base_back{
    position: absolute;
    left: 10px;
    bottom: 10px;
    width: 40px;
    height: 40px;
  }
  .base_back >img{
      width: 20px;
      height: 20px;
      margin-top: 10px;
      margin-left: 10px;
      z-index:10;
  }
`
  ],
  selector:"base-content"
})

export  class  ModalBaseView{
  /**
   * 标题
   * */
  @Input() title:string = '标题';
  /**
   *  1 为 X 返回  默认
   *  2 为 <- 返回
   * */
  @Input() backtype:number =  1;
  /**
   * 返回事件
   * */
  @Output("back") back:EventEmitter<Event> = new EventEmitter<Event>();
  constructor(
    private ele:ElementRef,
  ){}
  backEvent(event:MouseEvent){
    this.back.emit(event);
  }
}


@Directive({
  selector:"[base-content-no-scroll]"
})
export class BaseContentNoScroll{
  constructor(
    private ele:ElementRef,
  ){}
  ngOnInit(){
    let scroll_ele = this.ele.nativeElement.querySelector(".scroll-content");
    scroll_ele.style.overflowY = "hidden";
  }
}