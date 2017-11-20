/**
 * Created by zhuzihao on 2017/11/6.
 */


import {Injectable} from "@angular/core";
import {NetWorkManager, ResponseResult, URLFactory} from "../NetWorkManager";
import {BehaviorSubject, Observable} from "rxjs/Rx";
import { Storage } from '@ionic/storage';

export class NodeExhibition{
   id:string;
   title:string;
   summary:string;
   introduction:string;
   voice:string;
   fid:string;

   is_push_msg:string;
   coord_x:string;
   coord_y:string;
   coord_groupid:number;

   time_start:string;
   time_end:string;
  //点
   points:string[] = [];
   QRcode:string;
}

@Injectable()
export class NodeExhibitionManager{
  nodesSubject:BehaviorSubject<NodeExhibition[]>;
  private nodes:NodeExhibition[] = [];
  private static StorageKey:string  = "NodeExhibitionStorageKey";
  constructor(
    private http:NetWorkManager,
    private store:Storage,
    private Fac:URLFactory
  ){
    this.nodesSubject = new BehaviorSubject<NodeExhibition[]>([]);
    store.get(NodeExhibitionManager.StorageKey).then((nodes)=>{
        this.nodes =  nodes as  NodeExhibition[];
        if(this.nodes == null || this.nodes.length == 0){
          this.loadAlls();
        }else {
          this.nodesSubject.next(this.nodes)
        }
    })
  }
  private loadAlls(){
    this.http.Get(this.Fac.URL("exhibition/list")).subscribe((res:ResponseResult)=>{
      if(res.ok){
        this.nodes = res.result as  NodeExhibition[];
        this.store.set(NodeExhibitionManager.StorageKey,res.result);
        this.nodesSubject.next(this.nodes)
      }else{
        this.nodes = [];
        this.nodesSubject.next(this.nodes)
      }
    })
  }
  filterNodeExhibition(fid:string):Observable<NodeExhibition>{
    let node:any;
    for (var i = 0;i<this.nodes.length;i++){
      let one = this.nodes[i];
      if (one.fid == fid){
        node = one;
        break
      }
    }
    if(node == null){
      return this.http.Get(this.Fac.URL("exhibition/info"),null,{"fid":fid}).map<ResponseResult,NodeExhibition>((res:ResponseResult)=>{
        if(res.ok){
            return res.result as NodeExhibition;
        }else{
          return null;
        }
      })
    }else{
      return Observable.of<NodeExhibition>(node as NodeExhibition)
    }
  }
}
