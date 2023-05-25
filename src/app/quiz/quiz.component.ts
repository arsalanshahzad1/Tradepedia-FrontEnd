import { Component, ViewEncapsulation, OnInit, TemplateRef, ViewChild } from '@angular/core';
import SwiperCore, { Pagination, EffectCreative } from "swiper";
import { SwiperComponent } from 'swiper/angular';

import { PagesService } from '../services/pages.service';
import { NotificationService } from '../services/notification.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import {MatDialog} from '@angular/material/dialog';

import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


SwiperCore.use([Pagination, EffectCreative]);

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class QuizComponent implements OnInit {

  @ViewChild(SwiperComponent) swiper!: SwiperComponent;
  imgURL:any = environment.imgUrl;

  progressbarValue: any = 0;
  steps: number = 3;
  currentStep: number = 0;
  quizResult: number = 0;
  quizMsg:number = 0;
  quizPointTotal:number = 0;
  btnShow:number = 0;
  currentQuestion:any = "";

  languageSelected:any="";
  showConsole:any = environment.showConsole;      
  questionList:any=[];
  pointsList:any=[];
  //selectedGuide:any="";
  quizCode:any="";
  type:any=""; 
  ebookID:any=""; 
  chapterCode:any="";
  chapterLang:any="";
  showAlert:number=0;
  totalScore:any=0;
  totalZero:any=0;
  isLoading: any = "";

  userID:any="";
  userType:any="";
  quizImgpath:any="";

  totalQuestion:any = 0;
  correctQuestion:any = 0;
  wrongQuestion:any = 0;
  totalPoints:any = 0;
  showHint:any=0;
  btnDis:any=0;
  
  optArr:any = {1:'A',2:'B',3:'C',4:'D',5:'E'};
  staticImage:any = "";
  questionMaxLen:any = environment.quizQuestionCharLength;    

  constructor(
    private _service : PagesService,
    public _notification: NotificationService,
    private router : Router,
    private route: ActivatedRoute,
    private cookieService: CookieService, 
    public sanitizer: DomSanitizer,
    public  dialog: MatDialog 
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
    
    if(!localStorage.getItem("UserID")==false){
      this.userID =localStorage.getItem("UserID");        
    }

    if(!localStorage.getItem("UserType")==false){
      this.userType = localStorage.getItem("UserType");        
    }

    this.quizImgpath = this.imgURL+"quiz_images";
    //alert(this.quizImgpath);    
    this.staticImage = this.quizImgpath+"/message-caricature.png";
  }

  ngOnInit() {
    this.route.params
      .subscribe(params => {
        console.log(params);            
        if(!params['code']==false){
          //this.getCouponDets(params['code']);
          this.type=params['type']; 
          if(this.type!="Extra"){
            this.ebookID=params['ebookCode'];           
            this.chapterCode=params['code'];        
            this.chapterLang=params['lang'];        
          } else {
            this.ebookID=0;           
            this.chapterCode=params['code'];  
            //alert(!params['lang']);      
            if(!params['lang']==false){
              this.chapterLang=params['lang'];        
            } else {
              this.chapterLang=this.languageSelected;
            }     
            //alert(this.chapterLang);       
          }       
          //alert(this.chapterLang);
          this.getQuestionList();
          this.getPointsList();          
        }
    });
    this.isLoading = true;   
    /*setTimeout(()=>{
      this.isLoading = false;
    }, 5000);*/    
  }

  getValue(value: any, question:any) {
    //alert(value);
    //console.log(value);
    //console.log(question);
    question.selectedOpt = value;
    this.currentQuestion = question; 
    this.currentQuestion.correct_answer = this.optArr[this.currentQuestion.question_answer];        
    this.quizResult = 1;
    this.btnShow = 0; 
    this.quizMsg = 0;
    //console.log(this.questionList);
    let audio = new Audio();
    audio.src = "../assets/sound/button-click.wav";
    audio.load();
    audio.play();
  }

  checkAnswer(){
    //console.log(this.currentQuestion);
    let question:any=this.currentQuestion;
    let answer_key="question_option_"+question.question_answer;
    //console.log(question[answer_key]);
    this.quizResult = 1;

    for(let i=0;i<this.questionList.length;i++){
      if(this.questionList[i].question_id == question.question_id){
        this.questionList[i].disable = 1;
        question.disable = 1;
      }      
    }

    if(this.progressbarValue==100){
      this.btnShow=2;  
    } else {
      this.btnShow=1;
    }  
    
    if(question.selectedOpt == question[answer_key]){
      this.quizMsg = 1;
      this.showHint = 0;
      this.correctQuestion++;
      question.score = question.question_points;
      this.totalZero = 0;
      let audio = new Audio();
      audio.src = "../assets/sound/achievement-bell.wav";
      audio.load();
      audio.play();
    } else {
      this.quizMsg = 2;
      if(this.currentQuestion.question_explan!=null){
        this.showHint = 1;
      } else {
        this.showHint = 0;
      }
      this.wrongQuestion++;
      question.score = 0;
      this.totalZero = this.totalZero + parseInt(<any>1);
      let audio = new Audio();
      audio.src = "../assets/sound/game-fail.mp3";
      audio.load();
      audio.play();
    }    

    if(this.totalZero==2 || this.totalZero==4){
      this.showAlert = 1;
      setTimeout(()=>{             
          this.showAlert = 0;
      }, 2500);
    }

    this.totalScore = 0;
    for(let i=0;i<this.questionList.length;i++){
      if(this.questionList[i].score > 0){
        this.totalScore = this.totalScore + parseFloat(this.questionList[i].score);
      }      
    }
    //alert(this.totalScore);
    
  }

  nextprogress(){
    const isNextStep = this.currentStep < this.steps;
    if (isNextStep) this.currentStep++;
    this.progressbarValue = (this.currentStep / this.steps) * 100;
    this.swiper.swiperRef.slideNext();
    //console.log(isNextStep+" "+this.progressbarValue);
    this.showHint = 0;
    if(this.progressbarValue==100){
      this.btnShow=1;  
    } else {
      this.btnShow=0;
    }    
    this.quizResult = 0;
  }

  endProcess(){   
    console.log(this.questionList);
    this.btnDis = 1;
    let totalScore:number=0;
    let earnedScore:number=0;
    for(let i=0;i<this.questionList.length;i++){
      totalScore = totalScore + parseFloat(this.questionList[i].question_points);
      earnedScore = earnedScore + parseFloat(this.questionList[i].score);
    } 
    let logDets:any = {userID:this.userID,type:this.type,quizCode:this.quizCode,baseCode:this.ebookID,sectionCode:this.chapterCode,sectionLang:this.chapterLang,totalPoints:totalScore,earnedPoints:earnedScore}
    console.log(logDets);
    //alert("Quiz End, Your Score is "+totalScore);

    this._service.saveQuizLog(logDets)
    .subscribe(
      (data) => {
        console.log("Post Reuslt => ", data);  
        let url:any="";
        if(data.resultID!=""){
          url='/quiz-result/'+this.type+'/'+data.resultID;
        } else {
          url='/quiz-result/'+this.type+'/'+this.ebookID+'/'+this.chapterCode+'/'+this.chapterLang;
        }        
        //alert(url);
        this.router.navigate([url]);              
      },
      response => {
        console.log("POST call in error", response);                              
      });

      let audio = new Audio();
      audio.src = "../assets/sound/button-click.wav";
      audio.load();
      audio.play();  
  }

  getQuestionList(){
    //alert("in");    
    let lang:any={type:this.type,ebookCode:this.ebookID,chapterCode:this.chapterCode,chapterLang:this.languageSelected,userType:this.userType}
    console.log(lang);
    this._service.getQuestionList(lang)
    .subscribe(
      (data) => {
        console.log("Post Reuslt => ", data);   
        this.isLoading = false;      
        this.questionList = data.questionList;    
        this.quizCode = data.quizCode;
        this.steps = this.questionList.length - 1;
        this.totalQuestion = this.questionList.length;
        for(let i=0;i<this.questionList.length;i++){
                    
          //alert((this.questionList[i].question_title).length);
          // if((this.questionList[i].question_title).length <= this.questionMaxLen){
            this.questionList[i].question_title = this.questionList[i].question_title+'<div style="text-align: center; width: 100%; height: 100%; vertical-align: middle; padding: 25px;"><img src="'+this.staticImage+'" style="min-height: 320px; max-height: 320px;"></div>';                    
          // } else {
          //   this.questionList[i].question_title = this.questionList[i].question_title;                    
          // }
          
          //alert(this.questionList[i].question_title);
          this.questionList[i].title = (this.questionList[i].question_title).replaceAll('[[QUIZ_IMAGES]]', this.quizImgpath);             
          this.questionList[i].title = this.sanitizer.bypassSecurityTrustHtml((this.questionList[i].title).replaceAll('width="300"', 'class="img-fluid w-100"'));                       
          this.questionList[i].score = 0;
          this.questionList[i].selectedOpt = "";
          this.questionList[i].disable = 0;
          this.totalPoints = parseFloat(this.totalPoints) + parseFloat(this.questionList[i].question_points);
          
          if(this.questionList[i].question_answer_type=="Image"){            
            this.questionList[i].question_option_img1 = (this.questionList[i].question_option_1).replaceAll('[[QUIZ_IMAGES]]', this.quizImgpath);            
            this.questionList[i].question_option_img1 = this.sanitizer.bypassSecurityTrustHtml((this.questionList[i].question_option_img1).replaceAll('width="300"', 'class="img-fluid w-100"'));            
            this.questionList[i].question_option_img2 = (this.questionList[i].question_option_2).replaceAll('[[QUIZ_IMAGES]]', this.quizImgpath);
            this.questionList[i].question_option_img2 = this.sanitizer.bypassSecurityTrustHtml((this.questionList[i].question_option_img2).replaceAll('width="300"', 'class="img-fluid w-100"'));            
            this.questionList[i].question_option_img3 = (this.questionList[i].question_option_3).replaceAll('[[QUIZ_IMAGES]]', this.quizImgpath);
            this.questionList[i].question_option_img3 = this.sanitizer.bypassSecurityTrustHtml((this.questionList[i].question_option_img3).replaceAll('width="300"', 'class="img-fluid w-100"'));            
            
            if(!this.questionList[i].question_option_4==false){
              this.questionList[i].question_option_img4 = (this.questionList[i].question_option_4).replaceAll('[[QUIZ_IMAGES]]', this.quizImgpath);
              this.questionList[i].question_option_img4 = this.sanitizer.bypassSecurityTrustHtml((this.questionList[i].question_option_img4).replaceAll('width="300"', 'class="img-fluid w-100"'));
            }

            if(!this.questionList[i].question_option_5==false){            
              this.questionList[i].question_option_img5 = (this.questionList[i].question_option_5).replaceAll('[[QUIZ_IMAGES]]', this.quizImgpath);
              this.questionList[i].question_option_img5 = this.sanitizer.bypassSecurityTrustHtml((this.questionList[i].question_option_img5).replaceAll('width="300"', 'class="img-fluid w-100"'));
            }
            if(!this.questionList[i].question_explanation==false){ 
              this.questionList[i].question_explan = (this.questionList[i].question_explanation).replaceAll('[[QUIZ_IMAGES]]', this.quizImgpath);
              this.questionList[i].question_explan = this.sanitizer.bypassSecurityTrustHtml((this.questionList[i].question_explan).replaceAll('width="300"', 'class="img-fluid w-100"'));
            }
          } else {
            if(!this.questionList[i].question_explanation==false){ 
              this.questionList[i].question_explan = (this.questionList[i].question_explanation).replaceAll('[[QUIZ_IMAGES]]', this.quizImgpath);
              this.questionList[i].question_explan = this.sanitizer.bypassSecurityTrustHtml((this.questionList[i].question_explan).replaceAll('width="300"', 'class="img-fluid w-100"'));
            }
          }           
        }                                  
        console.log(this.questionList);
        //this.selectedGuide = this.questionList[0];
      },
      response => {
        this.isLoading = false;
        console.log("POST call in error", response);                              
      });
  }

  getPointsList(){
    //alert("in");        
    this._service.getPointsList()
    .subscribe(
      (data) => {
        console.log("Post Reuslt => ", data);        
        this.pointsList = data.pointsList;    
        console.log(this.pointsList);        
      },
      response => {
        console.log("POST call in error", response);                              
      });
  }

  openDialog(templateRef: TemplateRef<any>) {
    //console.log(this.currentQuestion);
    this.dialog.open(templateRef);
  }

}
