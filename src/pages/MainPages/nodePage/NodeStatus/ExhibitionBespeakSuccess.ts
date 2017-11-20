

import { Component ,Input,ViewChild,ElementRef} from "@angular/core";
import {NavController, ViewController, NavParams} from "ionic-angular/index";
import { Query } from "@angular/core/src/metadata/di";

@Component({
    selector:"bespeak-success",
    templateUrl:"./ExhibitionBespeakSuccess.html"
})

export  class ExhibitionBespeakSuccess{
    @ViewChild("QCode") code:ElementRef;
    private qcode:any;
    constructor(
        private navC:NavController,
        private navP:NavParams,
    ){}
    ionViewDidLoad(){
        let con = this.navP.get("qcode");
        this.qcode = new QRCode(this.code.nativeElement,con);
    }
    dismiss(){
        this.navC.pop();
    }
    goDetail(){
        console.log("还没写 之后添加")
    }
}