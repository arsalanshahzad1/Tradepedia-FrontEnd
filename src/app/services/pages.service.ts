import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, Subject, BehaviorSubject } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class PagesService {
  API_URL:string = environment.apiUrl; 
  public activeRoute = new BehaviorSubject('');
  public selectLang = new BehaviorSubject('EN');
  public getPoints = new BehaviorSubject('');
  public getUserName = new BehaviorSubject('');
  public getUserImage = new BehaviorSubject('');
  public getNoteCount = new BehaviorSubject(0);

  public getSignalCount = new BehaviorSubject(0);
  public getOfferCount = new BehaviorSubject(0);
  public getNewsCount = new BehaviorSubject(0);

  public getNoteArr = new BehaviorSubject([]);
  public getNoteSingalArr = new BehaviorSubject('');

  public getQuizType = new BehaviorSubject('');
  public getTransAlign = new BehaviorSubject(0);
  public getChatCount = new BehaviorSubject(0);
  public getWalletPart = new BehaviorSubject(1);

  httpOptions:any = {
    headers: new HttpHeaders({
      'Accept': 'application/json, text/plain, */*',
      'Content-Type':'application/json'
    })
  };    
  
  constructor(private _http : HttpClient) { }

  setActiveRoute(route:any) {
    //alert("Service => "+lang);
    this.activeRoute.next(route);
  }

  setLang(lang:any) {
    //alert("Service => "+lang);
    this.selectLang.next(lang);
  }

  setUserPoints(point:any) {
    //alert("Service => "+lang);
    this.getPoints.next(point);
  }

  setUserName(name:any) {
    //alert("Service => "+lang);
    this.getUserName.next(name);
  }

  setUserImage(image:any) {
    //alert("Service => "+lang);
    this.getUserImage.next(image);
  }

  setNoteCount(count:any) {
    //alert("Service => "+count);
    this.getNoteCount.next(count);
  }

  setSignalCount(count:any) {
    //alert("Service => "+count);
    this.getSignalCount.next(count);
  }

  setOfferCount(count:any) {
    //alert("Service => "+count);
    this.getOfferCount.next(count);
  }

  setNewsCount(count:any) {
    //alert("Service => "+count);
    this.getNewsCount.next(count);
  }

  setNoteArr(arrInput:any) {
    //alert("Service => ");
    this.getNoteArr.next(arrInput);
  }

  setNoteSingalArr(arrInput:any) {
    //alert("Service => ");
    this.getNoteSingalArr.next(arrInput);
    
    setTimeout(() => {
      this.getNoteSingalArr.next('');
    }, 100);
  }

  setQuizType(arrInput:any) {
    //alert("Service => ");
    this.getQuizType.next(arrInput); 

    setTimeout(() => {
      this.getQuizType.next('');
    }, 100);     
  }

  setTransAlign(input:any) {
    //alert("Service => "+input);
    this.getTransAlign.next(input); 
  }

  setChatCount(count:any) {
    //alert("Service => "+count);
    this.getChatCount.next(count);
  }

  setWalletPart(input:any) {
    //alert("Service => "+count);
    this.getWalletPart.next(input);
  }

  getReferCountries(country:any) {   
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json, text/plain, */*',
        'Content-Type':'application/json'
      })
    };      
    let input = JSON.stringify({country:country});
    console.log(input);     
    return this._http.post(this.API_URL + 'getReferCountries', input, httpOptions);         
  }
  
  updateUserAccess(inputData:any) {   
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json, text/plain, */*',
        'Content-Type':'application/json'
      })
    };    
    let input = JSON.stringify(inputData);
    console.log(input);    
    return this._http.post(this.API_URL + 'updateUserAccess', input, httpOptions);         
  }  

  getUserPoints(inputData:any): Observable<any> {      
    let input = JSON.stringify(inputData);
    console.log(input);    
    return this._http.post(this.API_URL + 'getUserPoints', input, this.httpOptions);         
  }

  getUserDets(inputData:any): Observable<any> {   
    
    let input = JSON.stringify(inputData);
    console.log(input);    
    return this._http.post<any>(this.API_URL + 'getUserDets', input, this.httpOptions);        
  }

  getSocialUserDets(inputData:any): Observable<any> {   
      
    let input = JSON.stringify(inputData);
    console.log(input);    
    return this._http.post<any>(this.API_URL + 'getSocialUserDets', input, this.httpOptions);        
  }

  updateInactiveUser(inputData:any): Observable<any> {   
      
    let input = JSON.stringify(inputData);
    console.log(input);    
    return this._http.post<any>(this.API_URL + 'updateInactiveUser', input, this.httpOptions);        
  }

  getReceiverDets(inputData:any): Observable<any> {   
      
    let input = JSON.stringify(inputData);
    console.log(input);    
    return this._http.post<any>(this.API_URL + 'getReceiverDets', input, this.httpOptions);        
  }

  getPointsLog(inputData:any): Observable<any> {   
          
     let input = JSON.stringify(inputData);
    console.log(input);
    return this._http.post<any>(this.API_URL + 'getPointsLog', input, this.httpOptions);         
  }

  getReferSummary(inputData:any): Observable<any> {   
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json, text/plain, */*',
        'Content-Type':'application/json'
      })
    };        
     let input = JSON.stringify(inputData);
    console.log(input);
    return this._http.post<any>(this.API_URL + 'getReferSummary', input, httpOptions);         
  }

  getPointsSummary(inputData:any): Observable<any> {   
          
     let input = JSON.stringify(inputData);
    console.log(input);
    return this._http.post<any>(this.API_URL + 'getPointsSummary', input, this.httpOptions);         
  }

  getLangList(): Observable<any> {   
          
    return this._http.post<any>(this.API_URL + 'getLangList', this.httpOptions);         
  }

  setCurrLang(inputData:any): Observable<any> {      
    let input = JSON.stringify(inputData);
    console.log(input);      
    return this._http.post<any>(this.API_URL + 'setCurrLang', input, this.httpOptions);         
  }

  getEbookList(inputData:any): Observable<any> {   
      
    let input = JSON.stringify(inputData);
    console.log(input);    
    return this._http.post<any>(this.API_URL + 'getEbookList', input, this.httpOptions);         
  }

  getEbookDets(inputData:any): Observable<any> {   
          

    let input = JSON.stringify(inputData);
    console.log(input);
    return this._http.post<any>(this.API_URL + 'getEbookDets', input, this.httpOptions);         
  }

  getChapterList(inputData:any): Observable<any> {   
          
    let input = JSON.stringify(inputData);
    console.log(input);
    return this._http.post<any>(this.API_URL + 'getChapterList', input, this.httpOptions);          
  }

  getEbookQuizDets(inputData:any): Observable<any> {   
          
    let input = JSON.stringify(inputData);
    console.log(input);
    return this._http.post<any>(this.API_URL + 'getEbookQuizDets', input, this.httpOptions);          
  }

  getChapterDets(inputData:any): Observable<any> {   
          

    let input = JSON.stringify(inputData);
    console.log(input);
    return this._http.post<any>(this.API_URL + 'getChapterDets', input, this.httpOptions);         
  }

  getGuideList(inputData:any): Observable<any> {   
      
    let input = JSON.stringify(inputData);
    console.log(input);    
    return this._http.post<any>(this.API_URL + 'getGuidesList', input, this.httpOptions);         
  }

  getGuideQuizDets(inputData:any): Observable<any> {   
          
    let input = JSON.stringify(inputData);
    console.log(input);
    return this._http.post<any>(this.API_URL + 'getGuideQuizDets', input, this.httpOptions);          
  }

  getGuideDets(inputData:any): Observable<any> {   
          

    let input = JSON.stringify(inputData);
    console.log(input);
    return this._http.post<any>(this.API_URL + 'getGuideDets', input, this.httpOptions);         
  }

  getLessonList(inputData:any): Observable<any> {   
      
    let input = JSON.stringify(inputData);
    console.log(input);    
    return this._http.post<any>(this.API_URL + 'getLessonList', input, this.httpOptions);         
  }

  getHSCList(inputData:any): Observable<any> {   
      
    let input = JSON.stringify(inputData);
    console.log(input);    
    return this._http.post<any>(this.API_URL + 'getHSCList', input, this.httpOptions);         
  }

  getHSCQuizDets(inputData:any): Observable<any> {   
          
    let input = JSON.stringify(inputData);
    console.log(input);
    return this._http.post<any>(this.API_URL + 'getHSCQuizDets', input, this.httpOptions);          
  }

  getCourseList(inputData:any): Observable<any> {   
          

    let input = JSON.stringify(inputData);
    console.log(input);
    return this._http.post<any>(this.API_URL + 'getCourseList', input, this.httpOptions);         
  }

  getSeminarList(inputData:any): Observable<any> {   
      
    let input = JSON.stringify(inputData);
    console.log(input);    
    return this._http.post(this.API_URL + 'getSeminarList', input, this.httpOptions);         
  }

  getSeminarDets(inputData:any): Observable<any> {   
          

    let input = JSON.stringify(inputData);
    console.log(input);
    return this._http.post(this.API_URL + 'getSeminarDets', input, this.httpOptions);         
  }

  getNewsList(inputData:any): Observable<any> {   
      
    let input = JSON.stringify(inputData);
    console.log(input);    
    return this._http.post<any>(this.API_URL + 'getNewsList', input, this.httpOptions);         
  }

  getNewsDets(inputData:any): Observable<any> {   
          

    let input = JSON.stringify(inputData);
    console.log(input);
    return this._http.post<any>(this.API_URL + 'getNewsDets', input, this.httpOptions);         
  }

  getAnalysisList(inputData:any): Observable<any> {   
      
    let input = JSON.stringify(inputData);
    console.log(input);    
    return this._http.post<any>(this.API_URL + 'getAnalysisList', input, this.httpOptions);         
  }

  getAnalysisDets(inputData:any): Observable<any> {   
          

    let input = JSON.stringify(inputData);
    console.log(input);
    return this._http.post<any>(this.API_URL + 'getAnalysisDets', input, this.httpOptions);         
  }

  getBlogList(inputData:any): Observable<any> {   
      
    let input = JSON.stringify(inputData);
    console.log(input);    
    return this._http.post<any>(this.API_URL + 'getBlogList', input, this.httpOptions);         
  }

  getBlogDets(inputData:any): Observable<any> {   
          

    let input = JSON.stringify(inputData);
    console.log(input);
    return this._http.post<any>(this.API_URL + 'getBlogDets', input, this.httpOptions);         
  }

  getToolsList(inputData:any): Observable<any> {   
      
    let input = JSON.stringify(inputData);
    console.log(input);    
    return this._http.post<any>(this.API_URL + 'getToolsList', input, this.httpOptions);         
  }

  getToolsDets(inputData:any): Observable<any> {             
    let input = JSON.stringify(inputData);
    console.log(input);
    return this._http.post<any>(this.API_URL + 'getToolsDets', input, this.httpOptions);         
  }

  getQuestionList(inputData:any): Observable<any> {   
      
    let input = JSON.stringify(inputData);
    console.log(input);    
    return this._http.post<any>(this.API_URL + 'getQuestionList', input, this.httpOptions);         
  }

  getPointsList(): Observable<any> {   
      
    //let input = JSON.stringify(inputData);
    //console.log(input);    
    return this._http.post<any>(this.API_URL + 'getPointsList', this.httpOptions);         
  }

  saveQuizLog(inputData:any): Observable<any> {   
      
    let input = JSON.stringify(inputData);
    console.log(input);    
    return this._http.post<any>(this.API_URL + 'saveQuizLog', input, this.httpOptions);         
  }

  getResultDets(inputData:any): Observable<any> {             
    let input = JSON.stringify(inputData);
    console.log(input);
    return this._http.post<any>(this.API_URL + 'getResultDets', input, this.httpOptions);         
  }

  getResultData(inputData:any): Observable<any> {           
    let input = JSON.stringify(inputData);
    console.log(input);
    return this._http.post<any>(this.API_URL + 'getResultData', input, this.httpOptions);         
  }

  saveSeminarBoking(bookDet:Array<any>): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        //Authorization: 'my-auth-token'
      })
    };
    let input = JSON.stringify(bookDet);
    console.log(input);
    return this._http.post<any>(this.API_URL + 'saveSeminarBoking', input, httpOptions);      
  }

  saveTransaction(inputData:any): Observable<any> {   
      
    let input = JSON.stringify(inputData);
    console.log(input);    
    return this._http.post<any>(this.API_URL + 'saveTransaction', input, this.httpOptions);         
  }

  buyPoints(inputData:any): Observable<any> {   
      
    let input = JSON.stringify(inputData);
    console.log(input);    
    return this._http.post<any>(this.API_URL + 'buyPoints', input, this.httpOptions);         
  }

  registerXmcode(inputData:any): Observable<any> {   
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json, text/plain, */*',
        'Content-Type':'application/json'
      })
    };    
    let input = JSON.stringify(inputData);
    console.log(input);    
    return this._http.post<any>(this.API_URL + 'registerXmcode', input, httpOptions);         
  }


  saveHSCPayment(inputData:any): Observable<any> {   
      
    let input = JSON.stringify(inputData);
    console.log(input);    
    return this._http.post<any>(this.API_URL + 'saveHSCPayment', input, this.httpOptions);         
  }

  getSquawkPlanList(inputData:any): Observable<any> {   
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json, text/plain, */*',
        'Content-Type':'application/json'
      })
    };    
    let input = JSON.stringify(inputData);
    console.log(input);    
    return this._http.post<any>(this.API_URL + 'getSquawkPlanList', input, httpOptions);         
  }

  saveSquawkPayment(inputData:any): Observable<any> {   
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json, text/plain, */*',
        'Content-Type':'application/json'
      })
    };    
    let input = JSON.stringify(inputData);
    console.log(input);    
    return this._http.post<any>(this.API_URL + 'saveSquawkPayment', input, httpOptions);         
  }


  getSignalPlanList(inputData:any): Observable<any> {   
      
    let input = JSON.stringify(inputData);
    console.log(input);    
    return this._http.post<any>(this.API_URL + 'getSignalPlanList', input, this.httpOptions);         
  }

  saveSignalPayment(inputData:any): Observable<any> {   
      
    let input = JSON.stringify(inputData);
    console.log(input);    
    return this._http.post<any>(this.API_URL + 'saveSignalPayment', input, this.httpOptions);         
  }

  buyUserTools(inputData:any): Observable<any> {         
    let input = JSON.stringify(inputData);
    console.log(input);    
    return this._http.post<any>(this.API_URL + 'buyUserTools', input, this.httpOptions);         
  }

  getBlogPlanList(inputData:any): Observable<any> {   
      
    let input = JSON.stringify(inputData);
    console.log(input);    
    return this._http.post<any>(this.API_URL + 'getBlogPlanList', input, this.httpOptions);         
  }

  saveBlogPayment(inputData:any): Observable<any> {   
      
    let input = JSON.stringify(inputData);
    console.log(input);    
    return this._http.post<any>(this.API_URL + 'saveBlogPayment', input, this.httpOptions);         
  }

  getRCPlanList(inputData:any): Observable<any> {         
    let input = JSON.stringify(inputData);
    console.log(input);    
    return this._http.post<any>(this.API_URL + 'getRCPlanList', input, this.httpOptions);         
  }

  makeStripePayment(inputData:any): Observable<any> {         
    let input = JSON.stringify(inputData);
    console.log(input);    
    return this._http.post<any>(this.API_URL + 'make-stripe-payment', input, this.httpOptions);         
  }

  checkUserDets(inputData:any): Observable<any> {           
    let input = JSON.stringify(inputData);
    console.log(input);
    return this._http.post<any>(this.API_URL + 'checkUserDets', input, this.httpOptions);         
  }

  getUserNoteCount(inputData:any): Observable<any> {   
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json, text/plain, */*',
        'Content-Type':'application/json'
      })
    };    
    let input = JSON.stringify(inputData);
    console.log(input);    
    return this._http.post(this.API_URL + 'getUserNoteCount', input, httpOptions);         
  }

  getChatUserList(inputData:any): Observable<any> {   
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json, text/plain, */*',
        'Content-Type':'application/json'
      })
    };    
    let input = JSON.stringify(inputData);
    console.log(input);    
    return this._http.post(this.API_URL + 'getChatUserList', input, httpOptions);         
  }

  getUserChats(inputData:any): Observable<any> {   
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json, text/plain, */*',
        'Content-Type':'application/json'
      })
    };    
    let input = JSON.stringify(inputData);
    console.log(input);    
    return this._http.post(this.API_URL + 'getUserChats', input, httpOptions);         
  }

  getRecentChats(inputData:any): Observable<any> {   
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json, text/plain, */*',
        'Content-Type':'application/json'
      })
    };    
    let input = JSON.stringify(inputData);
    console.log(input);    
    return this._http.post(this.API_URL + 'getRecentChats', input, httpOptions);         
  }

  updateRead(inputData:any): Observable<any> {   
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json, text/plain, */*',
        'Content-Type':'application/json'
      })
    };    
    let input = JSON.stringify(inputData);
    console.log(input);    
    return this._http.post(this.API_URL + 'updateRead', input, httpOptions);         
  }

  saveUserChat(inputData:any): Observable<any> {   
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json, text/plain, */*',
        'Content-Type':'application/json'
      })
    };    
    let input = JSON.stringify(inputData);
    console.log(input);    
    return this._http.post(this.API_URL + 'saveUserChat', input, httpOptions);         
  }

  getGeoLoc(){
    return this._http.get<any>('https://ipinfo.io/json');
  }

  getCountryList(inputData:any): Observable<any> {   
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json, text/plain, */*',
        'Content-Type':'application/json'
      })
    };    
    let input = JSON.stringify(inputData);
    console.log(input);    
    return this._http.post<any>(this.API_URL + 'getCountryList', input, httpOptions);        
  }


  getIpAddress() {
    return this._http.get('https://api.ipify.org/?format=json');
  } 

  getGEOLocation(ip:any) {
    let url = "https://api.ipgeolocation.io/ipgeo?apiKey=b81cc74e124247a0b99438bc3c22f79c&ip="+ip+"&fields=geo"; 
    return this._http.get(url);
  }

  getLocation(ip:any): Observable<any> {        
    return this._http.get('https://api.bigdatacloud.net/data/country-by-ip?ip='+ip+'&localityLanguage=en&key=bdc_350a3c3203044e438716397e9abbfb4c');        
  }

  getXMAccURL(country:any): Observable<any> {  
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json, text/plain, */*',
        'Content-Type':'application/json'
      })
    };  

    let input = JSON.stringify({country:country});
    console.log(input);    
    return this._http.post<any>(this.API_URL + 'getXMAccURL', input, httpOptions);         
  }

  getTimezone(inputData:any): Observable<any> {   
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json, text/plain, */*',
        'Content-Type':'application/json'
      })
    };    
    let input = JSON.stringify(inputData);
    console.log(input);    
    return this._http.post<any>(this.API_URL + 'getTimezone', input, httpOptions);        
  }


}
