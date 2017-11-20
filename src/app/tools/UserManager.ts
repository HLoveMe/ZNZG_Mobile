/**
 * Created by zhuzihao on 2017/10/31.
 */

import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs/Rx";
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/toPromise';

export class UserInfo{
  uid:string;
  token:string;
  nickname:string;
  headimgurl:string;
  exp:string;
  iat:string;
}

@Injectable()
export class  UserManager{
  userSubject:BehaviorSubject<UserInfo>;
  user?:UserInfo;
  private USERKEY:string = "User_Info";
  constructor(private storge:Storage){
    this.userSubject = new BehaviorSubject<UserInfo>(null);
    this.storge.ready().then(()=>{
      storge.get(this.USERKEY).then((user)=>{
        this.user = user as UserInfo;
        console.log(user,this.user);
        this.userSubject.next(this.user);
      });
    });
  }
  loginSucess(user:UserInfo){
    this.user = user;
    this.userSubject.next(this.user);
    this.storge.set(this.USERKEY,user)
  }
  isAble():boolean{
    return this.user != null && ((new Date()).getTime() > parseInt(this.user.exp));
  }
}


