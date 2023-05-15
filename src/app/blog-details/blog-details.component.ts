import { Component, OnInit } from '@angular/core';
import { PagesService } from '../services/pages.service';
import { NotificationService } from '../services/notification.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-blog-details',
  templateUrl: './blog-details.component.html',
  styleUrls: ['./blog-details.component.scss']
})
export class BlogDetailsComponent implements OnInit {
  showConsole:any = environment.showConsole;
  imgURL:any = environment.imgUrl;
  
  langCode:any="";
  blogID:any="";  
  blogDets:any="";  

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
          this.blogID=params['code'];
          this.langCode=params['lang'];
          this.getBlogDets();          
        }
    });
  }

  getBlogDets(){
    //alert("in");    
    let inputDets:any={code:this.blogID,langCode:this.langCode}
    this._service.getBlogDets(inputDets)
    .subscribe(
      (data) => {
        console.log("Blog Details Reuslt => ", data);        
        this.blogDets = data.blogDets;     
        this.blogDets.imgSrc = this.imgURL+"blog/"+this.blogDets.blog_cover_image                       
        console.log(this.blogDets);
      },
      response => {
        console.log("POST call in error", response);                              
      });
  }
}
