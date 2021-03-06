
//留言
import {Component,ElementRef,ViewChild,ViewChildren,QueryList,Renderer2} from '@angular/core';
import {NavController, ViewController,NavParams,LoadingController,Events} from "ionic-angular/index";
import { UserManager, UserInfo } from '../../../app/tools/UserManager';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { ImagePicker } from '@ionic-native/image-picker';
import { NetWorkManager, URLFactory, ResponseResult } from '../../../app/tools/NetWorkManager';
import { NodeExhibition } from '../../../app/tools/SourceManager/NodeExhibitionManager';
import { NetMessageNotifacation } from '../../../app/Constant';


@Component({
    templateUrl:"./LeaveMessageView.html"
})
export class LeaveMessageView{
    private node:NodeExhibition;
    private images:string[] = [];
    showImage:any[] = []
    contentValue:string = "";
    private user:UserInfo;
    @ViewChild("LeaveContent") content:ElementRef;
    constructor(
        private navC:NavController,
        private userM:UserManager,
        private render:Renderer2,
        private san:DomSanitizer,
        private imgPick:ImagePicker,
        private netM:NetWorkManager,
        private fac:URLFactory,
        private navP:NavParams,
        private loadV:LoadingController,
        private events:Events,

    ){}
    ionViewDidLoad(){
        this.node = this.navP.get("node");
        this.user = this.userM.user;
        this.updateImages(this.images);
    }
    //选择本机图片
    selectPhoneImage(index:number){
        if(index == this.showImage.length -1){
            console.log("选择");
            this.imgPick.getPictures({
                maximumImagesCount:3 - this.images.length,
                outputType:1
            }).then((res)=>{
                this.images = this.images.concat(res);
                this.updateImages(this.images);
            })
        }
    }
    //增加张图片
    addImage(source:string){
        this.images.push(source);
        this.updateImages(this.images);
    }
    //移除一张
    removeImage(event:Event,index:number){
        event.stopPropagation();
        delete this.images[index];
        this.updateImages(this.images);
    }
    //更新视图
    updateImages(images:string[] = []){
        let source:string[] = images;
        if(images.length > 3){
            source = images.slice(0,3);
            this.images = source; 
        }
        let _images:any[] = [];
        source.forEach((value)=>{
            if(value.indexOf("http")>=0){
                _images.push({
                    url:this.san.bypassSecurityTrustResourceUrl(value),
                    isSelect:true
                })
            }else{
                _images.push({
                    url:"data:image/png;base64," + value,
                    isSelect:true
                })
            }
        })
        if(_images.length < 3){
            _images.push({
                url:"assets/images/Message_Add@2x.png",
                isSelect:false
            })
        }
        this.showImage = _images;
    }
    dismiss(){
        this.navC.pop()
    }
    ionViewCanEnter(){
        return true
        // return this.userM.isAble()
    }
    textInput(event:KeyboardEvent){
        console.log(event);
        let target:any = event.target;
        this.contentValue = target.innerText as string;
        if(this.contentValue.length > 300){
            let _value = this.contentValue.substring(0,300);
            target.innerText =  _value;
            debugger
            this.contentValue = _value;
            target.blur();
        }
    }

    leaveSumbit(){
        let _imgs = this.images.map((value)=>{
            return "data:image/jpeg;base64," + value
        })
        let loadVC = this.loadV.create({
            enableBackdropDismiss:true
        })
        loadVC.present();
        this.netM.POST(this.fac.URL("exhibition/msg"),{id:this.node.id,content:this.contentValue,album:_imgs}).subscribe((result:ResponseResult)=>{
            loadVC.dismiss()
            this.events.publish(NetMessageNotifacation,result.ok ? "提交成功" : "提交失败");
        })
    }
}