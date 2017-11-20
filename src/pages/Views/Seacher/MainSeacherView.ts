/**
 * Created by zhuzihao on 2017/10/27.
 */
import {Component, ViewChild, Input, OnInit} from '@angular/core';
import { TextInput} from 'ionic-angular';
import {Subject} from "rxjs/Rx";


export enum InputStatus{
  Begin,Input,End
}
export class SeachStatus{
  status:InputStatus;
  content:string
}

@Component({
  templateUrl:"MainSeacherView.html",
  selector:"main-Seacher"
})
export  class MainSeacherView implements  OnInit{
  inputSubject:Subject<SeachStatus> = new Subject<SeachStatus>();
  @Input() placeConetnt:string;
  @ViewChild("Seacher") Seacher:TextInput;
  content:string = "";
  constructor(){}
  ngOnInit(){
      console.log(this.Seacher)
  };
  setContent(con:string){
    this.content = con;
  }
  seachInput(event:KeyboardEvent){
    if(this.content.length >= 1){
      this.inputSubject.next({content:this.content,status:InputStatus.Input} as SeachStatus);
    }
    if(event.keyCode == 13){
      this.Seacher.setBlur();
    }
  }
  endInput(){
    this.inputSubject.next({content:this.content,status:InputStatus.End} as SeachStatus);
  }
}
