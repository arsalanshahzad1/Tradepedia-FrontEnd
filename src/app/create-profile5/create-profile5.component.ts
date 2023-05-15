import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { SignalsService } from '../services/signals.service';
import { NotificationService } from '../services/notification.service';
import { environment } from '../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import * as CryptoJS from 'crypto-js';
import {TranslateService} from '@ngx-translate/core';



@Component({
  selector: 'app-create-profile5',
  templateUrl: './create-profile5.component.html',
  styleUrls: ['./create-profile5.component.scss']
})
export class CreateProfile5Component implements OnInit {
  imgURL:any = environment.imgUrl;
  passwordKey:any = environment.userPasswordKey;
  newProfile:Array<any> = [];
  strategiesDets:Array<any> = [];
  
  strategies:Array<any> = [];
  listStateT:Array<any> = [];
  listStateW:Array<any> = [];
  score:any = 0;
  
  btnNxt:any = 0;
  strategiesArr:any=[];
  stateTArr:any=[];
  stateWArr:any=[];

  languageSelected:any=""
  pageImgpath:any="";
  currLang:any="";
  scoreDropdown:any;
  scoreList:any=[1,2,3,4,5,6,7,8,9,10];


  constructor(
    private router : Router,
    private _service : SignalsService,    
    public _notification: NotificationService,    
    private route: ActivatedRoute,
    private cookieService: CookieService,
    public sanitizer: DomSanitizer,
    private translate: TranslateService,
  ) { 
    if(!localStorage.getItem("UserID")==true){      
      this.router.navigate(['/login']);
    }
    
    if(!this.cookieService.get('selectedLang')==false){
      this.languageSelected = this.cookieService.get('selectedLang'); 
      console.log(this.languageSelected); 
    } else {
      this.languageSelected = "EN";
      this.cookieService.set('selectedLang',this.languageSelected); 
    }
    this.currLang = this.languageSelected.toLowerCase();

    if(!localStorage.getItem("strategiesArr")==true){
      this.getStrategies();
    } else {
      this.strategies = JSON.parse(<any>localStorage.getItem("strategiesArr"));      
    }   
    console.log(this.strategies);

    if(!localStorage.getItem("stateTArr")==true){
      let dataT=["OB+01","OB+0","OB+1","OS+01","OS+0","OS+1","N"];
      let stateTList:any=[];
      for(let i=0;i<dataT.length;i++){                                        
          let obj = {name : dataT[i],status : 1};
          stateTList.push(obj);           
      } 
      localStorage.setItem("stateTArr",JSON.stringify(stateTList));
      this.listStateT = stateTList;
    } else {
      this.listStateT = JSON.parse(<any>localStorage.getItem("stateTArr"));      
    }   
    console.log(this.listStateT);

    if(!localStorage.getItem("stateWArr")==true){
      let dataW=["OB-12","OB-1","OB-2","OS-12","OS-1","OS-2","N"];
      let stateWList:any=[];
      for(let i=0;i<dataW.length;i++){                                        
          let obj = {name : dataW[i],status : 1};
          stateWList.push(obj);           
      } 
      localStorage.setItem("stateWArr",JSON.stringify(stateWList));
      this.listStateW = stateWList;
    } else {
      this.listStateW = JSON.parse(<any>localStorage.getItem("stateWArr"));      
    }   
    console.log(this.listStateW);

    this.pageImgpath = this.imgURL+"chart";
  }

