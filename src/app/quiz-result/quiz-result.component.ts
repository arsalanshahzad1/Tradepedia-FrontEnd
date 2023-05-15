import { Component, OnInit } from '@angular/core';
import { PagesService } from '../services/pages.service';
import { NotificationService } from '../services/notification.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { StarRatingComponent } from 'ng-starrating';
import {TranslateService} from '@ngx-translate/core';



@Component({
  selector: 'app-quiz-result',
  templateUrl: './quiz-result.component.html',
  styleUrls: ['./quiz-result.component.scss']
})
export class QuizResultComponent implements OnInit {
  showConsole:any = environment.showConsole;
  imgURL:any = environment.imgUrl;
  currCode:any = environment.CurrCode;
  
  langCode:any="";
  type:any="";  
  resultID:any="";  
  resultDets:any="";  
  nextDets:any="";
  userPoints:any="";

  exeName:any="";
  ebookCode:any="";
  code:any="";
  lang:any="";
  callingID:any="";
  btnLab:any="";

  alertPopup:any=0;
  alertPopupTitle:any="";
  alertPopupMsg:any="";
  alertPopupImg:any="";  

  constructor(
    private _service : PagesService,
    public _notification: NotificationService,
    private router : Router,
    private route: ActivatedRoute,
    private translate: TranslateService,
  ) { 
    if(!localStorage.getItem("UserID")==true){      
      this.router.navigate(['/login']);
    }
  }

  ngOnInit(): void {    
    this.route.params
      .subscribe(params => {
        console.log(params);       
        if(!params['resultID']==false){
          //alert("If");
          //this.getCouponDets(params['code']);
          this.type=params['type'];
          this.resultID=params['resultID'];          
          this.getResultDets();          
        } else if(!params['ebookCode']==false){
          //alert("Out");
          this.type=params['type'];
          this.ebookCode=params['ebookCode'];
          this.code=params['code'];
          this.lang=params['lang'];          
          //this.getResultDets();
          this.getResultData();
        }
    });

    if(this.type=="Chapter"){      
      this.translate.get('quiz_result.next_chapter').subscribe((res: string) => {
        this.btnLab = res;
      });
    } else if(this.type=="Lesson"){      
      this.translate.get('quiz_result.next_lesson').subscribe((res: string) => {
        this.btnLab = res;
      });
    } else if(this.type=="Course"){      
      this.translate.get('quiz_result.next_course').subscribe((res: string) => {
        this.btnLab = res;
      });
    }    
  }

  getResultDets(){    
    let inputDets:any={type:this.type,resultID:this.resultID};
    this._service.getResultDets(inputDets)
    .subscribe(
      (data) => {
        console.log("Tools Details Reuslt => ", data);                
        this.resultDets = data.resultDets; 
        this.nextDets = data.nextDets;
        this.userPoints = data.userPoints;
        let showPopup = data.showPopup;
        let popupList = data.popupList;

        let stars=this.resultDets.stars;
        this._service.setUserPoints(this.userPoints);
        localStorage.setItem("UserEarnedPoints",<any>parseFloat(this.userPoints));  
        
        if(this.type=="Chapter"){  
          if(!this.nextDets==false){
            if(this.resultDets.baseCode < this.nextDets.baseCode){
              this.translate.get('quiz_result.next_ebook').subscribe((res: string) => {
                this.btnLab = res;
              });
            } else {
              this.translate.get('quiz_result.next_chapter').subscribe((res: string) => {
                this.btnLab = res;
              });
            }              
          } else {
            this.translate.get('quiz_result.next_guide').subscribe((res: string) => {
              this.btnLab = res;
            });
          }
        } else if(this.type=="Lesson"){   
          if(!this.nextDets==false){                      
            if(this.resultDets.baseCode < this.nextDets.baseCode){
              this.translate.get('quiz_result.next_guide').subscribe((res: string) => {
                this.btnLab = res;
              });
            } else {
              this.translate.get('quiz_result.next_lesson').subscribe((res: string) => {
                this.btnLab = res;
              });
            }   
          } else {
            this.translate.get('quiz_result.next_hsc').subscribe((res: string) => {
              this.btnLab = res;
            });
          }
        } else if(this.type=="Course"){      
          if(!this.nextDets==false){         
            if(this.nextDets.webOn==1 && this.nextDets.webID!=0){              
              this.translate.get('quiz_result.next_webinar').subscribe((res: string) => {
                this.btnLab = res;
              });
            } else {
              this.translate.get('quiz_result.next_course').subscribe((res: string) => {
                this.btnLab = res;
              });
            }            
          } else {
            this.btnLab = "";
          }
        }

        if(!this.nextDets.subID==true && showPopup==1){
          this.alertPopup=1;                    
          for(let i=0;i<popupList.length;i++){            
            if(popupList[i].nset_command=="Ebook" && this.type=='Chapter'){
              this.alertPopupTitle=popupList[i].nset_subject;
              this.alertPopupMsg=popupList[i].nset_message;
              this.alertPopupImg=this.imgURL+"notification/"+popupList[i].nset_image;
            } else if(popupList[i].nset_command=="Guide" && this.type=='Lesson'){        
              this.alertPopupTitle=popupList[i].nset_subject;
              this.alertPopupMsg=popupList[i].nset_message;
              this.alertPopupImg=this.imgURL+"notification/"+popupList[i].nset_image;
            } else if(popupList[i].nset_command=="AWS" && this.type=='Course'){        
              this.alertPopupTitle=popupList[i].nset_subject;
              this.alertPopupMsg=popupList[i].nset_message;
              this.alertPopupImg=this.imgURL+"notification/"+popupList[i].nset_image;
            }    
          }                
        }

        /*if(this.type=='Chapter'){
          stars=this.resultDets.cresult_total_stars;
        } else if(this.type=='Lesson'){        
          stars=this.resultDets.lresult_total_stars;
        } else if(this.type=='Course'){        
          stars=this.resultDets.crresult_total_stars;
        }*/
        this.resultDets.stars = stars;
        console.log(this.resultDets);
      },
      response => {
        console.log("POST call in error", response);                              
      });
  }


