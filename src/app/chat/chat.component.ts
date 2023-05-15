import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { PagesService } from '../services/pages.service';
import { DatePipe } from '@angular/common';
import { interval, Subscription, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import {TranslateService} from '@ngx-translate/core';




@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  providers: [DatePipe]
})
export class ChatComponent implements OnInit, OnDestroy {
  userID:any="";
  userType:any="";
  userSub:any="";
  userChatList:any=[];
  showloader:any=0;
  newMessage:any="";
  dateArr:any=[];
  todayDate:any="";

  senderID:any="";
  receiverID:any="";
  usersList:any=[];
  userDets:any="";
  chatTotalCount:any=0;
  lastMsgTime:any="";
  timeScriptID !: Subscription;

  userSearch:any="";
  lefthdrSearch:any = 0;  
  timeInterval:number=3000;
  timeZone:any="";
  timeSettings:any=[];

  alertPopup:any=0;
  alertPopupMsg:any="";
  alertPopupImg:any="";

  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;
  groupID:any=0;
  pipe = new DatePipe('en-US'); 

  constructor(
    private router : Router,    
    private route: ActivatedRoute,
    private _service : PagesService,
    public datepipe: DatePipe,
    private translate: TranslateService,
  ) {
    if(!localStorage.getItem("UserID")==true){      
      this.router.navigate(['/login']);
    }
    
    if(!localStorage.getItem("UserID")==false){
      this.userID = localStorage.getItem("UserID");        
    }

    if(!localStorage.getItem("UserType")==false){
      this.userType = localStorage.getItem("UserType");        
    }    
      
  }

  ngOnInit(): void {
    this.showloader = 1;
    let date=new Date();
    this.todayDate = this.datepipe.transform(date, 'dd/MM/yyyy');

    if(this.userType=="User"){
      this.senderID=this.userID;
      this.receiverID=0;
      let name = 'Support Staff';
      this.translate.get('chat.username').subscribe((res: string) => {
        name = res;
      });
      this.userDets = {'userID':0,'userName':name};      
      this.translate.get('chat.admin_type').subscribe((res: string) => {
        this.userSub = res;
      });
      this.getUserChats();      
    } else if(this.userType=="Staff"){
      this.senderID=0;
      this.receiverID=0;
      this.userDets = "";      
      this.translate.get('chat.user_type').subscribe((res: string) => {
        this.userSub = res;
      });
      this.getChatUserList();      
    }
    //alert(this.userSub);
  }

  gotohome(){
    this.router.navigate(['/home']);
  }

  ngOnDestroy() {    
    if(!this.timeScriptID==false){
      this.timeScriptID.unsubscribe();
    }    
  }

  showMessage(user:any){
    this.userDets = user;
    console.log(this.userDets);
    this.receiverID=user.userID;    
    this.getUserChats();        
  }

  getChatUserList(){
    //alert("in");    
    //this.showloader = 1;
    let userInp:any={userID:this.senderID};
    console.log(userInp);  
    this._service.getChatUserList(userInp)
    .subscribe(
      (data) => {
        console.log("Post Reuslt => ", data);        
        this.userChatList = data.userChats;  
        //this.showloader = 0;
        if(!data.userList==false){
          this.usersList = data.userList
        }          
        this.chatTotalCount = data.unreadTotalCount;
        localStorage.setItem("TotalChatCount",this.chatTotalCount);
        this._service.setChatCount(this.chatTotalCount);
      },
      response => {
        //this.showloader = 0;
        console.log("POST call in error", response);                              
      });
  }

  getUserChats(){
    //alert("in");    
    //this.showloader = 1;
    let userInp:any={groupID:this.groupID,senderID:this.senderID,receiverID:this.receiverID,userType:this.userType};
    console.log(userInp);  
    this._service.getUserChats(userInp)
    .subscribe(
      (data) => {
        console.log("Post Reuslt => ", data);        
        this.userChatList = data.userChats;  
        //this.showloader = 0;   
        this.timeSettings = data.chatSettings; 

        this.userChatList.sort((a: any, b: any) => {
          return <any>new Date(a.chat_on) - <any>new Date(b.chat_on);
        });

        this.dateArr=[];
        for(let i=0;i<this.userChatList.length;i++){    
          this.userChatList[i].chat_on2 = (this.userChatList[i].chat_on.replace(" ","T"))+"Z";     
                
          /*if(this.dateArr.includes(this.userChatList[i].date2)==false){
            this.dateArr.push(this.userChatList[i].date2);
          }*/
          let dat2:any = this.pipe.transform(this.userChatList[i].chat_on2, 'yyyy-MM-dd');          
          if(this.dateArr.includes(dat2)==false){
            this.dateArr.push(dat2);
          }
        }

        this.chatTotalCount = data.unreadTotalCount;
        localStorage.setItem("TotalChatCount",this.chatTotalCount);
        this._service.setChatCount(this.chatTotalCount);
        
        /*if(this.userNoteList.length == 50){
          this.loadBtn = 1;
        } else {
          this.loadBtn = 0;
        }*/
        console.log(this.dateArr); 
        console.log(this.userChatList);         
        
        setTimeout(() => {     
          this.getRecentChats();
          //this.ngOnDestroy();
          this.updateRead();
          this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
        }, 100);
      },
      response => {
        //this.showloader = 0;
        console.log("POST call in error", response);                              
      });
  }  

