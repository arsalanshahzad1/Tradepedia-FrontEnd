import { Component, OnInit } from '@angular/core';
import { SignalsService } from '../services/signals.service';
import { NotificationService } from '../services/notification.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { DatePipe } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import * as d3 from 'd3';
import * as CryptoJS from 'crypto-js';
import { interval, Subscription, timer } from 'rxjs';
import {TranslateService} from '@ngx-translate/core';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss'],
  providers: [DatePipe]
})
export class MyProfileComponent implements OnInit {
  profileEditForm!: FormGroup;
  languageSelected:any="";
  passwordKey:any = environment.userPasswordKey;
  showConsole:any = environment.showConsole;
  imgURL:any = environment.imgUrl;  
  value = 0;
  profileList:any=[];
  selectedProfile:any="";
  autoProfileStatus:any="";

  profileChk:any;
  myRobot:any;
  userID:any="";

  colhideshow:any = 0;

  //Signal List
  decimalPoints:any = environment.decimalPoints;
  timeInterval: number=3000;

  //selectedProfile:any = [];
  profileDets: any;
  signalCount: any;
  index: any;
  profileID: any;

  signalInputs:any="";
  symbolInputArr:any[]=[];

  pendingDataList: Array<any> = [];
  activeDataList: Array<any> = [];
  pendingBlock: number = 0;
  activeBlock: number = 0;

  pendingData: number = 0;
  activeData: number = 0;
  cancelData: number = 3;

  pendingFilter: number = 0;
  activeFilter: number = 0;
  cancelFilter: number = 0;

  btnNext: number = 0;
  btnPrevious: number = 0;
  entry: any;

  currPendingSignalIDs:any=[];
  currActiveSignalIDs:any=[];

  selPendingSignalList:any="";
  selActiveSignalList:any="";

  selectedPendingCategoryIndex:any[]=[];
  selectedActiveCategoryIndex:any[]=[];

  selectedCategoryList:any=['All'];
  selActiveCategoryList:any=[];

  pendingMoreShow:any=false;
  activeMoreShow:any=false;

  selPendingCategory:any="";
  selActiveCategory:any="";

  symbolRootArr:any={};
  symbolRootNameArr:any=[];
  
  //userID:any="";
  userPoints:any="";
  userSignalStatus:any="";

  //Signal Details
  //decimalPoints:any = environment.decimalPoints;
  signalID:any="";
  signalDets:any = "";
  loadContent:number = 0;

  color:any;
  radius:any;
  chartURL!: SafeResourceUrl;
  url: string = 'assets/files/signal-chart.html';

  chartURL2!: SafeResourceUrl;
  //url2: string = 'assets/files/signal-tradingchart.html';
  url2: string = 'assets/files/signal-chart.html';

  showSignal:any=0;
  showSignalDet:any=0;

  profileName:any="";
  signalName:any="";
  signalType:any="";

  alertPopup:any=0;
  alertPopupMsg:any="";
  alertPopupImg:any="";

  deletePopup:any=0;
  deletePopupMsg:any="";
  deletePopupImg:any="";

  setTimeID:any=[];
  profileShow:any=0;
  currLang:any="";
  timeScriptID:any="";

  seletedProfile:any=[];
  btnDis:number = 0;
  showPopBtn:any = 0;
  timeZone:any="";
  
  //filteredSignals:any = [{value:1,name:"One"},{value:2,name:"Two"},{value:3,name:"Three"}];
  filteredSignals:any = [];
  selectedSignalsList:any=[];
  timeFrames:any=[];
  timeArr:any=[];
  statusList:any=['Pending','Active'];
  statusInp:any="Pending";

  searchSignal = new FormControl();
  finalSignals!: Observable<any[]>;
  lastFilter: string = '';

  tabIndex:any=1;
  catIndex:any="All";
  selUID:any="";

  constructor(
    private _service : SignalsService,
    public _notification: NotificationService,
    private router : Router,
    private route: ActivatedRoute,
    private cookieService: CookieService,
    public datepipe: DatePipe,
    public sanitizer: DomSanitizer,
    private translate: TranslateService,
    private formBuilder: FormBuilder,
  ) { 
    if(!localStorage.getItem("UserID")==true){      
      this.router.navigate(['/login']);
    }
    
    if(!this.cookieService.get('selectedLang')==false){
      this.languageSelected = this.cookieService.get('selectedLang');        
    } else {
      this.languageSelected = "EN";      
    } 
    console.log(this.languageSelected);
    this.currLang = this.languageSelected.toLowerCase();

    if(!localStorage.getItem("UserTimezone")==false){
      this.timeZone = localStorage.getItem("UserTimezone");        
    } else {
      this.timeZone="+0000";
    } 

    if(!localStorage.getItem("UserID")==false){
      this.userID = localStorage.getItem("UserID");    
    }
    this.userPoints = localStorage.getItem("UserEarnedPoints");
  }

  ngOnInit(): void {
    this.getProfileList();

    //Signal List
    //this.profileID=25;

    //Signal Details
    //this.signalID="BB084FB7C01CA5F655C7A2EAEB687DC7";

    let isLogged = localStorage.getItem("isLogged");      
    if(isLogged=="true"){      
      //CHECKING FOR ALREADY LOADED SIGNAL LIST    
      let Jwt_token= localStorage.getItem("Jwt-token");
      if(Jwt_token==""){
        this.autoLogin();
      }

      this.index=0; 
      this.signalCount=10;
      
      if(!localStorage.getItem('signalCount')==false){
        this.signalCount=localStorage.getItem('signalCount');
      } else {
        localStorage.setItem('signalCount',this.signalCount);
      }

      if(!localStorage.getItem('signalIndex')==false){        
        this.index=localStorage.getItem('signalIndex');
      }

      if(!localStorage.getItem('symbolRootArr')==false){    
        this.symbolRootArr = JSON.parse(<any>localStorage.getItem("symbolRootArr"));
      }  
      if(!localStorage.getItem('symbolRootNameArr')==false){ 
        this.symbolRootNameArr = JSON.parse(<any>localStorage.getItem("symbolRootNameArr"));                                
      }

      console.log(this.symbolRootArr);
      console.log(this.symbolRootNameArr);
      
    } else {      
      this.autoLogin();
    }

    this.profileEditForm = this.formBuilder.group({                       
      search_status: [this.statusInp],  
      search_symbol: [],
      search_timeframe: [],       
    });

    this.finalSignals = this.searchSignal.valueChanges.pipe(
      startWith(null),
      map(value => typeof value === 'string' ? value : this.lastFilter),
      map(filter => this.filter(filter))
    );

    if(!localStorage.getItem("searchInp")==false){
      let searchInp:any = JSON.parse(<any>localStorage.getItem("searchInp"));
      console.log(searchInp);
      this.profileEditForm.patchValue({         
        search_status: searchInp.search_status,  
        search_symbol: searchInp.search_symbol,
        search_timeframe: searchInp.search_timeframe               
      });
      
    }
  }

  getTabID(event:any){
    console.log(event);
    /*this.tabIndex=event.index;      
    this.selUID="";
    if(this.tabIndex==0){
      localStorage.setItem('selectedSignalCat',"Search");
      this.catIndex="Search";
    } else {
      localStorage.setItem('selectedSignalCat',"All");
      this.catIndex="All";
      if(this.tabIndex==1){
        this.loadPendingSignalList('All');
      } else if(this.tabIndex==2){
        this.loadActiveSignalList('All');
      }
    }
    localStorage.setItem('selectedSignalUID',"");
    localStorage.setItem('selectedSignalTab',event.index);*/
    if(!this.timeScriptID==false){
      this.timeScriptID.unsubscribe();
    }     
  }

  filter(filter: any) {
    this.lastFilter = filter;
    if (filter) {
      return this.filteredSignals.filter((option:any) => {
        return option.name.toLowerCase().indexOf(filter.toLowerCase()) >= 0;
      })
    } else {
      return this.filteredSignals.slice();
    }
  }  

  get valid() { return this.profileEditForm.controls; } 

  displayFn(value:any) {
    let displayValue: any="";
    if (Array.isArray(value)) {
      value.forEach((user, index) => {
        if (index === 0) {
          displayValue = user.name;
        } else {
          displayValue += ', ' + user.name;
        }
      });
    } else {
      displayValue = value;
    }
    return displayValue;
  }

  optionClicked(event: Event, input: any) {
    event.stopPropagation();
    console.log(input);    
    //this.toggleSelection(input);
    console.log(input);
    if (this.selectedSignalsList.includes(input.value)==false) {      
      this.selectedSignalsList.push(input.value);
    }    
    console.log(this.selectedSignalsList);    
    this.searchSignal.setValue('');
    this.profileEditForm.patchValue({         
      search_symbol:this.selectedSignalsList                 
    });
  }

  toggleSelection(input: any) {
    //input.selected = !input.selected;
    //alert(input);
    console.log(input);

    if (this.selectedSignalsList.includes(input.value)==false) {      
      this.selectedSignalsList.push(input.value);
    } /*else {      
      const i2 = this.selectedSignalsList.findIndex((value:any) => value === input.value);
      this.selectedSignalsList.splice(i2, 1)
    }*/
    
    console.log(this.selectedSignalsList);    
    this.searchSignal.setValue('');
    this.profileEditForm.patchValue({         
      search_symbol:this.selectedSignalsList                 
    });
  }

  selectTime(input:any){
    console.log(input);
    if(input.status==0){
      input.status = 1;
      this.timeArr.push(input.name);
    } else {
      input.status = 0;
      this.timeArr = this.timeArr.filter((item:any) => item !== input.name);
    }    
    console.log(this.timeArr);  
    this.profileEditForm.patchValue({   
      search_timeframe:this.timeArr                
    });
  }

  selectStatus(input:any){
    this.statusInp = input;
    this.profileEditForm.patchValue({   
      search_status:this.statusInp                
    });
  }

  removeSignal(sigName:any){       
    const i = this.selectedSignalsList.findIndex((value:any) => value === sigName);
    this.selectedSignalsList.splice(i, 1)    
    console.log(this.selectedSignalsList);
  }

