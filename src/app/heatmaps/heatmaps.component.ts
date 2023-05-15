import { Component, OnInit, ViewChild } from '@angular/core';
import { SignalsService } from '../services/signals.service';
//import * as d3 from "d3";
//import ApexCharts from 'apexcharts'

import { Router } from '@angular/router';
import { NotificationService } from '../services/notification.service';
import { environment } from '../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

import {
  ApexAxisChartSeries,
  ApexTitleSubtitle,
  ApexDataLabels,
  ApexChart,
  ApexPlotOptions,
  ApexLegend,
  ChartComponent
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  title: ApexTitleSubtitle;
  plotOptions: ApexPlotOptions;
  legend: ApexLegend;
  colors: string[];
};


@Component({
  selector: 'app-heatmaps',
  templateUrl: './heatmaps.component.html',
  styleUrls: ['./heatmaps.component.scss']
})
export class HeatmapsComponent implements OnInit {
  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions> | any;
  /*x: any;
  y: any;
  private heat_margin:any = { heat_top: 10, heat_right: 20, heat_bottom: 20, heat_left: 40 };
  private heat_width:any = 1000 - this.heat_margin.heat_left - this.heat_margin.heat_right;
  private heat_height:any = 1000 - this.heat_margin.heat_top - this.heat_margin.heat_bottom;
  private svgone:any;
  private margin:any = 50;
  private width:any = 1000 - (this.margin * 2);
  private height:any = 400 - (this.margin * 2);*/
  languageSelected:any="";
  timeFrames:Array<any> = [];

  markCupList:any=[];
  bestPerformList:any=[];
  markIndList:any=[];
  symbolsList:any="";
  firstSymbol:any="";
  selectedTF:any="H1";

  userID:any="";
  userPoints:any="";
  
  constructor(    
    private router : Router,
    private _service : SignalsService,    
    public _notification: NotificationService,    
    private route: ActivatedRoute,
    private cookieService: CookieService,
  ) {    
    if(!localStorage.getItem("UserID")==true){      
      this.router.navigate(['/login']);
    }
    
    if(!localStorage.getItem("UserID")==false){
      this.userID =localStorage.getItem("UserID");        
    }
    this.userPoints = localStorage.getItem("UserEarnedPoints");

    this.timeFrames = ['M5','M10','M15','M20','M30','H1','H2','H3','H4','H6','H8','H12','D1','W1','MN'];

    if(!this.cookieService.get('selectedLang')==false){
      this.languageSelected = this.cookieService.get('selectedLang');        
    } else {
      this.languageSelected = "EN";      
    } 
    console.log(this.languageSelected);

  }

  public generateData(count:any, yrange:any) {
    var i = 0;
    var series = [];
    while (i < count) {
      var x = "w" + (i + 1).toString();
      var y =
        Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

      series.push({
        x: x,
        y: y
      });
      i++;
    }
    return series;
  }

  ngOnInit(): void {

    /*this.createBarSvg();
    this.drawBarsChart();*/
    /*for(let i=0;i<this.timeFrames.length;i++){                              
      this.timeFrames[i].status = 0;                              
    }    
    console.log(this.timeFrames);*/

    this.getHitMapList();
    this.getMarkCapList();
    this.getBestPerformList();
  }