  getResultData(){    
    let inputDets:any={type:this.type,baseID:this.ebookCode,code:this.code,lang:this.lang};
    this._service.getResultData(inputDets)
    .subscribe(
      (data) => {
        console.log("Chapter Reuslt => ", data);  
        this.callingID = data.resultData;              
        //alert(this.callingID);
      },
      response => {
        console.log("POST call in error", response);                              
      });
  }

  gotoHome(){
    let url='/home';
    //alert(url);
    this.router.navigate([url]); 
  }

  retakeQuiz(){
    let url='/quiz/'+this.type+'/'+this.ebookCode+'/'+this.code+'/'+this.lang;
    //alert(url);
    this.router.navigate([url]);
  }
  
  gotoChapter(){
    let url="";
    /*if(this.type=="Chapter"){
      //url='/academy/chapter-details/'+this.nextDets.subID;
      if(!this.nextDets==false){
        url='/academy/ebooks/'+this.nextDets.subID;
      } else {
        url='/academy/video-chapter-list';
      }
    } else if(this.type=="Lesson"){
      //url='/academy/video-guide/'+this.nextDets.baseCode+'/'+this.nextDets.langCode; 
      if(!this.nextDets==false){
        url='/academy/video-chapter-list/'+this.nextDets.subID+'/'+this.nextDets.langCode;
      } else {
        url='/academy/hsc-chapter-list';
      }      
    } else if(this.type=="Course"){
      //url='/academy/home-study-courses/'+this.nextDets.baseCode+'/'+this.nextDets.langCode;
      url='/academy/hsc-chapter-list';
    }*/
    
    if(this.type=="Extra"){      
      url='/wallet';      
    } else if(this.type=="Chapter"){
      if(!this.nextDets==false){
        url='/academy/ebooks/'+this.nextDets.subID;
      } else {
        //url='/academy/chapter-details/'+this.resultDets.baseCode;
        url='/academy/video-chapter-list';
      }
    } else if(this.type=="Lesson"){
      if(!this.nextDets==false){
        url='/academy/video-chapter-list/'+this.nextDets.subID+'/'+this.nextDets.langCode;
      } else {
        //url='/academy/video-guide/'+this.resultDets.baseCode+'/'+this.resultDets.langCode; 
        url='/academy/hsc-chapter-list';
      }  
    } else if(this.type=="Course"){
      if(!this.nextDets==false){
        //alert("If");
        if(this.nextDets.webOn==1 && this.nextDets.webID!=0){  
          //alert("In");
          //url='/academy/home-study-courses/'+this.nextDets.webID+'/'+this.nextDets.webLang;
          url='/academy/hsc-chapter-list';
        } else {
          //alert("Out");
          //url='/academy/home-study-courses/'+this.nextDets.baseCode+'/'+this.nextDets.langCode;
          url='/academy/hsc-chapter-list/'+this.nextDets.subID;      
        }        
      } else {
        //alert("Out");
        //url='/academy/home-study-courses/'+this.resultDets.baseCode+'/'+this.resultDets.langCode;
        url='/academy/hsc-chapter-list/'+this.resultDets.subCode;      
      }
      //url='/academy/hsc-chapter-list/'+this.nextDets.subID;      
    }

    //alert(url);
    this.router.navigate([url]); 
  }

  goBack(){
    let url="";
    //alert(this.code);
    if(this.type=="Chapter"){
      //url='/academy/chapter-details/'+this.nextDets.subID;
      url='/academy/ebooks/'+this.callingID;
    } else if(this.type=="Lesson"){
      //url='/academy/video-guide/'+this.nextDets.baseCode+'/'+this.nextDets.langCode; 
      url='/academy/video-chapter-list/'+this.code+'/'+this.lang; 
    } else if(this.type=="Course"){
      //url='/academy/home-study-courses/'+this.nextDets.baseCode+'/'+this.nextDets.langCode;
      url='/academy/hsc-chapter-list/'+this.code;
    }    
    //alert(url);
    this.router.navigate([url]);
  }

  closeAlertPopup(){
    this.alertPopup = 0;
    localStorage.setItem('loginStatus',<any>1); 
  }
  
}
