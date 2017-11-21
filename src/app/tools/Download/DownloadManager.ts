

import {Injectable} from "@angular/core";
import { Storage } from '@ionic/storage';
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import { FileTransfer, FileTransferObject, FileTransferError } from '@ionic-native/file-transfer';
import { File, FileEntry, RemoveResult } from '@ionic-native/file';
import {Platform} from "ionic-angular";

export class DownFileSource{
    url:string;
}
export enum DownLoadStatus{
    Downloading = 0,Error = 1,Finish = 2,Normal = 3
}
export class DownloadTaskStatus{
    status:DownLoadStatus
    source:DownFileSource
    progress:number
    name:string  //文件名
    target:string //下载文件存放路径
}
class DownloadTask{
    private file:File;
    private transfer:FileTransfer;

    private subject:Subject<DownloadTaskStatus>  = new Subject<DownloadTaskStatus>();
    private progress:number = 0.0;
    private sorce:DownFileSource;
    private target:string = null;
    constructor(sorce:DownFileSource,transfer:FileTransfer,file:File){
        this.sorce = sorce;
        this.transfer = transfer;
        this.file = file;
    }
    hasGoing():boolean{
        return (!this.subject.isStopped && !this.subject.hasError);
    }
    curentObservable():Observable<DownloadTaskStatus>{
        return this.subject.asObservable();
    }
    /**
     * 手机环境下下载
     * 
     */
    start():Observable<DownloadTaskStatus>{
        let ransferObject = this.transfer.create();
        let url = this.sorce.url;
        let name = url.split("/").pop();
        this.target = this.file.dataDirectory + name;
        ransferObject.onProgress((progres:ProgressEvent)=>{
            this.progress = parseFloat(((progres.loaded / progres.total) * 100).toFixed(2));
            this.subject.next({
                status:DownLoadStatus.Downloading,
                source:this.sorce,
                progress:this.progress,
                target:this.target,
                name
            } as DownloadTaskStatus);
        });
        ransferObject.download(url,this.target).then((enter:FileEntry)=>{
            this.subject.next({
                status:DownLoadStatus.Finish,
                source:this.sorce,
                progress:this.progress,
                target:this.target,
                name
            } as DownloadTaskStatus);
        },(error:FileTransferError)=>{
            this.subject.next({
                status:DownLoadStatus.Error,
                source:this.sorce,
                progress:this.progress,
                target:this.target,
                name
            } as DownloadTaskStatus);
        })
        
        return this.subject.asObservable();
    }
    /**
     * 在不是 真机环境下的 模拟下载
     */
    _start():Observable<DownloadTaskStatus>{
        Observable.interval(500).take(20).map((i)=>{
            return (i+1) * 5;
        }).subscribe((progress)=>{
            this.progress = progress;
            this.subject.next({
                status:DownLoadStatus.Downloading,
                source:this.sorce,
                progress:this.progress,
                target:"不是手机,模拟下载",
                name:"无所谓"
            } as DownloadTaskStatus);
        },()=>{
            this.subject.next({
                status:DownLoadStatus.Error,
                source:this.sorce,
                progress:this.progress,
                target:"不是手机,模拟下载",
                name:"无所谓"
            } as DownloadTaskStatus);
        },()=>{
            this.subject.next({
                status:DownLoadStatus.Finish,
                source:this.sorce,
                progress:this.progress,
                target:"不是手机,模拟下载",
                name:"无所谓"
            } as DownloadTaskStatus);
        })
        return this.subject.asObservable();
    }
    cancel(){
        // this.subject.unsubscribe();
        this.subject.next({
            status:DownLoadStatus.Normal,
            source:this.sorce,
            progress:this.progress
        } as DownloadTaskStatus)
        this.subject.complete();
    }
    
}
@Injectable()
export class DownloadManager{
    private downloadsStorgeKey:string = "downloadsStorgeKey";
    private downloadsFinishKey:string = "downloadsFinishKey";
    //所有历史状态
    /***
     *  1 进行
     *  2 完成
     *  -1 错误
     */
    private taskStatus:{[url:string]:DownLoadStatus} = {};
    //记录已经下载完成的
    private downFinishs:{[url:string]:string} = {};
    //当前下载
    private tasks:{[url:string]:DownloadTask} = {}
    constructor(
        private storge:Storage,
        private file:File,
        private transfer:FileTransfer,
        private platem:Platform,
    ){
        this.storge.ready().then(()=>{
            this.storge.get(this.downloadsStorgeKey).then((va)=>{
                this.taskStatus = va || {};
             })
             this.storge.get(this.downloadsFinishKey).then((va)=>{
                this.downFinishs = va || {};
             })
        })
    }
    //开始任务
    startDownloadTask(url:string):Observable<DownloadTaskStatus>{
       let _task = this.tasks[url];
       if(null != _task){
           return _task.curentObservable();
       }
       let task = new DownloadTask({url} as DownFileSource,this.transfer,this.file);
       this.taskStatus[url] = DownLoadStatus.Downloading;
       this.tasks[url] = task;
       this.storge.set(this.downloadsStorgeKey,this.taskStatus);
       return (this.platem.is("cordova") ? task.start() : task._start()).do((status:DownloadTaskStatus)=>{
           switch (status.status){
               case DownLoadStatus.Error:
               this.taskStatus[status.source.url] = DownLoadStatus.Error;
               this.storge.set(this.downloadsStorgeKey,this.taskStatus);
               break
               case DownLoadStatus.Finish:
               this.taskStatus[status.source.url] = DownLoadStatus.Finish;
               this.storge.set(this.downloadsStorgeKey,this.taskStatus);
               this.downFinishs[status.source.url] = status.name;
               this.storge.set(this.downloadsFinishKey,this.downFinishs);
               break
               case DownLoadStatus.Normal:
                this.tasks[status.source.url] = null;
                this.taskStatus[status.source.url] = null;
                this.storge.set(this.downloadsStorgeKey,this.taskStatus);
               break
           }
       });
    }
    //取消下载
    cancelTask(url:string){
        let _task = this.tasks[url];
        if(null != _task){
            _task.cancel();
            delete this.tasks[url];
            delete this.taskStatus[url];
            this.storge.set(this.downloadsStorgeKey,this.taskStatus);
        }
    }
    //是否已经进行了操作
    hasTaskStatus(url:string):DownLoadStatus{
        return this.taskStatus[url];
    }
    /**
     * 所有已经下载的源
     */
    allFinishSource():{[url:string]:string}{
        return this.downFinishs;
    }
    /**
     * 删除文件
     */
    removeFile(url:string):Observable<boolean>{
        return Observable.create((obs:Subject<boolean>)=>{
            if(this.platem.is("cordova") ){
                let name = this.downFinishs[url];
                if(name != null){
                    this.file.removeFile(this.file.dataDirectory,name).then((res:RemoveResult)=>{
                        obs.next(res.success);
                        obs.complete();
                    },(e)=>{
                        obs.error(e);
                    })
                }else{
                    obs.error({name:"",message:"不存在该文件"}  as Error);
                }
            }else{
                obs.error({name:"",message:"不在手机上"}  as Error);
            }
        }).do((success)=>{
            if(success){
                delete this.taskStatus[url];
                this.storge.set(this.downloadsStorgeKey,this.taskStatus);
                delete this.downFinishs[url];
                this.storge.set(this.downloadsFinishKey,this.downFinishs);
            }
        })
    }
}