/**
 * Created by zhuzihao on 2017/10/27.
 */

import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';

@Injectable()
export  class PXHandle{
  constructor(private plat:Platform){}
  Width(px:number):number{
    return px / 750 * this.plat.width()
  }
  Height(px:number):number{
    return px / 1334 * this.plat.height()
  }
}