  autoLogin(){    
    let username:any = this.cookieService.get('username');
    let password:any = this.cookieService.get('password');

    let decode = CryptoJS.AES.decrypt(password, this.passwordKey).toString(CryptoJS.enc.Utf8);
    //console.log(decode);

    let inputDets:any={username:username,password:decode};
    this._service.userLogin(inputDets)
    .subscribe(
      (data) => {
        console.log("Login Reuslt => ", data);   
          
          let result:any = data.body;
          let requ:any = data.headers.get('jwt-token');
          console.log(result); 
          console.log(requ);

          this.colhideshow = 0;
          if(result.active==true){
            let isLogged:any=true;
            let next:any=false;
            let index:any=0;
                      
            //localStorage.setItem("username",inputDets['username']);            
            localStorage.setItem("isLogged",isLogged);
            localStorage.setItem("Jwt-token",requ);		
            localStorage.setItem('signalNext',next);
            localStorage.setItem('signalIndex',index);   
            this.getProfileDets();                    
          } else {
            //this._notification.warning("User account is inactive");   
            this.alertPopup=1;
            this.alertPopupMsg="User account is inactive"; 
            this.alertPopupImg="assets/images/fail.png";
            this.router.navigate(['/login']);         
          }
      },
      response => {
        console.log("POST call in error", response);               
        //this._notification.warning("Error on process, login again.");  
        this.alertPopup=1;
        this.alertPopupMsg="Error on process, login again."; 
        this.alertPopupImg="assets/images/fail.png"; 
        this.router.navigate(['/login']);
      });
  }

  gotoSignal(profileDets:any){
    this.showSignal = 1;
    console.log(profileDets);
    this.profileID = profileDets.profile_id;
    this.profileName = profileDets.profile_name;
    this.getProfileDets();
    //this.router.navigate(['/signal/signal-list/'+profileID])
  }  

  createProfile(){    
    localStorage.setItem('profileMode','Add');  
    localStorage.setItem("selectedProfile","");
    this.router.navigate(['/signal/create-profile1']);
  }  

  showSignalDets(event:any,profile:any){    
    for(let i=0;i<this.profileList.length;i++){ 
      if(this.profileList[i].profile_id == profile.profile_id && event.target.checked == true){
        this.profileList[i].profileChk = 1;
      } else {
        this.profileList[i].profileChk = 0;
      }          
    }
    console.log(this.profileList);
  }

  getProfileList(){
    //alert("in");    
    this.profileShow = 0; 
    this.profileList = [];

    let userDets:any={userID:this.userID};
    this._service.getProfileList(userDets)
    .subscribe(
      (data) => {
        console.log("Post Reuslt => ", data);        
        this.profileList = data.profileList;  
        this.autoProfileStatus = data.autoProfileStatus;  
        this.profileShow = 1;
        for(let i=0;i<this.profileList.length;i++){     
          this.profileList[i].profileChk = 0;     
          if(this.profileList[i].profile_image!=""){
            this.profileList[i].imgSrc = this.imgURL+"profiles/"+this.profileList[i].profile_image;
          } else {
            this.profileList[i].imgSrc = "assets/images/profile.jpg";
          }          
        }                         
        console.log(this.profileList);
        
        this.selectedProfile = this.profileList[0];
      },
      response => {
        console.log("POST call in error", response); 
        this.profileShow = -1;                             
      });
  }

  setDefaultProfile(profile:any){
    console.log(profile);

    let userDets:any={userID:this.userID,profileID:profile.profile_id};
    this._service.setDefaultProfile(userDets)
    .subscribe(
      (data) => {
        console.log("Post Reuslt => ", data);     
        //this._notification.success("Default profile selection completed.");  
        this.alertPopup=1;
        //this.alertPopupMsg="Default profile selection completed."; 
        this.alertPopupMsg=this.translate.instant('my_profile.default_selected');
        this.alertPopupImg="assets/images/validation-error.png"; 
        for(let i=0;i<this.profileList.length;i++){          
          if(this.profileList[i].profile_id == profile.profile_id){
            this.profileList[i].profile_default = 1;
          } else {
            this.profileList[i].profile_default = 0;
          }          
        }                 
      },
      response => {
        console.log("POST call in error", response);                              
      });
  }

  enableProfileNotification(profile:any){
    console.log(profile);

    if(profile.profile_notification==0){
      profile.profile_notification = 1;
    } else {
      profile.profile_notification = 0;
    }   

    let userDets:any={status:profile.profile_notification,profileID:profile.profile_id};
    this._service.enableProfileNotification(userDets)
    .subscribe(
      (data) => {
        console.log("Post Reuslt => ", data);     
        //this._notification.success("Notification enabled for profile.");                         
        this.alertPopup=1;        
        if(profile.profile_notification==1){
          //this.alertPopupMsg="Notification enabled for "+profile.profile_name+""; 
          this.alertPopupMsg=this.translate.instant('my_profile.enable_note2',{profileName:profile.profile_name});
        } else {
          //this.alertPopupMsg="Notification disabled for "+profile.profile_name+""; 
          this.alertPopupMsg=this.translate.instant('my_profile.disable_note',{profileName:profile.profile_name});
        }  
        this.alertPopupImg="assets/images/validation-error.png"; 
      },
      response => {
        console.log("POST call in error", response);                              
      });
  }

  enableAutoProfileNotification(profile:any){
    console.log(profile);
    
    if(this.autoProfileStatus==0){
      this.autoProfileStatus = 1;
    } else {
      this.autoProfileStatus = 0;
    }       
    
      let userDets:any={status:this.autoProfileStatus,userID:this.userID};
      console.log(userDets); 
      this._service.enableAutoProfileNotification(userDets)
      .subscribe(
        (data) => {
          console.log("Post Reuslt 2 => ", data);     
          this.autoProfileStatus = data.autoProfileStatus; 
          //alert(this.autoProfileStatus);
          if(data.status==true){
            //this._notification.success("Notification enabled for auto signal profile.");                         
            this.alertPopup=1;
            if(this.autoProfileStatus==1){
              //this.alertPopupMsg="Notification enabled for auto signal profile"; 
              this.alertPopupMsg=this.translate.instant('my_profile.enable_auto');
            } else {
              //this.alertPopupMsg="Notification disabled for auto signal profile"; 
              this.alertPopupMsg=this.translate.instant('my_profile.disable_auto');
            }            
            this.alertPopupImg="assets/images/validation-error.png"; 
          }                    
        },
        response => {
          console.log("POST call in error", response);                              
        });
    
  }

  editProfile(profile:any){
    console.log(profile);

    let userDets:any={profileID:profile.profile_id};
    this._service.profileDets(userDets)
    .subscribe(
      (data) => {
        console.log("Post Reuslt => ", data);  
        let input = data.profileDets;
        let obj = {"profileID":input['profile_id'], "userID":localStorage.getItem("UserID"), "name":input['profile_name'], "description":input['profile_description'], "image":input['profile_image'], "selSymbol":input['profile_symbols'].split(","), "selTransaction":input['profile_transaction'].split(","), "selTimeFrame":input['profile_timeframe'].split(","), "selTools":input['profile_tools'].split(","), "selStrategie":input['profile_strategies'].split(","), "selStateT":input['profile_stateT'].split(","), "selStateW":input['profile_stateW'].split(","), "selScore":input['profile_score'].split(",")};
  
        console.log(obj);
        localStorage.setItem("selectedProfile",JSON.stringify(obj));
        localStorage.setItem('profileMode','Edit');            
        this.router.navigate(['/signal/create-profile1']);                        
      },
      response => {
        console.log("POST call in error", response);                              
      });
  }

  delPopup(profile:any){
    this.showPopBtn = 1;
    this.seletedProfile = profile;
    this.deletePopup=1;
    //this.alertPopupMsg="Do you want to delete this profile.";
    this.deletePopupImg="assets/images/validation-error.png"; 
    this.deletePopupMsg=this.translate.instant('my_profile.conform_delete',{profileName:profile.profile_name});
  }

  delProfile(profile:any){
    this.showPopBtn = 0;
    console.log(profile);
    this.btnDis = 1;
    let userDets:any={profileID:profile.profile_id};
    this._service.delProfile(userDets)
    .subscribe(
      (data) => {
        console.log("Post Reuslt => ", data);             
        this.profileList = this.profileList.filter((item:any) => item.profile_id !== profile.profile_id);
        console.log(this.profileList);
        //this._notification.success("Profile Deleted");      
        
        this.btnDis = 0;
        this.showPopBtn = 0;                 
        this.deletePopup=1;
        //this.alertPopupMsg="Profile Deleted Successfully"; 
        this.deletePopupMsg=this.translate.instant('my_profile.success_message');
        this.deletePopupImg="assets/images/validation-error.png"; 

        setTimeout(() => {
          this.closeDeletePopup();
        }, 1500);
      },
      response => {
        console.log("POST call in error", response);                              
      });
  }

  gotoCourse(input:any){
    this.router.navigate(['/academy/home-study-courses/'+input.profile_code+'/'+input.profile_lang]);
  }

  //Signal List
  gotoLogin(){
    //alert("Calling");
    this.router.navigate(['/login']);
  }

  formatRate(amount:any){
    let count=this.decimalPoints;
    let amt=parseFloat(amount.toFixed(count));
    //amt=amt.toFixed(count);
    return amt;
  }

  showCategory(cat:any){
    //alert(cat);
    /*if(cat=="All"){
      this.selectedCategory = "";  
    } else {
      this.selectedCategory = cat;
    }*/    
  }

