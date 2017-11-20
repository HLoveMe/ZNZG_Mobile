
/**
 * Created by zhuzihao on 2017/11/6.
 */
import {NodeExhibitionManager, NodeExhibition} from "./NodeExhibitionManager";
import { take } from "rxjs/operator/take";

class NodeExhibitionInfo{
  node:NodeExhibition;
  layer:any;
  constructor(node:NodeExhibition){
    this.node = node;
  }
}

//不作为服务 仅仅作为一个管理类
export  class PolygonLayerManager{
  private nodes:NodeExhibitionInfo[] = [];
  private time:number = 0;
  constructor(
    public nodesM:NodeExhibitionManager,
    public map:any
  ){
    this.nodesM.nodesSubject.subscribe((nodes)=>{
      this.nodes = nodes.map((node)=>{
          return new NodeExhibitionInfo(node);
      })
      console.log(this.nodes)
    })
  }
  showCurrentPolygon(id:string){
    let currents = this.nodes.filter((value:NodeExhibitionInfo)=>{
        let node  = value.node;
        return node.coord_groupid == parseInt(id)
    })
    //删除所有围栏
    //显示当前围栏
    let group = this.map.getFMGroup(id);
    let layer = group.getOrCreateLayer('polygonMarker');
    for (var index = 0;index<currents.length;index++){
      let one = currents[index].node;
      let points = one.points.map((value:string)=>{
        let xy = value.split(",");
        return {x:xy[0],y:xy[1],z:id}
      });
      let poly = new fengmap.FMPolygonMarker({
        color:"#4169e1",
        alpha:0.5,
        lineWidth:2,
        height:1,
        points:points
      })
      layer.addMarker(poly)
      currents[index].layer = poly;
    }
  }
  //检测是否在围栏
  /**
   * {
   *    focusGroupID:focusID,
   *    x:
   *    y:
   *    z:
   * }
   * @param info 
   * 
   */
  checkPoint(info:any){
    if(info == null){return;}
    let current = (new Date()).getTime();
    if((current - this.time) < 3000){
        return;
    }
    this.time = current;
    let currents = this.nodes.filter((value:NodeExhibitionInfo)=>{
      let node  = value.node;
      return node.coord_groupid == 1 && node.is_push_msg == "1";
    })
    if(currents.length < 1){return;}
    let target = currents.find((value)=>{
        return value.layer.contain({
          x:info.x,
          y:info.y
        })
    })
    if(target){
      target.node.is_push_msg = "0";
      return target.node;
    }
  }
}