  getRecentChats(){
    console.log("Calling => ");
    if(!this.timeScriptID==false){
      this.timeScriptID.unsubscribe();
    }

    this.lastMsgTime = this.userChatList[this.userChatList.length-1].chat_on;
    //alert(this.lastMsgTime)
    let userInp:any={groupID:this.groupID,senderID:this.senderID,receiverID:this.receiverID,lastMsgTime:this.lastMsgTime,userType:this.userType};
    console.log(userInp);  
    this._service.getRecentChats(userInp)
    .subscribe(
      (data) => {
        console.log("Recent Chat Reuslt => ", data);        
        //this.userChatList = data.userChats;  
        //this.showloader = 0; 
        //if(!data.userChats==false){  
        if (typeof data.userChats !== 'undefined' && data.userChats.length > 0) {  
          let list:any = data.userChats;
          for(let i=0;i<list.length;i++){          
            //this.userChatList.push(list[i]); 

            list[i].chat_on2 = (list[i].chat_on.replace(" ","T"))+"Z";      
            this.userChatList.push(list[i]);

           /* if(this.dateArr.includes(list[i].date2)==false){
              this.dateArr.push(list[i].date2);
            }*/

            let dat2:any = this.pipe.transform(list[i].chat_on2, 'yyyy-MM-dd');          
            if(this.dateArr.includes(dat2)==false){
              this.dateArr.push(dat2);
            }
          }         
          console.log(this.userChatList);      
          
          this.userChatList.sort((a: any, b: any) => {
            return <any>new Date(a.chat_on) - <any>new Date(b.chat_on);
          }); 

          setTimeout(() => {
            console.log("Part Calling");
            this.updateRead();
            this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
          }, 100);         
        }

        if(!data.unreadTotalCount==false){
          this.chatTotalCount = data.unreadTotalCount;
          localStorage.setItem("TotalChatCount",this.chatTotalCount);
          this._service.setChatCount(this.chatTotalCount);
        } 

        this.timeScriptID = interval(this.timeInterval).subscribe((x =>{
          this.getRecentChats();
        }));
       
      },
      response => {
        //this.showloader = 0;        
        console.log("POST call in error", response);                              
      });      
  }

  updateRead(){
    let userInp:any={groupID:this.groupID,senderID:this.senderID,receiverID:this.receiverID};
    console.log(userInp);  
    this._service.updateRead(userInp)
    .subscribe(
      (data) => {
        console.log("Post Reuslt => ", data);   
        if(!this.usersList==false){
          for(let i=0;i<this.usersList.length;i++){
            if(this.usersList[i].userID == this.receiverID){
              this.usersList[i].count = data.unreadCount;
            }
          }
        }      

        this.chatTotalCount = data.unreadTotalCount;
        localStorage.setItem("TotalChatCount",this.chatTotalCount);
        this._service.setChatCount(this.chatTotalCount);
      },
      response => {
        this.showloader = 0;
        console.log("POST call in error", response);                              
      });
  }

  filterFunction(arrlist: any[],type:any): any {  
    if (!arrlist || !type) {
        return arrlist;
    }    
    return arrlist.filter((item:any) => item.date2.indexOf(type) !== -1);
  } 

  searchUser(arrlist: any[],args:any): any {  
    if (!arrlist || !args) {
        return arrlist;
    }    
    return arrlist.filter((item:any) => { 
      let rVal = (item.userName.toLowerCase().includes(args));
      return rVal; 
    });
  }  

  sendMessage(){
  if(this.newMessage.trim() =="")
  return;
    //alert(this.newMessage);
    let curr_date:any = new Date();
    //alert(curr_date);    
    let dubai_date = new Date(curr_date).toLocaleString("en-US", {timeZone: "Asia/Dubai"});
    //alert(dubai_date);
    let curr_time:any = this.pipe.transform(dubai_date, 'HH:mm');
    //alert(curr_time);

    /*if(curr_time >= this.timeSettings.setting_chat_from && curr_time <= this.timeSettings.setting_chat_to){
      alert("In Time");
    } else {
      alert("Out Time");
    }*/

    if(!this.timeScriptID==false){
      this.timeScriptID.unsubscribe();
    }
    if(curr_time >= this.timeSettings.setting_chat_from && curr_time <= this.timeSettings.setting_chat_to){

      let chatDets:any={groupID:this.groupID,userID:this.senderID,toID:this.receiverID,message:this.newMessage};
      console.log(chatDets);  
      this.newMessage = "";
      this._service.saveUserChat(chatDets)
      .subscribe(
        (data) => {
          console.log("Chat Save Reuslt => ", data);     
          this.userChatList.push(data.lastChats);  
          if(this.dateArr.includes(data.lastChats.date2)==false){
            this.dateArr.push(data.lastChats.date2);
          }
          console.log(this.userChatList);              

          setTimeout(() => {
            this.getRecentChats();
            this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
          }, 100);
        },
        response => {
          //this.showloader = 0;
          console.log("POST call in error", response);                              
        });
      } else {
        this.alertPopup=1;
        this.alertPopupMsg=this.translate.instant('chat.error_msg');
        this.alertPopupImg="assets/images/fail.png"; 
      }
  }

  closeAlertPopup(){
    this.alertPopup = 0;        
  }

  leftsearchbtn(){
    this.userSearch = "";
    this.lefthdrSearch = !this.lefthdrSearch;
  }

}
