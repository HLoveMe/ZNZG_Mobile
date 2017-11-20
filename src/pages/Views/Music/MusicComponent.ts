import {
  Component, HostBinding, ViewChild, ElementRef, OnDestroy, ViewContainerRef, Renderer2, HostListener
} from "@angular/core";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {Observable, Subscription} from "rxjs/Rx";
import {Range, Platform} from "ionic-angular/index";
@Component({
  selector:"music",
  templateUrl:"./MusicComponent.html"
})
export class MusicComponent implements OnDestroy{
  @HostBinding("style.padding") padding:string = "0px 8px";
  @ViewChild("Audio") audio:ElementRef;
  @ViewChild(Range) range:Range;
  value:number = 0;
  music:SafeResourceUrl;
  duration:string =  "00:00";
  current:string = "00:00";

  private sub:Subscription;
  constructor(
              private sanitizer:DomSanitizer,
              private VC:ViewContainerRef,
              private render:Renderer2,
              private plt:Platform
              //Renderer2
  ){}
  public setMusicURL(con:string){
    this.value = 0;
    this.music = this.sanitizer.bypassSecurityTrustResourceUrl(con);
    this.audio.nativeElement.onloadeddata =()=>{
      this.duration = this.getTimeStrig(this.audio.nativeElement.duration);
      this.range.max = parseInt(this.audio.nativeElement.duration);
    }
    this.sub = Observable.interval(1000).subscribe(()=>{
      this.current = this.getTimeStrig(this.audio.nativeElement.currentTime);
      this.value = parseInt(this.audio.nativeElement.currentTime);
      // this.range.setValue(parseInt(this.audio.nativeElement.currentTime))
    })
    //解决safari无法自动播放
    /**
     * this.audio.nativeElement.load();
     * this.audio.nativeElement.play();
     * 必须有事件触发
     * */
  }
  private getTimeStrig(time:number):string{
    let minute = parseInt(time / 60 + "");
    let ss = parseInt(time % 60 + "");
    if(ss < 10){
      return minute+":0"+ss
    }else{
      return minute+":"+ss
    }
  }
  rePlay(){
    if(this.audio.nativeElement.fastSeek != null){
      this.audio.nativeElement.fastSeek(0);
    }else{
      this.audio.nativeElement.currentTime = 0;
    }
  }
  remove(){
    this.audio.nativeElement.pause();
    if(this.sub){
      this.sub.unsubscribe();
    }
    this.current = "00:00";
    this.duration = "00:00";
    this.render.setStyle(this.VC.element.nativeElement.parentElement,"display","none");
  }
  playOrPause(){
    let au = this.audio.nativeElement;
    if(au.paused){
      au.play();
      au.onended =(a,b,c)=>{
        this.sub.unsubscribe()
      };
    }else{
      au.pause();
    }
  }
  seekTime(event:number){
    console.log(event)
    let audio =  this.audio.nativeElement;
    let buffLen = audio.buffered.end(audio.buffered.length-1);
    let cu = event >= buffLen ? buffLen - 1 : event;
    if(this.audio.nativeElement.fastSeek != null){
      this.audio.nativeElement.fastSeek(cu);
    }else{
      this.audio.nativeElement.currentTime = cu;
    }
  }
  ngOnDestroy(){
    this.remove()
  }
}
