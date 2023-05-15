import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SignalsService } from '../services/signals.service';
import { NotificationService } from '../services/notification.service';
import { environment } from '../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-signal-list',
  templateUrl: './signal-list.component.html',
  styleUrls: ['./signal-list.component.scss'],
  providers: [DatePipe]
})
export class SignalListComponent implements OnInit {
  decimalPoints:any = environment.decimalPoints;
  timeInterval: number=3000;

  selectedProfile:any = [];
  profileDets: any;
  signalCount: any;
  index: any;
  profileID: any;

  signalInputs:any="";
  symbolInputArr:any[]=[];

  pendingDataList: Array<any> = [];
  activeDataList: Array<any> = [];

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
  
  userID:any="";
  userPoints:any="";
  userSignalStatus:any="";

  constructor(
    private _service : SignalsService,
    public _notification: NotificationService,
    private router : Router,
    private route: ActivatedRoute,
    private cookieService: CookieService,
    public datepipe: DatePipe
  ) { 
    if(!localStorage.getItem("UserID")==true){      
      this.router.navigate(['/login']);
    }
    
    this.route.params
      .subscribe(params => {
        console.log(params);            
        if(!params['code']==false){
          //this.getCouponDets(params['code']);
          this.profileID=params['code'];                   
        }
    });

    if(!localStorage.getItem("UserID")==false){
      this.userID =localStorage.getItem("UserID");        
    }
    this.userPoints = localStorage.getItem("UserEarnedPoints");
  }

  ngOnInit(): void {
    let isLogged = localStorage.getItem("isLogged");      
    if(isLogged=="true"){      
      //CHECKING FOR ALREADY LOADED SIGNAL LIST    
      let Jwt_token= localStorage.getItem("Jwt-token");
      if(Jwt_token==""){
        this.gotoLogin();
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

      this.getProfileDets();
    } else {      
      this.gotoLogin();
    }
  }

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
    this._service.profileDets(profileDets)
      .subscribe(
        (data:any) => {
          console.log("Profile Details");
          console.log(data);
          let input:any = data.profileDets;
          this.userSignalStatus = data.signalStatus;
          //alert(this.userSignalStatus);

          this.selectedProfile = {"profileID":input['profile_id'], "userID":localStorage.getItem("UserID"), "name":input['profile_name'], "description":input['profile_description'], "image":input['profile_image'], "selSymbol":(input['profile_symbols']).split(","), "selTransaction":(input['profile_transaction']).split(","), "selTimeFrame":input['profile_timeframe'].split(","), "selTools":input['profile_tools'].split(","), "selStrategie":input['profile_strategies'].split(","), "selStateT":input['profile_stateT'].split(","), "selStateW":input['profile_stateW'].split(","), "selScore":input['profile_score']};    
          console.log(this.selectedProfile);
          localStorage.setItem("selectedProfile",JSON.stringify(this.selectedProfile));

          //this.CalSignalList();

          let timeframeArr:any = this.selectedProfile.selTimeFrame;
          let symbolArr:any = this.selectedProfile.selSymbol;
          let stragesArr:any = this.selectedProfile.selStrategie;
          let stateTArr:any = this.selectedProfile.selStateT;
          let stateWArr:any = this.selectedProfile.selStateW;
          let score:any = this.selectedProfile.selScore;
          
          console.log("Input List");
          console.log(timeframeArr);
          console.log(symbolArr);
          console.log(stragesArr);
          console.log(stateTArr);
          console.log(stateWArr);
          console.log(score);
          console.log(this.signalCount);
          console.log(this.index);

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
              let sig_obj={"symbol":symbolArr[j],"timeframe":timeframeArr[i]};        
              this.symbolInputArr[<any>'All'].push(sig_obj);
              if(!this.symbolRootArr[symbolArr[j]]==false){         
                this.symbolInputArr[this.symbolRootArr[symbolArr[j]]].push(sig_obj);         
              }
            }      
          }

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
            "symbols": this.symbolInputArr[<any>'All'],
            "filters": [{   
              "timeframes": timeframeArr,
              "patterns": [],
              "quality": [],         	
              "stateWave": stateWArr,
              "stateTrend": stateTArr,
              "scoreFrom": score,  
              "scoreTo":10,         	
              "strategies": stragesArr
            }],
            //"filters": [],	
            "signalFrom": this.index, 
            "signalCount": 50, 
            "onlySignals": true			
          };
          this.signalInputs=signalData;

