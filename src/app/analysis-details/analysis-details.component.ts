import { Component, OnInit } from '@angular/core';
import { PagesService } from '../services/pages.service';
import { NotificationService } from '../services/notification.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-analysis-details',
  templateUrl: './analysis-details.component.html',
  styleUrls: ['./analysis-details.component.scss']
})
export class AnalysisDetailsComponent implements OnInit {
  showConsole:any = environment.showConsole;
  imgURL:any = environment.imgUrl;
  
  langCode:any="";
  analysisID:any="";  
  analysisDets:any="";  

  constructor(
    private _service : PagesService,
    public _notification: NotificationService,
    private router : Router,
    private route: ActivatedRoute,
  ) { 
    if(!localStorage.getItem("UserID")==true){      
      this.router.navigate(['/login']);
    }
  }

  ngOnInit(): void {
    this.route.params
      .subscribe(params => {
        console.log(params);            
        if(!params['code']==false){
          //this.getCouponDets(params['code']);
          this.analysisID=params['code'];
          this.langCode=params['lang'];
          this.getAnalysisDets();          
        }
    });
  }

  getAnalysisDets(){
    //alert("in");    
    let inputDets:any={code:this.analysisID,langCode:this.langCode}
    this._service.getAnalysisDets(inputDets)
    .subscribe(
      (data) => {
        console.log("Analysis Details Reuslt => ", data);        
        this.analysisDets = data.analysisDets;     
        this.analysisDets.imgSrc = this.imgURL+"analysis/"+this.analysisDets.analysis_cover_image                       
        console.log(this.analysisDets);
      },
      response => {
        console.log("POST call in error", response);                              
      });
  }

}
