/**
 * Created by zhuzihao on 2017/11/23.
 */

class PointStatus{
  location:any;
  time:number;
}
class UpdateStatus{
  startPoint?:PointStatus;
  endPoint?:PointStatus;
  distance:number = 0;
  setPoint(point:PointStatus){
    this.distance = 0;
    if(this.startPoint == null){
      this.startPoint = point;
    }else if(this.endPoint == null){
      this.endPoint = point;
    }else {
      this.endPoint = this.startPoint;
      this.startPoint = point;
    }
  }
  //是否满足上传条件 满足
  CanUpdate(map:any,time:number = 2000,len:number = 0.5):boolean{
    if(this.startPoint != null && this.endPoint == null){
      //第一个
      return true;
    }else if(this.startPoint != null && this.endPoint != null){
        if((this.endPoint.time - this.startPoint.time) >= time){
          /**
           *  距离通过map 对象可以得到  这里就想做了
           * */
          return true
        }
        return false;
    }
    return false;
  }
}

export default class LocationSocketManager{
  private  map:any;
  private  socket:WebSocket;
  private updateS:UpdateStatus;
  private id:string;
  constructor(
     map:any,
     id:string,
  ){
    this.map = map;
    this.id = id;
    this.updateS = new UpdateStatus();
  }
  startLocationUpdate(){
    this.socket = new WebSocket("ws://39.108.80.183:9503");
    this.socket.onopen = (ev:Event)=>{
      console.log("socket 打开",ev);
    };
    this.socket.onmessage = (ev:MessageEvent)=>{
      console.log("socket得到消息 ",ev);
    };
    this.socket.onerror = (ev:Event)=>{
      console.log("socket错误 ",ev);
    }
    this.socket.onclose = (ev:CloseEvent)=>{
      console.log("socket关闭 ",ev);
    }
    //控制2秒检测一次 并且要求距离为 0.5m
  }
  /**
   * 检测该点是否需要上传 条件为上次上传的时间和当前相差 2s 距离为0.5m;
   * */
  updatePoint(location:any,_len:number = 0.5,_time:number = 2000){
    //测试 不打开
    if(_time == 2000){
      console.log("不上传  如果需要打开即可");
      return;
    }
    
    let time = new Date().getTime();
    this.updateS.setPoint({time,location} as PointStatus);
    if(this.updateS.CanUpdate(this.map,_time,_len)){
      //满足条件
      let po = this.updateS.startPoint;
      this.socket.send(JSON.stringify({
        user_id:this.id,
        coord_x:po.location.x,
        coord_y:po.location.y,
        coord_groupid:po.location.groupID
      }))
    }
  }
}
