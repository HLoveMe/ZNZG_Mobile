

import {Component,ViewChild} from '@angular/core';
import {Events} from "ionic-angular";
import {NavController, ViewController, NavParams} from "ionic-angular/index";
import { NetWorkManager, URLFactory, ResponseResult } from '../../../app/tools/NetWorkManager';
import { NetMessageNotifacation } from '../../../app/Constant';

@Component({
    templateUrl:"./EmailSendView.html"
})
export class EmailSendView{
    private data:any;
    email:string;
    constructor(
        private navC:NavController,
        private navP:NavParams,
        private netM:NetWorkManager,
        private fanC:URLFactory,
        private events:Events
    ){}
    ionViewDidLoad(){
        this.data = this.navP.get("email_data");
        console.log(this.data);
    }
    dismiss(event:Event){
        this.navC.pop();
    }
    emailSend(){
        debugger
        let pa = {
            email:this.email,
            ... this.data
        }
        this.netM.POST(this.fanC.URL("exhibition/send-attachment"),pa).subscribe((result:ResponseResult)=>{
            if(result.ok){
                this.events.publish(NetMessageNotifacation,"注意邮件查收");
                setTimeout(() => {
                    this.navC.pop();
                }, 1000);
            }
        })
    }
}