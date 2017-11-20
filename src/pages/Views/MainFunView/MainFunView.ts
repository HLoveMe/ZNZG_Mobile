/**
 * Created by zhuzihao on 2017/10/27.
 */

import {Component, Input, Renderer2, ViewChild, ElementRef, HostBinding} from "@angular/core"
import  { MainFunType } from "./MainFuncManager"

@Component({
  selector:"FuncView",
  templateUrl:"MainFunView.html"
})
export class MainFunView{
  @Input() status:MainFunType;
  /**1 为圆形  2 为圆角*/
  @Input() type:number;
  //内容
  @Input() icon:string;
  @Input() floor:number;

  @ViewChild("Button") content:ElementRef;

  constructor(private render:Renderer2){}
  ngOnInit(){
    this.render.setStyle(this.content.nativeElement,"border-radius",this.type == 2 ? "10px" : "23px");
    console.log($(this.content.nativeElement))
    let div = this.content.nativeElement.querySelector("div");
    let img = this.content.nativeElement.querySelector("img");

     if(this.icon == null){
      this.render.setStyle(div,"visibility","visible");
      this.render.setStyle(img,"visibility","hidden");
    }else if(this.floor != 0){
       this.render.setStyle(div,"visibility","hidden");
       this.render.setStyle(img,"visibility","visible");
     }
  }
  /**为楼层点击准备*/
  showFloorSelect(select:Boolean){
      let div = this.content.nativeElement.querySelector("div");
      select ? this.render.addClass(div,"floor_select") : this.render.removeClass(div,"floor_select")
  }
}

/***
 *  展示搜索结果页面
 * */
@Component({
  selector:"seacher-result",
  template:`
 <div  *ngFor="let res of result" (click)="modelSelect(res)">
   {{res?.name}}
</div>
`,
  styles:[`
    div{
      height: 44px;
      line-height: 44px;
      padding-left: 20px;
      background-color: white;
    }
`]
})

export  class MapSeachResultView{
  private result:any[] = [];
  @HostBinding("style.display") show:string = "none";
  constructor(){}
  //便于管理者处理
  clickFunc:Function;

  setContent(result:any[]){
    this.result = result.slice(0,3);
    this.show = (this.result.length >= 1) ? "block" : "none";
  }
  modelSelect(res){
    if(this.clickFunc){
      this.clickFunc.call(this,res);
      this.setContent([]);
    }
  }
}