  ngOnInit(): void {
    let isLogged = localStorage.getItem("isLogged");	
      if(isLogged=="true"){
        //CHECKING FOR ALREADY LOADED SIGNAL LIST

        let Jwt_token= localStorage.getItem("Jwt-token");
        if(Jwt_token==""){
          this.autoLogin();
        }

        this.newProfile = JSON.parse(<any>localStorage.getItem('selectedProfile'));
        console.log(this.newProfile);    
        let stArr = this.newProfile[<any>'selStrategie'];
        let staTArr = this.newProfile[<any>'selStateT'];
        let staWArr = this.newProfile[<any>'selStateW'];
        let scoreInp = this.newProfile[<any>'selScore'];        
        
        let scoreString:any=[];
        if(stArr==""){
          //this.btnNxt = 1;                   
          for(let i=0;i<this.strategies.length;i++){                              
              this.strategies[i].status = 1;    
              this.strategiesArr.push((this.strategies[i].id).toString());
			        this.strategies[i].scoreDropdown = 1;	
              this.strategies[i].scoreFrom = 1;
              this.strategies[i].scoreTo = 10;	
              scoreString.push(((this.strategies[i].id).toString())+":1:10"); 	  
          }    
          console.log(this.strategies);                 
        } else {
          //this.btnNxt = 0;     
          this.strategiesArr = stArr;    
          console.log(stArr);  
          for(let i=0;i<this.strategies.length;i++){                              
              if((stArr.includes((this.strategies[i].id).toString())) == true){
                this.strategies[i].status = 1;
				        this.strategies[i].scoreDropdown = 1;                
                //this.strategies[i].scoreFrom = 1;
                //this.strategies[i].scoreTo = 10;
                //scoreString.push(((this.strategies[i].id).toString())+":1:10"); 	  
              } else {
                this.strategies[i].status = 0;
				        this.strategies[i].scoreDropdown = 0;
                this.strategies[i].scoreFrom = 0;
                this.strategies[i].scoreTo = 0;
              }                
          }    
          console.log(this.strategies);
        }

        console.log(scoreString);  
        if(!scoreInp==false){
          this.score = scoreInp;
          for(let i=0;i<this.strategies.length;i++){
            for(let s=0;s<this.score.length;s++){
              let arr:any=this.score[s].split(":");
              console.log(" => "+((this.strategies[i].id).toString())+" == "+arr[0]);
              if(((this.strategies[i].id).toString()) == arr[0]){
                this.strategies[i].scoreFrom = arr[1];
                this.strategies[i].scoreTo = arr[2];
              }
            }
          }
        } else {
          this.score = scoreString;
        }
        console.log(this.strategies);
        
        if(!staTArr==false){                                             
          this.stateTArr = staTArr;      
          for(let i=0;i<this.listStateT.length;i++){                              
              if((staTArr.includes(this.listStateT[i].name)) == true){
                  this.listStateT[i].status = 1; 
              } else {
                this.listStateT[i].status = 0;
              }                
          }    
          console.log(this.listStateT);
        } else {
          for(let i=0;i<this.listStateT.length;i++){                              
            this.listStateT[i].status = 1;    
            this.stateTArr.push(this.listStateT[i].name);                           
          }                   
        }

        if(!staWArr==false){                                             
          this.stateWArr = staWArr;      
          for(let i=0;i<this.listStateW.length;i++){                              
              if((staWArr.includes(this.listStateW[i].name)) == true){
                  this.listStateW[i].status = 1; 
              } else {
                this.listStateW[i].status = 0;
              }                
          }    
          console.log(this.listStateW);
        } else {
          for(let i=0;i<this.listStateW.length;i++){                              
            this.listStateW[i].status = 1;     
            this.stateWArr.push(this.listStateW[i].name);                        
          }                   
        }

        console.log(this.strategiesArr);
        console.log(this.stateTArr);
        console.log(this.stateWArr);
        console.log(this.score);
       
        if(this.strategiesArr.length > 0 && this.stateTArr.length > 0 && this.stateWArr.length > 0){
          this.btnNxt = 0;
        } else {
          this.btnNxt = 1;
        }

        this.newProfile[<any>'selStrategie'] = this.strategiesArr;
        this.newProfile[<any>'selStateT'] = this.stateTArr;
        this.newProfile[<any>'selStateW'] = this.stateWArr;
        this.newProfile[<any>'selScore'] = this.score;
        console.log("Transaction Select");
        console.log(this.newProfile);		      
        localStorage.setItem('selectedProfile',JSON.stringify(this.newProfile));
      } else {        
        this.autoLogin();
      }
  }

