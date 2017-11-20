

import {Injectable} from "@angular/core";

@Injectable()
export class MapNavigationManager{
    private naviM:any;
    set map(value:any){
        this.naviM = new fengmap.FMNavigation({
            map:value,
            lineStyle: {
              lineType: fengmap.FMLineType.FMARROW,
              lineWidth: 2,
            }
          });
    }
    /**当前是否在导航*/
    isRouteNavigation:boolean = false;
    constructor(){}
    /**
     *  x: content.node.coord_x,
        y: content.node.coord_y,
        groupID: content.node.coord_groupid,
     * @param start 
     * 
     * @param end 
     * 
     * plan:是否需要隐藏操作界面
     */
    showNavigationRoute(start:any,end:any,plan:boolean = true){
        let _start = {
            url: 'assets/images/start_icon@2x.png',
            size: 20,
            ...start
        }
        let _end = {
            url: 'assets/images/end_icon@2x.png',
            size: 20,
            ...end
        }
        this.naviM.setStartPoint(_start);
        this.naviM.setEndPoint(_end);
        this.naviM.drawNaviLine();

        this.isRouteNavigation = plan;
    }
    /**
     * 退出并清除地图标注
     */
    clearNavigationRoute(){
        this.naviM.clearAll();
        this.isRouteNavigation = false;
    }
}