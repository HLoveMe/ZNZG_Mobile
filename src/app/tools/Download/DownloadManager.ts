

import {Injectable} from "@angular/core";
import { Storage } from '@ionic/storage';
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import {HTTP, HTTPResponse} from "@ionic-native/http";

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
}
class DownloadTask{
    private http:HTTP;
    private subject:Subject<DownloadTaskStatus>  = new Subject<DownloadTaskStatus>();
    private progress:number = 0.0;
    private sorce:DownFileSource;
    constructor(sorce:DownFileSource,http:HTTP){
        this.sorce = sorce;
        this.http = http;
    }
    hasGoing():boolean{
        return (!this.subject.isStopped && !this.subject.hasError);
    }
    curentObservable():Observable<DownloadTaskStatus>{
        return this.subject.asObservable();
    }
    start():Observable<DownloadTaskStatus>{
        Observable.interval(500).take(20).map((i)=>{
            return (i+1) * 5;
        }).subscribe((progress)=>{
            this.progress = progress;
            this.subject.next({
                status:DownLoadStatus.Downloading,
                source:this.sorce,
                progress:this.progress
            } as DownloadTaskStatus);
        },()=>{
            this.subject.next({
                status:DownLoadStatus.Error,
                source:this.sorce,
                progress:this.progress
            } as DownloadTaskStatus);
        },()=>{
            this.subject.next({
                status:DownLoadStatus.Finish,
                source:this.sorce,
                progress:this.progress
            } as DownloadTaskStatus);
        })
        this.http.downloadFile(this.sorce.url,{},{},"").then((res:HTTPResponse)=>{

        },()=>{

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
    //所有历史状态
    /***
     *  1 进行
     *  2 完成
     *  -1 错误
     */
    private downloads:{[url:string]:DownLoadStatus} = {};
    //当前下载
    private tasks:{[url:string]:DownloadTask} = {}
    constructor(
        private storge:Storage,
        private http:HTTP
    ){
        this.storge.ready().then(()=>{
            this.storge.remove(this.downloadsStorgeKey);
            this.storge.get(this.downloadsStorgeKey).then((va)=>{
                this.downloads = va || {};
             })
        })
    }
    //开始任务
    startDownloadTask(url:string):Observable<DownloadTaskStatus>{
       let _task = this.tasks[url];
       if(null != _task){
           return _task.curentObservable();
       }
       let task = new DownloadTask({url} as DownFileSource,this.http);
       this.downloads[url] = DownLoadStatus.Downloading;
       this.tasks[url] = task;
       this.storge.set(this.downloadsStorgeKey,this.downloads);
       return task.start().do((status:DownloadTaskStatus)=>{
           switch (status.status){
               case DownLoadStatus.Error:
               this.downloads[status.source.url] = DownLoadStatus.Error;
               this.storge.set(this.downloadsStorgeKey,this.downloads);
               break
               case DownLoadStatus.Finish:
               this.downloads[status.source.url] = DownLoadStatus.Finish;
               this.storge.set(this.downloadsStorgeKey,this.downloads);
               break
               case DownLoadStatus.Normal:
                this.tasks[status.source.url] = null;
                this.downloads[status.source.url] = null;
                this.storge.set(this.downloadsStorgeKey,this.downloads);
               break
           }
       });
    }
    //取消下载
    cancelTask(url:string){
        let _task = this.tasks[url];
        if(null != _task){
            _task.cancel()
        }
    }
    //是否已经进行了操作
    hasTaskStatus(url:string):DownLoadStatus{
        return this.downloads[url];
    }
    stopDownload(task:string){
        
    }
}