  autoLogin(){    
    let username:any = localStorage.getItem('username');
    let password:any = localStorage.getItem('password');

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
            this.getStrategies();                    
          } else {
            //this._notification.warning("User account is inactive");  
            let msg:any=this.translate.instant('crtprf_five.inactive_user');             
            this._notification.warning(msg); 
            this.router.navigate(['/login']);         
          }
      },
      response => {
        console.log("POST call in error", response);               
        //this._notification.warning("Error on process, login again.");   
        let msg:any=this.translate.instant('crtprf_five.msg_process');             
        this._notification.warning(msg); 
        this.router.navigate(['/login']);
      });
  }

  filterFunction(arrlist: any[],type:any): any {  
    if (!arrlist || !type) {
        return arrlist;
    }    
    return arrlist.filter((item:any) => (item >= type) == true);
  }

  getStrategieDets(){    
    let dets:any = {langCode:this.languageSelected};    
    this._service.getStrategieDets(dets)
      .subscribe(
          (data:any) => {
            console.log(data);                 
            this.strategiesDets = data.strategieDets;     
            //this.strategies = JSON.parse(<any>localStorage.getItem("strategiesArr"));                  
            console.log(this.strategies);
            for(let i=0;i<this.strategies.length;i++){
              for(let j=0;j<this.strategiesDets.length;j++){
                if(this.strategies[i].id == this.strategiesDets[j].pag_section_code){
                  this.strategies[i].hintTitle = this.strategiesDets[j].pag_section_title;                  
                  this.strategies[i].hintContent = this.sanitizer.bypassSecurityTrustHtml((this.strategiesDets[j].pag_description).replaceAll('[[PAGE_IMAGES]]', this.pageImgpath));                       
                }
              }
            }
            console.log(this.strategies);
          },
          err => {
            console.log(err);
            //this._notification.warning("Oop's error an process");
            //this.gotoLogin();
          }
      );         
  }

  getStrategies(){    
    let token = localStorage.getItem("Jwt-token");
    this._service.getStrategies(token,this.currLang)
      .subscribe(
          (data:any) => {
            console.log(data);          
            
            let strategies2:any=[];
            for(let i=0;i<data.length;i++){
              if(data[i].is_signal==true){
                strategies2.push(data[i]);
              }
            }
           
            let scoreString:any=[];
            this.strategies = strategies2;              
            let stArr = this.newProfile[<any>'selStrategie'];
            if(stArr==""){
              //this.btnNxt = 1;                   
              for(let i=0;i<this.strategies.length;i++){                              
                  this.strategies[i].status = 1;
				          this.strategies[i].scoreDropdown = 1;
                  this.strategies[i].scoreFrom = 1;
                  this.strategies[i].scoreTo = 10;
                  scoreString.push(((this.strategies[i].id).toString())+":1:10"); 	  
                  this.strategiesArr.push((this.strategies[i].id).toString());				          
              }                  
            } else {
              for(let i=0;i<this.strategies.length;i++){                              
                  if((stArr.includes((this.strategies[i].id).toString())) == true){
                    this.strategies[i].status = 1; 
					          this.strategies[i].scoreDropdown = 1;
                    let from:number=1; let to:number=10;             
                    for(let s=0;s<this.score.length;s++){
                      let arr:any=this.score[s].split(":");
                      //console.log(" => "+((this.strategies[i].id).toString())+" == "+arr[0]);
                      if(((this.strategies[i].id).toString()) === arr[0]){
                        from = parseInt(arr[1]);
                        to = parseInt(arr[2]);
                      }
                    }
                    this.strategies[i].scoreFrom = from;
                    this.strategies[i].scoreTo = to;
                    scoreString.push(((this.strategies[i].id).toString())+":"+from+":"+to); 
                  } else {
                    this.strategies[i].status = 0;
					          this.strategies[i].scoreDropdown = 0;
                    this.strategies[i].scoreFrom = 1;
                    this.strategies[i].scoreTo = 10;
                  }                
              }                             
            }
            console.log(this.strategies); 
            console.log(scoreString);  
            this.score = scoreString;

            if(this.strategiesArr.length > 0 && this.stateTArr.length > 0 && this.stateWArr.length > 0){
              this.btnNxt = 0;
            } else {
              this.btnNxt = 1;
            }

            this.newProfile[<any>'selScore'] = this.score;
            this.newProfile[<any>'selStrategie'] = this.strategiesArr;        
            console.log(this.newProfile);		      
            localStorage.setItem('selectedProfile',JSON.stringify(this.newProfile));
            this.getStrategieDets();
          },
          err => {
            console.log(err);
            //this._notification.warning("Oop's error an process");
            //this.gotoLogin();
            if(!localStorage.getItem('username')==true && !localStorage.getItem('password')==true){
              this.gotoLogin();
            } else {
              //this._notification.success("Processing please wait..");
              let msg:any=this.translate.instant('crtprf_five.msg_process');             
              this._notification.success(msg);
              this.autoLogin();
            } 
          }
      );         
  }

  setStScore(input:any){    
    //alert(input.id+" "+input.scoreFrom+" "+input.scoreTo);
    for(let i=0;i<this.score.length;i++){
      let arr:any=this.score[i].split(":");
      if(input.id == arr[0]){
        this.score[i] = arr[0]+":"+input.scoreFrom+":"+input.scoreTo;
      }
    }
    console.log(this.score);
    this.newProfile[<any>'selScore'] = this.score;
    localStorage.setItem('selectedProfile',JSON.stringify(this.newProfile));
  }
  
  selectParam(type:any,input:any){
    console.log(input);

    this.newProfile = JSON.parse(<any>localStorage.getItem('selectedProfile'));
        console.log(this.newProfile);    
        let stArr = this.newProfile[<any>'selStrategie'];
        let staTArr = this.newProfile[<any>'selStateT'];
        let staWArr = this.newProfile[<any>'selStateW'];
        let scoreInp = this.newProfile[<any>'selScore'];

        stArr = stArr.filter((el:any) => { return el != ""; });
        staTArr = staTArr.filter((el:any) => { return el != ""; });
        staWArr = staWArr.filter((el:any) => { return el != ""; });
        scoreInp = scoreInp.filter((el:any) => { return el != ""; });
        

        /*if(!scoreInp==false){
          this.score = scoreInp;
        } else {
          this.score = 1;
        }

        if(stArr==""){
          //this.btnNxt = 1;                   
          for(let i=0;i<this.strategies.length;i++){                              
              this.strategies[i].status = 1;    
              this.strategiesArr.push((this.strategies[i].id).toString());                  
          }    
          console.log(this.strategies);          
        } else {
          //this.btnNxt = 0;     
          this.strategiesArr = stArr;    
          console.log(stArr);  
          for(let i=0;i<this.strategies.length;i++){                              
              if((stArr.includes((this.strategies[i].id).toString())) == true){
                this.strategies[i].status = 1; 
              } else {
                this.strategies[i].status = 0;
              }                
          }    
          console.log(this.strategies);
        }*/

        let scoreString:any=[];
        if(stArr==""){
          //this.btnNxt = 1;                   
          for(let i=0;i<this.strategies.length;i++){                              
              this.strategies[i].status = 1;
              this.strategies[i].scoreDropdown = 1;
              this.strategies[i].scoreFrom = 1;
              this.strategies[i].scoreTo = 10;
              scoreString.push(((this.strategies[i].id).toString())+":1:10"); 	  
              this.strategiesArr.push((this.strategies[i].id).toString());				          
          }                  
        } else {
          for(let i=0;i<this.strategies.length;i++){                              
              if((stArr.includes((this.strategies[i].id).toString())) == true){
                this.strategies[i].status = 1; 
                this.strategies[i].scoreDropdown = 1;
                let from:number=1; let to:number=10;             
                for(let s=0;s<this.score.length;s++){
                  let arr:any=this.score[s].split(":");
                  //console.log(" => "+((this.strategies[i].id).toString())+" == "+arr[0]);
                  if(((this.strategies[i].id).toString()) === arr[0]){
                    from = parseInt(arr[1]);
                    to = parseInt(arr[2]);
                  }
                }
                this.strategies[i].scoreFrom = from;
                this.strategies[i].scoreTo = to;
                scoreString.push(((this.strategies[i].id).toString())+":"+from+":"+to); 
              } else {
                this.strategies[i].status = 0;
                this.strategies[i].scoreDropdown = 0;
                this.strategies[i].scoreFrom = 1;
                this.strategies[i].scoreTo = 10;
              }                
          }                             
        }        
        
        if(!staTArr==false){                                             
          this.stateTArr = staTArr;      
          for(let i=0;i<this.listStateT.length;i++){                              
              if((staTArr.includes(this.listStateT[i].name)) == true){
                  this.listStateT[i].status = 1; 
              } else {
                this.listStateT[i].status = 0;
              }                
          }    
          console.log(this.listStateT);
        } else {
          for(let i=0;i<this.listStateT.length;i++){                              
            this.listStateT[i].status = 1;    
            this.stateTArr.push(this.listStateT[i].name);                           
          }                   
        }

        if(!staWArr==false){                                             
          this.stateWArr = staWArr;      
          for(let i=0;i<this.listStateW.length;i++){                              
              if((staWArr.includes(this.listStateW[i].name)) == true){
                  this.listStateW[i].status = 1; 
              } else {
                this.listStateW[i].status = 0;
              }                
          }    
          console.log(this.listStateW);
        } else {
          for(let i=0;i<this.listStateW.length;i++){                              
            this.listStateW[i].status = 1;     
            this.stateWArr.push(this.listStateW[i].name);                        
          }                   
        }

        console.log(this.strategiesArr);
        console.log(this.stateTArr);
        console.log(this.stateWArr);
        console.log(this.score);


    if(type=="strategies"){
      if(input.status==0){
        input.status = 1;
        this.strategiesArr.push((input.id).toString());
        this.score.push(((input.id).toString())+":"+input.scoreFrom+":"+input.scoreTo);
      } else {
        input.status = 0;
        this.strategiesArr = this.strategiesArr.filter((item:any) => item !== (input.id).toString());
        let obj:any=((input.id).toString())+":"+input.scoreFrom+":"+input.scoreTo;
        this.score = this.score.filter((item:any) => item !== obj);
      }     
    } else if(type=="stateT"){
      if(input.status==0){
        input.status = 1;
        this.stateTArr.push(input.name);
      } else {
        input.status = 0;
        this.stateTArr = this.stateTArr.filter((item:any) => item !== input.name);
      }    
    } else if(type=="stateW"){
      if(input.status==0){
        input.status = 1;
        this.stateWArr.push(input.name);
      } else {
        input.status = 0;
        this.stateWArr = this.stateWArr.filter((item:any) => item !== input.name);
      }    
    } else if(type=="score"){      
      //this.score = input.target.value;
    }
    console.log(this.strategiesArr);
    console.log(this.stateTArr);
    console.log(this.stateWArr);
    console.log(this.score);

    if(this.strategiesArr.length > 0 && this.stateTArr.length > 0 && this.stateWArr.length > 0){
      this.btnNxt = 0;
    } else {
      this.btnNxt = 1;
    }
    
    this.newProfile[<any>'selStrategie'] = this.strategiesArr;
    this.newProfile[<any>'selStateT'] = this.stateTArr;
    this.newProfile[<any>'selStateW'] = this.stateWArr;
    this.newProfile[<any>'selScore'] = this.score;
    console.log("Transaction Select");
    console.log(this.newProfile);		      
    localStorage.setItem('selectedProfile',JSON.stringify(this.newProfile));

    if(input.scoreDropdown == 0){
      input.scoreDropdown = 1;
    }
    else{
      input.scoreDropdown = 0;
    }
  }

  gotoLogin(){
    this.router.navigate(['/home']);
  }

  gotoNext(){
    this.router.navigate(['/signal/create-profile6']);
  }

  gotoHsc(){
    this.router.navigate(['/academy/hsc-chapter-list']);
  }
  
}
