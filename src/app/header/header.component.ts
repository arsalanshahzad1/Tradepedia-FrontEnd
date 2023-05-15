import { Component, ChangeDetectorRef, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { fader, slider } from '../route-animations';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import {MediaMatcher} from '@angular/cdk/layout';
import { SwipeEvent } from 'ng-swipe';
import { PagesService } from '../services/pages.service';
import { SignalsService } from '../services/signals.service';
import { TranslationComponent } from '../translation/translation.component';
import { ThemeService } from '../services/theme.service';
import { NotificationService } from '../services/notification.service';
import { environment } from '../../environments/environment';
import { SocialAuthService, GoogleLoginProvider, FacebookLoginProvider, SocialUser } from 'angularx-social-login';
import { DatePipe } from '@angular/common';
import {AppComponent} from '../app.component';


//import * as $ from "jquery";
//declare var $:any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: [ fader ],
  providers: [DatePipe]
})
export class HeaderComponent implements OnInit, OnDestroy {
  IMG_URL:string = environment.imgUrl;

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation']
  }
  
  activeNav:any="";
  activeRoute:any="";
  languageList:any=[];
  languageSelected:any="";
  isLoading: any = "";
  langCode:any="";
  userName:any="";
  userPoints:any="";
  userImage:any="";
  totalPoints:any="";
  profileName:any="";
  profileImage:any="";
  profileSrc:any="./assets/images/avatar.jpg";
  isLogged:any=0;
  notificationListArr:Array<any>=[];
  noteCount:any=0;
  chatCount:any=0;
  bellVibrate:any=0;
  unReadCount:any=0;

  themeIcon: any = 1;
  themeLogo:number = 1;

  currenttransTheme:any;
  currentRoute:any="";
  alertPopup:any=0;
  alertPopupMsg:any="";  

  constructor(
    public dialog: MatDialog,
    private router : Router,
    private translate: TranslateService,
    private cookieService: CookieService,
    private _service : PagesService,
    private _sigservice : SignalsService,    
    private themeService: ThemeService,
    public _notification: NotificationService,
    private socialAuthService: SocialAuthService,
    changeDetectorRef: ChangeDetectorRef, 
    media: MediaMatcher,
    public datepipe: DatePipe,
    public myapp: AppComponent
  ) {    

    let loggedUserID = localStorage.getItem("UserID");    
    //alert(!loggedUserID);
    let paramArr:any=(window.location.href).split("/");
    //alert("Url => "+paramArr[(paramArr.length-2)]);  
    if(!loggedUserID==true){          
      if(paramArr[(paramArr.length-2)]!="email-verification"){
        this.router.navigate(['/login']);  
      }      
      this.isLogged = 0;
    } else {
      this.isLogged = 1;
    }
    
    this.router.events.subscribe((event: Event) => {        
      if (event instanceof NavigationEnd) {
          // Hide progress spinner or progress bar
          this.currentRoute = event.url;       
          //alert(this.currentRoute);   
          //console.log(event);
          let path = this.currentRoute.split("/");
          //alert(path[1]);   
          if(path[1] === "login" || path[1] === "register" || path[1] === "forgot-password" || path[1] === "email-verification"){
            this.isLogged = 0;
          }
      }        
  });
    

    //translate.setDefaultLang('en');    

    this.userName = localStorage.getItem("UserName"); 
    this.userPoints = localStorage.getItem("UserEarnedPoints");
    this.userImage = localStorage.getItem("UserImage"); 

    if(!this.userImage==false){
      this.profileSrc = this.IMG_URL+"users/"+this.userImage;;        
    }
    //alert(this.profileSrc);
    
    translate.setDefaultLang('en');
    translate.use('en');
    if(!this.cookieService.get('selectedLang')==false){
      this.languageSelected = this.cookieService.get('selectedLang'); 
      console.log(this.languageSelected); 
    } else {
      this.languageSelected = "EN";
      this.cookieService.set('selectedLang',this.languageSelected); 
    }
    if(!this.cookieService.get('selectedTheme')==false){
      this.themeService.theme = this.cookieService.get('selectedTheme'); 
      this.darklightbtn(); 
    }    

    this.translate.use(this.languageSelected.toLowerCase());  

    this._service.setLang(this.languageSelected);
    this._service.setUserPoints(this.userPoints);
    this._service.setUserName(this.userName);
    this._service.setUserImage(this.profileSrc);

    if(!localStorage.getItem("DisplayNoteCount")==false){
      this.unReadCount = localStorage.getItem("DisplayNoteCount");
      this._service.setNoteCount(this.unReadCount);      
    } 

    if(!localStorage.getItem("TotalChatCount")==false){
      this.chatCount = localStorage.getItem("TotalChatCount");
      this._service.setChatCount(this.chatCount);      
    } 
    //alert(this.unReadCount)
    //alert(this.languageSelected);
    //alert(this.translate.currentLang);

    //translate.setDefaultLang(this.cookieService.get('selectedLang')); 
    //translate.use('en'); 

    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }  

  ngOnInit() {
    if(!this.cookieService.get('languageListArr')==false){
      this.languageList = JSON.parse(this.cookieService.get('languageListArr')); 
      console.log(this.languageList); 
    } else {
      this.getLangList();
    }    

    this._service.activeRoute.subscribe((route:any) => {
      this.activeRoute = route;
      setTimeout(() => {
        this.getCurrentPage();      
      }, 100);
      
    });

    this._service.selectLang.subscribe((lang:any) => {
      this.langCode = lang;
    });
    //alert("Header => "+this.langCode);

    this._service.getPoints.subscribe((point:any) => {
      this.totalPoints = point;
    });
    //alert("Header => "+this.langCode);

    this._service.getUserName.subscribe((name:any) => {
      this.profileName = name;
    });
    //alert("Header => "+this.langCode);

    this._service.getUserImage.subscribe((image:any) => {
      this.profileImage = image;
    });
    //alert("Header => "+this.langCode);

    this._service.getNoteCount.subscribe((count:any) => {
      this.noteCount = count;
    });

    this._service.getTransAlign.subscribe((type:any) => {
      this.currenttransTheme = type;
      //alert(this.currenttransTheme);
    });

    this._service.getChatCount.subscribe((count:any) => {
      this.chatCount = count;
      //alert(this.currenttransTheme);
    });
    
    if (this.cookieService.get("selectedLang") === 'AR') {
      this.currenttransTheme = 1;
    } else {
      this.currenttransTheme = 0;
    }
  }
  

  gotoWallet(){ 
    this.router.navigate(['/wallet']);
  }

  gotoProfile(){ 
    this.router.navigate(['/account/my-profile']);
  }

  changelang(event: string){
    this.languageSelected = event;
    this.cookieService.set('selectedLang',event); 
    //this.translate.use(event);    
    this.router.navigate(['/home']);
  }

  getCurrentPage(){
    //alert(this.activeRoute+" === "+this.router.url);
    if(this.activeRoute === this.router.url){
      let ar:any = this.activeRoute.split("/");
      this.activeNav = ar[1];
    } else {
      if(this.router.url!=""){
        let ar:any = this.router.url.split("/");
        this.activeNav = ar[1];
      } else {
        this.activeNav = "home";
      }      
    }
    //alert(this.activeNav);
  }

  gotoPage(url:any){
    this._service.setActiveRoute(url);
    this.router.navigate([url]);
  }

  createProfile(){
    localStorage.setItem('profileMode','Add');  
    localStorage.setItem("selectedProfile","");
    this.router.navigate(['/signal/create-profile1']);
  }

  getLangList(){
    //alert("in");    
    this._service.getLangList()
    .subscribe(
      (data) => {
        console.log("Post Reuslt => ", data);        
        this.languageList = data.langList;                           
        console.log(this.languageList);
        this.cookieService.set('languageListArr',JSON.stringify(this.languageList));
      },
      response => {
        console.log("POST call in error", response);                              
      });
  }

  translationbtn(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = false;
    dialogConfig.maxHeight = '300px';
    this.dialog.open(TranslationComponent,dialogConfig);
  }

  
  darklightbtn(){
    //alert(this.themeService.theme);
    this.cookieService.set('selectedTheme',this.themeService.theme); 
    if(this.themeService.theme === 'dark'){
      //alert("In");
      this.themeService.theme! = null;
      this.themeLogo = 1;
    } else{
      //alert("Out");      
      this.themeService.theme! = 'dark';
      this.themeLogo = 0;
    }
    this.themeIcon = !this.themeIcon;
  }

  logout(){ 
  localStorage.clear();  
    /*let token = localStorage.getItem("Jwt-token");
    let username = localStorage.getItem("username");
    this._sigservice.logout(token,username)
      .subscribe(
          (data:any) => {                        
            console.log(data);                        
            localStorage.clear();            
            this.router.navigate(['/login']);
          },
          (err:any) => {
            console.log(err);
            this._notification.warning("Oop's error an process");
            this.router.navigate(['/login']);
          }
      );*/
      this.socialAuthService.signOut().then((data:any) => {
        console.log(data);
        this.router.navigate(['/login']);
      }).catch((error:any) => {
        console.log(error);
        this.router.navigate(['/login']);
      });
      this.isLogged = 0;
    //this.router.navigate(['/login']);
  }

  /*get dark() {
    return this.themeService.theme === 'dark';
  }

  set dark(enabled: boolean) {
    this.themeService.theme! = enabled ? 'dark' : null;
  }*/

  //Sidenav Part  
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  isNavBarOpened = true;
  sidetoggle(){
    if(this.isNavBarOpened===true){
      this.isNavBarOpened=false;
    }
    else{
      this.isNavBarOpened=true;
    }
  }
  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  notifyBtn(){
    this.bellVibrate=1;
    setTimeout(()=>{
      this.bellVibrate=0;
    }, 2000);
  }

  callNotification(){ 
    let date=new Date();
    let randomID=this.randomString();

    let dat = this.datepipe.transform(date, 'yyyy-MM-dd hh:mm:ss');
    let obj:any={noteID:randomID,wasTapped:false,title:"Signal",body:"Signal Message Content",type:"Signal",paramID:"01A14BDF12DF5735E763E5E261B20E77",screen:"Signal",messageOn:dat,image:'https://tradepedia.io/userfiles/logo.png'};
    console.log(obj);

    this.myapp.saveMessage(obj);
  }

  randomString() {
    let result = '';
    let chars:any="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let length:any=24;
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  }

  saveNotification(){ 
    let sno:number=1;
    if(!localStorage.getItem("notificationListArr")==false){
      this.notificationListArr = JSON.parse(<any>localStorage.getItem("notificationListArr"));
      sno=parseInt(<any>this.notificationListArr.length)+1;
    }  
    console.log(this.notificationListArr);
        
    let date=new Date();
    let dat = this.datepipe.transform(date, 'yyyy-MM-dd hh:mm:ss');
    let obj:any={title:"Notification Title "+sno,body:"Notification Message Content "+sno,readStatus:0,created_on:dat};
    console.log(obj);

    this.notificationListArr.unshift(obj);
    console.log(this.notificationListArr);
    this.unReadCount=0;
    for(let i=0;i<this.notificationListArr.length;i++){
      if(this.notificationListArr[i].readStatus == 0){
        this.unReadCount++;
      }
    }
    this._service.setNoteCount(this.unReadCount);
    localStorage.setItem("notificationListArr",JSON.stringify(this.notificationListArr));        
  }

  gotoNoteList(){
    this.router.navigate(['/home/notification-center']);
  }

  openAlertPopup(type:any){
    this.alertPopup = 1;   
    if(type==1){
      this.alertPopupMsg = "Copy Trading Coming Soon..";
    } else {
      this.alertPopupMsg = "Squawk Room Coming Soon..";
    } 
  }

  closeAlertPopup(){
    this.alertPopup = 0;   
    this.alertPopupMsg = "";
  }

}
