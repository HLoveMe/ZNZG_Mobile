

import { Component ,Input} from "@angular/core";
import {NavController, ViewController, NavParams} from "ionic-angular/index";
import { UserManager } from "../../../../app/tools/UserManager";
import { NodeExhibition } from "../../../../app/tools/SourceManager/NodeExhibitionManager";
import { BespeakItem,BespeakType,BespeakStutas, BespeakBaseModel } from "../../../Views/BespeakItem/BespeakItem";
import { ExhibitionBespeakSuccess } from "./ExhibitionBespeakSuccess";

class ExhibitionSubmitModel extends BespeakBaseModel{
    company:string;
    position:string;
    node:string;
    time:string;
}

@Component({
    templateUrl:"./ExhibitionBespeak.html",
})
export class ExhibitionBespeak{
    exhibitionModel:ExhibitionSubmitModel;
    bespeaks:BespeakStutas[] = []
    node:NodeExhibition;
    constructor(
        private navC:NavController,
        private navP:NavParams,
        private userM:UserManager,
    ){}
    ionViewDidLoad(){
        this.node = this.navP.get("node");
        this.exhibitionModel = {
            phone:"17688938286",
            node:this.node.title
        } as ExhibitionSubmitModel;
        this.bespeaks = [{type:BespeakType.Content,requird:true,name:"姓名",icon:"SignUp_Icon_User@2x.png",placeContent:"请输入预约姓名(必填)",default:"",canEdit:true,property:"name"}
            , {type:BespeakType.Content,requird:false,name:"公司",icon:"SignUp_Icon_Company@2x.png",placeContent:"请输入预约人所在公司(选填)",default:"",canEdit:true,property:"company"}
            , {type:BespeakType.Content,requird:false,name:"职位",icon:"SignUp_Icon_Job@2x.png",placeContent:"请输入职位(选填)",default:"",canEdit:true,property:"position"}
            , {type:BespeakType.Number,requird:true,name:"电话",icon:"SignUp_Icon_Cellphone@2x.png",placeContent:"请输入预约人电话(必填)",default:this.exhibitionModel.phone,canEdit:true,property:"phone"}
            , {type:BespeakType.Content,requird:true,name:"预约展点",icon:"SignUp_Icon_Showpoint@2x.png",placeContent:"",default:this.exhibitionModel.node,canEdit:false,property:"node"}
            , {type:BespeakType.Time,requird:true,name:"预约时间",icon:"SignUp_Icon_Time@2x.png",placeContent:"",default:"2017/11/17 10:30",canEdit:true,property:"time"}
            , {type:BespeakType.Code,requird:true,name:"验证码",icon:"SignUp_Icon_Identify@2x.png",placeContent:"验证码(必填)",default:"",canEdit:true,property:"code"}
        ] as BespeakStutas[];
    }
    ionViewCanEnter(){
        return true;
        // return this.userM.isAble();
    }
    SubmitClick(){
        this.navC.push(ExhibitionBespeakSuccess,{"qcode":"{'type':'1'}"})
    }
    dismiss(){
        this.navC.pop();
    }
}