  getProfileDets(){    
    let profileDets:any={profileID:this.profileID,userID:this.userID};
    console.log(profileDets);
    this._service.profileDets(profileDets)
      .subscribe(
        (data:any) => {
          console.log("Profile Details");
          console.log(data);
          let input:any = data.profileDets;
          this.userSignalStatus = data.signalStatus;
          //alert(this.userSignalStatus);          

          this.selectedProfile = {"profileID":input['profile_id'], "userID":localStorage.getItem("UserID"), "name":input['profile_name'], "description":input['profile_description'], "image":input['profile_image'], "selSymbol":(input['profile_symbols']).split(","), "selTransaction":(input['profile_transaction']).split(","), "selTimeFrame":input['profile_timeframe'].split(","), "selTools":input['profile_tools'].split(","), "selStrategie":input['profile_strategies'].split(","), "selStateT":input['profile_stateT'].split(","), "selStateW":input['profile_stateW'].split(","), "selScore":input['profile_score'].split(",")};    
          console.log(this.selectedProfile);
          localStorage.setItem("selectedProfile",JSON.stringify(this.selectedProfile));

          //this.CalSignalList();

          let timeframeArr:any = this.selectedProfile.selTimeFrame;
          let symbolArr:any = this.selectedProfile.selSymbol;
          let stragesArr:any = this.selectedProfile.selStrategie;
          let stateTArr:any = this.selectedProfile.selStateT;
          let stateWArr:any = this.selectedProfile.selStateW;
          let score:any = this.selectedProfile.selScore;

          timeframeArr = timeframeArr.filter((el:any) => { return el != ''; });
          symbolArr = symbolArr.filter((el:any) => { return el != ''; });
          stragesArr = stragesArr.filter((el:any) => { return el != ''; });
          stateTArr = stateTArr.filter((el:any) => { return el != ''; });
          stateWArr = stateWArr.filter((el:any) => { return el != ''; });
          score = score.filter((el:any) => { return el != ''; });
          
          console.log("Input List");
          console.log(timeframeArr);
          console.log(symbolArr);
          console.log(stragesArr);
          console.log(stateTArr);
          console.log(stateWArr);
          console.log(score);
          console.log(this.signalCount);
          console.log(this.index);

          this.filteredSignals=[];
          for(let i=0;i<symbolArr.length;i++){
            if(symbolArr[i]!=""){
              let obj:any={value:symbolArr[i],name:symbolArr[i]};
              this.filteredSignals.push(obj);
            }
          }  

          this.timeFrames = [];
          this.timeArr=[];
          for(let i=0;i<timeframeArr.length;i++){
            if(timeframeArr[i]!=""){
              let obj:any={status:1,name:timeframeArr[i]};
              this.timeArr.push(timeframeArr[i]);  
              this.timeFrames.push(obj);
            }
          } 
          this.profileEditForm.patchValue({   
            search_timeframe:this.timeArr                
          }); 


          if(timeframeArr.length > 0 && symbolArr.length > 0){
            this.pendingFilter = 0;
            this.activeFilter = 0;
            this.cancelFilter = 0;
          }         
                
          //this.symbolInputArr:any[]=[];
          //this.symbolInputArr[<any>'All']=[];
          //this.selectedPendingCategoryIndex[<any>'All'] = 0;
          //this.selectedActiveCategoryIndex[<any>'All'] = 0;
          
          for(let j=0;j<this.symbolRootNameArr.length;j++){
            this.symbolInputArr[this.symbolRootNameArr[j]]=[];
            this.selectedPendingCategoryIndex[this.symbolRootNameArr[j]] = 0;
            this.selectedActiveCategoryIndex[this.symbolRootNameArr[j]] = 0;
          }           
          
          console.log(this.symbolInputArr); 
          console.log(this.selectedPendingCategoryIndex); 
          console.log(this.selectedActiveCategoryIndex); 

          for(let j=0;j<symbolArr.length;j++){               
              if(this.selectedCategoryList.includes(this.symbolRootArr[symbolArr[j]]) == false){
                if(!this.symbolRootArr[symbolArr[j]]==false){
                  this.selectedCategoryList.push(this.symbolRootArr[symbolArr[j]]);              
                  //this.symbolInputArr[this.symbolRootArr[symbolArr[j]]]=[];  

                  //this.selectedPendingCategoryIndex[this.symbolRootArr[symbolArr[j]]] = 0;
                  //this.selectedActiveCategoryIndex[this.symbolRootArr[symbolArr[j]]] = 0;
                }
              }           
              for(let i=0;i<timeframeArr.length;i++){                    
                  let sig_obj:any={"symbol":symbolArr[j],"timeframe":timeframeArr[i]};        
                  this.symbolInputArr[<any>'All'].push(sig_obj);
                  if(!this.symbolRootArr[symbolArr[j]]==false){         
                    this.symbolInputArr[this.symbolRootArr[symbolArr[j]]].push(sig_obj);         
                  }                
              }                  
          }

          let stFilterArr:any=[];
          for(let s=0;s<score.length;s++){
            let srArr:any=score[s].split(":");
            let obj:any = {"strategies": [srArr[0]],"scoreFrom": srArr[1],"scoreTo": srArr[2]};
            stFilterArr.push(obj);
          }
          console.log(stFilterArr);
          

          console.log('Symbol Matirx Data');
          console.log(this.symbolInputArr); 
          console.log(this.selectedCategoryList);
          console.log(this.selectedPendingCategoryIndex);
          console.log(this.selectedActiveCategoryIndex); 

          if(timeframeArr.length==0 && symbolArr.length==0){
            this.pendingData = 1;
            this.activeData = 1;
          } else {
            this.pendingData = 2;
            this.activeData = 2;
          }
            
          if(score==""){ score=1; }    
          if(this.signalCount==""){ this.signalCount=10; }
                  
          let signalData={
            "apiKey": null,
            "getDebugMessages": false, 
            "getIncludeOriginal": false,
            "getIncludeCandles": false,
            "getIncludeLnrArray": false,
            "getIncludeOptimized": false,
            "getIncludeSignals": true,    
            "lang": this.currLang,  
            "symbols": this.symbolInputArr[<any>'All'],
            "mainFilter": {   
              "timeframes": timeframeArr,
              "patterns": [],
              "quality": [],         	
              "stateWave": stateWArr,
              "stateTrend": stateTArr,
              //"scoreFrom": score,  
              //"scoreTo":10,         	
              "strategies": stragesArr
            },
            "filters": stFilterArr,	
            /*"filters": [{   
              "timeframes": timeframeArr,
              "patterns": [],
              "quality": [],         	
              "stateWave": stateWArr,
              "stateTrend": stateTArr,
              "scoreFrom": 2,  
              "scoreTo":10,         	
              "strategies": stragesArr
            }],*/ 
            "signalFrom": this.index, 
            "signalCount": 50, 
            "onlySignals": false			
          };
          this.signalInputs=signalData;

          this.loadPendingSignalList('All');
          this.loadActiveSignalList('All');
          //alert(this.tabIndex+" "+this.catIndex);
          /*if(this.catIndex!=""){
            if(this.tabIndex==0 && this.catIndex=='Search'){
              this.setSearchInput();
              //this.loadPendingSignalList('All');
              //this.loadActiveSignalList('All');
            } else {
              if(this.tabIndex==1){
                this.loadPendingSignalList(this.catIndex);
              } else if(this.tabIndex==2){
                this.loadActiveSignalList(this.catIndex);
              }       
            }            
          } else {
            if(this.tabIndex==1){
              this.loadPendingSignalList('All');
            } else if(this.tabIndex==2){
              this.loadActiveSignalList('All');
            }
          }*/
        },
        (err) => {
          console.log;
        }
      );     
  }

  searchItem:any="";
  setSearchInput(){    
    console.log(this.profileEditForm.value);
       
    let status:any=this.profileEditForm.value['search_status'];   
    let symbolArr:any=this.profileEditForm.value['search_symbol'];   
    let timeframeArr:any = this.profileEditForm.value['search_timeframe'];    
    //alert(status);
    this.symbolInputArr[<any>'Search']=[];    
    console.log(symbolArr);
    let symArr:any=[];
    
    localStorage.setItem("searchInp",JSON.stringify(<any>this.profileEditForm.value));    
    for(let j=0;j<symbolArr.length;j++){
      if(this.selectedCategoryList.includes(this.symbolRootArr[symbolArr[j]]) == false){
        if(!this.symbolRootArr[symbolArr[j]]==false){
          this.selectedCategoryList.push(this.symbolRootArr[symbolArr[j]]);                          
        }
      }           
      for(let i=0;i<timeframeArr.length;i++){        
        let sig_obj={"symbol":symbolArr[j],"timeframe":timeframeArr[i]};        
        symArr.push(sig_obj);          
      }
    }

    console.log(symArr);
    this.symbolInputArr[<any>'Search']=symArr;
    this.selectedPendingCategoryIndex[<any>'Search'] = 0;
    this.selectedActiveCategoryIndex[<any>'Search'] = 0;

    this.currSearchSignalIDs = [];
    this.searchDataList = [];
    //this.currActiveSignalIDs = [];
    //this.activeDataList = [];

    console.log(this.symbolInputArr);
    console.log(this.signalInputs);

    //this.msgPopup = 0;
    if(status=="Pending"){
      this.searchPendingSignalList('Search');
    } else if(status=="Active"){
      this.searchActiveSignalList('Search');  
    }
  }

  reset(){
    this.serachFilter = 0;
  }

  clearSearchInput(){
      this.searchItem="";
      this.serachFilter = 0;
      this.symbolInputArr[<any>'Search']="";
      this.selectedPendingCategoryIndex[<any>'Search'] = 0;
      this.selectedActiveCategoryIndex[<any>'Search'] = 0;
      localStorage.setItem("searchInp","");
      this.statusInp="Pending";
      
      this.selectedSignalsList = [];
      this.timeArr=[];
      for(let i=0;i<this.timeFrames.length;i++){
        this.timeFrames[i].status=1;  
        this.timeArr.push(this.timeFrames[i].name);      
      }  
      
      this.profileEditForm.patchValue({   
        search_status: [this.statusInp],          
        search_symbol: [],
        search_timeframe: this.timeArr,               
      });

      for(let j=0;j<this.symbolRootNameArr.length;j++){
        this.selectedPendingCategoryIndex[this.symbolRootNameArr[j]] = 0;
        this.selectedActiveCategoryIndex[this.symbolRootNameArr[j]] = 0;
      }   

      this.currSearchSignalIDs = [];
      this.searchDataList = [];
      //this.searchSignal.setValue('e');
      this.searchSignal.setValue('');         
  }

  searchDataList:any=[];
  serachData: number = 0;
  serachFilter: number = 0;
  searchMoreShow:any=false;
  currSearchSignalIDs:any=[];

