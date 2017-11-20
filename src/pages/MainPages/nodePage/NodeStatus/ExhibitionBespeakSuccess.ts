

import { Component ,Input} from "@angular/core";
import {NavController, ViewController, NavParams} from "ionic-angular/index";

@Component({
    selector:"bespeak-success",
    templateUrl:"./ExhibitionBespeakSuccess.html"
})

export  class ExhibitionBespeakSuccess{
    constructor(
        private navC:NavController,
        private navP:NavParams,
    ){}
    ionViewDidLoad(){
        let con = this.navP.get("qcode");
        console.log(con);
    }
    dismiss(){
        this.navC.pop();
    }
}