  getTimeFrames(){    
    this._service.getTimeFrames()
      .subscribe(
          (data:any) => {
            console.log(data);                  
            this.sortByKey(data,"id");		
            console.log(data);  
            this.timeFrames = data;
            localStorage.setItem("timeFramesArr",JSON.stringify(data));                    
          },
          err => {
            console.log(err);
            this._notification.warning("Oop's error an process");
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

  getHitMapList(){    
    this._service.getHitMapList()
      .subscribe(
          (data:any) => {
            console.log(data);                                                
            let list = data;
            let inpArr:any=[];
            let inpValue:any = [65,35,38,34,32,33,32,30,28,27,25,23,20,18,15,10,7,5];
            for(let i=0;i<list.length;i++){              
              let cap:any=this.formatRate((list[i].marketCapUsd/1000000000),2);
              let per:any=this.formatRate(list[i].changePercent24Hr,2);
              let cap1:any=100/(list[i].rank);
              let cap2:any=0;
              if(per<0){
                cap2=inpValue[i] * -1;
                //cap2=this.formatRate((cap) * -1,2);
              } else {
                cap2=inpValue[i];
                //cap2=this.formatRate((cap),2);
              }              

              //let obj:any= {x: list[i].symbol+" Rank "+list[i].rank+" $"+cap+"B "+per+"%", y: parseFloat(cap2)};
              let obj:any= {x: [list[i].symbol, " Rank "+list[i].rank, " $"+cap+"B ", per+"%"], y: parseFloat(cap2)};
              inpArr.push(obj);         
            }
            console.log(inpArr);
            //this.chartOptions.series = {data:inpArr};
            //console.log(this.chartOptions);

            this.chartOptions = {
              series: [
                {                    
                  data: inpArr
                }
              ],
              legend: {
                show: false
              },
              chart: {
                height: 650,
                type: "treemap"
              },
              title: {
                text: "Crypto Heatmap by Market Cap",
                style: {
                  fontSize: '24px',
                  fontWeight: 'bold',
                },
              },
              dataLabels: {
                enabled: true,
                offsetY: -17,
                style: {
                  fontSize: '14px',
                  fontWeight: 'bold'
                }
              },
              plotOptions: {
                treemap: {
                  enableShades: true,
                  shadeIntensity: 0,
                  reverseNegativeShade: true,
                  colorScale: {
                    ranges: [
                      {
                        from: -5000,
                        to: 0,
                        color: "#cd131d"
                      },
                      {
                        from: 0.001,
                        to: 5000,
                        color: "#5bbf2b"
                      }
                    ]
                  }
                }
              }
            };
        
            console.log(this.chartOptions);
          },
          err => {
            console.log(err);
            this._notification.warning("Oop's error an process");
            //this.gotoLogin();
          }
      );         
  }

  getMarkCapList(){    
    this._service.getMarkCapList()
      .subscribe(
          (data:any) => {
            console.log(data);                                                
            let list = data;
            for(let i=0;i<list.length;i++){
              let inp:any = list[i].quote.USD;
              let price=this.formatRate(inp.price,6);
              let day=this.formatRate(inp.percent_change_24h,2);
              let week:any=this.formatRate(inp.percent_change_7d,2);
              let month=this.formatRate(inp.percent_change_30d,2);
              let qutor=this.formatRate(inp.percent_change_90d,2);
              let mkt_cap=this.formatRate((inp.market_cap/1000000000),2);
              let vol=this.formatRate((inp.volume_24h/1000000000),2);  
              let name=list[i].symbol+'USD';

              this.symbolsList=this.symbolsList+","+name;
              if(i==0){
                this.firstSymbol = name;
                localStorage.setItem('heatFirstSymbol',this.firstSymbol);
              } 

              let obj:any={name:name,price:price,day:day,week:week,month:month,qutor:qutor,mkt_cap:mkt_cap,vol:vol};
              this.markCupList.push(obj);              
            }
            console.log(this.markCupList);
            this.symbolsList=this.symbolsList.substring(1);
            console.log(this.symbolsList);
            if(this.symbolsList!=""){
              this.getMarkIndList();
            }
          },
          err => {
            console.log(err);
            this._notification.warning("Oop's error an process");
            //this.gotoLogin();
          }
      );         
  }

  getBestPerformList(){    
    this._service.getBestPerformList()
      .subscribe(
          (data:any) => {
            console.log(data);    
            let list = data;
            for(let i=0;i<list.length;i++){
              let inp:any = list[i].quote.USD;
              let price=this.formatRate(inp.price,6);
              let day=this.formatRate(inp.percent_change_24h,2);
              let week:any=this.formatRate(inp.percent_change_7d,2);
              let month=this.formatRate(inp.percent_change_30d,2);
              let qutor=this.formatRate(inp.percent_change_90d,2);
              let mkt_cap=this.formatRate((inp.market_cap/1000000000),2);
              let vol=this.formatRate((inp.volume_24h/1000000000),2);    
              let name=list[i].symbol+'USD';                     

              let obj:any={name:name,price:price,day:day,week:week,month:month,qutor:qutor,mkt_cap:mkt_cap,vol:vol};
              this.bestPerformList.push(obj);              
            }                                
            console.log(this.bestPerformList);            
          },
          err => {
            console.log(err);
            this._notification.warning("Oop's error an process");
            //this.gotoLogin();
          }
      );         
  }

  resetIndList(time:any){
    this.selectedTF = time;
    this.getMarkIndList();
  }

  getMarkIndList(){    
    console.log(this.symbolsList);
    console.log(this.selectedTF);
    this._service.getMarkIndList(this.symbolsList,this.selectedTF)
      .subscribe(
          (data:any) => {
            console.log(data);    
            this.markIndList = data;
            console.log(this.markIndList);            
          },
          err => {
            console.log(err);
            this._notification.warning("Oop's error an process");
            //this.gotoLogin();
          }
      );         
  }

  formatRate(amount:any,count:any){
    //let count=6;
    let amt=parseFloat(amount).toFixed(count);
    //amt=amt.toFixed(count);
    return amt;
  }

  /*private createBarSvg(): void {
    
    this.svgone = d3.select("#my_dataviz")
    .append("svg")
    .attr(
      "viewBox",
      `0 0 ${this.heat_width + this.heat_margin.heat_left + this.heat_margin.heat_right} ${this
        .heat_height +
        this.heat_margin.heat_top +
        this.heat_margin.heat_bottom}`
    )
    .append("g")
    .attr("transform", "translate(" + this.margin + "," + this.margin + ")");
  }*/

  /*private drawBarsChart(): void {
    // Labels of row and columns
    var myGroups = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]
    var myVars = ["v1", "v2", "v3", "v4", "v5", "v6", "v7", "v8", "v9", "v10"]

    var x = d3.scaleBand()
      .range([ 0, this.width ])
      .domain(myGroups)
      .padding(0.01);
    this.svgone.append("g")
      .attr("transform", "translate(0," + this.height + ")")
      .call(d3.axisBottom(x))

    // Build X scales and axis:
    var y = d3.scaleBand()
      .range([ this.height, 0 ])
      .domain(myVars)
      .padding(0.01);
      this.svgone.append("g")
      .call(d3.axisLeft(y));

    // Build color scale
    var myColor = d3.scaleLinear()
      //.range(["white", "#69b3a2"])
      .domain([1,100])

    //Read the data
    /*d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/heatmap_data.csv", (data) => {

      this.svgone.selectAll()
          .data(data, function(d:any) {return d.group+':'+d.variable;})
          .enter()
          .append("rect")
          .attr("x", function(d:any) { return x(d.group) })
          .attr("y", function(d:any) { return y(d.variable) })
          .attr("width", x.bandwidth() )
          .attr("height", y.bandwidth() )
          .style("fill", function(d:any) { return myColor(d.value)} )

    });*/
  /*}*/

}
