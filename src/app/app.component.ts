import { Component, ViewChild } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { Router } from '@angular/router';
import { PagesService } from './services/pages.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  @ViewChild(HeaderComponent) headerComponent !: HeaderComponent;

  notificationListArr:any=[];
  bellVibrate:any=0;
  unReadCount:any=0;

  constructor(
    private _service : PagesService,
    private router : Router,
  ) { 
    window.addEventListener("message", (result:any) => {
        //console.log(result.data);
        let input:any=JSON.parse(result.data);
        //console.log("addEventListener on Chapter");
        //console.log(input);
        if(input.message=="Chapter"){          
          this._service.setQuizType(input.message);
        } else if(input.type=="completed"){    
          console.log(this.router.url);      
          let link:any=(this.router.url).split("/");
          if(link[2]=="video-chapter-list"){
            this._service.setQuizType('Video');
          } else if(link[2]=="hsc-chapter-list"){
            this._service.setQuizType('HSC');
          }        
        }       
    }, false);
    
    this.getIPAddress(); 
  }

  saveMessage(input:any){
    console.log("Start Saving");      
    console.log(input);      

    /** Save Part **/
    let sno:number=1;
    if(!localStorage.getItem("notificationListArr")==false){
      this.notificationListArr = JSON.parse(<any>localStorage.getItem("notificationListArr"));
      sno=parseInt(<any>this.notificationListArr.length)+1;
    }  
    console.log(this.notificationListArr);

    let wasTapped:any = input.wasTapped;
    let screen:any = input.screen;
    let paramID:any = input.paramID;
    let noteID:any = input.noteID;
    let image:any = "";
    if(!input.image==false){
      image=input.image;
    }
        
    let obj:any={noteID:noteID,paramID:paramID,type:input.type,title:input.title,body:input.body,readStatus:0,created_on:input.messageOn,image:image};    
    console.log(obj);

    this.headerComponent.notifyBtn()
    this.notificationListArr.unshift(obj);
    console.log(this.notificationListArr);
    //alert(this.notificationListArr.length);
    this.unReadCount=0;
    for(let i=0;i<this.notificationListArr.length;i++){
      if(this.notificationListArr[i].readStatus == 0){
        this.unReadCount++;
      }
    }
    this._service.setNoteCount(this.unReadCount);
    this._service.setNoteSingalArr(obj);
    this._service.setNoteArr(this.notificationListArr); 
    localStorage.setItem("notificationListArr",JSON.stringify(this.notificationListArr));
  }

  subscribeTopic(topic:any,status:any) {
    console.log("Subscribe Function");
    console.log("Topic => "+topic+" Status => "+status);
    if(status==false){
      //FCM.unsubscribeFromTopic(topic);
    } else if(status==true){
      //FCM.subscribeToTopic(topic);
    }    
    return status;
  }

  getIPAddress() {
    this._service.getIpAddress().subscribe((data:any) => {
        console.log(data);
        let ip:any=data['ip'];
        //alert(ip);
        localStorage.setItem("DeviceIP", ip);
    });     
  }
}
