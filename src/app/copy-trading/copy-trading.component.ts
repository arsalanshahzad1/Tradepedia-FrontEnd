import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-copy-trading',
  templateUrl: './copy-trading.component.html',
  styleUrls: ['./copy-trading.component.scss']
})
export class CopyTradingComponent implements OnInit {
  imgURL:any = environment.imgUrl;
  comingImg:any="";
  constructor() { }

  ngOnInit(): void {
    this.comingImg = this.imgURL+"coming/copy_trading_comingsoon.svg";
    //this.comingImg = this.imgURL+"coming/test.svg";
  }

}
