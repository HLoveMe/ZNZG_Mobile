import {Component,ViewChild,ElementRef,ViewContainerRef,Renderer2} from '@angular/core';
import {ViewController} from "ionic-angular/index";
import { NodeExhibition } from '../../../app/tools/SourceManager/NodeExhibitionManager';
import { Content} from 'ionic-angular';

@Component({
    templateUrl:"./ExhibitionPolygonInfo.html"
})
export class ExhibitionPolygonInfoView{
    /***围栏检测 消息展示 */
    @ViewChild("BaseContent",{read:ViewContainerRef}) contnet:ViewContainerRef;
    private data:NodeExhibition;
    constructor(
        private VC:ViewController,
        private render:Renderer2,
    ){}
    ionViewDidLoad(){
        this.data = this.VC.data as NodeExhibition;
    }
    ionViewDidEnter(){
        let scroll_ele = this.contnet.element.nativeElement.querySelector(".scroll-content");
        scroll_ele.style.backgroundColor = "rgba(100,100,100,0.3)";
    }
    dismiss(){
        let scroll_ele = this.contnet.element.nativeElement.querySelector(".scroll-content");
        scroll_ele.style.backgroundColor = "rgba(100,100,100,0)";
        this.VC.dismiss();
    }
}