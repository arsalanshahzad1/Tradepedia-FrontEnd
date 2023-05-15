import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import { SignalsService } from '../services/signals.service';
import { NotificationService } from '../services/notification.service';
import { Router } from '@angular/router';
import { PagesService } from '../services/pages.service';


@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  notificationForm: FormGroup;
  userID:any="";
  noteSettings:any="";
  userNoteList:any="";
  noteFrom:any="";
  btnDis:any=0;
  loadBtn:any=0;

  //notification center
  notificationListArr:Array<any>=[];
  noteCount:any=0;

  newTotalCount:any=0;
  signalCount:any=0;
  newsCount:any=0;
  offerCount:any=0;

  signalLastDt:any="";
  newsLastDt:any="";
  offerLastDt:any="";
  type:any="Signal";
  showloader:any=0;

  noteType:any="";
  lastNoteID:any="";
  

  constructor(
    private formBuilder: FormBuilder,
    private _service : SignalsService,
    public _notification: NotificationService,
    public _page: PagesService,
    private router : Router,
  ) {
    if(!localStorage.getItem("UserID")==true){      
      this.router.navigate(['/login']);
    }
    
    if(!localStorage.getItem("UserID")==false){
      this.userID = localStorage.getItem("UserID");        
    }  

    this.notificationForm = formBuilder.group({
      userID: this.userID,
      newsignal: [false],
      cancelled: [false],
      activated: [false],
      getready: [false],
      target1: [false],
      target2: [false],
      target3: [false],
      stoploss: [false],
      offer: [false],
      news: [false]
    });    
  }

  ngOnInit(): void {   
    this._page.getNoteArr.subscribe((arr:any) => {
      //alert(arr.length);
      console.log(arr);
      if(arr.length>0){
        this.notificationListArr = arr;        
        this.listNotification();
      }      
    });

    this.newTotalCount = localStorage.getItem("DisplayNoteCount");
    this.signalCount = localStorage.getItem("SignalNoteCount");
    this.newsCount = localStorage.getItem("NewsNoteCount");
    this.offerCount = localStorage.getItem("OfferNoteCount");  

    //alert(this.newTotalCount+" "+this.signalCount+" "+this.newsCount+" "+this.offerCount);
    
    this._page.setNoteCount(this.newTotalCount);
    this._page.setSignalCount(this.signalCount);
    this._page.setOfferCount(this.offerCount);
    this._page.setNewsCount(this.newsCount);
    
    this.getUserNoteCount();

    this.getUserNoteDets(this.type);

    this._page.getSignalCount.subscribe((count:any) => {
      this.signalCount = count;
    });

    this._page.getNewsCount.subscribe((count:any) => {
      this.newsCount = count;
    });

    this._page.getOfferCount.subscribe((count:any) => {
      this.offerCount = count;
    });
  }

  ngOnDestroy(): void {
    let updateDets:any={userID:this.userID,type:this.noteType,lastNoteID:this.lastNoteID};
    console.log(updateDets);  
    //alert(this.noteFrom);
    //this.showloader = 1;
    this._service.setLastNoteID(updateDets)
    .subscribe(
      (data) => {
        console.log("Post Reuslt => ", data);                          
        let signalCount:any = localStorage.getItem("SignalNoteCount");
        let newsCount:any = localStorage.getItem("NewsNoteCount");
        let offerCount:any = localStorage.getItem("OfferNoteCount");
        let newTotalCount:any = localStorage.getItem("DisplayNoteCount");
        let RetNoteCount:any = localStorage.getItem("RetNoteCount");

        if(this.noteType=='Signal'){       
          newTotalCount = newTotalCount - signalCount;
          signalCount = 0;             
        } else if(this.noteType=='News'){          
          newTotalCount = newTotalCount - newsCount;
          newsCount = 0;          
        } else if(this.noteType=='Offer'){          
          newTotalCount = newTotalCount - offerCount;
          offerCount = 0;          
        }

        localStorage.setItem("SignalNoteCount",signalCount);
        localStorage.setItem("NewsNoteCount",newsCount);
        localStorage.setItem("OfferNoteCount",offerCount);        
        localStorage.setItem("DisplayNoteCount",newTotalCount);
        localStorage.setItem("RetNoteCount",newTotalCount); 
        
        this._page.setNoteCount(newTotalCount);
        this._page.setSignalCount(signalCount);
        this._page.setOfferCount(offerCount);
        this._page.setNewsCount(newsCount);
      },
      response => {
        console.log("POST call in error", response);                              
      });
  }


  listNotification(){
    //alert("in");
      console.log(this.notificationListArr);
      this.noteCount = this.notificationListArr.length;
      //this._service.setNoteCount(this.notificationListArr.length);    
      this.signalCount=0;
      this.newsCount=0;
      this.offerCount=0;
      for(let i=0;i<this.notificationListArr.length;i++){
        if(this.notificationListArr[i].readStatus == 0 && this.notificationListArr[i].type == "Signal"){          
          this.signalCount++;          
        } else if(this.notificationListArr[i].readStatus == 0 && this.notificationListArr[i].type == "Offer"){          
          this.offerCount++;
        } else if(this.notificationListArr[i].readStatus == 0 && this.notificationListArr[i].type == "News"){
          this.newsCount++;
        }
      }
      //alert(" In => "+this.signalCount);
  }

  gotoHistory(input:any){
    console.log(input);
    let url='/home/history/'+input;
    //alert(url);
    this.router.navigate([url]);        
  }

  gotoSignaldetails(signalID:any){
    //signalID="E15F1736ACC51868059C1983EACB7918";
    if(signalID!=""){
      this.router.navigate(['/signal/signal-detail/'+signalID]);
    }
  }

  gotoLink(url:any){
    console.log(url);
    
    //alert(url);
    if(url!=""){
      if(url=="/home/referral-program"){
        this.router.navigate(['/wallet/refer']);
      } else if(url=="/signal/signal-plan"){
        this.router.navigate(['/signal-plan']);
      } else if(url.includes('/academy/chapter-details')){
        url = url.replace('/academy/chapter-details','/academy/ebooks');
        this.router.navigate([url]);
      } else if(url.includes('/academy/video-guide')){
        url = url.replace('/academy/video-guide','/academy/video-chapter-list');
        this.router.navigate([url]);
      } else if(url.includes('/academy/home-study-courses')){
        url = url.replace('/academy/home-study-courses','/academy/hsc-chapter-list');
        this.router.navigate([url]);
      } else if(url=="/home/my-subscriptions"){
        this.router.navigate(['/account/my-subscriptions']);
      } else {
        window.open(url, '_blank');
        // this.router.navigate([url]);
      }      
    }
  }

  getUserNoteDets(type:any){
    //alert(type);    
    this.type = type;
    this.noteType = type;
    let userDets:any={userID:this.userID,from:this.noteFrom,type:type};
    console.log(userDets);  
    this.showloader = 1;
    this._service.getUserNoteDets(userDets)
    .subscribe(
      (data) => {
        console.log("Post Reuslt => ", data);        
        this.noteSettings = data.noteSettings;
        this.userNoteList = data.userNoteList;   
        
        if(data.userNoteList.length == 50){
          this.loadBtn = 1;
        } else {
          this.loadBtn = 0;
        } 
        this.showloader = 0;

        //alert(this.showloader);

        this.lastNoteID = this.userNoteList[0].notelog_id;
        this.ngOnDestroy();

        /*let ns=false; if(this.noteSettings.user_new_status==1){ ns=true; }
        let can=false; if(this.noteSettings.user_cancel_status==1){ can=true; }
        let act=false; if(this.noteSettings.user_active_status==1){ act=true; }
        let gr=false; if(this.noteSettings.user_ready_status==1){ gr=true; }
        let t1=false; if(this.noteSettings.user_t1_status==1){ t1=true; }
        let t2=false; if(this.noteSettings.user_t2_status==1){ t2=true; }
        let t3=false; if(this.noteSettings.user_t3_status==1){ t3=true; }
        let st=false; if(this.noteSettings.user_stop_status==1){ st=true; }
        let offer=false; if(this.noteSettings.user_offer_status==1){ offer=true; }
        let news=false; if(this.noteSettings.user_news_status==1){ news=true; }
        
        this.notificationForm.patchValue({                    
          newsignal: ns,
          cancelled: can,
          activated: act,
          getready: gr,
          target1: t1,
          target2: t2,
          target3: t3,
          stoploss: st,
          offer: offer,
          news: news       
        });

        console.log(this.notificationForm.value);*/
      },
      response => {
        this.showloader = 0;
        console.log("POST call in error", response);                              
      });
  }

  loadMore(type:any){
    //alert(type); 
    this.noteFrom = this.userNoteList[(this.userNoteList.length)-1].notelog_id;
    let userDets:any={userID:this.userID,from:this.noteFrom,type:type};
    console.log(userDets);  
    //alert(this.noteFrom);

    this.showloader = 1;
    this._service.getUserNoteDets(userDets)
    .subscribe(
      (data) => {
        console.log("Post Reuslt => ", data);        
        let list:any= data.userNoteList;    
        if(list.length > 0){
          this.loadBtn = 1;
        } else {
          this.loadBtn = 0;
        }     
        
        for(let i=0;i<list.length;i++){
          this.userNoteList.push(list[i]);
        }
        console.log(this.userNoteList);                    
        this.showloader = 0;
      },
      response => {
        this.showloader = 0;
        console.log("POST call in error", response);                              
      })
  } 

  /*saveNotification(){
    //alert("In");
   
    this.btnDis = 1;
    console.log(this.notificationForm.value); 
        
    this._notification.longMsg("Notification Setting Update going on, Please wait.");
    let userDet:any=this.notificationForm.value;
    console.log(userDet);
    this._service.saveNotification(userDet)
      .subscribe(
        (data:any) => {
          console.log(data);                    
          let result = data;
          this.btnDis = 0;
          if(result.status==true){                        	            
            this._notification.success("Notification Setting Updated Successfully.");                         
            this.noteSettings = result.noteSettings;            
            
            let ns=false; if(this.noteSettings.user_new_status==1){ ns=true; }
            let can=false; if(this.noteSettings.user_cancel_status==1){ can=true; }
            let act=false; if(this.noteSettings.user_active_status==1){ act=true; }
            let gr=false; if(this.noteSettings.user_ready_status==1){ gr=true; }
            let t1=false; if(this.noteSettings.user_t1_status==1){ t1=true; }
            let t2=false; if(this.noteSettings.user_t2_status==1){ t2=true; }
            let t3=false; if(this.noteSettings.user_t3_status==1){ t3=true; }
            let st=false; if(this.noteSettings.user_stop_status==1){ st=true; }
            let offer=false; if(this.noteSettings.user_offer_status==1){ 
              offer=true;
              //this.subscribeTopic(offer,'Offer');
            }
            let news=false; if(this.noteSettings.user_news_status==1){ 
              news=true; 
              //this.subscribeTopic(news,'News');
            }
            
            this.notificationForm.patchValue({                    
              newsignal: ns,
              cancelled: can,
              activated: act,
              getready: gr,
              target1: t1,
              target2: t2,
              target3: t3,
              stoploss: st,
              offer: offer,
              news: news       
            });

            console.log(this.notificationForm.value);
          }
        },
        (err:any) => {
          this.btnDis = 0;
          console.log(err);
        }
      );      
  }*/

  getUserNoteCount(){
    //alert("in");    
    let userDets:any={userID:this.userID};
    console.log(userDets);  
    this._page.getUserNoteCount(userDets)
    .subscribe(
      (data) => {
        console.log("Post Reuslt => ", data);  
        this.signalCount=data.newSignalCount;
        this.newsCount=data.newNewsCount;
        this.offerCount=data.newOfferCount;    
        this.newTotalCount=data.newTotalCount;    

        localStorage.setItem("SignalNoteCount",this.signalCount);
        localStorage.setItem("NewsNoteCount",this.newsCount);
        localStorage.setItem("OfferNoteCount",this.offerCount);        
        localStorage.setItem("DisplayNoteCount",this.newTotalCount);
        localStorage.setItem("RetNoteCount",this.newTotalCount);  
        
        this._page.setNoteCount(this.newTotalCount);
        this._page.setSignalCount(this.signalCount);
        this._page.setOfferCount(this.offerCount);
        this._page.setNewsCount(this.newsCount);
      },
      response => {        
        console.log("POST call in error", response);                              
      });
  }


}
