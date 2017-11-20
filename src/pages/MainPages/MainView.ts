/**
 * Created by zhuzihao on 2017/10/27.
 */
import {
  Component, ViewChild, AfterContentInit, ElementRef, Renderer2, ViewChildren, QueryList, ViewContainerRef,ComponentFactoryResolver
} from '@angular/core';
import {LoadingController, Loading, ModalController, Events} from 'ionic-angular';
import {MainFunView, MapSeachResultView} from "../Views/MainFunView/MainFunView"
import { MainFunType,MainFunViewManager ,MainFunTypeInstance,MainFuncMessage} from "../Views/MainFunView/MainFuncManager"
import {MainSeacherView, SeachStatus, InputStatus} from "../Views/Seacher/MainSeacherView"
import { SettingViewConponent } from "./settings/SettingViewConponent"
import {NetMessageNotifacation} from "../../app/Constant";
import {NetWorkManager} from "../../app/tools/NetWorkManager";
import {PolygonLayerManager} from "../../app/tools/SourceManager/PolygonLayerManager";
import {NodeExhibitionManager, NodeExhibition} from "../../app/tools/SourceManager/NodeExhibitionManager";
import {NodeInfoView, NodeShowStatus} from "./nodePage/NodeInfoView";
import { ExhibitionPolygonInfoView } from "./nodePage/ExhibitionPolygonInfo";
import {MusicComponent} from "../Views/Music/MusicComponent";
import {MainAnimations} from "./MainViewAnimations";
import { RoutePlanView } from "../Views/RoutePlanView/RoutePlanView"
import { MapNavigationManager } from "../../app/tools/Map/MapNavigationManager"


@Component({
  selector: 'main-viewc',
  templateUrl: 'MainView.html',
  animations:MainAnimations
})

export  class MainView implements AfterContentInit{
  MapID:string = "sapce-2017";
  MapKey:string = "81b77e8a229f0478ef397f58364aa58c";
  AppName:string = "space_test";
  ThemeID:string = "4007";

  Map:any;
  locationMaker:any; //我的点
  currentMaker:any; //当前选择的模型
  @ViewChild("MapContainer") container:ElementRef;//地图
  @ViewChild("LeftTools") leftTools:ElementRef;
  @ViewChild("floors") Floor:ElementRef;//楼层
  @ViewChild("Functions") functios:ElementRef;//左中部
  @ViewChild("Seach") seach:ElementRef;//搜索框
  @ViewChild("User") user:ElementRef; //左下角
  // @ViewChild("Result") result:ElementRef;  //搜索结果

  @ViewChild("Music") music:ElementRef;
  @ViewChild(MusicComponent) musicCom:MusicComponent;
  @ViewChildren(MainFunView) funcs:QueryList<MainFunView>;
  @ViewChild(MainSeacherView) seacherView:MainSeacherView;
  @ViewChild("SeachResult") resultView:MapSeachResultView;
  @ViewChild("Routeplan",{read:ViewContainerRef}) plan:ViewContainerRef;
  status:MainFunTypeInstance;
  private manager:MainFunViewManager; //功能按钮管理
  private loading:Loading;
  private polyManager:PolygonLayerManager; //围栏管理
  private location:any;//我的位置
  private planView:RoutePlanView;
  constructor(
              private render:Renderer2,
              private loadC:LoadingController,
              private modal:ModalController,
              private events:Events,
              private http:NetWorkManager,
              private nodeM:NodeExhibitionManager,
              private resolver:ComponentFactoryResolver,
              private mapS:MapNavigationManager,
            
  ){
    this.status  =  new  MainFunTypeInstance();
    this.manager = new MainFunViewManager();
  }

