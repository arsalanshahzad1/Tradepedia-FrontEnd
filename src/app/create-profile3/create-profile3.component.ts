import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { SignalsService } from '../services/signals.service';
import { NotificationService } from '../services/notification.service';
import { environment } from '../../environments/environment';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-create-profile3',
  templateUrl: './create-profile3.component.html',
  styleUrls: ['./create-profile3.component.scss']
})
export class CreateProfile3Component implements OnInit {

  newProfile:Array<any> = [];
  timeFrames:Array<any> = [];
  btnNxt:any = 0;
  timeArr:any=[];

  removeTFArr:any=['M1','M2','M3','M4','M6'];

  constructor(
    private router : Router,
    private _service : SignalsService,    
    public _notification: NotificationService,    
    private route: ActivatedRoute,
  ) { 
    if(!localStorage.getItem("UserID")==true){      
      this.router.navigate(['/login']);
    }
    
    if(!localStorage.getItem("timeFramesArr")==true){
      this.getTimeFrames();
    } else {
      this.timeFrames = JSON.parse(<any>localStorage.getItem("timeFramesArr"));      
    }   
    console.log(this.timeFrames);
  }

  ngOnInit(): void {
    let isLogged = localStorage.getItem("isLogged");	
      if(isLogged=="true"){
        //CHECKING FOR ALREADY LOADED SIGNAL LIST
        this.newProfile = JSON.parse(<any>localStorage.getItem('selectedProfile'));
        console.log(this.newProfile);    
        let tfArr = this.newProfile[<any>'selTimeFrame'];            
        if(tfArr==""){          
          this.btnNxt = 1;          
          for(let i=0;i<this.timeFrames.length;i++){                              
              this.timeFrames[i].status = 0;                              
          }    
          console.log(this.timeFrames);
        } else {
          this.btnNxt = 0;          
          this.timeArr = tfArr; 
          for(let i=0;i<this.timeFrames.length;i++){                              
              if((tfArr.includes(this.timeFrames[i].name)) == true){
                  this.timeFrames[i].status = 1; 
              } else {
                this.timeFrames[i].status = 0;
              }                
          }    
          console.log(this.timeFrames);
        }      
      } else {        
        this.gotoLogin();
      }    
  }

  getTimeFrames(){    
    this._service.getTimeFrames()
      .subscribe(
          (data:any) => {
            console.log(data);                  
            this.sortByKey(data,"id");		
            console.log(data);  
            //this.timeFrames = data;

            let tfInput:any = data;
            for(let i=0;i<tfInput.length;i++){                   
              if((this.removeTFArr.includes(tfInput[i].name)) == false){
                this.timeFrames.push(tfInput[i]);
              }
            }
            console.log(this.timeFrames);

            localStorage.setItem("timeFramesArr",JSON.stringify(this.timeFrames));

            let tfArr = this.newProfile[<any>'selTimeFrame'];
            for(let i=0;i<this.timeFrames.length;i++){                              
                if((tfArr.includes(this.timeFrames[i].name)) == true){
                   this.timeFrames[i].status = 1; 
                } else {
                  this.timeFrames[i].status = 0;
                }                
            }     
            console.log(this.timeFrames);            
          },
          err => {
            console.log(err);
            //this._notification.warning("Oop's error an process");
            //this.gotoLogin();
          }
      );         
  }

  sortByKey(array:any, key:any) {
	  return array.sort((a:any, b:any) => {
    	let x = a[key];
    	let y = b[key];
    
    	return ((x < y) ? -1 : ((x > y) ? 1 : 0));
  	});
  }

  selectTime(input:any){
    console.log(input);
    this.newProfile = JSON.parse(<any>localStorage.getItem('selectedProfile'));
    console.log(this.newProfile);
    this.timeArr = this.timeArr.filter((el:any) => {
      return el != "";
    });
    console.log(this.timeArr);
    
    if(input.status==0){
      input.status = 1;
      this.timeArr.push(input.name);
    } else {
      input.status = 0;
      this.timeArr = this.timeArr.filter((item:any) => item !== input.name);
    }    
    console.log(this.timeArr);

    if(this.timeArr.length > 0){
      this.btnNxt = 0;
    } else {
      this.btnNxt = 1;
    }
    
    this.newProfile[<any>'selTimeFrame'] = this.timeArr;
    console.log("Transaction Select");
    console.log(this.newProfile);		      
    localStorage.setItem('selectedProfile',JSON.stringify(this.newProfile));
  }

  gotoLogin(){
    this.router.navigate(['/home']);
  }

  gotoNext(){
    this.router.navigate(['/signal/create-profile5']);
  }

}
