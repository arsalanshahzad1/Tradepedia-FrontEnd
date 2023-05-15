import { Component, OnInit, Injectable, ViewEncapsulation, ViewChild, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import {SelectionModel} from '@angular/cdk/collections';
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {BehaviorSubject} from 'rxjs';

import { SignalsService } from '../services/signals.service';
import { NotificationService } from '../services/notification.service';
import { environment } from '../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { SwiperComponent } from 'swiper/angular';
import SwiperCore, { Pagination } from "swiper";
import {MatDialog} from '@angular/material/dialog';
import {TranslateService} from '@ngx-translate/core';
import { PagesService } from '../services/pages.service';
import * as CryptoJS from 'crypto-js';


SwiperCore.use([Pagination]);

/**
 * Node for to-do item
 */
 export class TodoItemNode {
  children!: TodoItemNode[];
  item!: string;
}

/** Flat to-do item node with expandable and level information */
export class TodoItemFlatNode {
  item!: string;
  level!: number;
  expandable!: boolean;
}

/**
 * The Json object for to-do list data.
 * Need to remove dummy contents
 */
const TREE_DATA = {
  Cryptos: {
    'Almond Meal flour': null,
    'Organic eggs': null,
    'Protein Powder': null,
    Cryptos2: {
      'Almond Meal flour2': null,
      'Organic eggs2': null,
      'Protein Powder2': null,
      Cryptos3: {
        'Almond Meal flour3': null,
        'Organic eggs3': null,
        'Protein Powder3': null,
        Cryptos4: {
          'Almond Meal flour4': null,
          'Organic eggs4': null,
          'Protein Powder4': null,
        },
      },
    },
  },
  CFD_Stockes: {
    'Almond Meal flour': null,
    'Organic eggs': null,
    'Protein Powder': null,
  },
  Saudi_Arabia: {
    'Almond Meal flour': null,
    'Organic eggs': null,
    'Protein Powder': null,
  },
  Reminders: [
    'Cook dinner',
    'Read the Material Design spec',
    'Upgrade Application to Angular'
  ]
};

/**
 * Checklist database, it can build a tree structured Json object.
 * Each node in Json object represents a to-do item or a category.
 * If a node is a category, it has children items and new items can be added under the category.
 */
@Injectable()
export class ChecklistDatabase {
  dataChange = new BehaviorSubject<TodoItemNode[]>([]);

  treeData:Array<any>=[];
  symbolRootArr:any={};
  symbolRootNameArr:any=[];

  get data(): TodoItemNode[] { return this.dataChange.value; }
  passwordKey:any = environment.userPasswordKey;
  existArr:any=['1.','2.','3.','4.','5.'];
  
  constructor(
    private _service : SignalsService,    
    public _notification: NotificationService,
    private router : Router,
    private route: ActivatedRoute,
    private translate: TranslateService,
  ) {
    if(!localStorage.getItem("UserID")==true){      
      this.router.navigate(['/login']);
    }

    let Jwt_token= localStorage.getItem("Jwt-token");
    if(Jwt_token==""){
      this.autoLogin();
    }
    
    this.initialize();
  }

  autoLogin(){    
    let username:any = localStorage.getItem('username');
    let password:any = localStorage.getItem('password');

    let decode = CryptoJS.AES.decrypt(password, this.passwordKey).toString(CryptoJS.enc.Utf8);
    //console.log(decode);

    let inputDets:any={username:username,password:decode};
    this._service.userLogin(inputDets)
    .subscribe(
      (data) => {
        console.log("Login Reuslt => ", data);   
          
          let result:any = data.body;
          let requ:any = data.headers.get('jwt-token');
          console.log(result); 
          console.log(requ);

          if(result.active==true){
            let isLogged:any=true;
            let next:any=false;
            let index:any=0;
                      
            //localStorage.setItem("username",inputDets['username']);            
            localStorage.setItem("isLogged",isLogged);
            localStorage.setItem("Jwt-token",requ);		
            localStorage.setItem('signalNext',next);
            localStorage.setItem('signalIndex',index);   
            this.createTreeData();                    
          } else {
            //this._notification.warning("User account is inactive");   
            let msg:any=this.translate.instant('crtprf_one.inactive_user');             
            this._notification.warning(msg);  
            this.router.navigate(['/login']);         
          }
      },
      response => {
        console.log("POST call in error", response);   
        let msg:any=this.translate.instant('crtprf_one.err_onprocess');
        //this._notification.warning("Error on process, login again.");   
        this._notification.warning(msg);   
        this.router.navigate(['/login']);
      });
  }

  initialize() {    
    if(!localStorage.getItem("symbolsTreeArr")==true){
      this.createTreeData();
    } else {
      let treeData:any = JSON.parse(<any>localStorage.getItem("symbolsTreeArr"));
      console.log(treeData);  
      this.dataChange.next(treeData);
    }      
  }

  createTreeData(){
    let token = localStorage.getItem("Jwt-token");
    //alert(token);
    this._service.getSymbolslist(token)
      .subscribe(
          (data:any) => {
            console.log(data);                        
            let symArr=data;
            symArr.sort((a:any,b:any) => (a.name < b.name) ? 1 : -1);
            let symbolsDataArr2:any = "";

            //for(let i=0;i<5;i++){
            for(let i=0;i<symArr.length;i++){
              let path = symArr[i].category.split("/");              
              let symName = symArr[i].name;  
              if(this.existArr.includes(path[0].substring(0, 2))==true){                        
                for(let p=0;p<path.length;p++){  
                  let pathVal = path[p].replaceAll(" ", "_");   
                  //if(pathVal=="Indices"){ pathVal=pathVal+"_"; }  

                  if(path.length==1){
                    if(symbolsDataArr2.indexOf( pathVal+'": [' )==-1){
                        let obj='"'+pathVal+'": []';                                                
                        if(symbolsDataArr2==""){
                          symbolsDataArr2=symbolsDataArr2+obj;
                        } else {
                          symbolsDataArr2=symbolsDataArr2+","+obj;
                        }                    
                    } 
                  } else {
                    if(p==0){
                      if(symbolsDataArr2.indexOf( pathVal+'": {' )==-1){
                          let obj='"'+pathVal+'": {}';                                                
                          if(symbolsDataArr2==""){
                            symbolsDataArr2=symbolsDataArr2+obj;
                          } else {
                            symbolsDataArr2=symbolsDataArr2+","+obj;
                          }                      
                      }    
                      //console.log(symbolsDataArr2);
                    } else if(p==(path.length-1)){
                      let pathVal2 = (path[(p-1)]).replaceAll(" ", "_");  

                      if(symbolsDataArr2.indexOf( pathVal+'": [' )==-1){
                        let obj2 = '"'+pathVal+'": []';          
                        let parentStr=pathVal2+'": {';
                        let parentStr2=pathVal2+'": {}';                                      
                        let pos2 = symbolsDataArr2.indexOf(parentStr); 
                        let pos21 = symbolsDataArr2.indexOf(parentStr2); 
                        let len2 = parentStr.length;
                        let poslen2 = parseInt(pos2)+parseInt(<any>len2);

                        if(pos21==-1){
                          obj2=obj2+",";
                        }
                        //console.log(parentStr+" "+pos2+" "+pos21+" "+len2+" "+poslen2);
                        symbolsDataArr2 = [symbolsDataArr2.slice(0, poslen2), obj2, symbolsDataArr2.slice(poslen2)].join('');  
                        //console.log(symbolsDataArr2);
                      }
                    } else {
                      let pathVal2 = (path[(p-1)]).replaceAll(" ", "_");  

                      if(symbolsDataArr2.indexOf( pathVal+'": {' )==-1){
                        let obj2 = '"'+pathVal+'": {}';          
                        let parentStr=pathVal2+'": {';
                        let parentStr2=pathVal2+'": {}';                                      
                        let pos2 = symbolsDataArr2.indexOf(parentStr); 
                        let pos21 = symbolsDataArr2.indexOf(parentStr2); 
                        let len2 = parentStr.length;
                        let poslen2 = parseInt(pos2)+parseInt(<any>len2);

                        if(pos21==-1){
                          obj2=obj2+",";
                        }
                        //console.log(parentStr+" "+pos2+" "+pos21+" "+len2+" "+poslen2);
                        symbolsDataArr2 = [symbolsDataArr2.slice(0, poslen2), obj2, symbolsDataArr2.slice(poslen2)].join('');  
                        //console.log(symbolsDataArr2);
                      }
                    }
                  }

                  if(p==(path.length-1)){
                      //console.log("Path End => ");
                      let obj3 = '"'+symName+'"';          
                      let parentStr31=pathVal+'": [';
                      let parentStr32=pathVal+'": []';                                      
                      let pos3 = symbolsDataArr2.indexOf(parentStr31); 
                      let pos31 = symbolsDataArr2.indexOf(parentStr32); 
                      let len3 = parentStr31.length;
                      let poslen3 = parseInt(pos3)+parseInt(<any>len3);

                      if(pos31==-1){
                        obj3=obj3+",";
                      }                 
                      
                      //console.log(path[0]+" "+symName);
                      this.symbolRootArr[symName] = path[0];
                      /*if(path[0]=="CFDs"){
                        if(path[1]=='Cash Indices'){
                          this.symbolRootArr[symName] = 'Indices';
                        } else {
                          this.symbolRootArr[symName] = 'Commodities';
                        }
                      } else if(path[0]=="CFDs on Stocks"){
                        this.symbolRootArr[symName] = 'Stocks';
                      } else {
                        this.symbolRootArr[symName] = path[0];
                      }*/
                      if(this.symbolRootNameArr.includes(path[0])==false){
                        this.symbolRootNameArr.push(path[0]);
                      }                    

                      //console.log(parentStr31+" "+pos3+" "+pos31+" "+len3+" "+poslen3);
                      symbolsDataArr2 = [symbolsDataArr2.slice(0, poslen3), obj3, symbolsDataArr2.slice(poslen3)].join('');  
                      //console.log(symbolsDataArr2);
                  }               
                }
              }
            }            
            //console.log(symbolsDataArr2);    
            symbolsDataArr2=symbolsDataArr2.replaceAll("_"," "); 
            symbolsDataArr2=symbolsDataArr2.replaceAll("Indices ","Indices");        
            symbolsDataArr2="{"+symbolsDataArr2+"}";  


            console.log(symbolsDataArr2);
            this.treeData = this.sortObjectByKeys(JSON.parse(symbolsDataArr2));
            console.log(this.treeData);
            const data2 = this.buildFileTree(this.treeData, 0);
            console.log(data2);
            console.log(this.symbolRootArr);
            console.log(this.symbolRootNameArr);
            this.symbolRootNameArr=(this.symbolRootNameArr).sort();
            this.symbolRootNameArr.unshift("All");
            console.log(this.symbolRootNameArr);

            //let symbolRootNameArr2:any=['All','1.Forex','2.Cryptocurrencies','3.Indices','4.Commodities','5.Equities'];
            //console.log(symbolRootNameArr2);

            // Notify the change.
            localStorage.setItem("symbolsTreeArr",JSON.stringify(data2));    
            localStorage.setItem("symbolRootArr",JSON.stringify(this.symbolRootArr));
            localStorage.setItem("symbolRootNameArr",JSON.stringify(this.symbolRootNameArr));                                
            this.initialize();
          },
          err => {
            console.log(err);
            //this._notification.warning("Oop's error an process");     
            if(!localStorage.getItem('username')==true && !localStorage.getItem('password')==true){
              this.router.navigate(['/login']);
            } else {
              //this._notification.success("Processing please wait..");
              let msg:any=this.translate.instant('crtprf_one.msg_process');        
              this._notification.success(msg);
              this.autoLogin();
            }        
          }
      );         
  }

  sortObjectByKeys(o:any) {
      return Object.keys(o).sort().reduce((r:any, k:any) => (r[k] = o[k], r), {});
  }

  /**
   * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
   * The return value is the list of `TodoItemNode`.
   */
  buildFileTree(obj: {[key: string]: any}, level: number): TodoItemNode[] {
    return Object.keys(obj).reduce<TodoItemNode[]>((accumulator, key) => {
      const value = obj[key];
      const node = new TodoItemNode();
      node.item = key;

      if (value != null) {
        if (typeof value === 'object') {
          node.children = this.buildFileTree(value, level + 1);
        } else {
          node.item = value;
        }
      }

      return accumulator.concat(node);
    }, []);
  }

  /** Add an item to to-do list */
  insertItem(parent: TodoItemNode, name: string) {
    if (parent.children) {
      parent.children.push({item: name} as TodoItemNode);
      this.dataChange.next(this.data);
    }
  }

  updateItem(node: TodoItemNode, name: string) {
    node.item = name;
    this.dataChange.next(this.data);
  }
}

@Component({
  selector: 'app-create-profile1',
  templateUrl: './create-profile1.component.html',
  styleUrls: ['./create-profile1.component.scss'],
  providers: [ChecklistDatabase],
  encapsulation: ViewEncapsulation.None
})
export class CreateProfile1Component implements OnInit {
  newProfile:any= "";
  btnNxt:any = 0;
  symbolArr:any = [];
  imgURL:any = environment.imgUrl;

  alertPopup:any=0;
  alertPopupMsg:any="";
  alertPopupImg:any="";

  strategies:Array<any> = [];
  strategiesArr:any=[];
  score:any = 0;
  currLang:any="";

  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap = new Map<TodoItemFlatNode, TodoItemNode>();

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<TodoItemNode, TodoItemFlatNode>();

  /** A selected parent node to be inserted */
  selectedParent: TodoItemFlatNode | null = null;

  /** The new item's name */
  newItemName = '';

  treeControl: FlatTreeControl<TodoItemFlatNode>;

  treeFlattener: MatTreeFlattener<TodoItemNode, TodoItemFlatNode>;

  dataSource: MatTreeFlatDataSource<TodoItemNode, TodoItemFlatNode>;

  /** The selection for checklist */
  checklistSelection = new SelectionModel<TodoItemFlatNode>(true /* multiple */);

  @ViewChild(SwiperComponent) swiper!: SwiperComponent;

  @ViewChild('templateDialogbx') TemplateDialogbx!: TemplateRef<any>;

  constructor(
    private _service : SignalsService,
    private router : Router, 
    private _database: ChecklistDatabase,
    public  dialog: MatDialog,
    private translate: TranslateService,
    private _pgservice : PagesService,
    ) {
  
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel,
      this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<TodoItemFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    _database.dataChange.subscribe(data => {
      this.dataSource.data = data;
      
    });    

    this._pgservice.selectLang.subscribe((lang:any) => {
      this.currLang = lang.toLowerCase();
    });    
  }
  opendalog(){
    this.dialog.open(this.TemplateDialogbx);
  }
  

  getLevel = (node: TodoItemFlatNode) => node.level;

  isExpandable = (node: TodoItemFlatNode) => node.expandable;

  getChildren = (node: TodoItemNode): TodoItemNode[] => node.children;

  hasChild = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.expandable;

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  transformer = (node: TodoItemNode, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode = existingNode && existingNode.item === node.item
        ? existingNode
        : new TodoItemFlatNode();
    flatNode.item = node.item;
    flatNode.level = level;
    flatNode.expandable = !!node.children?.length;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  }

  /** Whether all the descendants of the node are selected. */
  descendantsAllSelected(node: TodoItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.length > 0 && descendants.every(child => {
      return this.checklistSelection.isSelected(child);
    });
    return descAllSelected;
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: TodoItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  todoItemSelectionToggle(node: TodoItemFlatNode): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);

    // Force update for the parent
    descendants.forEach(child => this.checklistSelection.isSelected(child));
    this.checkAllParentsSelection(node);
    this.filter(node);
  }

  /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
  todoLeafItemSelectionToggle(node: TodoItemFlatNode): void {
    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);
    this.filter(node);
  }

  /* Checks all the parents when a leaf node is selected/unselected */
  checkAllParentsSelection(node: TodoItemFlatNode): void {
    let parent: TodoItemFlatNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  /** Check root node checked state and change it accordingly */
  checkRootNodeSelection(node: TodoItemFlatNode): void {
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.length > 0 && descendants.every(child => {
      return this.checklistSelection.isSelected(child);
    });
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
  }

  /* Get the parent node of a node */
  getParentNode(node: TodoItemFlatNode): TodoItemFlatNode | null {
    const currentLevel = this.getLevel(node);

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }

  ngOnInit(): void {
    let isLogged = localStorage.getItem("isLogged");
    
    if(isLogged=="true"){      
      //CHECKING FOR ALREADY LOADED SIGNAL LIST
      let Jwt_token= localStorage.getItem("Jwt-token");      
      if(Jwt_token==""){        
        this.gotoLogin();
      }
          
      let obj:any="";     
      let trans:any=['buy','sell'];   
      if(localStorage.getItem('profileMode')=="Edit"){
        this.newProfile = JSON.parse(<any>localStorage.getItem('selectedProfile'));
      } else if(localStorage.getItem('profileMode')=="Add" || localStorage.getItem('profileMode')==""){
        //obj = {"profileID":"", "userID":localStorage.getItem("UserID"), "name":"", "description":"", "image":"", "selTimeFrame":[], "selTransaction":trans, "selTools":"", "selStrategie":['333', '334', '335', '336', '337', '338', '341', '342', '343', '344', '359', '360', '361', '362'], "selStateT":['OB+01', 'OB+0', 'OB+1', 'OS+01', 'OS+0', 'OS+1', 'N'], "selStateW":['OB-12', 'OB-1', 'OB-2', 'OS-12', 'OS-1', 'OS-2', 'N'], "selScore":['333:1:10', '334:1:10', '335:1:10', '336:1:10', '337:1:10', '338:1:10', '341:1:10', '342:1:10', '343:1:10', '344:1:10', '359:1:10', '360:1:10', '361:1:10', '362:1:10'], "selSymbol":[]};        
        obj = {"profileID":"", "userID":localStorage.getItem("UserID"), "name":"", "description":"", "image":"", "selTimeFrame":[], "selTransaction":trans, "selTools":"", "selStrategie":[], "selStateT":['OB+01', 'OB+0', 'OB+1', 'OS+01', 'OS+0', 'OS+1', 'N'], "selStateW":['OB-12', 'OB-1', 'OB-2', 'OS-12', 'OS-1', 'OS-2', 'N'], "selScore":[], "selSymbol":[]};        
        localStorage.setItem('profileMode','Edit');
        this.getStrategies();
        this.newProfile = obj;
        localStorage.setItem('selectedProfile',JSON.stringify(this.newProfile));              
      }
      //console.log(this.newProfile);      
      console.log(this.newProfile);
      this.setSelectedData();      
      if(this.newProfile['selSymbol']==""){			
        this.btnNxt = 1;
      }                	
    } else {
      this.gotoLogin();
    }
  }

  getStrategies(){    
    let token = localStorage.getItem("Jwt-token");
    //alert("In");
    this._service.getStrategies(token,this.currLang)
      .subscribe(
          (data:any) => {
            console.log(data);          
            
            let strategies2:any=[];
            for(let i=0;i<data.length;i++){
              if(data[i].is_signal==true){
                strategies2.push(data[i]);
              }
            }
           
            let scoreString:any=[];
            this.strategies = strategies2;              
            let stArr = this.newProfile[<any>'selStrategie'];
            if(stArr==""){
              //this.btnNxt = 1;                   
              for(let i=0;i<this.strategies.length;i++){                              
                  this.strategies[i].status = 1;
				          this.strategies[i].scoreDropdown = 1;
                  this.strategies[i].scoreFrom = 1;
                  this.strategies[i].scoreTo = 10;
                  scoreString.push(((this.strategies[i].id).toString())+":1:10"); 	  
                  this.strategiesArr.push((this.strategies[i].id).toString());				          
              }                  
            } else {
              for(let i=0;i<this.strategies.length;i++){                              
                  if((stArr.includes((this.strategies[i].id).toString())) == true){
                    this.strategies[i].status = 1; 
					          this.strategies[i].scoreDropdown = 1;
                    let from:number=1; let to:number=10;             
                    for(let s=0;s<this.score.length;s++){
                      let arr:any=this.score[s].split(":");
                      //console.log(" => "+((this.strategies[i].id).toString())+" == "+arr[0]);
                      if(((this.strategies[i].id).toString()) === arr[0]){
                        from = parseInt(arr[1]);
                        to = parseInt(arr[2]);
                      }
                    }
                    this.strategies[i].scoreFrom = from;
                    this.strategies[i].scoreTo = to;
                    scoreString.push(((this.strategies[i].id).toString())+":"+from+":"+to); 
                  } else {
                    this.strategies[i].status = 0;
					          this.strategies[i].scoreDropdown = 0;
                    this.strategies[i].scoreFrom = 1;
                    this.strategies[i].scoreTo = 10;
                  }                
              }                             
            }
            console.log(this.strategies); 
            console.log(scoreString);  
            this.score = scoreString;           

            this.newProfile[<any>'selScore'] = this.score;
            this.newProfile[<any>'selStrategie'] = this.strategiesArr;        
            console.log(this.newProfile);		      
            localStorage.setItem('selectedProfile',JSON.stringify(this.newProfile));
            //this.getStrategieDets();
          },
          err => {
            console.log(err);
            //this._notification.warning("Oop's error an process");
            //this.gotoLogin();
          }
      );         
  }

  filter(node: TodoItemFlatNode){
    //alert("In");
    console.log(node);
    const descendants = this.treeControl.getDescendants(node);
    console.log(descendants);
    console.log(this.checklistSelection.isSelected(node));      
    
    let symArr:any=[];
    if(this.newProfile['selSymbol']!=""){
      symArr = this.newProfile['selSymbol'];      
    }
    console.log(symArr);
    
    if(this.checklistSelection.isSelected(node)==true){
      console.log("Check In");
      if(descendants.length>0){
          for(let s=0;s<descendants.length;s++){
            if(descendants[s].expandable==false){
                if(symArr.includes(descendants[s].item)==false){
                  symArr.push(descendants[s].item);
                }
            }
          }
      } else {
        if(symArr.includes(node.item)==false){
            symArr.push(node.item);
        }
      }      
    } else {
      console.log("Check Out");
      if(descendants.length>0){
          for(let s=0;s<descendants.length;s++){
            if(descendants[s].expandable==false){
                if(symArr.includes(descendants[s].item)==true){
                    symArr.splice(symArr.indexOf(descendants[s].item), 1);
                }
            }
          }
      } else {
        if(symArr.includes(node.item)==true){
            symArr.splice(symArr.indexOf(node.item), 1);
        }       
      }      
    }

    console.log("Final Symbol Arr");
    console.log(symArr);
    this.newProfile['selSymbol'] = symArr;
    if(symArr.length > 0){
      this.btnNxt = 0;
    } else {
      this.btnNxt = 1;
    }
    console.log(this.newProfile);
    localStorage.setItem('selectedProfile',JSON.stringify(this.newProfile));   
  }

  setSelectedData() {
    let symArr = this.newProfile['selSymbol'];   
    symArr = symArr.filter((el:any) => { return el != ""; });   
    console.log(symArr);
    if(symArr.length > 0){
      for (let i = 0; i < this.treeControl.dataNodes.length; i++) {
        if(symArr.includes(this.treeControl.dataNodes[i].item)==true){        
          this.todoItemSelectionToggle(this.treeControl.dataNodes[i]);
          this.treeControl.expand(this.treeControl.dataNodes[i]);        
        }
      }
    }    
  }
  
  gotoLogin(){
    this.router.navigate(['/home']);
  }

  gotoNext(){
    this.router.navigate(['/signal/create-profile3'])
  }

  isChild1FormValid!: boolean;
  enableSubmitButton(isValid: boolean) {
    this.isChild1FormValid = isValid;
  }

  pagination = {
    clickable: true,
    renderBullet: function (index: number, className: string) {
      return '<span class="' + className + '">' + (index + 1) + "</span>";
    },
  };

  swipePrev() {
    //console.log(this.newProfile);
    //localStorage.setItem('selectedProfile',JSON.stringify(this.newProfile));  
    this.swiper.swiperRef.slidePrev();
  }

  swipeNext() {
    //console.log(this.newProfile);
    //localStorage.setItem('selectedProfile',JSON.stringify(this.newProfile));  
    this.swiper.swiperRef.slideNext();
  }

  getImgURL(name:any){
    //console.log(name);
    let url = this.imgURL+'symbols/'+(name.toLowerCase()).replaceAll(" ","")+'.svg';
    //console.log(name+" => "+this.checkIfImageExists(url));
    /*if(this.checkIfImageExists(url)===true){
      return url;
    } else {
      return "";
    }*/  
    return url; 
  }

  closeAlertPopup(){
    this.alertPopup = 0;
    this.router.navigate(['/signal/my-profile']);
  }

  filterFunction(type:any): any {  
    let arrlist:any = ["1.Forex","2.Cryptocurrencies","3.Indices","4.Commodities","5.Equities"];   
    //console.log(arrlist);        
    return arrlist.includes(type);
  } 

}
