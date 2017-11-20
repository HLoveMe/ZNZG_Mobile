import {Component,ViewChild} from '@angular/core';
import {NavController, ViewController, NavParams} from "ionic-angular/index";
import { NodeExhibition } from '../../../../app/tools/SourceManager/NodeExhibitionManager';
import { DomSanitizer ,SafeHtml} from '@angular/platform-browser';
import { NavFuncManager } from '../../base/BaseProtocol';
import { ExhibitionBespeak } from './ExhibitionBespeak';
@Component({
    templateUrl:"./NodeDetailView.html"
})
export class NodeDetailView{
    private node:NodeExhibition;
    private html:SafeHtml
    constructor(
        private navC:NavController,
        private navP:NavParams,
        private san:DomSanitizer,
        private navM:NavFuncManager,
        private vc:ViewController
    ){}
    ionViewDidLoad(){
        this.node = this.navP.get("node");
        this.html = this.san.bypassSecurityTrustHtml(this.node.introduction);
    }
    //展馆预约
    bespeakNode(){
        console.log("预约");
        $("video").each((index,value)=>{value.pause();});
        this.navM.push(this.navC,this.vc,ExhibitionBespeak,{"node":this.node});
    }
    dismiss(){
        this.navC.pop()
    }
}