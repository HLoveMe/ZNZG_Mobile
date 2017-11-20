/**
 * Created by zhuzihao on 2017/11/3.
 */


import {Component, Input, Output, EventEmitter, HostBinding} from "@angular/core";
@Component({
  selector:"long-button",
  templateUrl:"./CustomButton.html",
  styles:[`
  .button_continer{
    text-align: center;
  }
  .button_continer >button{
      // width: 325px;
      height: 44px;
      width: -webkit-calc(100% - 20px);
      width: calc(100% - 20px);
      min-width: -webkit-calc(100% - 20px);
      min-width: calc(100% - 20px);
  }
`],

})

/**
 *
 *  登入  底部较长的按钮
 * **/
export class CustomButton{
  @Input() title:string;
  @Output() buttonClick:EventEmitter<Event> = new EventEmitter<Event>();
  @HostBinding('style.display') dis:string = 'block';
  @HostBinding('style.width') width:string = '100%';
  constructor(){}
  button_Click(event:MouseEvent){
    this.buttonClick.emit(event);
  }
}