          this.loadPendingSignalList('All');
          this.loadActiveSignalList('All');
        },
        (err) => {
          console.log;
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

    this.pendingData = 2;
    this.pendingMoreShow=false;

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
               

               var mode="";
               if((data.signals[z].signalActual.dir)=="UU" || (data.signals[z].signalActual.dir)=="UD"){
                 mode="BUY";
               } else if((data.signals[z].signalActual.dir)=="DU" || (data.signals[z].signalActual.dir)=="DD"){
                 mode="SELL";
               } else if((data.signals[z].signalActual.dir)=="NN"){
                 mode="NEUTRAL";
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

               let en=data.signals[z].signalActual.en;
               let s2=data.signals[z].signalActual.s2;
               let ENT=this.formatRate(parseFloat(en));
               let STOP=this.formatRate(parseFloat(s2));

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
         this._notification.warning("Oop's error an process, Login again.");
         this.gotoLogin();
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

    this.activeMoreShow=false;
    this.activeData = 2;

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

               var mode="";
               if((data.signals[z].signalActual.dir)=="UU" || (data.signals[z].signalActual.dir)=="UD"){
                 mode="BUY";
               } else if((data.signals[z].signalActual.dir)=="DU" || (data.signals[z].signalActual.dir)=="DD"){
                 mode="SELL";
               } else if((data.signals[z].signalActual.dir)=="NN"){
                 mode="NEUTRAL";
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

               let en=data.signals[z].signalActual.en;
               let s2=data.signals[z].signalActual.s2;
               let ENT=this.formatRate(parseFloat(en));
               let STOP=this.formatRate(parseFloat(s2));

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
         this._notification.warning("Oop's error an process, Login again.");
         this.gotoLogin();
       }
     );
  }


  CalSignalList(){
    //alert("In");
    let Jwt_token=localStorage.getItem("Jwt-token");
          
     let symbolList: Array<any>=[];

     console.log('Signal Data');
     console.log(this.signalInputs);    
     let token="Bearer "+Jwt_token;
     console.log(token);
    
     let date1=new Date();
     let latest1:any=this.datepipe.transform(date1, 'yyyy-MM-dd hh:mm a');    
     console.log('Pending Signals Calling Starting On => '+ latest1);
     // Pending Signals
     this._service.getPendSignals(this.signalInputs, token)
     .subscribe(
       (data:any) => {
         console.log("Pending Signals");
         console.log(data);

         if(data.signals.length > 0){
           let date2=new Date();
           let latest2:any=this.datepipe.transform(date2, 'yyyy-MM-dd hh:mm a');    
           console.log('Pending Signals Calling Ending On => '+ latest2);
         }
        
         data.signals=this.multiSort(data.signals, {signalInceptionDate: 'desc'});
         console.log('After Sort');
         console.log(data);
        
         this.selPendingSignalList = data.signals;													

         //alert(data.hasNext);        
         /*localStorage.setItem('signalNext',data.hasNext);
         if(data.hasNext==true){          
           this.btnNext = 1;
         } else {
           this.btnNext = 0;
         }

         let signalIndex=<any>localStorage.getItem('signalIndex');
         if(signalIndex>0){
           this.btnPrevious = 1;
         } else {
           this.btnPrevious = 0;
         }*/
        
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
               data.signals[z].signalActual.root = this.symbolRootArr[symbol];              

               var mode="";
               if((data.signals[z].signalActual.dir)=="UU" || (data.signals[z].signalActual.dir)=="UD"){
                 mode="BUY";
               } else if((data.signals[z].signalActual.dir)=="DU" || (data.signals[z].signalActual.dir)=="DD"){
                 mode="SELL";
               } else if((data.signals[z].signalActual.dir)=="NN"){
                 mode="NEUTRAL";
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

               let en=data.signals[z].signalActual.en;
               let s2=data.signals[z].signalActual.s2;
               let ENT=this.formatRate(parseFloat(en));
               let STOP=this.formatRate(parseFloat(s2));

               let t3=data.signals[z].signalActual.t3;
               let T3=this.formatRate(parseFloat(t3));
               //var dt=dateFormat(data.signals[z].signalActual.activationDate);
                                              
               //let dt=this.dateFormat(data.signals[z].signalActual.signalInceptionDate);
               //var dt=data.signals[z].signalActual.activationDate;
               //console.log(dt+" "+data.signals[z].signalActual.isSignal);

               data.signals[z].signalActual.en = en;
               data.signals[z].signalActual.s2 = s2;
               data.signals[z].signalActual.t3 = t3;
               data.signals[z].signalActual.ENT = ENT;
               data.signals[z].signalActual.STOP = STOP;
               data.signals[z].signalActual.T3 = T3;
               //data.signals[z].signalActual.dt = dt;
              
               //currRate=ENT;
               //bal=(currRate-ENT).toFixed(5);
               currRate="-";
               let bal="-";

               data.signals[z].signalActual.currRate = currRate;
               data.signals[z].signalActual.bal = bal;                                            
           }

           console.log(data.signals);
           this.pendingDataList = data.signals;
           this.pendingData = 0;

           //console.log(symbolList);
         } else {            
           this.pendingData = 3;
         }          
       },
       (err) => {
         //console.log;
         console.log("POST call in error", err);          
         this._notification.warning("Oop's error an process, Login again.");
         this.gotoLogin();
       }
     );     
    

     let date3=new Date();
     let latest3:any=this.datepipe.transform(date3, 'yyyy-MM-dd hh:mm a');    
     console.log('Active Signals Calling Starting On => '+ latest3);

     // Active Signals
     this._service.getActiveSignals(this.signalInputs, token)
     .subscribe(
       (data:any) => {
         console.log("Active Signals");
         console.log(data);

         if(data.signals.length > 0){
           let date4=new Date();
           let latest4:any=this.datepipe.transform(date4, 'yyyy-MM-dd hh:mm a');    
           console.log('Active Signals Calling Ending On => '+ latest4);
         }

         data.signals=this.multiSort(data.signals, {signalInceptionDate: 'desc'});
         console.log('After Sort');
         console.log(data);
              
         this.selActiveSignalList = data.signals;													

         /*localStorage.setItem('signalNext',data.hasNext);
         if(data.hasNext==true){
           this.btnNext = 1;
         } else {
           this.btnNext = 0;
         }

         let signalIndex=<any>localStorage.getItem('signalIndex');
         if(signalIndex>0){
           this.btnPrevious = 1;
         } else {
           this.btnPrevious = 0;
         }*/
        
         //let row="";
         let add_act=0;     
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
               data.signals[z].signalActual.root = this.symbolRootArr[symbol];

               var mode="";
               if((data.signals[z].signalActual.dir)=="UU" || (data.signals[z].signalActual.dir)=="UD"){
                 mode="BUY";
               } else if((data.signals[z].signalActual.dir)=="DU" || (data.signals[z].signalActual.dir)=="DD"){
                 mode="SELL";
               } else if((data.signals[z].signalActual.dir)=="NN"){
                 mode="NEUTRAL";
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

               let en=data.signals[z].signalActual.en;
               let s2=data.signals[z].signalActual.s2;
               let ENT=this.formatRate(parseFloat(en));
               let STOP=this.formatRate(parseFloat(s2));

               let t3=data.signals[z].signalActual.t3;
               let T3=this.formatRate(parseFloat(t3));

               //var dt=dateFormat(data.signals[z].signalActual.activationDate);
                                              
               //let dt=this.dateFormat(data.signals[z].signalActual.activationDate);
               //var dt=data.signals[z].signalActual.activationDate;
               //console.log(dt+" "+data.signals[z].signalActual.isSignal);

               data.signals[z].signalActual.en = en;
               data.signals[z].signalActual.s2 = s2;
               data.signals[z].signalActual.t3 = t3;
               data.signals[z].signalActual.ENT = ENT;
               data.signals[z].signalActual.STOP = STOP;
               data.signals[z].signalActual.T3 = T3;
               //data.signals[z].signalActual.dt = dt;
              
               //currRate=ENT;
               //bal=(currRate-ENT).toFixed(5);
               currRate="-";
               let bal="-";

               data.signals[z].signalActual.currRate = currRate;
               data.signals[z].signalActual.bal = bal;                                            
           }
           console.log(data.signals);
           this.activeDataList = data.signals;
           this.activeData = 0;

           /*console.log("Symbol List");
           console.log(symbolList);
           if(symbolList!=null){
             this.ngOnDestroy();            
             this.getSymbolCurrentPrice(symbolList);
           }*/
         } else {
           this.activeData = 3;
         }          
       },
       (err) => {
         console.log;
         this._notification.warning("Oop's error an process, Login again.");
         this.gotoLogin();
       }
     );            
  }  

  filterFunction(arrlist: any[],type:any): any {  
    if (!arrlist || !type) {
        return arrlist;
    }    
    return arrlist.filter((item:any) => item.root.indexOf(type) !== -1);
  }

  ngOnDestroy() {
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
  }

  gotoSignaldetails(signalID:any){
    this.router.navigate(['/signal/signal-detail/'+signalID]);
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

}
