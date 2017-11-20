/**
 * Created by zhuzihao on 2017/10/31.
 */

/**
 *    元素的显示 隐藏
 * */
import {Directive, Input, ElementRef, Renderer2} from "@angular/core";

@Directive({
  selector:'[ElementShowWhen]'
})
export class ElementShowStatus{
  @Input() set  ElementShowWhen(status:Boolean){
        this.render.setStyle(this.template.nativeElement,"display",status ? "block" : "none")
  }
  constructor(
      private template:ElementRef,
      private render:Renderer2
  ){}
}
