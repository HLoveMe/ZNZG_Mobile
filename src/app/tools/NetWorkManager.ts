/**
 * Created by zhuzihao on 2017/10/12.
 */
import { Injectable } from '@angular/core';
import { Headers, URLSearchParams
} from "@angular/http";

import { Observable } from 'rxjs/Observable';
import { Subject }  from "rxjs/Subject"

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/combineLatest'
import 'rxjs/add/operator/zip'
import 'rxjs/add/operator/last'
import 'rxjs/add/operator/retry'
import 'rxjs/add/operator/catch'

import {Events, Platform} from "ionic-angular";
import {NetMessageNotifacation} from "../Constant";
import {
  HttpClient, HttpHandler, HttpRequest, HttpInterceptor, HttpEvent, HttpResponse,
  HttpErrorResponse, HttpHeaders, HttpParams
} from "@angular/common/http";
import {UserManager} from "./UserManager";
import {HTTP, HTTPResponse} from "@ionic-native/http";

@Injectable()
export  class  AuthorizationInterceptor implements HttpInterceptor{
  constructor(private userManager:UserManager){};
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
    let token:string = (this.userManager.user != null) ? this.userManager.user.token :"";
    let nReq = req.clone({
      headers:req.headers.set("Authorization",token)
        .set("Access-Control-Allow-Origin","*")
        .set("Content-Type","application/x-www-form-urlencoded")
    });
    return next.handle(nReq);
  }
}
@Injectable()
export class HttpStatusErrorInterceptor implements  HttpInterceptor{
  constructor(private  events:Events){};
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
    if(req.responseType == 'json'){
      return next.handle(req).do((event)=>{
          if (event instanceof  HttpResponse){
            //MainView
            // (this.app.getRootNav() as NavController).getViews()[0]._cmp.instance
            let result = event.body as {[name:string]:any};
            let status = result["res_status"] as number;
            if(status == -1){
              let msg = result["res_msg"];
              this.events.publish(NetMessageNotifacation,msg);
            }else if(status == 0){
              console.log("未登入");
            }
          }
      })
    };
    return next.handle(req);
  }
}

@Injectable()
export class URLFactory{
  private BaseURl:string;
  constructor(private plat:Platform){
    this.BaseURl = plat.url();
  }
  URL(content:string):string{
    if(this.BaseURl.indexOf("file://") >=0 ){
      //UIWevView 打包之后
      return  "http://ah.vr68.com/apiv1/" + content;
    }else if(this.BaseURl.indexOf("localhost:8080") >= 0){
      //WKWebView 打包之后
      /**
       *  针对WKWebView 这里没做处理  还是存在Cors问题
       *  请阅读ionic WkWebView说明
       * */
      console.log("针对WKWebView 这里没做处理  还是存在Cors问题 \r 请阅读ionic WkWebView说明");
      return  "http://ah.vr68.com/apiv1/" + content;
    }else{
      //远程 或者 远程真机调试
      //设置代理
      return "/apiv1/" + content;
    }
  }
}
export class ResponseResult{
  ok:boolean;
  result?:{[key:string]:any};
  error?:any;
}

@Injectable()
export class  NetWorkManager{
  private BaseURl:string;
  constructor(
              private client:HttpClient,
              private native:HTTP,
              private plt:Platform
  ){
    this.BaseURl = plt.url();
  }
  private parserResult(res:{string:any}){
      let status = res["res_status"] as number;
      if(status == 1){
          return {ok:true,result:res["res_body"],error:null}
      }else if(status == 0){
          return {ok:false,result:"未登入",error:null}
      }else{
        // -1 显示信息
        return {ok:false,result:res["res_msg"],error:null}
      }
  }
  private NetWork(url:string,method:"GET" | "POST",parmars?:{[key:string]: any},header?:Headers):Observable<ResponseResult>{
    return Observable.create((sub:Subject<ResponseResult>)=>{
      if(this.BaseURl.indexOf("localhost:8080") >= 0){
        //使用本地网络请求绕过CORS
        let _pars = parmars || {};
        let _header = header || {};
        let _promise = null;
        if(method == "GET"){
          _promise = this.native.get(url,_pars,_header)
        }else if(method == "POST"){
          _promise = this.native.post(url,_pars,_header)
        }else{
          console.warn("注意请求的方法 GET or POST");
          sub.error("注意请求的方法 GET or POST");
          return
        }
        (_promise as Promise<HTTPResponse>).then((response:HTTPResponse)=>{
          let _result = this.parserResult(JSON.parse(response.data) as {string:any});
          sub.next(_result as ResponseResult);
          sub.complete();
        }).catch((err:HTTPResponse)=>{
          sub.next({ok:false,result:null,error:err.error} as ResponseResult);
          sub.complete();
            // sub.error(err.error);
        })
      }else{
        //使用 HttpClient

        let request = null
        let _header = header == null ? null : new HttpHeaders(header.toJSON());
        if (method == "POST"){
          let params:URLSearchParams = new URLSearchParams();
          if (null != parmars){
            for (var one in parmars){
              params.set(one,parmars[one]);
            }
          }
          request = new HttpRequest<string>(method,url,params.toString(),{
            headers: _header,
            responseType:"json",
          });
        }else{
          //HttpParams
          let params:HttpParams = new  HttpParams()
          if (null != parmars){
            for (var one in parmars){
              params = params.set(one,parmars[one]);
            }
          }
          request = new HttpRequest<string>(method,url,{
            headers: _header,
            responseType:"json",
            params:params
          });
        }




        this.client.request(request).subscribe((event)=>{
          if ( event instanceof  HttpResponse){
            let result = (event as HttpResponse<any>).body;
            let _result = this.parserResult(result as {string:any});
            sub.next(_result as ResponseResult);
            sub.complete();
          }
        },(response:HttpErrorResponse)=>{
          console.log(response);
          sub.next({ok:false,result:null,error:response.error} as ResponseResult);
          sub.complete();
        })
      }
    });
  }
  Get(url:string,header?:Headers,parms?:{[key:string]: any}):Observable<ResponseResult>{
    return this.NetWork(url,"GET",parms,header);
  }

  /**
   *  result
   *   {
   *    ok:bool,
   *    result:any,
   *    error:any
   *  }
   *  这里 已经处理error  ok 表示请求是否成功
   * */
  POST(url:string,body?:{[name:string]:any}):Observable<ResponseResult>{
    return this.NetWork(url,"POST",body);
  }
}
/***

*/