  ionViewDidEnter(){
      this.configEvents();
  }
  ngAfterContentInit(){
    this.Map = new fengmap.FMMap({
      //渲染dom
      container: this.container.nativeElement,
      //设置主题
      defaultThemeName: this.ThemeID,
      //对不可见图层启用透明设置 默认为true
      focusAlphaMode: true,
      //开启聚焦层切换的动画显示
      focusAnimateMode: false,
      //对不聚焦图层启用透明设置，当focusAlphaMode = true时有效
      focusAlpha: 0.1,
      //开启2维，3维切换的动画显示
      viewModeAnimateMode: true,
      //地图定位跳转动画设置
      moveToAnimateMode: false,
      // [16, 23], 比例尺级别范围， 16级到23级
      mapScaleLevelRange: [20, 23],
      // [200, 4000]， 自定义比例尺范围，单位（厘米）
      // mapScaleRange: [200, 4000],
      // 默认比例尺级别设置为20级
      defaultMapScaleLevel: 20,
      // 默认自定义比例尺为 1：1000（厘米）
      // defaultMapScale: 1000,
      //支持单击模型高亮，false为单击时模型不高亮
      modelSelectedEffect: true,
      //初始显示楼层，默认[1]
      defaultVisibleGroups: [1],
      //初始聚焦楼层,默认1
      defaultFocusGroup: 1,
      //初始二维还是三维状态,默认是3D状态
      defaultViewMode: fengmap.FMViewMode.MODE_2D,
      //两楼层间的高度
      defaultGroupSpace: 40,
      //默认的地图中心设置
      // defaultViewCenter: {x: 12961582.417, y: 4861877.766},
      //开发者申请应用下web服务的key
      key: this.MapKey,
      //开发者申请应用名称
      appName: this.AppName,
      //设置地图默认状态。defaultControlsPose值可为方向枚举、角度值、或特定角度的Json对象的任意一种。如设置二维模式下正北显示：
      //方向枚举型。可设置正南、正北、正东、正西、东南、西南等方向值。具体可参考fengmap.ControlsPoseEnum类。
      defaultControlsPose: fengmap.FMDirection.NORTH,
      //最大倾斜角
      defaultMaxTiltAngle: 80,
      //设置倾斜角，默认倾斜角为45度
      defaultTiltAngle: 45,
    });
    this.Map.openMapById(this.MapID,function (error) {
        this.loading.dismiss(false);
    });


    this.Map.on("loadComplete",()=>{
      console.log(this.Map)
        this.location = {
            x:this.Map.center.x,
            y:this.Map.center.y,
            groupID:this.Map.focusGroupID
        }
        //初始化其他控件
        this.loading.dismiss("朱子豪");
        this.Map.visibleGroupIDs = this.Map.groupIDs;
        this.Map.focusGroupID = this.Map.groupIDs[0];
        this.connfigSubViews();
        this.configManager();
        this.startOperationListen();
        this.showLocation();

        this.polyManager = new PolygonLayerManager(this.nodeM,this.Map);
        setTimeout(()=>{this.createShowPolygon(this.Map.focusGroupID)},2000);
        this.startLocationListen();
    });
    
    //点击事件
    this.Map.on("mapClickNode",(model)=>{
        switch (model.nodeType){
          case fengmap.FMNodeType.FLOOR:
            if(this.planView != null){
              //当前在路线规划
              this.planView.setPointValue(model);
              return;
            }
            //地板
            break
          case fengmap.FMNodeType.MODEL:
            if(model.typeID == "30000"){return;}//墙
            if(this.planView != null){
              console.log(model)
              this.planView.setPointValue(model);
              return;
            }

            if(this.mapS.isRouteNavigation){
              //正在导航中
            }else{
              this.currentMaker = model;
              this.Map.selectNull();
              this.Map.storeSelect(model);
              //显示信息
              this.showNodeExhibitionInfo(model);
              //显示围栏信息 delete
              // console.log("删除");
              // this.nodeExhibitionShowInfo(model);
            }
            //模型
            break
          case fengmap.FMNodeType.FACILITY:
          case fengmap.FMNodeType.IMAGE_MARKER:
            console.log(model)
            break
        }
    });

    this.loading = this.loadC.create({
      spinner:"circles",
      content:"地图加载中。。。",
      dismissOnPageChange:true,
      showBackdrop:false
    });
    this.loading.present();
 }
  connfigSubViews(){
    this.render.setStyle(this.leftTools.nativeElement,"display","flex");

    this.render.setStyle(this.Floor.nativeElement,"height",57 * this.Map.groupIDs.length + "px");
    this.render.setStyle(this.Floor.nativeElement,"display","flex");

    this.render.setStyle(this.functios.nativeElement,"display","flex");

    this.render.setStyle(this.seach.nativeElement,"display","flex");

    this.render.setStyle(this.user.nativeElement,"display","flex");
  }
  //配置功能管理者
  configManager(){
    this.manager.floor_index = this.Map.focusGroupID;
    this.manager.funcViews = this.funcs.toArray() as [MainFunView];
    this.manager.inputView = this.seacherView;
    this.manager.seachView = this.resultView;
    this.manager.setOperation(this.render);
    this.mapS.map = this.Map;
  }
  //显示 更新 坐标点 
  showLocation(){
    if(this.locationMaker == null){
        this.locationMaker = new fengmap.FMLocationMarker({
          url:"assets/images/home/active.png",
          size:20,
          height:20
        });
        this.Map.addLocationMarker(this.locationMaker);
    }
    this.locationMaker.setPosition({
      x:this.location.x,
      y:this.location.y,
      groupID:this.location.floorID,
      zOffset:1  
    })
  }
  //监听功能回调
  startOperationListen(){
    this.manager.selectSubject.asObservable().subscribe((msgs)=>{
      console.log(msgs)
      for (var i in msgs){
        let one = msgs[i] as MainFuncMessage;
        switch (one.type){
          case MainFunType.ShowStatus:
               this.Map.viewMode = (one.content as Boolean) ? fengmap.FMViewMode.MODE_3D : fengmap.FMViewMode.MODE_2D
            break;
          case MainFunType.PlannRoute:
            this.showRoutePlan();
            break;
          case MainFunType.HotMap:

            break;
          case MainFunType.Location:
          this.Map.moveTo({
            x:this.location.x,
            y:this.location.y,
            z:0,
            groupID:this.location.floorID,
          })
            break;
          case MainFunType.Floor:
            let floor = one.content as number;
            this.Map.focusGroupID = floor;
            break;
          case MainFunType.Scan:

            break;
          case MainFunType.Panorama:

            break;
          case MainFunType.RouteGroom:

            break;
          case MainFunType.MeetHall:

            break;
          case MainFunType.Seacher:
            console.log(one.content);

            let InputS = one.content as SeachStatus;
            switch (InputS.status){
              case InputStatus.Begin:
                break
              case InputStatus.Input:
                let analyser = this.Map.searchAnalyser;
                let request = new fengmap.FMSearchRequest(fengmap.FMNodeType.MODEL);
                request.keyword(InputS.content);
                analyser.query(request,(req,result)=>{
                  this.manager.showSeachResults(result);
                });
                break
              case InputStatus.End:
                this.manager.showSeachResults([]);
                break
            }

            break;
          case MainFunType.USer:
            let modelc = this.modal.create(SettingViewConponent);
            modelc.present();
            break
          case MainFunType.Result:
            let model = one.content;
            this.seacherView.setContent(model.name);
            this.Map.moveTo({groupID:this.Map.focusGroupID ,...model.mapCoord});
            break
        }
      }
    });
  }
  //这里处理 显示文本
  configEvents(){
    let messageLoad:Loading;
      this.events.subscribe(NetMessageNotifacation,(msg)=>{
          if(messageLoad != null){
            messageLoad.dismiss();
          }
        messageLoad = this.loadC.create({
          spinner:"hide",
          content:msg,
          dismissOnPageChange:true,
          showBackdrop:false,
          duration:0.75
        });
        messageLoad.present();
      })
  }
  //显示当前围栏 创建围栏
  createShowPolygon(id:string){
    this.polyManager.showCurrentPolygon(id);
  }
  //显示围栏触发信息
  nodeExhibitionShowInfo(node:NodeExhibition = null){
    if(node == null){return;}
    console.log("显示围栏消息",node);
    this.modal.create(ExhibitionPolygonInfoView,node).present();
  }
  //开启真趣定位
  startLocationListen(){
    var navi:any = navigator;
    if( navi && navi.ZQBluetooth){
      debugger
      navi.ZQBluetooth.start((info)=>{
        this.location = {
          x:this.Map.minX + info.x,
          y:this.Map.maxY - info.y,
          groupID:info.groupID,
        };
        this.showLocation();
        this.nodeExhibitionShowInfo(this.polyManager.checkPoint(this.location));
      })
    }
  }
  //显示点击的模型单位 信息
  showNodeExhibitionInfo(node:any){
    this.nodeM.filterNodeExhibition(node.FID).subscribe((node)=>{
      console.log(node);
      if(node  != null){
        let modelc = this.modal.create(NodeInfoView,node);
        modelc.present();
        modelc.onDidDismiss((Node)=>{
          if(Node == null){return;}
          let content = Node as NodeShowStatus;
          if(content.func == 1){
            //音乐
            this.render.setStyle(this.music.nativeElement,"display","block")
            this.musicCom.setMusicURL(node.voice)
          }else{
            //到这里去 路线规划
            this.musicCom.remove();
            this.mapS.showNavigationRoute({
              ... this.location,
              url: 'assets/images/start_icon@2x.png',
              size: 20
            },{
              x: content.node.coord_x,
              y: content.node.coord_y,
              groupID: content.node.coord_groupid,
              url: 'assets/images/end_icon@2x.png',
              size: 20
            })
          }
        })
      }
    })
  }
  //退出导航
  outNavigation(){
    this.mapS.clearNavigationRoute()
  }
  //显示路线规划视图
  showRoutePlan(){
      if(this.planView != null){return;}
      let fac = this.resolver.resolveComponentFactory(RoutePlanView);
      this.plan.clear();
      let comR = this.plan.createComponent(fac);
      this.planView =  comR.instance as RoutePlanView;
      this.planView.dismiss = ()=>{
        this.plan.clear();
        this.planView = null;
      }
  }
}
