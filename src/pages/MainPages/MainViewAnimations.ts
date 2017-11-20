/**
 * Created by zhuzihao on 2017/11/7.
 */
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

export let MainAnimations = [
  trigger("ShowStatusLeft",[
    state("show",style({
      left:"10px",
    })),
    state("hidden",style({
      left:"-50px"
    })),
    transition('* => hidden', animate('0.5s ease-in')),
    transition('* => show', animate('0.5s ease-in'))
  ]),
  trigger("ShowStatusRight",[
    state("show",style({
      right:"10px"
    })),
    state("hidden",style({
      right:"-46px"
    })),
    transition('* => hidden', animate('0.5s ease-in')),
    transition('* => show', animate('0.5s ease-in'))
  ]),
  trigger("ShowStatusTop",[
    state("show",style({
      top:"40px"
    })),
    state("hidden",style({
      top:"-80px"
    })),
    transition('* => hidden', animate('0.5s ease-in')),
    transition('* => show', animate('0.5s ease-in'))
  ]),
  trigger("ShowStatusNavigation",[
    state("show",style({
      bottom:"20px"
    })),
    state("hidden",style({
      bottom:"-40px"
    })),
    transition('show => hidden', animate('0.5s ease-in')),
    transition('* => show', animate('0.5s ease-in'))
  ])
];
