import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import SwiperCore, { Pagination, Autoplay } from "swiper";

SwiperCore.use([Pagination, Autoplay]);

@Component({
  selector: 'app-signal',
  templateUrl: './signal.component.html',
  styleUrls: ['./signal.component.scss']
})
export class SignalComponent implements OnInit {

  constructor(
    private router : Router,
  ) { 
    if(!localStorage.getItem("UserID")==true){      
      this.router.navigate(['/login']);
    }
  }

  ngOnInit(): void {
  }


  createProfile(){
    //alert("Calling");
    localStorage.setItem('profileMode','Add');  
    localStorage.setItem("selectedProfile","");
    this.router.navigate(['/signal/create-profile1']);
  }  

}
