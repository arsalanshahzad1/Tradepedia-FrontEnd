import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SignalsService } from '../services/signals.service';
import { NotificationService } from '../services/notification.service';
import { environment } from '../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import * as d3 from 'd3';
import { DatePipe } from '@angular/common';
import * as CryptoJS from 'crypto-js';
import { interval, Subscription, timer } from 'rxjs';



@Component({
  selector: 'app-signal-detail',
  templateUrl: './signal-detail.component.html',
  styleUrls: ['./signal-detail.component.scss'],
  providers: [DatePipe]
})
export class SignalDetailComponent implements OnInit {
  decimalPoints:any = environment.decimalPoints;
  passwordKey:any = environment.userPasswordKey;
  signalID:any="";
  signalDets:any = "";
  loadContent:number = 0;

  color:any;
  radius:any;
  chartURL!: SafeResourceUrl;
  url: string = 'assets/files/signal-chart.html';
  signalName:any="";

  alertPopup:any=0;
  alertPopupMsg:any="";
  alertPopupImg:any="";

  //chartURL2!: SafeResourceUrl;
  //url2: string = 'assets/files/signal-tradingchart.html';
  //url2: string = 'http://dreamserver/workarea/tradepedia/doc/charting_library-master/charting_library-master/index.html';
  setTimeID:any=[];
  userID:any="";

  chartURL2!: SafeResourceUrl;
  //url2: string = 'assets/files/signal-tradingchart.html';
  url2: string = 'assets/files/signal-chart.html';

  languageSelected:any="";
  currLang:any="";

  constructor(
    private _service : SignalsService,
    public _notification: NotificationService,
    private router : Router,
    private route: ActivatedRoute,
    private cookieService: CookieService,
    public sanitizer: DomSanitizer,
    public datepipe: DatePipe
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
    
    if(!localStorage.getItem("UserID")==false){
      this.userID =localStorage.getItem("UserID");  
      this.getUserSignalStatus();      
    }

    this.route.params
      .subscribe(params => {
        console.log(params);            
        if(!params['code']==false){
          //this.getCouponDets(params['code']);
          this.signalID=params['code'];                   
        }
    });
  }

  ngOnInit(): void {
    let isLogged = localStorage.getItem("isLogged");  
    //alert(Jwt_token);
    if(isLogged=="true"){
      //alert("IF");
      //CHECKING FOR ALREADY LOADED SIGNAL LIST
      let Jwt_token= localStorage.getItem("Jwt-token");
      //alert(Jwt_token);
      if(Jwt_token==""){
        //alert("LogIn");
        this.autoLogin();
      }

      this.getSignalDets();
    } else {
      //alert("ELSE");
      this.autoLogin();
    }
  }