  searchPendingSignalList(category:any){
    localStorage.setItem('selectedSignalCat',category);
    this.selPendingCategory = "";  
    //alert(category);
    this.serachFilter = 1;
    this.serachData = 2;
    this.searchMoreShow=false;

    let Jwt_token=localStorage.getItem("Jwt-token");
    //console.log('Signal Data');
    //console.log(this.signalInputs);  
    console.log("Pending Category Index => "+category+" "+this.selectedPendingCategoryIndex[category]);      

    let timeframeArr:any = this.profileEditForm.value['search_timeframe'];

    //alert(category);
    let signalPendingInputs:any = this.signalInputs;
    signalPendingInputs.symbols = this.symbolInputArr[<any>category]; 
    signalPendingInputs.mainFilter.timeframes = timeframeArr;    
    if(this.selectedPendingCategoryIndex[category] > 0){
      signalPendingInputs.signalFrom = this.selectedPendingCategoryIndex[category];      
    }    
    signalPendingInputs=JSON.stringify(signalPendingInputs);
    console.log(signalPendingInputs);  
    
    let token="Bearer "+Jwt_token;
    //console.log(token);
    
     let date1=new Date();
     let latest1:any=this.datepipe.transform(date1, 'yyyy-MM-dd hh:mm a');    
     console.log('Pending Signals Calling Starting On => '+ latest1);
     // Pending Signals
     this._service.getPendSignals(signalPendingInputs, token)
     .subscribe(
       (data:any) => {
          console.log("Pending Signals");
          console.log(data);

          if(!data.echoMessage==false && (data.echoMessage).substring(0, 22)=="You are not authorized"){
            this.pendingBlock = 1;
          }

          if(data.signals.length > 0){
            let date2=new Date();
            let latest2:any=this.datepipe.transform(date2, 'yyyy-MM-dd hh:mm a');    
            console.log('Pending Signals Calling Ending On => '+ latest2);
          }
        
          data.signals=this.multiSort(data.signals, {signalInceptionDate: 'desc'});
          console.log('After Sort');
          console.log(data);

          this.searchMoreShow = data.hasNext;         
          this.selPendingSignalList = data.signals;													        
          this.selectedPendingCategoryIndex[category] = parseInt(this.selectedPendingCategoryIndex[category]) + parseInt(this.selPendingSignalList.length);

          let len=this.selPendingSignalList.length;
          let add_pen=0;                      
          if(len > 0){                             
            for(let z=0;z<len;z++){              
               data.signals[z].signalActual.z = z;
               data.signals[z].signalActual.tblInner = 0;
               let symbol:any = data.signals[z].signalActual.symbol;
               //alert(symbol+" "+this.symbolRootArr[symbol]);
               console.log(this.symbolRootArr[symbol]);
               if(this.symbolRootArr[symbol] !== undefined){
                data.signals[z].signalActual.root = this.symbolRootArr[symbol];              
               } else {
                data.signals[z].signalActual.root = "";
               }
               
               let en=data.signals[z].signalActual.en;
               let s2=data.signals[z].signalActual.s2;
               let ENT=this.formatRate(parseFloat(en));
               let STOP=this.formatRate(parseFloat(s2));

               var mode="";   
                if(ENT >= STOP){
                  mode="BUY";
                } else if(ENT < STOP){
                  mode="SELL";
                }
               data.signals[z].signalActual.mode = mode;

               let currRate=<any>0;
               let symbolName=(data.signals[z].signalActual.symbol).replace(".","").replace("&","").replace("#","");					    		
               data.signals[z].signalActual.symbolName = symbolName;
                    
               add_pen=add_pen+1;
               // console.log(add_pen);

               let class_val2 = "";
               if((add_pen%2)==0){
                   class_val2="tab-dark";
               } else if((add_pen%2)==1){
                   class_val2="tab-light";
               }
               data.signals[z].signalActual.class_val2 = class_val2;

               let class_val = "";
               if(mode=="SELL"){
                   class_val="text-danger";
                   //class_val2="tab-dark";
               } else if(mode=="BUY"){
                   class_val="text-primary";
                   //class_val2="tab-light";
               }						      	        

               data.signals[z].signalActual.class_val = class_val;
               let t3=data.signals[z].signalActual.t3;
               let T3=this.formatRate(parseFloat(t3));
              //let actDate:any=this.datepipe.transform(data.signals[z].signalActual.activationDate, 'dd.MM.yyyy | HH:mm'); 
               
               data.signals[z].signalActual.en = en;
               data.signals[z].signalActual.s2 = s2;
               data.signals[z].signalActual.t3 = t3;
               data.signals[z].signalActual.ENT = ENT;
               data.signals[z].signalActual.STOP = STOP;
               data.signals[z].signalActual.T3 = T3;
               //data.signals[z].signalActual.actDate = actDate;
               
               //currRate=ENT;
               //bal=(currRate-ENT).toFixed(5);
               currRate="-";
               let bal="-";
               data.signals[z].signalActual.currRate = currRate;
               data.signals[z].signalActual.bal = bal;                                            
            }

            console.log(data.signals);
            //this.searchDataList = data.signals;          
            for(let z=0;z<data.signals.length;z++){
              if(this.currSearchSignalIDs.includes(data.signals[z].signalActual.uid) == false){
                this.currSearchSignalIDs.push(data.signals[z].signalActual.uid);
                this.searchDataList.push(data.signals[z].signalActual);
              }                
            }
            console.log(this.searchDataList);
           
            this.serachData = 0;
            //console.log(symbolList);

            if(this.selUID!=""){
              setTimeout(() => {     
                //alert(this.selUID);       
                document.querySelector(this.selUID).scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });            
              }, 500);
            }
          } else {            
            this.serachData = 3;
            if(this.searchDataList.length > 0){
              this.serachData = 0;
            }
          }          
       },
       (err) => {
         //console.log;
         console.log("POST call in error", err);    
          if(!localStorage.getItem('username')==true && !localStorage.getItem('password')==true){
            this.gotoLogin();
          } else {
            let msg=this.translate.instant('autotrade.process_wait');
            //this._notification.success("Processing please wait..");
            this._notification.success(msg);
            this.autoLogin();
          } 
       }
     );
  }

  searchActiveSignalList(category:any){
    localStorage.setItem('selectedSignalCat',category);
    this.selActiveCategory = "";      
    this.serachFilter = 1;
    this.searchMoreShow=false;
    this.serachData = 2;

    let Jwt_token=localStorage.getItem("Jwt-token");
    //console.log('Signal Data');
    //console.log(this.signalInputs);    
    console.log("Active Category Index => "+category+" "+this.selectedActiveCategoryIndex[category]);
    let timeframeArr:any = this.profileEditForm.value['search_timeframe'];
    
    let signalActiveInputs:any = this.signalInputs;
    signalActiveInputs.symbols = this.symbolInputArr[<any>category];  
    signalActiveInputs.mainFilter.timeframes = timeframeArr;     
    //alert(this.selectedActiveCategoryIndex[category]);
    if(this.selectedActiveCategoryIndex[category] > 0){
      signalActiveInputs.signalFrom = this.selectedActiveCategoryIndex[category];      
    }   
    signalActiveInputs=JSON.stringify(signalActiveInputs);
    console.log(signalActiveInputs);    
    
    let token="Bearer "+Jwt_token;
    //console.log(token);

    let date3=new Date();
    let latest3:any=this.datepipe.transform(date3, 'yyyy-MM-dd hh:mm a');    
    console.log('Active Signals Calling Starting On => '+ latest3);

     // Active Signals
     this._service.getActiveSignals(signalActiveInputs, token)
     .subscribe(
       (data:any) => {
         console.log("Active Signals");
         console.log(data);

         if(!data.echoMessage==false && (data.echoMessage).substring(0, 22)=="You are not authorized"){
          this.activeBlock = 1;
         }

         if(data.signals.length > 0){
           let date4=new Date();
           let latest4:any=this.datepipe.transform(date4, 'yyyy-MM-dd hh:mm a');    
           console.log('Active Signals Calling Ending On => '+ latest4);
         }

         data.signals=this.multiSort(data.signals, {signalInceptionDate: 'desc'});
         console.log('After Sort');
         console.log(data);              

         this.searchMoreShow = data.hasNext; 
         this.selActiveSignalList = data.signals;													        
         //let row="";
         let add_act=0;     

         this.selectedActiveCategoryIndex[category] = parseInt(this.selectedActiveCategoryIndex[category]) + parseInt(this.selActiveSignalList.length);
         
         let len=data.signals.length;                 
         if(len!=0){                 
           for(let z=0;z<len;z++){
               data.signals[z].signalActual.z = z;
               data.signals[z].signalActual.tblInner = 0;
               let symbol:any = data.signals[z].signalActual.symbol;
               //alert(symbol+" "+this.symbolRootArr[symbol]);
               if(this.symbolRootArr[symbol] !== undefined){
                data.signals[z].signalActual.root = this.symbolRootArr[symbol];
              } else {
                data.signals[z].signalActual.root = "";
              }

                let en=data.signals[z].signalActual.en;
                let s2=data.signals[z].signalActual.s2;
                let ENT=this.formatRate(parseFloat(en));
                let STOP=this.formatRate(parseFloat(s2));

                var mode="";               
                if(ENT >= STOP){
                  mode="BUY";
                } else if(ENT < STOP){
                  mode="SELL";
                }

                data.signals[z].signalActual.mode = mode;

               let currRate=<any>0;
               let symbolName=(data.signals[z].signalActual.symbol).replace(".","").replace("&","").replace("#","");					    		
               data.signals[z].signalActual.symbolName = symbolName;
                    
               add_act=add_act+1;
               // console.log(add_act);

               let class_val2 = "";
               if((add_act%2)==0){
                   class_val2="tab-dark";
               } else if((add_act%2)==1){
                   class_val2="tab-light";
               }
               data.signals[z].signalActual.class_val2 = class_val2;
               let class_val = "";
               if(mode=="SELL"){
                   class_val="text-danger";
                   //class_val2="tab-dark";
               } else if(mode=="BUY"){
                   class_val="text-primary";
                   //class_val2="tab-light";
               }						      	        
               data.signals[z].signalActual.class_val = class_val;
               let t3=data.signals[z].signalActual.t3;
               let T3=this.formatRate(parseFloat(t3));
               //let actDate:any=this.datepipe.transform(data.signals[z].signalActual.activationDate, 'dd.MM.yyyy | HH:mm'); 

               data.signals[z].signalActual.en = en;
               data.signals[z].signalActual.s2 = s2;
               data.signals[z].signalActual.t3 = t3;
               data.signals[z].signalActual.ENT = ENT;
               data.signals[z].signalActual.STOP = STOP;
               data.signals[z].signalActual.T3 = T3; 
               //data.signals[z].signalActual.actDate = actDate;              
              
               //currRate=ENT;
               //bal=(currRate-ENT).toFixed(5);
               currRate="-";
               let bal="-";
               data.signals[z].signalActual.currRate = currRate;
               data.signals[z].signalActual.bal = bal;                                            
           }
           console.log(data.signals);           
            for(let z=0;z<data.signals.length;z++){              
              if(this.currSearchSignalIDs.includes(data.signals[z].signalActual.uid) == false){
                this.currSearchSignalIDs.push(data.signals[z].signalActual.uid);
                this.searchDataList.push(data.signals[z].signalActual);
              } /*else {
                this.searchDataList.push(data.signals[z].signalActual);
              }*/                
            }
            console.log(this.searchDataList);           
           
           this.serachData = 0;           
            if(this.selUID!=""){
              setTimeout(() => {     
                //alert(this.selUID);       
                document.querySelector(this.selUID).scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });            
              }, 500);
            }
         } else {
            this.serachData = 3;
            if(this.searchDataList.length > 0){
              this.serachData = 0;
            }
         }          
       },
       (err) => {
         console.log;
         //this._notification.warning("Oop's error an process, Login again.");
         //this.gotoLogin();
       }
     );
  }

  loadPendingSignalList(category:any){
    if(category=="All"){
      this.selPendingCategory = "";  
    } else {
      this.selPendingCategory = category;
    }
    if(category==""){
      category="All";
    }

    this.signalType = category;

    this.pendingData = 2;
    this.pendingMoreShow=false;

    this.signalDets="";
    this.colhideshow = 0;
    this.signalName="";
  

    let Jwt_token=localStorage.getItem("Jwt-token");
    //console.log('Signal Data');
    //console.log(this.signalInputs);  
    console.log("Pending Category Index => "+category+" "+this.selectedPendingCategoryIndex[category]);      

    let signalPendingInputs:any = this.signalInputs;
    signalPendingInputs.symbols = this.symbolInputArr[<any>category];    
    if(this.selectedPendingCategoryIndex[category] > 0){
      signalPendingInputs.signalFrom = this.selectedPendingCategoryIndex[category];      
    }    
    signalPendingInputs=JSON.stringify(signalPendingInputs);
    console.log(signalPendingInputs);      
    
    let token="Bearer "+Jwt_token;
    //console.log(token);
    
     let date1=new Date();
     let latest1:any=this.datepipe.transform(date1, 'yyyy-MM-dd hh:mm a');    
     console.log('Pending Signals Calling Starting On => '+ latest1);
     // Pending Signals
      this._service.getPendSignals(signalPendingInputs, token)
      .subscribe(
        (data:any) => {
          console.log("Pending Signals");
          console.log(data);

          this.alertPopup = 0;

          if(data.signals.length > 0){
           let date2=new Date();
           let latest2:any=this.datepipe.transform(date2, 'yyyy-MM-dd hh:mm a');    
           console.log('Pending Signals Calling Ending On => '+ latest2);
          }
        
          data.signals=this.multiSort(data.signals, {signalInceptionDate: 'desc'});
          console.log('After Sort');
          console.log(data);

          this.pendingMoreShow = data.hasNext; 
        
          this.selPendingSignalList = data.signals;													
        
          this.selectedPendingCategoryIndex[category] = parseInt(this.selectedPendingCategoryIndex[category]) + parseInt(this.selPendingSignalList.length);

          let len=this.selPendingSignalList.length;
          let add_pen=0;                      
          if(len > 0){                             
            for(let z=0;z<len;z++){
               //alert(add_pen);        
               /*if(data.signals[z].signalActual.isSignal != false && symbolList.includes(data.signals[z].signalActual.symbol) == false){                
                 symbolList.push(data.signals[z].signalActual.symbol);
               }*/

               data.signals[z].signalActual.z = z;
               data.signals[z].signalActual.tblInner = 0;
               let symbol:any = data.signals[z].signalActual.symbol;
               //alert(symbol+" "+this.symbolRootArr[symbol]);
               console.log(this.symbolRootArr[symbol]);
               if(this.symbolRootArr[symbol] !== undefined){
                data.signals[z].signalActual.root = this.symbolRootArr[symbol];              
               } else {
                data.signals[z].signalActual.root = "";
               }
               let en=data.signals[z].signalActual.en;
               let s2=data.signals[z].signalActual.s2;
               let ENT=this.formatRate(parseFloat(en));
               let STOP=this.formatRate(parseFloat(s2));               

               var mode="";
               /*if((data.signals[z].signalActual.dir)=="UU" || (data.signals[z].signalActual.dir)=="UD"){
                 mode="BUY";
               } else if((data.signals[z].signalActual.dir)=="DU" || (data.signals[z].signalActual.dir)=="DD"){
                 mode="SELL";
               } else if((data.signals[z].signalActual.dir)=="NN"){
                 mode="NEUTRAL";
               }*/

              if(ENT >= STOP){
                mode="BUY";
              } else if(ENT < STOP){
                mode="SELL";
              }

               data.signals[z].signalActual.mode = mode;

               let currRate=<any>0;
               let symbolName=(data.signals[z].signalActual.symbol).replace(".","").replace("&","").replace("#","");					    		
               data.signals[z].signalActual.symbolName = symbolName;
                    
               add_pen=add_pen+1;
               // console.log(add_pen);

               let class_val2 = "";
               if((add_pen%2)==0){
                   class_val2="tab-dark";
               } else if((add_pen%2)==1){
                   class_val2="tab-light";
               }

               data.signals[z].signalActual.class_val2 = class_val2;

               let class_val = "";
               if(mode=="SELL"){
                   class_val="text-danger";
                   //class_val2="tab-dark";
               } else if(mode=="BUY"){
                   class_val="text-primary";
                   //class_val2="tab-light";
               }						      	        

               data.signals[z].signalActual.class_val = class_val;

               

               let t3=data.signals[z].signalActual.t3;
               let T3=this.formatRate(parseFloat(t3));
               
               data.signals[z].signalActual.en = en;
               data.signals[z].signalActual.s2 = s2;
               data.signals[z].signalActual.t3 = t3;
               data.signals[z].signalActual.ENT = ENT;
               data.signals[z].signalActual.STOP = STOP;
               data.signals[z].signalActual.T3 = T3;
               
               //currRate=ENT;
               //bal=(currRate-ENT).toFixed(5);
               currRate="-";
               let bal="-";
               data.signals[z].signalActual.currRate = currRate;
               data.signals[z].signalActual.bal = bal;                                            
            }

            console.log(data.signals);
            //this.pendingDataList = data.signals;
            for(let z=0;z<data.signals.length;z++){
              if(this.currPendingSignalIDs.includes(data.signals[z].signalActual.uid) == false){
                this.currPendingSignalIDs.push(data.signals[z].signalActual.uid);
                this.pendingDataList.push(data.signals[z].signalActual);
              } /*else {
                this.activeDataList.push(data.signals[z].signalActual);
              }*/                
            }
            console.log(this.pendingDataList);

            this.pendingData = 0;
            //console.log(symbolList);
          } else {            
            this.pendingData = 3;
            if(this.pendingDataList.length > 0){
              this.pendingData = 0;
            }
          }          
        },
        (err) => {
         //console.log;
         console.log("POST call in error", err);          
         //this._notification.success("Processing please wait..");
         if(!this.cookieService.get('username')==true && !this.cookieService.get('password')==true){
            this.gotoLogin();
          } else {
            this.alertPopup=1;
            this.alertPopupMsg="Processing please wait.."; 
            this.alertPopupImg="assets/images/validation-error.png";
            this.autoLogin();
          } 
        }
      );
  }

  loadActiveSignalList(category:any){
    if(category=="All"){
      this.selActiveCategory = "";  
    } else {
      this.selActiveCategory = category;
    }
    if(category==""){
      category="All";
    }

    this.signalType = category;

    this.activeMoreShow=false;
    this.activeData = 2;

    this.signalDets="";
    this.colhideshow = 0;
    this.signalName="";
    

    let Jwt_token=localStorage.getItem("Jwt-token");
    //console.log('Signal Data');
    //console.log(this.signalInputs);    
    console.log("Active Category Index => "+category+" "+this.selectedActiveCategoryIndex[category]);
    
    let signalActiveInputs:any = this.signalInputs;
    signalActiveInputs.symbols = this.symbolInputArr[<any>category];     
    if(this.selectedActiveCategoryIndex[category] > 0){
      signalActiveInputs.signalFrom = this.selectedActiveCategoryIndex[category];      
    }   
    signalActiveInputs=JSON.stringify(signalActiveInputs);
    console.log(signalActiveInputs);    
    
    let token="Bearer "+Jwt_token;
    //console.log(token);

    let date3=new Date();
    let latest3:any=this.datepipe.transform(date3, 'yyyy-MM-dd hh:mm a');    
    console.log('Active Signals Calling Starting On => '+ latest3);

     // Active Signals
     this._service.getActiveSignals(signalActiveInputs, token)
     .subscribe(
       (data:any) => {
         console.log("Active Signals");
         console.log(data);

         this.alertPopup = 0;

         if(data.signals.length > 0){
           let date4=new Date();
           let latest4:any=this.datepipe.transform(date4, 'yyyy-MM-dd hh:mm a');    
           console.log('Active Signals Calling Ending On => '+ latest4);
         }

         data.signals=this.multiSort(data.signals, {signalInceptionDate: 'desc'});
         console.log('After Sort');
         console.log(data);              

         this.activeMoreShow = data.hasNext; 
         this.selActiveSignalList = data.signals;													        
         //let row="";
         let add_act=0;     

         this.selectedActiveCategoryIndex[category] = parseInt(this.selectedActiveCategoryIndex[category]) + parseInt(this.selActiveSignalList.length);
         
         let len=data.signals.length;                 
         if(len!=0){ 
                
           for(let z=0;z<len;z++){
               /*if(data.signals[z].signalActual.isSignal != false && symbolList.includes(data.signals[z].signalActual.symbol) == false){
                 symbolList.push(data.signals[z].signalActual.symbol);
               }*/
              
               data.signals[z].signalActual.z = z;
               data.signals[z].signalActual.tblInner = 0;
               let symbol:any = data.signals[z].signalActual.symbol;
               //alert(symbol+" "+this.symbolRootArr[symbol]);
              if(this.symbolRootArr[symbol] !== undefined){
                data.signals[z].signalActual.root = this.symbolRootArr[symbol];
              } else {
                data.signals[z].signalActual.root = "";
              }

              let en=data.signals[z].signalActual.en;
              let s2=data.signals[z].signalActual.s2;
              let ENT=this.formatRate(parseFloat(en));
              let STOP=this.formatRate(parseFloat(s2));

              var mode="";
              /*
              if((data.signals[z].signalActual.dir)=="UU" || (data.signals[z].signalActual.dir)=="UD"){
                 mode="BUY";
               } else if((data.signals[z].signalActual.dir)=="DU" || (data.signals[z].signalActual.dir)=="DD"){
                 mode="SELL";
               } else if((data.signals[z].signalActual.dir)=="NN"){
                 mode="NEUTRAL";
               }*/

              if(ENT >= STOP){
                mode="BUY";
              } else if(ENT < STOP){
                mode="SELL";
              } 

              data.signals[z].signalActual.mode = mode;

               let currRate=<any>0;
               let symbolName=(data.signals[z].signalActual.symbol).replace(".","").replace("&","").replace("#","");					    		
               data.signals[z].signalActual.symbolName = symbolName;
                    
               add_act=add_act+1;
               // console.log(add_act);

               let class_val2 = "";
               if((add_act%2)==0){
                   class_val2="tab-dark";
               } else if((add_act%2)==1){
                   class_val2="tab-light";
               }

               data.signals[z].signalActual.class_val2 = class_val2;

               let class_val = "";
               if(mode=="SELL"){
                   class_val="text-danger";
                   //class_val2="tab-dark";
               } else if(mode=="BUY"){
                   class_val="text-primary";
                   //class_val2="tab-light";
               }						      	        

               data.signals[z].signalActual.class_val = class_val;
               
               let t3=data.signals[z].signalActual.t3;
               let T3=this.formatRate(parseFloat(t3));

               data.signals[z].signalActual.en = en;
               data.signals[z].signalActual.s2 = s2;
               data.signals[z].signalActual.t3 = t3;
               data.signals[z].signalActual.ENT = ENT;
               data.signals[z].signalActual.STOP = STOP;
               data.signals[z].signalActual.T3 = T3;               
              
               //currRate=ENT;
               //bal=(currRate-ENT).toFixed(5);
               currRate="-";
               let bal="-";

               data.signals[z].signalActual.currRate = currRate;
               data.signals[z].signalActual.bal = bal;                                            
           }
           console.log(data.signals);

            for(let z=0;z<data.signals.length;z++){
              if(this.currActiveSignalIDs.includes(data.signals[z].signalActual.uid) == false){
                this.currActiveSignalIDs.push(data.signals[z].signalActual.uid);
                this.activeDataList.push(data.signals[z].signalActual);
              } /*else {
                this.activeDataList.push(data.signals[z].signalActual);
              }*/                
            }
            console.log(this.activeDataList);           
           
           this.activeData = 0;

           /*console.log("Symbol List");
           console.log(symbolList);
           if(symbolList!=null){
             this.ngOnDestroy();            
             this.getSymbolCurrentPrice(symbolList);
           }*/
         } else {
            this.activeData = 3;
            if(this.activeDataList.length > 0){
              this.activeData = 0;
            }
         }          
       },
       (err) => {
         console.log;
         //this._notification.warning("Oop's error an process, Login again.");
         //this.gotoLogin();
       }
     );
  }
  
  filterFunction(arrlist: any[],type:any): any {  
    if (!arrlist || !type) {
        return arrlist;
    }    
    return arrlist.filter((item:any) => item.root.indexOf(type) !== -1);
  }

  /*ngOnDestroy() {
    let setTimeID=<any>localStorage.getItem('setTimeID');
    //alert(setTimeID);
    if (setTimeID){
      clearTimeout(setTimeID);
      let setTimeID2:any=0;
      localStorage.setItem('setTimeID',setTimeID2);
    };
  }

  getSymbolCurrentPrice(symbolArr:any){
    //FUNCTION FOR LOADING ALL TIMEFRAMES FOR TIMEFRAME BUTTONS
     var timeInterval=3000;     
     console.log("Symbol Current");
     let Jwt_token= localStorage.getItem("Jwt-token");
     console.log(Jwt_token);
     console.log(symbolArr);

     //console.log(this.pendingDataList);
     let pendSymbolArr = this.pendingDataList;

     //console.log(this.activeDataList);
     let activeSymbolArr = this.activeDataList;

     let symbolArr2=JSON.stringify(symbolArr);
     let token="Bearer "+Jwt_token;

     this._service.getCurrentPrice(symbolArr2,token)
      .subscribe(
        (data:any) => {
          console.log("Symbol Current Price");
          console.log(data);
          
          let currentList = data;
          let count=0;
          for(let c=0;c<currentList.length;c++){
            count++;
            for(let s=0;s<pendSymbolArr.length;s++){
              let symName = pendSymbolArr[s].signalActual.symbol;
              if(symName == currentList[c].name){                
                let en=pendSymbolArr[s].signalActual.ENT;
                let s2=pendSymbolArr[s].signalActual.STOP;
                let mode=pendSymbolArr[s].signalActual.mode;
                
                let currRate:any=0;
                let bal:any=0;
                
                if(en > s2){
                  currRate=currentList[c].ask;
                } else if(en < s2){
                  currRate=currentList[c].bid;
                }

                //var bal=0;
                if(mode=="BUY"){
                  bal=(currRate-en);
                } else if(mode=="SELL"){
                  bal=(en-currRate);
                }
                //alert(currRate+" "+bal);
                currRate=this.formatRate(currRate);
                bal=this.formatRate(bal);
                
                pendSymbolArr[s].signalActual.currRate = currRate;
                pendSymbolArr[s].signalActual.bal = bal;                
              }
            }

            for(let s=0;s<activeSymbolArr.length;s++){              
              let symName = activeSymbolArr[s].signalActual.symbol;
              if(symName == currentList[c].name){
                let en=<any>activeSymbolArr[s].signalActual.ENT;
                let s2=<any>activeSymbolArr[s].signalActual.STOP;
                let mode=activeSymbolArr[s].signalActual.mode;
                
                let currRate:any=0;
                let bal:any=0;
                
                if(en > s2){
                  currRate=currentList[c].ask;
                } else if(en < s2){
                  currRate=currentList[c].bid;
                }

                //var bal=0;
                if(mode=="BUY"){
                  bal=(currRate-en);
                } else if(mode=="SELL"){
                  bal=(en-currRate);
                }
                //alert(currRate+" "+bal);
                currRate=this.formatRate(currRate);
                bal=this.formatRate(bal);
                
                activeSymbolArr[s].signalActual.currRate = currRate;
                activeSymbolArr[s].signalActual.bal = bal;                
              }
            }
          }

          if(count==currentList.length){
            let setTimeID = setTimeout(() => {
              this.getSymbolCurrentPrice(symbolArr);
            }, timeInterval);
            localStorage.setItem('setTimeID',<any>setTimeID);
          }
        },
        (err) => {
          console.log;
          this._notification.warning("Oop's error an process");
          this.gotoLogin();
        }
      );         
  }*/

  gotoSignaldetails(signalID:any){
    //this.router.navigate(['/signal/signal-detail/'+signalID]);
    this.colhideshow = 1;
    this.ngOnDestroy();
    this.getSignalDets(signalID);
  }

  gotoSignaldetails2(){
    //this.router.navigate(['/signal/signal-detail/'+signalID]);
  }

  multiSort(array:any, sortObject:any = {}) {
    console.log("Array");
    console.log(array);
       const sortKeys = Object.keys(sortObject);
      // Return array if no sort object is supplied.
      if (!sortKeys.length) {
          return array;
      }
  
      // Change the values of the sortObject keys to -1, 0, or 1.
      for (var key in sortObject) {
          sortObject[key] = sortObject[key] === 'desc' || sortObject[key] === -1 ? -1 : (sortObject[key] === 'skip' || sortObject[key] === 0 ? 0 : 1);
      }
  
      const keySort = (a:any, b:any, direction:any) => {
          direction = direction !== null ? direction : 1;
  
          if (a === b) { // If the values are the same, do not switch positions.
              return 0;
          }
          // If b > a, multiply by -1 to get the reverse direction.
          return a > b ? direction : -1 * direction;
      };
  
      return array.sort((a:any, b:any) => {
          var sorted = 0;
          var index = 0;
          
          // Loop until sorted (-1 or 1) or until the sort keys have been processed.
          while (sorted === 0 && index < sortKeys.length) {
              const key = sortKeys[index];            
              if (key) {
                  const direction = sortObject[key];              
                  sorted = keySort(a['signalActual'][key], b['signalActual'][key], direction);
                  index++;
              }
          }
          return sorted;
      });
  }

  dateFormat(date:any){
    //alert(date);
    if(date!=null){
      let todayDate=new Date(date);
      let format ="AM";
      let hour=todayDate.getHours();
      let min=todayDate.getMinutes();
      //if(hour>11){format="PM";}
      //if (hour   > 12) { hour = hour - 12; }
      //if (hour   == 0) { hour = 12; }  
      if (min < 10){min = <any>"0" + min;}
      //document.write(todayDate.getMonth()+1 + " / " + todayDate.getDate() + " / " +  todayDate.getFullYear()+" "+hour+":"+min+" "+format);
      var str=todayDate.getDate() + "." + (<any>(todayDate.getMonth())+1) + "." + todayDate.getFullYear() + " | " + hour + "." + min;
      
      return str;
    } else {
      return "-";
    }
  }

  showPopup = 0;
  gotoPaynowpopup(){
    this.showPopup = 1;
  }
  closePaynowpopup(){
    this.showPopup = 0;
  }

  gotoSignalplan(){
    this.router.navigate(['/signal-plan'])
  }

  //Signal details
  getSignalDets(uid:any){    
    let Jwt_token=localStorage.getItem("Jwt-token");
    //let uid=this.signalID;                     
    let token="Bearer "+Jwt_token;
    // console.log(token);
    
    this.signalDets = "";
    this.showSignalDet = 1;
    this.loadContent = 2
    this._service.getSignalDets(uid,token,this.currLang)
      .subscribe(
        (data:any) => {
            console.log("Signal Details");
            console.log(data);
            this.loadContent = 1;

            console.log(data.candles.length);
            let count=data.candles.length;
            if(uid==(data.signal.signalActual.uid)){            	
            	  let uID=data.signal.signalActual.uid;
                let symbol=data.signal.signalActual.symbol;
                let dir=data.signal.signalActual.signalDir;
                
            	  localStorage.setItem('signalUID',uID);
                localStorage.setItem('signalDIR',dir);
                localStorage.setItem('signalSymbol',symbol);
            	  localStorage.setItem('signalDets',JSON.stringify(data));

                this.signalDets = data.signal.signalActual;
                this.signalName = this.signalDets.currentStatus;

                this.signalDets.en=this.formatRate(this.signalDets.en);
                this.signalDets.s2=this.formatRate(this.signalDets.s2);

            	  //this.showChart();            

                this.chartURL = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
                console.log(this.chartURL);      

                this.chartURL2 = this.sanitizer.bypassSecurityTrustResourceUrl(this.url2);
                console.log(this.chartURL2);

                let t1=this.signalDets.t1; 
                let t2=this.signalDets.t2;
                let t3=this.signalDets.t3
                this.signalDets.T1=this.formatRate(t1);
                this.signalDets.T2=this.formatRate(t2);
                this.signalDets.T3=this.formatRate(t3);
                
                this.signalDets.currRate = "-";
            	
                if(this.signalDets.dir=="UU" || this.signalDets.dir=="UD"){
                	if(this.signalDets.dir=="UU"){
                		let lab="Strong Up";
                		
                    //this.signalDets.directionLab = lab+' <i class="las la-arrow-up text-success"></i> ';
                    if(this.signalDets.signalDir=="bullish"){
                      this.signalDets.directionLab = lab+' <img src="assets/images/up_arrow.svg" style="height:25px;" class="img-fluid"> ';
                    } else if(this.signalDets.signalDir=="bearish"){
                      this.signalDets.directionLab = lab+' <img src="assets/images/down_arrow.svg" style="height:25px;" class="img-fluid"> ';
                    }    
                    this.signalDets.trend_value = lab;
                    this.signalDets.trend_value_txt = this.signalDets.dir;

                	} else if(this.signalDets.dir=="UD"){
                		let lab=this.signalDets.signalDir;

                    //this.signalDets.directionLab = lab+' <i class="las la-arrow-up text-success"></i> ';
                    if(this.signalDets.signalDir=="bullish"){
                      this.signalDets.directionLab = lab+' <img src="assets/images/up_arrow.svg" style="height:25px;" class="img-fluid"> ';
                    } else if(this.signalDets.signalDir=="bearish"){
                      this.signalDets.directionLab = lab+' <img src="assets/images/down_arrow.svg" style="height:25px;" class="img-fluid"> ';
                    }
                    this.signalDets.trend_value = lab;
                    this.signalDets.trend_value_txt = this.signalDets.dir;
                	}				    	
                } else if(this.signalDets.dir=="DU" || this.signalDets.dir=="DD"){
                	if(this.signalDets.dir=="DD"){
                		let lab="Strong Down";

                    //this.signalDets.directionLab = lab+' <i class="bi bi-arrow-down text-danger"></i>';
                    if(this.signalDets.signalDir=="bullish"){
                      this.signalDets.directionLab = lab+' <img src="assets/images/up_arrow.svg" style="height:25px;" class="img-fluid"> ';
                    } else if(this.signalDets.signalDir=="bearish"){
                      this.signalDets.directionLab = lab+' <img src="assets/images/down_arrow.svg" style="height:25px;" class="img-fluid"> ';
                    }
                    this.signalDets.trend_value = lab;
                    this.signalDets.trend_value_txt = this.signalDets.dir;

                	} else if(this.signalDets.dir=="DU"){
                		let lab=this.signalDets.signalDir;

                    //this.signalDets.directionLab = lab+' <i class="bi bi-arrow-down text-danger"></i>';
                    if(this.signalDets.signalDir=="bullish"){
                      this.signalDets.directionLab = lab+' <img src="assets/images/up_arrow.svg" style="height:25px;" class="img-fluid"> ';
                    } else if(this.signalDets.signalDir=="bearish"){
                      this.signalDets.directionLab = lab+' <img src="assets/images/down_arrow.svg" style="height:25px;" class="img-fluid"> ';
                    }
                    this.signalDets.trend_value = lab;
                    this.signalDets.trend_value_txt = this.signalDets.dir;
                	}				    	
                } else if(this.signalDets.dir=="NN"){
                	let lab='Neutral';

                  this.signalDets.directionLab = lab+' <i class="bi bi-arrow-right text-default"></i>';
                  this.signalDets.trend_value = lab;
                  this.signalDets.trend_value_txt = this.signalDets.dir;
                }  
                
                let support1=null; let support2=null; let resistance1=null; let resistance2=null;  
               	if(this.signalDets.support1!=null){
                	support1=this.signalDets.support1;
               	}
            
               	if(this.signalDets.support2!=null){
                	support2=this.signalDets.support2;
               	}
            
               	if(this.signalDets.resistance1!=null){
                	resistance1=this.signalDets.resistance1;
               	}
            
               	if(this.signalDets.resistance2!=null){
                	resistance2=this.signalDets.resistance2;
               	}
            
                this.signalDets.support1=this.formatRate(support1);
                this.signalDets.support2=this.formatRate(support2);
                this.signalDets.resistance1=this.formatRate(resistance1);
                this.signalDets.resistance2=this.formatRate(resistance2);
                  
                //let actDate:any=this.datepipe.transform(this.signalDets.activationDate, 'dd.MM.yyyy hh:mm a'); 
                //let incDate:any=this.datepipe.transform(this.signalDets.signalInceptionDate, 'dd.MM.yyyy hh:mm a'); 
                let actDate:any="";
                if(this.signalDets.activationDate!=null){                
                  //actDate=this.datepipe.transform((this.signalDets.activationDate).replaceAll('.', '-').replace(' ', 'T'), 'dd.MM.yyyy hh:mm a'); 
                  actDate=(this.signalDets.activationDate).replaceAll('.', '-').replace(' ', 'T'); 
                  
                }                
                //alert(actDate);                
                let incDate:any="";
                if(this.signalDets.signalInceptionDate!=null){                
                  //incDate=this.datepipe.transform((this.signalDets.signalInceptionDate).replaceAll('.', '-').replace(' ', 'T'), 'dd.MM.yyyy hh:mm a'); 
                  incDate=(this.signalDets.signalInceptionDate).replaceAll('.', '-').replace(' ', 'T'); 
                }

                if(!actDate==true){ actDate=""; }
                if(!incDate==true){ incDate=""; }
                this.signalDets.actDate = actDate; 
                this.signalDets.incDate = incDate;

                //let t1Date:any=this.datepipe.transform(this.signalDets.reachedT1Date, 'dd.MM.yyyy hh:mm a'); 
                //let t2Date:any=this.datepipe.transform(this.signalDets.reachedT2Date, 'dd.MM.yyyy hh:mm a'); 
                //let t3Date:any=this.datepipe.transform(this.signalDets.reachedT3Date, 'dd.MM.yyyy hh:mm a'); 
                //let stopDate:any=this.datepipe.transform(this.signalDets.reachedStopDate, 'dd.MM.yyyy hh:mm a'); 
                //let exitDate:any=this.datepipe.transform(this.signalDets.reachedEarlyExitDate, 'dd.MM.yyyy hh:mm a'); 
                let t1Date:any="";
                if(this.signalDets.reachedT1Date!=null){
                    //t1Date=this.datepipe.transform((this.signalDets.reachedT1Date).replaceAll('.', '-').replace(' ', 'T'), 'dd.MM.yyyy hh:mm a'); 
                    t1Date=(this.signalDets.reachedT1Date).replaceAll('.', '-').replace(' ', 'T'); 
                }
                //alert(t1Date);
                
                let t2Date:any="";
                if(this.signalDets.reachedT2Date!=null){
                    //t2Date=this.datepipe.transform((this.signalDets.reachedT2Date).replaceAll('.', '-').replace(' ', 'T'), 'dd.MM.yyyy hh:mm a'); 
                    t2Date=(this.signalDets.reachedT2Date).replaceAll('.', '-').replace(' ', 'T'); 
                }   
                
                let t3Date:any="";
                if(this.signalDets.reachedT3Date!=null){
                    //t3Date=this.datepipe.transform((this.signalDets.reachedT3Date).replaceAll('.', '-').replace(' ', 'T'), 'dd.MM.yyyy hh:mm a'); 
                    t3Date=(this.signalDets.reachedT3Date).replaceAll('.', '-').replace(' ', 'T'); 
                }
                
                let stopDate:any="";
                if(this.signalDets.reachedStopDate!=null){
                    //stopDate=this.datepipe.transform((this.signalDets.reachedStopDate).replaceAll('.', '-').replace(' ', 'T'), 'dd.MM.yyyy hh:mm a');
                    stopDate=(this.signalDets.reachedStopDate).replaceAll('.', '-').replace(' ', 'T'); 
                }

                let exitDate:any="";
                if(this.signalDets.reachedEarlyExitDate!=null){                  
                    //exitDate=this.datepipe.transform((this.signalDets.reachedEarlyExitDate).replaceAll('.', '-').replace(' ', 'T'), 'dd.MM.yyyy hh:mm a'); 
                    exitDate=(this.signalDets.reachedEarlyExitDate).replaceAll('.', '-').replace(' ', 'T'); 
                }
                                
                if(!t1Date==true){ t1Date=""; }
                if(!t2Date==true){ t2Date=""; }
                if(!t3Date==true){ t3Date=""; }
                if(!stopDate==true){ stopDate=""; }
                if(!exitDate==true){ exitDate=""; }

                this.signalDets.t1Date = t1Date; 
                this.signalDets.t2Date = t2Date;
                this.signalDets.t3Date = t3Date;
                this.signalDets.stopDate = stopDate;
                this.signalDets.exitDate = exitDate;

                console.log(this.signalDets);

                let symbolArr=[];
                symbolArr.push(this.signalDets.symbol);
                if(symbolArr!=null){
                  this.ngOnDestroy();
                  this.getSymbolCurrentPrice(symbolArr);       	   
                }     	   
              	setTimeout(() => {
                  this.doughnut();
                }, 2000);       
            } else {
            	//alert('No');
              //this._notification.warning("Invalid Signal");
              this.alertPopup=1;
              this.alertPopupMsg="Invalid Signal"; 
              this.alertPopupImg="assets/images/fail.png"; 
              //this.router.navigate(['/signal']);
              this.colhideshow = 0;
            }
          
        },
        (err) => {
          console.log;
          //this._notification.success("Processing please wait..");
          if(!this.cookieService.get('username')==true && !this.cookieService.get('password')==true){
            this.gotoLogin();
          } else {
            this.alertPopup=1;
            this.alertPopupMsg="Processing please wait.."; 
            this.alertPopupImg="assets/images/validation-error.png";
            this.autoLogin();
          } 
        }
      );      
    
  }

  showChart(){        
      this.chartURL = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
      console.log(this.chartURL);      

      this.chartURL2 = this.sanitizer.bypassSecurityTrustResourceUrl(this.url2);
      console.log(this.chartURL2);      
  }

  ngOnDestroy() {
    //let setTimeID=<any>localStorage.getItem('setTimeID');
    //alert(this.setTimeID);
    /*if (!this.setTimeID==false){
      for(let i=0;i<this.setTimeID.length;i++){
        clearTimeout(this.setTimeID[i]);
      }     
      this.setTimeID = [];       
      localStorage.setItem('setTimeID',<any>this.setTimeID);
    };*/

    if(!this.timeScriptID==false){
      this.timeScriptID.unsubscribe();
    } 
  }

  getSymbolCurrentPrice(symbolArr:any){
    //FUNCTION FOR LOADING ALL TIMEFRAMES FOR TIMEFRAME BUTTONS
     let timeInterval=3000;
     //alert('CalTimeframes');
    if(!this.timeScriptID==false){
      this.timeScriptID.unsubscribe();
    }

     console.log("Symbol Current");
     let Jwt_token= localStorage.getItem("Jwt-token");
     console.log(Jwt_token);
     console.log(symbolArr);

     console.log(this.signalDets);
     //let signalDetsArr = this.signalDets;
     
     let symbolArr2=JSON.stringify(symbolArr);
     let token="Bearer "+Jwt_token;

     this._service.getCurrentPrice(symbolArr2,token)
      .subscribe(
        (data:any) => {
          console.log("Symbol Current Price");
          console.log(data);
          
          let currentList = data;
          let count=0;
          for(let c=0;c<currentList.length;c++){
            count++;
              let symName = this.signalDets.symbol;
              if(symName == currentList[c].name){
                
                let en=this.signalDets.en;
                let s2=this.signalDets.s2;
                //alert(en+" "+s2);

                let currRate:any=0;
                if(en > s2){
                    currRate=currentList[c].ask;
                } else if(en < s2){
                    currRate=currentList[c].bid;
                }
                
                let bal:any=(currRate-en);
                //alert(currRate+" - "+bal);

                currRate=this.formatRate(parseFloat(currRate));
                bal=this.formatRate(parseFloat(bal));
                
                this.signalDets.currRate = currRate;                
              }            
          }
          
          if(count==currentList.length){
            /*for(let i=0;i<this.setTimeID.length;i++){
              clearTimeout(this.setTimeID[i]);
            }     
            this.setTimeID = []; 
            
            let timeID:any = setTimeout(() => {
              this.getSymbolCurrentPrice(symbolArr);
            }, timeInterval);
            this.setTimeID.push(timeID);
            localStorage.setItem('setTimeID',<any>this.setTimeID);*/

            this.timeScriptID = interval(timeInterval).subscribe((x =>{
              this.getSymbolCurrentPrice(symbolArr);
            }));
          }            
        },
        (err) => {
          console.log;
          //this._notification.warning("Oop's error an process");
          if(!this.cookieService.get('username')==true && !this.cookieService.get('password')==true){
            this.gotoLogin();
          } else {
            this.alertPopup=1;
            this.alertPopupMsg="Processing please wait.."; 
            this.alertPopupImg="assets/images/validation-error.png";
            this.autoLogin();
          } 
        }
      );           
  }

  doughnut(){             	
      let trendVal=this.signalDets.dir;      
      this.color=""; 
      let range1=0; 
      let balance1=0;
      //alert(trendVal);
      if(trendVal=="UU"){
        this.color="#31CF11"; 
        range1=100;
        balance1=0;
      } else if(trendVal=="UD"){
        this.color="#37B13A"; 
        range1=75;
        balance1=25;
      } else if(trendVal=="DU"){
        this.color="#D03D3B"; 
        range1=75;
        balance1=25;
      } else if(trendVal=="DD"){
        this.color="#EF0F0B"; 
        range1=100;
        balance1=0;
      } if(trendVal=="NN"){
        this.color="#AAA8A8"; 
        range1=50;
        balance1=50;
      }
      //alert(this.color+" "+range1+" "+balance1);

      let width1 = 220;
      let height1 = 220;
      this.radius = Math.min(width1, height1) / 2;
      let labelr1 = this.radius + 30;
      this.color = d3.scaleOrdinal()
      .range([this.color, '#EFE5E5']);
      //range(['#e06317', '#3ae1ce', '#e13a61', '#218efa', '#aaaaaa'])
      let data = [
        { value: range1 },
        { value: balance1 }
      ];
      console.log(data);
      let vis1 = d3.select("#chartone")
                  .append("svg")              //create the SVG element inside the <body>
                  .data([data])                   //associate our data with the document
                  .attr("width", width1)           //set the width and height of our visualization (these will be attributes of the <svg> tag
                  .attr("height", height1)
                  .append("svg:g")                //make a group to hold our pie chart
                  .attr('transform', 'translate(' + (width1 / 2) +  ',' + (height1 / 2) + ')');    //move the center of the pie chart from 0, 0 to radius, radius
    
      let arc1 = <any>d3.arc<number>()
              .innerRadius(80) 								
            .outerRadius(this.radius - 10)

    
      let pie1 = <any>d3.pie() 
                  .startAngle(-90 * (Math.PI/180))
                  .endAngle(90 * (Math.PI/180))
                  .padAngle(.02)
                  .sort(null)
                  .value(function(d:any) { return d.value; });
    
      let arcs1 = vis1.selectAll("g.slice")
              .data(pie1) 
              .enter()
              .append("svg:g")
              .attr("class", "slice");
          arcs1.append("svg:path")
              .attr("fill", (d:any, i:any) => { return this.color(i); } )
              .attr("d", arc1); 
          arcs1.append("svg:text")      
              .attr("class", "labels")
              .attr("fill", "grey")
                .attr("transform", function(d:any) {
              let c = arc1.centroid(d),
                  xp = c[0],
                  yp = c[1],
                  hp = Math.sqrt(xp*xp + yp*yp);
              return "translate(" + (xp/hp * labelr1) +  ',' +
                  (yp/hp * labelr1) +  ")"; 
          })
              .attr("text-anchor", "middle")
              //.text(function(d:any, i:any) { return data[i].value; });
              //.text(function(d:any, i:any) { return data[i].label; });


    /************************/
        
    let stateTVal=this.signalDets.stateT; 
    this.color=""; 
    let range2=0; 
    let balance2=0;
    //alert(stateTVal);
    if(stateTVal=="OB-1"){
      this.color="#31CF11"; 
      range2=75;
      balance2=25;
    } else if(stateTVal=="OB-2"){
      this.color="#37B13A"; 
      range2=100;
      balance2=0;
    } else if(stateTVal=="OS-1"){
      this.color="#D03D3B"; 
      range2=75;
      balance2=25;
    } else if(stateTVal=="OS-2"){
      this.color="#EF0F0B"; 
      range2=100;
      balance2=0;
    } if(stateTVal=="N"){
      this.color="#AAA8A8"; 
      range2=50;
      balance2=50;
    }

    //alert(this.color+" "+range2+" "+balance2);

    let width2 = 220;
    let height2 = 220;
    this.radius = Math.min(width2, height2) / 2;
    let labelr2 = this.radius + 30;
    this.color = d3.scaleOrdinal()
    .range([this.color, '#EFE5E5']);
    
    data = [
      { value: range2 },
      { value: balance2 }
    ];
    
    let vis2 = d3.select("#charttwo")
                .append("svg")              //create the SVG element inside the <body>
                .data([data])                   //associate our data with the document
                .attr("width", width2)           //set the width and height of our visualization (these will be attributes of the <svg> tag
                .attr("height", height2)
                .append("svg:g")                //make a group to hold our pie chart
                .attr('transform', 'translate(' + (width2 / 2) +  ',' + (height2 / 2) + ')');    //move the center of the pie chart from 0, 0 to radius, radius

    let arc2 = <any>d3.arc()
          .innerRadius(80) 								
          .outerRadius(this.radius - 10)


    let pie2 = <any>d3.pie() 
                .startAngle(-90 * (Math.PI/180))
                .endAngle(90 * (Math.PI/180))
                .padAngle(.02)
                .sort(null)
                .value(function(d:any) { return d.value; });

    let arcs2 = vis2.selectAll("g.slice")
                  .data(pie2) 
                  .enter()
                  .append("svg:g")
                  .attr("class", "slice");
          arcs2.append("svg:path")
                .attr("fill", (d:any, i:any) => { return this.color(i); } )
                .attr("d", arc2); 
          arcs2.append("svg:text")      
            .attr("class", "labels")
            .attr("fill", "grey")
              .attr("transform", function(d) {
            let c = arc2.centroid(d),
                xp = c[0],
                yp = c[1],
                hp = Math.sqrt(xp*xp + yp*yp);
            return "translate(" + (xp/hp * labelr2) +  ',' +
                (yp/hp * labelr2) +  ")"; 
        })
            .attr("text-anchor", "middle")
            //.text(function(d, i) { return data[i].value; });
            //.text(function(d, i) { return data[i].label; });
    /************************/
        
    let stateWVal=this.signalDets.stateW;
    this.color=""; 
    let range3=0; 
    let balance3=0;
    //alert(stateWVal);
    if(stateWVal=="OB-1"){
      this.color="#31CF11"; 
      range3=75;
      balance3=25;
    } else if(stateWVal=="OB-2"){
      this.color="#37B13A"; 
      range3=100;
      balance3=0;
    } else if(stateWVal=="OS-1"){
      this.color="#D03D3B"; 
      range3=75;
      balance3=25;
    } else if(stateWVal=="OS-2"){
      this.color="#EF0F0B"; 
      range3=100;
      balance3=0;
    } if(stateWVal=="N"){
      this.color="#AAA8A8"; 
      range3=50;
      balance3=50;
    }
    //alert(this.color+" "+range3+" "+balance3);

    let width3 = 220;
    let height3 = 220;
    this.radius = Math.min(width3, height3) / 2;
    let labelr3 = this.radius + 30;
    this.color = d3.scaleOrdinal()
    .range([this.color, '#EFE5E5']);
    data = [
      { value: range3 },
      { value: balance3 }
    ];
    
    let vis3 = d3.select("#chartthree")
                .append("svg")              //create the SVG element inside the <body>
                .data([data])                   //associate our data with the document
                .attr("width", width3)           //set the width and height of our visualization (these will be attributes of the <svg> tag
                .attr("height", height3)
                .append("svg:g")                //make a group to hold our pie chart
                .attr('transform', 'translate(' + (width3 / 2) +  ',' + (height3 / 2) + ')');    //move the center of the pie chart from 0, 0 to radius, radius

    let arc3 = <any>d3.arc()
            .innerRadius(80) 								
          .outerRadius(this.radius - 10)


    let pie3 = <any>d3.pie() 
                .startAngle(-90 * (Math.PI/180))
                .endAngle(90 * (Math.PI/180))
                .padAngle(.02)
                .sort(null)
                .value(function(d:any) { return d.value; });

    let arcs3 = vis3.selectAll("g.slice")
                  .data(pie3) 
                  .enter()
                  .append("svg:g")
                  .attr("class", "slice");
        arcs3.append("svg:path")
              .attr("fill", (d:any, i:any) => { return this.color(i); } )
              .attr("d", arc3); 
        arcs3.append("svg:text")      
              .attr("class", "labels")
              .attr("fill", "grey")
              .attr("transform", function(d) {
        
        let c = arc3.centroid(d),
                xp = c[0],
                yp = c[1],
                hp = Math.sqrt(xp*xp + yp*yp);
            return "translate(" + (xp/hp * labelr3) +  ',' +
                (yp/hp * labelr3) +  ")"; 
        })
            .attr("text-anchor", "middle")
            //.text(function(d, i) { return data[i].value; });
            //.text(function(d, i) { return data[i].label; });                       
  }


  /*formatRate(amount:any){
    //alert(amount);
    let count=this.decimalPoints;
    let amt=parseFloat(amount.toFixed(count));
    //amt=amt.toFixed(count);
    return amt;
  }*/

  formatRate6(amount:any){
    let count=6;
    let amt=parseFloat(amount).toFixed(count);
    //amt=amt.toFixed(count);
    return amt;
  }

  closesignaldetails(){
    this.colhideshow = 0;
    this.ngOnDestroy();
  }

  closeAlertPopup(){
    this.alertPopup = 0;
    this.signalDets = "";
  }

  closeDeletePopup(){
    this.deletePopup = 0;    
  }

}
