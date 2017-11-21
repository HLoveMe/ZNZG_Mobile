

import {Component,ElementRef,Renderer2,ViewChild} from '@angular/core';
import {NavController, ViewController, NavParams} from "ionic-angular/index";
import { URLFactory, NetWorkManager, ResponseResult } from '../../../app/tools/NetWorkManager';
import { NodeExhibition } from '../../../app/tools/SourceManager/NodeExhibitionManager';
import { DownloadManager, DownLoadStatus, DownloadTaskStatus } from '../../../app/tools/Download/DownloadManager';
import { Observable } from 'rxjs/Observable';
import {Events} from "ionic-angular";
import { NetMessageNotifacation } from '../../../app/Constant';
import { NavFuncManager } from '../base/BaseProtocol';
import { EmailSendView } from './EmailSendView';

enum DatumType {
    notKnow,TXT,Image,Video,PDF,PPT,Xls,Doc
}
class FileSource{
    id:string;
    raw_file_name:string;
    file_uri:string;

    type:DatumType;
    icon:string;
    //是否选中
    select:boolean = false;
    /**
     * 状态
     *  0 还没下载
     *  1 正在下载
     *  2 已经下载完成
     *  -1 下载失败
     */
    download:number = 0;
    progress:string = "0";
    constructor(info:any){
        this.id = info["id"];
        this.raw_file_name = info["raw_file_name"];
        this.file_uri = info["file_uri"];
        let urls = this.file_uri.toLowerCase().split(".");
        let url = urls[urls.length -1];
            if((url == "jpg") || url == "png"){
                this.icon = "JPG@2x.png"
                this.type = DatumType.Image
            }else if(url == "txt"){
                this.icon = "TXT@2x.png"
                this.type = DatumType.TXT
            }else if(url == "mp4"){
                this.icon = "MP4@2x.png"
                this.type = DatumType.Video
            }else if(url == "pdf"){
                this.icon = "PDF@2x.png"
                this.type = DatumType.PDF
            }else if(url == "ppt"){
                this.icon = "PPT@2x.png"
                this.type = DatumType.PPT
            }else if(url == "xls"){
                this.icon = "xls@2x.png"
                this.type = DatumType.Xls
            }else if(url == "doc"){
                this.icon = "DOC@2x.png"
                this.type = DatumType.Doc
            }else{
                this.icon = "notknow"
            }
    }
}
@Component({
    templateUrl:"./SourceDownloadView.html",
})
export class SourceDownloadView{
    private node:NodeExhibition;
    private sources:FileSource[] = [];
    @ViewChild("Email") email:ElementRef;
    constructor(
        private navP:NavParams,
        private navC:NavController,
        private ViewC:ViewController,
        private Fanc:URLFactory,
        private netWork:NetWorkManager,
        private downM:DownloadManager,
        private render:Renderer2,
        private event:Events,
        private navM:NavFuncManager,
    ){}
    ionViewDidLoad(){
        this.node = this.navP.get('node');
        this.render.listen(this.email.nativeElement,"click",()=>{
            let ids:string[] = [];
            this.sources.forEach((one)=>{
                if(one.select){
                    ids.push(one.id);
                }
            })
            if(ids.length >= 1){
                console.log("邮件发送");
                this.navM.push(this.navC,this.ViewC,EmailSendView,{"email_data":{"id":this.node.id,"atta_ids":ids.join(",")}})
            }else{
                this.event.publish(NetMessageNotifacation,"选择需要发送的文件")
            }
        })
        this.netWork.Get(this.Fanc.URL("exhibition/attachments"),null,{"id":this.node.id}).subscribe((value:ResponseResult)=>{
            if(value.ok){
                this.sources = (value.result as any[]).map((one)=>{
                    let souce = new FileSource(one);
                    souce.download = 0;
                    let status = this.downM.hasTaskStatus(souce.file_uri);
                    switch (status){
                        case DownLoadStatus.Downloading:
                        souce.download = 1;
                        break
                        case DownLoadStatus.Error:
                        souce.download = -1;
                        break
                        case DownLoadStatus.Finish:
                        souce.download = 2;
                        souce.progress = "100";
                        break
                    }
                    if(souce.download != 0){
                        //表示已经进行了操作
                        if(status == DownLoadStatus.Downloading){
                            this.downM.startDownloadTask(souce.file_uri).subscribe((st:DownloadTaskStatus)=>{
                                this.handletask(souce,st);
                            })
                        }
                    }
                    return souce;
                })
                //初始下载状态设置
            }
        })
    }
    dismiss(){
        this.navC.pop();
    }
    //下载标识图片
    downIconName(one:FileSource){
        if(one.download == 0){
            return "assets/images/Select_Icon_download@2x.png";
        }else if(one.download ==  1){
            return "assets/images/cancel@2x.png";           
        }else if(one.download ==  2){
            return "assets/images/finish@2x.png";           
        }else{
            return "assets/images/redown@2x.png";
        }
    }
    downStatusName(one:FileSource){
        //一直掉 也不想改了
        if(one.download == 0){
            return "";
        }else if(one.download ==  1){
            return "下载中";
        }else if(one.download ==  2){
            return "下载完成";
        }else{
            return "下载错误";
        }
    }
    operationSource(one:FileSource){
        if(one.download == 0){
            //还没开始
            //开始下载
            one.download = 1;
            this.downM.startDownloadTask(one.file_uri).subscribe((st:DownloadTaskStatus)=>{
                 this.handletask(one,st);
            })
        }else if(one.download ==  1){
            //正在下载
            //取消下载
            one.download = 0;
            one.progress = '0'
            this.downM.cancelTask(one.file_uri);
        }else if(one.download ==  2){
            //下载完成
            //不进行操作
        }else{
            //下载失败
            //重新下载
            one.download = 0;
            this.downM.cancelTask(one.file_uri);
            this.operationSource(one);
        }
    }
    private handletask(source:FileSource,info:DownloadTaskStatus){
        switch (info.status){
            case DownLoadStatus.Downloading:
            source.progress = info.progress+"";
            break
            case DownLoadStatus.Error:
            source.download = -1;
            break
            case DownLoadStatus.Finish:
            console.log(info)
            source.download = 2;
            source.progress = "100";
            break
        } 
    }
}