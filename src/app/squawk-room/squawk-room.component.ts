import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import { SignalsService } from '../services/signals.service';
import { NotificationService } from '../services/notification.service';
import { Router } from '@angular/router';
import { PagesService } from '../services/pages.service';
import { environment } from '../../environments/environment';
import { ViewEncapsulation } from '@angular/core'

@Component({
  selector: 'app-squawk-room',
  templateUrl: './squawk-room.component.html',
  styleUrls: ['./squawk-room.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SquawkRoomComponent implements OnInit {
  imgURL:any = environment.imgUrl;
  userID:any="";
  userStatus:any="";
  userSquawkList:any="";
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
  languageSelected:any="";
  timeZone:any="";  

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

    if(!localStorage.getItem('selectedLang')==false){
      this.languageSelected = localStorage.getItem('selectedLang');        
    } else {
      this.languageSelected = "EN";      
    } 
    console.log(this.languageSelected);

    if(!localStorage.getItem("UserTimezone")==false){
      this.timeZone = localStorage.getItem("UserTimezone");        
    } else {
      this.timeZone="+0000";
    }  
  }

  ngOnInit(): void {     

    /*this.newTotalCount = localStorage.getItem("DisplayNoteCount");
    this.signalCount = localStorage.getItem("SignalNoteCount");
    this.newsCount = localStorage.getItem("NewsNoteCount");
    this.offerCount = localStorage.getItem("OfferNoteCount");  

    //alert(this.newTotalCount+" "+this.signalCount+" "+this.newsCount+" "+this.offerCount);
    
    this._page.setNoteCount(this.newTotalCount);
    this._page.setSignalCount(this.signalCount);
    this._page.setOfferCount(this.offerCount);
    this._page.setNewsCount(this.newsCount);    
    */

    this.getSquawkList();

    /*this._page.getSignalCount.subscribe((count:any) => {
      this.signalCount = count;
    });

    this._page.getNewsCount.subscribe((count:any) => {
      this.newsCount = count;
    });

    this._page.getOfferCount.subscribe((count:any) => {
      this.offerCount = count;
    });*/
  }

  ngOnDestroy(): void {
    /*let updateDets:any={userID:this.userID,type:this.noteType,lastNoteID:this.lastNoteID};
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
      });*/
  }

  
    
  gotoSquawkPlan(){
    this.router.navigate(['/squawk-plan']);
  }

  getSquawkList(){
    //alert(type);    
    let userDets:any={userID:this.userID,lang:this.languageSelected};
    console.log(userDets); 
    this.showloader = 1;
    this._service.getSquawkList(userDets)
    .subscribe(
      (data) => {
        console.log("Post Reuslt => ", data);        
        this.userStatus = data.userStatus;
        this.userSquawkList = data.userSquawkList;           
        console.log(this.userSquawkList);
        for(let i=0;i<this.userSquawkList.length;i++){
          this.userSquawkList[i].squawk_published_on2 = (this.userSquawkList[i].squawk_published_on.replace(" ","T"))+"Z";          
          this.userSquawkList[i].imgSrc = this.imgURL+"squawk/"+this.userSquawkList[i].squawk_cover_image
        }
        this.showloader = 0;
      },
      response => {
        this.showloader = 0;
        console.log("POST call in error", response);                              
      });
  }

  loadMore(type:any){
    //alert(type); 
    this.noteFrom = this.userSquawkList[(this.userSquawkList.length)-1].notelog_id;
    let userDets:any={userID:this.userID,from:this.noteFrom,type:type};
    console.log(userDets);  
    //alert(this.noteFrom);

    this.showloader = 1;
    this._service.getSquawkList(userDets)
    .subscribe(
      (data) => {
        console.log("Post Reuslt => ", data);        
        let list:any= data.userSquawkList;    
        if(list.length > 0){
          this.loadBtn = 1;
        } else {
          this.loadBtn = 0;
        }     
        
        for(let i=0;i<list.length;i++){
          this.userSquawkList.push(list[i]);
        }
        console.log(this.userSquawkList);                    
        this.showloader = 0;
      },
      response => {
        this.showloader = 0;
        console.log("POST call in error", response);                              
      })
  } 
}

