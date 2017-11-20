import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule, NavController} from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { ZNZG } from './app.component';
import { HTTP } from "@ionic-native/http"
import { FileTransfer } from "@ionic-native/file-transfer"

import { ModalBaseView,BaseContentNoScroll } from "../pages/MainPages/base/ModalBaseView"
import { MainView } from "../pages/MainPages/MainView"
import { MainSeacherView } from "../pages/Views/Seacher/MainSeacherView"
import { PXHandle } from "./tools/Handle"
import {MainFunView, MapSeachResultView} from "../pages/Views/MainFunView/MainFunView"
import { SettingViewConponent } from "../pages/MainPages/settings/SettingViewConponent"
import { UserManager } from "./tools/UserManager"
import { MyBespokeComponent } from "../pages/MainPages/settings/Components/MyBespokeComponent"
import {NavFuncManager} from "../pages/MainPages/base/BaseProtocol";
import {UserLoginComponent} from "../pages/MainPages/base/login/UserLoginComponent";
import {ElementShowStatus} from "./tools/ElementHidden";
import {UserInfoComponent} from "../pages/MainPages/settings/Components/UserInfoComponent";
import {IonicStorageModule} from "@ionic/storage";
import {NetWorkManager, AuthorizationInterceptor, HttpStatusErrorInterceptor, URLFactory} from "./tools/NetWorkManager";
import {HttpClientModule, HTTP_INTERCEPTORS} from "@angular/common/http";
import { CustomButton } from "../pages/Views/Button/CustomButton"
import {ImagePicker} from "@ionic-native/image-picker";
import {NodeExhibitionManager} from "./tools/SourceManager/NodeExhibitionManager";
import {NodeInfoView} from "../pages/MainPages/nodePage/NodeInfoView";
import {MusicComponent} from "../pages/Views/Music/MusicComponent";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {RoutePlanView} from "../pages/Views/RoutePlanView/RoutePlanView";
import { MapNavigationManager } from  "./tools/Map/MapNavigationManager"
import { ExhibitionPolygonInfoView } from "../pages/MainPages/nodePage/ExhibitionPolygonInfo";
import { LeaveMessageView }  from "../pages/MainPages/nodePage/LeaveMessageView"
import { SourceDownloadView } from '../pages/MainPages/nodePage/SourceDownloadView';
import { DownloadManager } from './tools/Download/DownloadManager';
import { EmailSendView } from '../pages/MainPages/nodePage/EmailSendView';
import { NodeDetailView } from '../pages/MainPages/nodePage/NodeStatus/NodeDetailView';
import { ExhibitionBespeak } from '../pages/MainPages/nodePage/NodeStatus/ExhibitionBespeak';
import { BespeakItem } from '../pages/Views/BespeakItem/BespeakItem';
import { ExhibitionBespeakSuccess } from '../pages/MainPages/nodePage/NodeStatus/ExhibitionBespeakSuccess';

@NgModule({
  declarations: [
    ZNZG,

    ModalBaseView,BaseContentNoScroll,
    MainSeacherView,
    MainFunView,
    CustomButton,
    MapSeachResultView,
    MusicComponent,RoutePlanView,EmailSendView,NodeDetailView,ExhibitionBespeak,BespeakItem,ExhibitionBespeakSuccess,

    MainView,
    SettingViewConponent,
    MyBespokeComponent,
    UserLoginComponent,
    UserInfoComponent,
    NodeInfoView,ExhibitionPolygonInfoView,
    LeaveMessageView,SourceDownloadView,

    //指令
    ElementShowStatus,
  ],
  imports: [
    BrowserModule,BrowserAnimationsModule,
    IonicModule.forRoot(ZNZG),
    IonicStorageModule.forRoot({
      name:"ZNZG",
      driverOrder:[
        "websql",
        "indexeddb",
        "sqlite"
      ]
    }),
    HttpClientModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    ZNZG,ModalBaseView,
    MainSeacherView,MainFunView,CustomButton,MapSeachResultView,
    MusicComponent,RoutePlanView,ExhibitionPolygonInfoView,
    LeaveMessageView,SourceDownloadView,EmailSendView,NodeDetailView,ExhibitionBespeak,BespeakItem,ExhibitionBespeakSuccess,
    
    MainView,
    SettingViewConponent,
    MyBespokeComponent,
    UserLoginComponent,
    UserInfoComponent,
    NodeInfoView,

  ],
  providers: [
    StatusBar,
    SplashScreen,URLFactory,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    PXHandle,UserManager,NavFuncManager,NetWorkManager,
    {provide:HTTP_INTERCEPTORS,useClass:AuthorizationInterceptor,multi:true},//
    {provide:HTTP_INTERCEPTORS,useClass:HttpStatusErrorInterceptor,multi:true},//
    ImagePicker,HTTP,NodeExhibitionManager,MapNavigationManager,DownloadManager,FileTransfer,
  ]
})
export class AppModule {}
