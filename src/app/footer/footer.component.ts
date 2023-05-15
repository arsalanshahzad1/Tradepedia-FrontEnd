import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  routerLink: null | undefined;

  constructor(
    private translate: TranslateService,
    private router: Router
  ) { 
    this.footerMenubtn(1);
  }

  ngOnInit(): void {
    if (this.routerLink == null) {
      //this.router.navigateByUrl('/home');
    }
  }

  activeButton: any;
  footerMenubtn(event: any){
    //alert(event);
    this.activeButton = event;
  }

}
