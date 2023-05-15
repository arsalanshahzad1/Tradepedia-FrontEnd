import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import SwiperCore, { EffectFade, Pagination } from "swiper";
import { CookieService } from 'ngx-cookie-service';
import { PagesService } from '../services/pages.service';
import { SignalsService } from '../services/signals.service';
import { NotificationService } from '../services/notification.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import {TranslateService} from '@ngx-translate/core';


export class TodoItemNode {
  children!: TodoItemNode[];
  item!: string;
}

SwiperCore.use([EffectFade, Pagination]);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class HomeComponent implements OnInit {
  IMG_URL:string = environment.imgUrl;
  passwordKey:any = environment.userPasswordKey;

  languageSelected:any="";
  treeData:Array<any>=[];
  symbolRootArr:any={};
  symbolRootNameArr:any=[];
  userName:any="";
  userPoints:any="";
  userID:any="";
  userEmail:any="";
  userImage:any="";
  profileSrc:any="./assets/images/avatar.jpg";
  toolsList:any = [];
  textDir:any;
  chatCount:any=0;

  alertPopup:any=0;
  alertPopupMsg:any="";  
  existArr:any=['1.','2.','3.','4.','5.'];
  
  constructor(
    private _service : PagesService,
    private _userservice : SignalsService,
    private cookieService: CookieService,
    public _notification: NotificationService,
    private router : Router,
    private route: ActivatedRoute,
    private translate: TranslateService,
  ) { 

    if(!localStorage.getItem("UserID")==true){      
      this.router.navigate(['/login']);
    }

    if((!localStorage.getItem("loginStatus")==false) && (<any>localStorage.getItem("loginStatus")==0)){      
      this.alertPopup=1;
      //this.alertPopupMsg="Welcome to Tradepedia";      
      this.translate.get('home.msg_welcome').subscribe((res: string) => {
        this.alertPopupMsg = res;
      });
    }

    if(!this.cookieService.get('selectedLang')==false){
      this.languageSelected = this.cookieService.get('selectedLang'); 
      console.log(this.languageSelected); 
    } else {
      this.languageSelected = "EN";
      this.cookieService.set('selectedLang',this.languageSelected); 
    }
    //alert(this.languageSelected);

    this.userID = localStorage.getItem("UserID");
    this.userName = localStorage.getItem("UserName"); 
    this.userPoints = localStorage.getItem("UserEarnedPoints"); 
    this.userImage = localStorage.getItem("UserImage"); 
    this.userEmail = localStorage.getItem("EmailID"); 
    //alert(this.userPoints);

    if(!this.userImage==false){
      this.profileSrc = this.IMG_URL+"users/"+this.userImage;;        
    }
    //alert(this.profileSrc);

    this._service.setUserPoints(this.userPoints);
    this._service.setUserName(this.userName);
    this._service.setUserImage(this.profileSrc);
    this.getUserNoteCount(this.userID);
    this.getUserPoints();
  }

  ngOnInit() {    
    //alert(!localStorage.getItem("symbolsTreeArr"));
    if(!localStorage.getItem("symbolsTreeArr")==true){
      this.createTreeData();
    }        
    this.getToolsList();  
    this.getUserExpiry();
  }

  getUserExpiry(){    
    this._userservice.getUserExpiry(this.userEmail)
    .subscribe(
      (data) => {
        console.log("Post Reuslt => ", data);                              
      },
      response => {
        console.log("POST call in error", response);                              
      });
  }

  getToolsList(){
    //alert("in");    
    let lang:any={langCode:this.languageSelected,userID:this.userID};
    this._service.getToolsList(lang)
    .subscribe(
      (data) => {
        console.log("Post Reuslt => ", data);        
        this.toolsList = data.toolsList;                    
        for(let i=0;i<this.toolsList.length;i++){
          this.toolsList[i].imgSrc = this.IMG_URL+"tools/"+this.toolsList[i].tools_cover_image                              
        } 
        console.log(this.toolsList);               
      },
      response => {
        console.log("POST call in error", response);                              
      });
  }

  gotoDetails(input:any){
    console.log(input);
    let toolsID:any = input.tools_code;                  
    this.router.navigate(['/tools/'+toolsID+'/'+input.tools_lang]);
  }

  createTreeData(){
    let token = localStorage.getItem("Jwt-token");
    //alert(token);
    this._userservice.getSymbolslist(token)
      .subscribe(
          (data:any) => {
            console.log(data);                        
            let symArr=data;
            symArr.sort((a:any,b:any) => (a.name < b.name) ? 1 : -1);
            let symbolsDataArr2:any = "";

            //for(let i=0;i<5;i++){
            for(let i=0;i<symArr.length;i++){
              let path = symArr[i].category.split("/");              
              let symName = symArr[i].name;    
              if(this.existArr.includes(path[0].substring(0, 2))==true){           
                for(let p=0;p<path.length;p++){  
                  let pathVal = path[p].replaceAll(" ", "_");   
                  //if(pathVal=="Indices"){ pathVal=pathVal+"_"; }  

                  if(path.length==1){
                    if(symbolsDataArr2.indexOf( pathVal+'": [' )==-1){
                        let obj='"'+pathVal+'": []';                                                
                        if(symbolsDataArr2==""){
                          symbolsDataArr2=symbolsDataArr2+obj;
                        } else {
                          symbolsDataArr2=symbolsDataArr2+","+obj;
                        }                    
                    } 
                  } else {
                    if(p==0){
                      if(symbolsDataArr2.indexOf( pathVal+'": {' )==-1){
                          let obj='"'+pathVal+'": {}';                                                
                          if(symbolsDataArr2==""){
                            symbolsDataArr2=symbolsDataArr2+obj;
                          } else {
                            symbolsDataArr2=symbolsDataArr2+","+obj;
                          }                      
                      }    
                      //console.log(symbolsDataArr2);
                    } else if(p==(path.length-1)){
                      let pathVal2 = (path[(p-1)]).replaceAll(" ", "_");  

                      if(symbolsDataArr2.indexOf( pathVal+'": [' )==-1){
                        let obj2 = '"'+pathVal+'": []';          
                        let parentStr=pathVal2+'": {';
                        let parentStr2=pathVal2+'": {}';                                      
                        let pos2 = symbolsDataArr2.indexOf(parentStr); 
                        let pos21 = symbolsDataArr2.indexOf(parentStr2); 
                        let len2 = parentStr.length;
                        let poslen2 = parseInt(pos2)+parseInt(<any>len2);

                        if(pos21==-1){
                          obj2=obj2+",";
                        }
                        //console.log(parentStr+" "+pos2+" "+pos21+" "+len2+" "+poslen2);
                        symbolsDataArr2 = [symbolsDataArr2.slice(0, poslen2), obj2, symbolsDataArr2.slice(poslen2)].join('');  
                        //console.log(symbolsDataArr2);
                      }
                    } else {
                      let pathVal2 = (path[(p-1)]).replaceAll(" ", "_");  

                      if(symbolsDataArr2.indexOf( pathVal+'": {' )==-1){
                        let obj2 = '"'+pathVal+'": {}';          
                        let parentStr=pathVal2+'": {';
                        let parentStr2=pathVal2+'": {}';                                      
                        let pos2 = symbolsDataArr2.indexOf(parentStr); 
                        let pos21 = symbolsDataArr2.indexOf(parentStr2); 
                        let len2 = parentStr.length;
                        let poslen2 = parseInt(pos2)+parseInt(<any>len2);

                        if(pos21==-1){
                          obj2=obj2+",";
                        }
                        //console.log(parentStr+" "+pos2+" "+pos21+" "+len2+" "+poslen2);
                        symbolsDataArr2 = [symbolsDataArr2.slice(0, poslen2), obj2, symbolsDataArr2.slice(poslen2)].join('');  
                        //console.log(symbolsDataArr2);
                      }
                    }
                  }

                  if(p==(path.length-1)){
                      //console.log("Path End => ");
                      let obj3 = '"'+symName+'"';          
                      let parentStr31=pathVal+'": [';
                      let parentStr32=pathVal+'": []';                                      
                      let pos3 = symbolsDataArr2.indexOf(parentStr31); 
                      let pos31 = symbolsDataArr2.indexOf(parentStr32); 
                      let len3 = parentStr31.length;
                      let poslen3 = parseInt(pos3)+parseInt(<any>len3);

                      if(pos31==-1){
                        obj3=obj3+",";
                      }                 
                      
                      //console.log(path[0]+" "+symName);
                      this.symbolRootArr[symName] = path[0];
                      /*if(path[0]=="CFDs"){
                        if(path[1]=='Cash Indices'){
                          this.symbolRootArr[symName] = 'Indices';
                        } else {
                          this.symbolRootArr[symName] = 'Commodities';
                        }
                      } else if(path[0]=="CFDs on Stocks"){
                        this.symbolRootArr[symName] = 'Stocks';
                      } else {
                        this.symbolRootArr[symName] = path[0];
                      }*/                     
                      if(this.symbolRootNameArr.includes(path[0])==false){
                        this.symbolRootNameArr.push(path[0]);
                      }                    

                      //console.log(parentStr31+" "+pos3+" "+pos31+" "+len3+" "+poslen3);
                      symbolsDataArr2 = [symbolsDataArr2.slice(0, poslen3), obj3, symbolsDataArr2.slice(poslen3)].join('');  
                      //console.log(symbolsDataArr2);
                  }               
                }
              }
            }            
            //console.log(symbolsDataArr2);    
            symbolsDataArr2=symbolsDataArr2.replaceAll("_"," "); 
            symbolsDataArr2=symbolsDataArr2.replaceAll("Indices ","Indices");       
            symbolsDataArr2="{"+symbolsDataArr2+"}";  
            
            this.treeData = this.sortObjectByKeys(JSON.parse(symbolsDataArr2));
            console.log(this.treeData);
            const data2 = this.buildFileTree(this.treeData, 0);

            console.log(this.symbolRootArr);
            console.log(this.symbolRootNameArr);
            this.symbolRootNameArr=(this.symbolRootNameArr).sort();
            this.symbolRootNameArr.unshift("All");
            console.log(this.symbolRootNameArr);

            //let symbolRootNameArr2:any=['All','1.Forex','2.Cryptocurrencies','3.Indices','4.Commodities','5.Equities'];
            //console.log(symbolRootNameArr2);

            // Notify the change.
            localStorage.setItem("symbolsTreeArr",JSON.stringify(data2));    
            localStorage.setItem("symbolRootArr",JSON.stringify(this.symbolRootArr));
            localStorage.setItem("symbolRootNameArr",JSON.stringify(this.symbolRootNameArr));                                
          },
          err => {
            console.log(err);
            //this._notification.warning("Oop's error an process");            

            if(!localStorage.getItem('username')==true && !localStorage.getItem('password')==true){
              this.router.navigate(['/login']);
            } else {
              let msg = this.translate.instant('home.msg_process');
              //this._notification.success("Processing please wait..");
              this._notification.success(msg);
              this.autoLogin();
            }
          }
      );         
  }

  autoLogin(){    
    let username:any = localStorage.getItem('username');
    let password:any = localStorage.getItem('password');

    let decode = CryptoJS.AES.decrypt(password, this.passwordKey).toString(CryptoJS.enc.Utf8);
    //console.log(decode);

    let inputDets:any={username:username,password:decode};
    this._userservice.userLogin(inputDets)
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
            this.createTreeData();                    
          } else {
            let msg = this.translate.instant('home.msg_accinactive')
            //this._notification.warning("User account is inactive");   
            this._notification.warning(msg);
            this.router.navigate(['/login']);         
          }
      },
      response => {
        console.log("POST call in error", response);   
        let msg = this.translate.instant('home.err_onprocess')            
        //this._notification.warning("Error on process, login again.");   
        this._notification.warning(msg);
        this.router.navigate(['/login']);
      });
  }

  sortObjectByKeys(o:any) {
      return Object.keys(o).sort().reduce((r:any, k:any) => (r[k] = o[k], r), {});
  }

  buildFileTree(obj: {[key: string]: any}, level: number): TodoItemNode[] {
    return Object.keys(obj).reduce<TodoItemNode[]>((accumulator, key) => {
      const value = obj[key];
      const node = new TodoItemNode();
      node.item = key;

      if (value != null) {
        if (typeof value === 'object') {
          node.children = this.buildFileTree(value, level + 1);
        } else {
          node.item = value;
        }
      }

      return accumulator.concat(node);
    }, []);
  }

  createProfile(){
    localStorage.setItem('profileMode','Add');  
    localStorage.setItem("selectedProfile","");
    this.router.navigate(['/signal/create-profile1']);
  }

  getUserNoteCount(userID:any){
    //alert(userID);    
    let userDets:any={userID:userID};
    console.log(userDets);  
    this._service.getUserNoteCount(userDets)
    .subscribe(
      (data) => {
        console.log("Post Reuslt => ", data);  
        let signalCount:any=data.newSignalCount;
        let newsCount:any=data.newNewsCount;
        let offerCount:any=data.newOfferCount;    
        let newTotalCount:any=data.newTotalCount;    

        localStorage.setItem("SignalNoteCount",signalCount);
        localStorage.setItem("NewsNoteCount",newsCount);
        localStorage.setItem("OfferNoteCount",offerCount);        
        localStorage.setItem("DisplayNoteCount",newTotalCount);
        localStorage.setItem("RetNoteCount",newTotalCount);  
        
        this._service.setNoteCount(newTotalCount);
        this._service.setSignalCount(signalCount);
        this._service.setOfferCount(offerCount);
        this._service.setNewsCount(newsCount);
      },
      response => {        
        console.log("POST call in error", response);                              
      });
  }

  getUserPoints(){    
    let input:any={userID:this.userID,userType:localStorage.getItem("UserType")};
    this._service.getUserPoints(input)
      .subscribe(
        (result:any) => {
          console.log("Current User Points"); 
          console.log(result);      
          this.userPoints = result.userPoints;
          localStorage.setItem("UserEarnedPoints",<any>parseFloat(this.userPoints));  
          this._service.setUserPoints(this.userPoints);   

          this.chatCount=result.unreadTotalCount;
          localStorage.setItem("TotalChatCount",<any>parseFloat(this.chatCount));
          this._service.setChatCount(this.chatCount);
        },
        (err) => {
          console.log;
        }
      );
  }  

  openAlertPopup(type:any){
    this.alertPopup = 1; 
    if(type==1){
      //this.alertPopupMsg = "Copy Trading Coming Soon..";
      this.translate.get('home.copy_coming').subscribe((res: string) => {
        this.alertPopupMsg = res;
      });
    } else {
      //this.alertPopupMsg = "Squawk Room Coming Soon..";
      this.translate.get('home.squawk_coming').subscribe((res: string) => {
        this.alertPopupMsg = res;
      });
    }   
    
  }

  closeAlertPopup(){
    this.alertPopup = 0;   
    this.alertPopupMsg = "";
    localStorage.setItem('loginStatus',<any>1); 
  }
  
}