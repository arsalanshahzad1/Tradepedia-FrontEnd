import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import { SignalsService } from '../services/signals.service';
import { NotificationService } from '../services/notification.service';
import { Router } from '@angular/router';
import {TranslateService} from '@ngx-translate/core';


@Component({
  selector: 'app-notification-setting',
  templateUrl: './notification-setting.component.html',
  styleUrls: ['./notification-setting.component.scss']
})
export class NotificationSettingComponent implements OnInit {

  notificationForm: FormGroup;
  userID:any="";
  noteSettings:any="";
  btnDis:any=0;

  showLoader:any=0;

  constructor(
    private formBuilder: FormBuilder,
    private _service : SignalsService,
    public _notification: NotificationService,
    private router : Router,
    private translate: TranslateService,
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
    this.showLoader = 1;
    this.getUserNoteDets();
  }

  getUserNoteDets(){
    //alert("in");    
    let userDets:any={userID:this.userID};
    console.log(userDets);  
    this._service.getUserNoteDets(userDets)
    .subscribe(
      (data) => {
        console.log("Post Reuslt => ", data);        
        this.noteSettings = data.noteSettings;    

        let ns=false; if(this.noteSettings.user_new_status==1){ ns=true; }
        let can=false; if(this.noteSettings.user_cancel_status==1){ can=true; }
        let act=false; if(this.noteSettings.user_active_status==1){ act=true; }
        //let gr=false; if(this.noteSettings.user_ready_status==1){ gr=true; }
        let gr=false;
        let t1=false; if(this.noteSettings.user_t1_status==1){ t1=true; }
        let t2=false; if(this.noteSettings.user_t2_status==1){ t2=true; }
        let t3=false; if(this.noteSettings.user_t3_status==1){ t3=true; }
        //let st=false; if(this.noteSettings.user_stop_status==1){ st=true; }
        let st=false;
        //let offer=false; if(this.noteSettings.user_offer_status==1){ offer=true; }
        //let news=false; if(this.noteSettings.user_news_status==1){ news=true; }
        let offer=true;
        let news=true;
        
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
        this.showLoader = 0;
      },
      response => {
        console.log("POST call in error", response);                              
        this.showLoader = 0;
      });
  }  

  saveNotification(){
    //alert("In");
   
    this.btnDis = 1;
    console.log(this.notificationForm.value); 
        
    //this._notification.longMsg("Notification Setting Update going on, Please wait.");
    this._notification.longMsg(this.translate.instant('notification_setting.wait_msg'));
    
    let userDet:any=this.notificationForm.value;
    console.log(userDet);
    this._service.saveNotification(userDet)
    .subscribe(
      (data:any) => {
        console.log(data);                    
        let result = data;
        this.btnDis = 0;
        if(result.status==true){                        	            
          //this._notification.success("Notification Setting Updated Successfully.");                         
          this._notification.success(this.translate.instant('notification_setting.update_msg'));
          this.noteSettings = result.noteSettings;            
          
          let ns=false; if(this.noteSettings.user_new_status==1){ ns=true; }
          let can=false; if(this.noteSettings.user_cancel_status==1){ can=true; }
          let act=false; if(this.noteSettings.user_active_status==1){ act=true; }
          //let gr=false; if(this.noteSettings.user_ready_status==1){ gr=true; }
          let gr=false; 
          let t1=false; if(this.noteSettings.user_t1_status==1){ t1=true; }
          let t2=false; if(this.noteSettings.user_t2_status==1){ t2=true; }
          let t3=false; if(this.noteSettings.user_t3_status==1){ t3=true; }
          //let st=false; if(this.noteSettings.user_stop_status==1){ st=true; }
          let st=false;
          /*let offer=false; if(this.noteSettings.user_offer_status==1){ 
            offer=true;
            //this.subscribeTopic(offer,'Offer');
          }*/
          let offer=true;
          /* let news=false; if(this.noteSettings.user_news_status==1){ 
             news=true; 
             //this.subscribeTopic(news,'News');
          }*/
          let news=true;
          
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
  }

}