  autoLogin(){    
    let username = this.cookieService.get('username');
    let password = this.cookieService.get('password');

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
          
          if(result.active==true){
            let isLogged:any=true;
            let next:any=false;
            let index:any=0;
                      
            //localStorage.setItem("username",inputDets['username']);            
            localStorage.setItem("isLogged",isLogged);
            localStorage.setItem("Jwt-token",requ);		
            localStorage.setItem('signalNext',next);
            localStorage.setItem('signalIndex',index);   
            this.getSignalDets();                    
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
  

  gotoLogin(){
    //alert("Calling");
    //this.router.navigate(['/login']);
  }

  getUserSignalStatus(){    
    //alert(this.profileID);
    let userDets:any={userID:this.userID};
    this._service.getUserSignalStatus(userDets)
      .subscribe(
        (data:any) => {
          console.log("User Details");
          console.log(data);          
        },
        (err) => {
          console.log;
        }
      );     
  }

  getSignalDets(){    
    let Jwt_token=localStorage.getItem("Jwt-token");
    let uid=this.signalID;                     
    let token="Bearer "+Jwt_token;
    // console.log(token);

    this._service.getSignalDets(uid,token,this.currLang)
      .subscribe(
        (data:any) => {
            console.log("Signal Details");
            console.log(data);

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
                    
                    this.signalDets.directionLab = lab+' <i class="las la-arrow-up text-success"></i> ';
                    this.signalDets.trend_value = lab;
                    this.signalDets.trend_value_txt = this.signalDets.dir;

                  } else if(this.signalDets.dir=="UD"){
                    let lab=this.signalDets.signalDir;

                    this.signalDets.directionLab = lab+' <i class="las la-arrow-up text-success"></i> ';
                    this.signalDets.trend_value = lab;
                    this.signalDets.trend_value_txt = this.signalDets.dir;
                  }				    	
                } else if(this.signalDets.dir=="DU" || this.signalDets.dir=="DD"){
                  if(this.signalDets.dir=="DD"){
                    let lab="Strong Down";

                    this.signalDets.directionLab = lab+' <i class="bi bi-arrow-down text-danger"></i>';
                    this.signalDets.trend_value = lab;
                    this.signalDets.trend_value_txt = this.signalDets.dir;

                  } else if(this.signalDets.dir=="DU"){
                    let lab=this.signalDets.signalDir;

                    this.signalDets.directionLab = lab+' <i class="bi bi-arrow-down text-danger"></i>';
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
                  
                let actDate:any=this.datepipe.transform(this.signalDets.activationDate, 'dd.MM.yyyy hh:mm a'); 
                let incDate:any=this.datepipe.transform(this.signalDets.signalInceptionDate, 'dd.MM.yyyy hh:mm a'); 
                if(!actDate==true){ actDate=""; }
                if(!incDate==true){ incDate=""; }
                this.signalDets.actDate = actDate; 
                this.signalDets.incDate = incDate;

                let t1Date:any=this.datepipe.transform(this.signalDets.reachedT1Date, 'dd.MM.yyyy hh:mm a'); 
                let t2Date:any=this.datepipe.transform(this.signalDets.reachedT2Date, 'dd.MM.yyyy hh:mm a'); 
                let t3Date:any=this.datepipe.transform(this.signalDets.reachedT3Date, 'dd.MM.yyyy hh:mm a'); 
                let stopDate:any=this.datepipe.transform(this.signalDets.reachedStopDate, 'dd.MM.yyyy hh:mm a'); 
                let exitDate:any=this.datepipe.transform(this.signalDets.reachedEarlyExitDate, 'dd.MM.yyyy hh:mm a'); 
                
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
                
                this.loadContent = 1;
            } else {
            	//alert('No');
              this._notification.warning("Invalid Signal");
              this.router.navigate(['/signal']);
            }
          
        },
        (err) => {
          console.log;
          //this._notification.warning("Oop's error an process");
          //this.gotoLogin();
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
    if (!this.setTimeID==false){
      for(let i=0;i<this.setTimeID.length;i++){
        clearTimeout(this.setTimeID[i]);
      }     
      this.setTimeID = [];       
      localStorage.setItem('setTimeID',<any>this.setTimeID);
    };
  }

  getSymbolCurrentPrice(symbolArr:any){
    //FUNCTION FOR LOADING ALL TIMEFRAMES FOR TIMEFRAME BUTTONS
     let timeInterval=3000;
     //alert('CalTimeframes');
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
            for(let i=0;i<this.setTimeID.length;i++){
              clearTimeout(this.setTimeID[i]);
            }     
            this.setTimeID = []; 
            
            let timeID:any = setTimeout(() => {
              this.getSymbolCurrentPrice(symbolArr);
            }, timeInterval);
            this.setTimeID.push(timeID);
            localStorage.setItem('setTimeID',<any>this.setTimeID);
          }              
        },
        (err) => {
          console.log;
          this._notification.success("Processing please wait..");
          this.autoLogin();
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


  formatRate(amount:any){
    //alert(amount);
    let count=this.decimalPoints;
    let amt=parseFloat(amount.toFixed(count));
    //amt=amt.toFixed(count);
    return amt;
  }

  formatRate6(amount:any){
    let count=6;
    let amt=parseFloat(amount).toFixed(count);
    //amt=amt.toFixed(count);
    return amt;
  }

  closesignaldetails(){
    //this.colhideshow = 0;
    this.ngOnDestroy();
  }

}
