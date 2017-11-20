
/**
 * Created by zhuzihao on 2017/10/31.
 */
import {Page, TransitionDoneFn} from "ionic-angular/umd/navigation/nav-util";
import {NavController, NavOptions, ViewController} from "ionic-angular/index";
import { UserLoginComponent } from "./login/UserLoginComponent"
import {Injectable} from "@angular/core";

@Injectable()
export class NavFuncManager{
  //有这个管理导航
  constructor(){}
  push(nav:NavController,viewC:ViewController,page:Page,params?: any,opts?:NavOptions,done?:TransitionDoneFn){
    nav.push(page,params,opts,done).then((flag)=>{
      //视图实现can 来实现是否可进入
      if(!flag){
        //这里说明需要登入权限
        let pars = {
          params:params,
          page:page,
          opts:opts,
          done:done
        };
        nav.push(UserLoginComponent,pars);
      }
    })
  }
}

