import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-profile2',
  templateUrl: './create-profile2.component.html',
  styleUrls: ['./create-profile2.component.scss']
})
export class CreateProfile2Component implements OnInit {

  newProfile:Array<any> = [];
  btnNxt:any = 0;
  //robot2Form!: FormGroup;
  buyrobot:any = false;
  sellrobot:any = false
  selectedArr:any = [];

  @Output() isChild1FormValid: EventEmitter<boolean> = new EventEmitter<boolean>();
  
  constructor(private router : Router) { 
    if(!localStorage.getItem("UserID")==true){      
      this.router.navigate(['/login']);
    }
  }

  ngOnInit(): void {
    let isLogged = localStorage.getItem("isLogged");
	
      if(isLogged=="true"){
        //CHECKING FOR ALREADY LOADED SIGNAL LIST
            
        let buylist:any="";                
        this.newProfile = JSON.parse(<any>localStorage.getItem('selectedProfile'));
        console.log(this.newProfile);        
          if(this.newProfile[<any>'selTransaction']!=""){            
            buylist = this.newProfile[<any>'selTransaction'];	            
            console.log(buylist);                        
            if(buylist.includes("buy")==true){
              this.buyrobot = true;  
            }
  
            if(buylist.includes("sell")==true){              
              this.sellrobot = true;              
            }				
          } else {
            this.buyrobot = true;
            this.sellrobot = true;    
            this.selectedArr.push('buy');
            this.selectedArr.push('sell');          
            this.btnNxt = 0;
            this.isChild1FormValid.emit(false);

            this.newProfile[<any>'selTransaction']=this.selectedArr;
            console.log("Transaction Select");
            console.log(this.newProfile);		
            localStorage.setItem('selectedProfile',JSON.stringify(this.newProfile));
          }
        /*if(this.newProfile[<any>'selTransaction']==""){			
          this.btnNxt = 1;
        }*/	                            			
      } else {        
        this.gotoLogin();
      }
  }

  gotoLogin(){
    this.router.navigate(['/home']);
  }

  selectTransaction(event:any,type:any){    
    console.log(event);
    this.newProfile=JSON.parse(<any>localStorage.getItem('selectedProfile'));
    console.log(this.newProfile); 
    
    this.selectedArr = this.selectedArr.filter((el:any) => { return el != ""; });
      
    if(type == "buy" && event.checked == true){      
      this.selectedArr.push(type);
    } else if(type == "buy" && event.checked == false){
      this.selectedArr = this.selectedArr.filter((item:any) => item !== type);
    }

    if(type == "sell" && event.checked == true){
      this.selectedArr.push(type);
    } else if(type == "sell" && event.checked == false){
      this.selectedArr = this.selectedArr.filter((item:any) => item !== type);
    }

    console.log(this.selectedArr);    
    if(this.selectedArr.length > 0){    	
      this.btnNxt = 0;
      this.isChild1FormValid.emit(false);
    } else {
      this.btnNxt = 1;
      this.isChild1FormValid.emit(true);
    }

    this.newProfile[<any>'selTransaction']=this.selectedArr;
    console.log("Transaction Select");
    console.log(this.newProfile);		
    localStorage.setItem('selectedProfile',JSON.stringify(this.newProfile));		
  }

  gotoNext(){
    this.router.navigate(['/signal/create-profile3'])
  }

}
