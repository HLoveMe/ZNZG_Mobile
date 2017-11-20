/**
 * Created by zhuzihao on 2017/10/28.
 */

declare  var fengmap:any;

declare  var $;


import { InjectionToken } from '@angular/core';

export let URLString = (content:string)=>{
  return "http://ah.vr68.com/apiv1/" + content;
};
export let URLToken = new InjectionToken<string>("URLFunc");
