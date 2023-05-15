import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-profile7',
  templateUrl: './create-profile7.component.html',
  styleUrls: ['./create-profile7.component.scss']
})
export class CreateProfile7Component implements OnInit {

  constructor(private router : Router) {
    if(!localStorage.getItem("UserID")==true){      
      this.router.navigate(['/login']);
    }
  }

  ngOnInit(): void {
  }

  gotoNext(){
    this.router.navigate(['/signal/create-profile7']);
  }

}
