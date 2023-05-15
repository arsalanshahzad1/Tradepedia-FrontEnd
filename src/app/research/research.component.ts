import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import SwiperCore, { EffectFade, Pagination } from "swiper";
import { Router } from '@angular/router';

SwiperCore.use([EffectFade, Pagination]);

@Component({
  selector: 'app-research',
  templateUrl: './research.component.html',
  styleUrls: ['./research.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ResearchComponent implements OnInit {

  constructor(
    private router : Router,
  ) {
    if(!localStorage.getItem("UserID")==true){      
      this.router.navigate(['/login']);
    }
   }

  ngOnInit(): void {
  }

}
