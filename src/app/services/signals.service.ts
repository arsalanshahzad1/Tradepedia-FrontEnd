import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, Subject } from 'rxjs';
import { FormGroup } from '@angular/forms';


@Injectable({
  providedIn: 'root'
})
export class SignalsService {
  API_URL:string = environment.apiUrl;
  
  constructor(private _http : HttpClient) { }

  randomString() {
    let length:any=16;
    let chars:any="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$*_+-=:,.|";
    let result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

  login(user:Array<any>): Observable<any> {   
    //alert(robotID);        
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json, text/plain, */*',
        'Content-Type':'application/json'
      })
    };
        
    let input = JSON.stringify(user);
    console.log(input);
    return this._http.post<any>('https://api.analyzzerai.com/user/login', input, httpOptions);        
  }

  register(user:any): Observable<any> {   
    //alert(robotID);            
    const httpOptions = {
      headers: new HttpHeaders({        
        'Accept': 'application/json, text/plain, */*',
			  'Content-Type':'application/json',            
			  'Authorization':'ga_cli_anlzzr:0b053cc9-5dad-46a8-a3ad-d24e9c09665f'        
      })
    };
    console.log(httpOptions);
        
    let input = JSON.stringify(user);
    console.log(input);
    return this._http.post('https://api.analyzzerai.com/user/registerapp', input, httpOptions);        
  }

  updatepassword(user:any): Observable<any> {   
    //alert(robotID);        
    const httpOptions = {
      headers: new HttpHeaders({
        //'Content-Type':'multipart/form-data',				
				'Accept': 'application/json, text/plain, */*',
				'Authorization': 'ga_cli_anlzzr:0b053cc9-5dad-46a8-a3ad-d24e9c09665f'
      })
    };
            
    //let input = JSON.stringify(user);
    //console.log(input);
    
    let formData:any = new FormData();
    formData.append('currentUsername', user['currentUsername']);
    formData.append('currentPassword', user['currentPassword']);
    formData.append('password', user['password']);
    console.log(formData);

    return this._http.post('https://api.analyzzerai.com/user/updatepassword', formData, httpOptions);        
  }

  forgotPassword(userID:any): Observable<any> {   
    //alert(userID);        
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json, text/plain, */*',
			  'Authorization':'ga_cli_anlzzr:0b053cc9-5dad-46a8-a3ad-d24e9c09665f'
      })
    };
        
    //let input = JSON.stringify(userID);
    console.log(userID);
    return this._http.get('https://api.analyzzerai.com/user/resetpassword/'+userID, httpOptions);        
  }

  saveUser(userDet:Array<any>): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        //Authorization: 'my-auth-token'
      })
    };
    let input = JSON.stringify(userDet);
    console.log(input);
    return this._http.post<any>(this.API_URL + 'saveUser', input, httpOptions);      
  }

  updateUser(userDet:Array<any>): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        //Authorization: 'my-auth-token'
      })
    };
    let input = JSON.stringify(userDet);
    console.log(input);
    return this._http.post<any>(this.API_URL + 'updateUser', input, httpOptions);      
  }

  getUserProfile(inputData:any): Observable<any> {   
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json, text/plain, */*',
        'Content-Type':'application/json'
      })
    };    
    let input = JSON.stringify(inputData);
    console.log(input);    
    return this._http.post<any>(this.API_URL + 'getUserProfile', input, httpOptions);        
  }

  resendVerifyMail(inputData:any): Observable<any> {   
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json, text/plain, */*',
        'Content-Type':'application/json'
      })
    };    
    let input = JSON.stringify(inputData);
    console.log(input);    
    return this._http.post<any>(this.API_URL + 'resendVerifyMail', input, httpOptions);
  }

  checkUserStatus(inputData:any): Observable<any> {   
    const httpOptions:any = {
      headers: new HttpHeaders({
        'Accept': 'application/json, text/plain, */*',
        'Content-Type':'application/json',
        'Authorization':"ga_cli_anlzzr:0b053cc9-5dad-46a8-a3ad-d24e9c09665f"		  
      })         
    };           
    return this._http.get('https://api.analyzzerai.com/user/find/'+inputData, httpOptions);         
  }

  reActiveUser2(inputData:any): Observable<any> {   
    const httpOptions:any = {
      headers: new HttpHeaders({
        'Accept': 'application/json, text/plain, */*',
        //'Content-Type':'application/json',
        'Authorization':"ga_cli_anlzzr:0b053cc9-5dad-46a8-a3ad-d24e9c09665f"		  
      }),
      //observe: "response"         
    };      
    //let input = JSON.stringify(inputData);
    //console.log(input);  
    //alert('https://api.analyzzerai.com/user/reactivate?username='+inputData['username']+'&password='+inputData['password']);
    return this._http.post('https://api.analyzzerai.com/user/reactivate?username='+inputData['username']+'&password='+inputData['password'], httpOptions);         
    //return this._http.get('https://api.analyzzerai.com/user/find/'+inputData['username'], httpOptions);             
  }

  deActiveUser(inputData:any): Observable<any> {   
    const httpOptions:any = {
      headers: new HttpHeaders({
        'Accept': 'application/json, text/plain, */*',
        //'Content-Type':'application/json',
        'Authorization':"ga_cli_anlzzr:0b053cc9-5dad-46a8-a3ad-d24e9c09665f"		  
      })         
    };           
    return this._http.get('https://api.analyzzerai.com/user/deactivate/'+inputData, httpOptions);         
  }

  reActiveUser(inputData:any): Observable<any> {   
    //alert(robotID);        
    const httpOptions = {
      headers: new HttpHeaders({
        //'Content-Type':'multipart/form-data',				
				'Accept': 'application/json, text/plain, */*',
				'Authorization': 'ga_cli_anlzzr:0b053cc9-5dad-46a8-a3ad-d24e9c09665f'
      })
    };              
    
    let formData:any = new FormData();
    formData.append('username', inputData['username']);
    formData.append('password', inputData['password']);    
    console.log(formData);

    return this._http.post('https://api.analyzzerai.com/user/reactivate', formData, httpOptions);        
  }

  userLogin(inputData:any): Observable<any> {   
    const httpOptions:any = {
      headers: new HttpHeaders({
        'Accept': 'application/json, text/plain, */*',
        'Content-Type':'application/json',
      }),
      observe: "response"      
    };      
    let input = JSON.stringify(inputData);
    console.log(input); 
    return this._http.post('https://api.analyzzerai.com/user/login', input, httpOptions);         
  }

  logout(token:any,username:any): Observable<any> {   
    //alert(robotID);        
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json, text/plain, */*',
			  'Content-Type':'application/json',
			  'Authorization':"Bearer "+token,
      })
    };        
    let input = JSON.stringify(httpOptions);
    console.log(input);
    localStorage.clear();
    return this._http.post<any>('https://api.analyzzerai.com/user/logout/'+username, input, httpOptions);        
  }

  getSymbolslist(token:any): Observable<any> {   
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization':"Bearer"+token,
			  'Accept': 'application/json, text/plain, */*',
			  'Content-Type':'application/json'
      })
    };    
    return this._http.get('https://api.analyzzerai.com/data/symbols');        
  }

  getTimeFrames(): Observable<any> {                
    return this._http.get('https://api.analyzzerai.com/data/timeframes');        
  }

  getToolsList(inputData:any): Observable<any> {   
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json, text/plain, */*',
        'Content-Type':'application/json'
      })
    };    
    let input = JSON.stringify(inputData);
    console.log(input);    
    return this._http.post(this.API_URL + 'getToolsList', input, httpOptions);         
  }

  getStrategies(token:any,lang:any): Observable<any> {      
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization':"Bearer "+token,
			  'Accept': 'application/json, text/plain, */*',
			  'Content-Type':'application/json'
      })
    };
    let sid=5;
    //alert('https://api.analyzzerai.com/strategies/retrievecached/'+sid+'&lang='+lang);
    //return this._http.get<any>('https://api.analyzzerai.com/strategies/retrievecached/'+sid,httpOptions); 
    return this._http.get<any>('https://api.analyzzerai.com/strategies/retrievecached/'+sid+'?lang='+lang,httpOptions); 
  }

  getStrategieDets(inputData:any): Observable<any> {   
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json, text/plain, */*',
        'Content-Type':'application/json'
      })
    };    
    let input = JSON.stringify(inputData);
    console.log(input);    
    return this._http.post(this.API_URL + 'getStrategieDets', input, httpOptions);         
  }

  saveProfile(inputData:any): Observable<any> {   
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json, text/plain, */*',
        'Content-Type':'application/json'
      })
    };    
    let input = JSON.stringify(inputData);
    console.log(input);    
    return this._http.post(this.API_URL + 'saveProfile', input, httpOptions);         
  }

  getSquawkList(inputData:any): Observable<any> {   
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json, text/plain, */*',
        'Content-Type':'application/json'
      })
    };    
    let input = JSON.stringify(inputData);
    console.log(input);    
    return this._http.post(this.API_URL + 'getSquawkList', input, httpOptions);         
  }

  getUserNoteDets(inputData:any): Observable<any> {   
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json, text/plain, */*',
        'Content-Type':'application/json'
      })
    };    
    let input = JSON.stringify(inputData);
    console.log(input);    
    return this._http.post(this.API_URL + 'getUserNoteDets', input, httpOptions);         
  }

  saveNotification(inputData:any): Observable<any> {   
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json, text/plain, */*',
        'Content-Type':'application/json'
      })
    };    
    let input = JSON.stringify(inputData);
    console.log(input);    
    return this._http.post(this.API_URL + 'saveNotification', input, httpOptions);         
  }


  getProfileList(inputData:any): Observable<any> {   
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json, text/plain, */*',
        'Content-Type':'application/json'
      })
    };    
    let input = JSON.stringify(inputData);
    console.log(input);    
    return this._http.post(this.API_URL + 'getProfileList', input, httpOptions);         
  }

  getSubscriptDets(inputData:any): Observable<any> {   
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json, text/plain, */*',
        'Content-Type':'application/json'
      })
    };    
    let input = JSON.stringify(inputData);
    console.log(input);    
    return this._http.post(this.API_URL + 'getSubscriptDets', input, httpOptions);         
  }

  enableAutoRenewal(inputData:any): Observable<any> {   
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json, text/plain, */*',
        'Content-Type':'application/json'
      })
    };    
    let input = JSON.stringify(inputData);
    console.log(input);    
    return this._http.post(this.API_URL + 'enableAutoRenewal', input, httpOptions);         
  }

  cancelSubPlan(inputData:any): Observable<any> {   
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json, text/plain, */*',
        'Content-Type':'application/json'
      })
    };    
    let input = JSON.stringify(inputData);
    console.log(input);    
    return this._http.post(this.API_URL + 'cancelSubPlan', input, httpOptions);         
  }

  enableToolsAutoRenewal(inputData:any): Observable<any> {   
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json, text/plain, */*',
        'Content-Type':'application/json'
      })
    };    
    let input = JSON.stringify(inputData);
    console.log(input);    
    return this._http.post(this.API_URL + 'enableToolsAutoRenewal', input, httpOptions);         
  }

  cancelSubTools(inputData:any): Observable<any> {   
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json, text/plain, */*',
        'Content-Type':'application/json'
      })
    };    
    let input = JSON.stringify(inputData);
    console.log(input);    
    return this._http.post(this.API_URL + 'cancelSubTools', input, httpOptions);         
  }

  setDefaultProfile(inputData:any): Observable<any> {   
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json, text/plain, */*',
        'Content-Type':'application/json'
      })
    };    
    let input = JSON.stringify(inputData);
    console.log(input);    
    return this._http.post(this.API_URL + 'setDefaultProfile', input, httpOptions);         
  }

  enableProfileNotification(inputData:any): Observable<any> {   
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json, text/plain, */*',
        'Content-Type':'application/json'
      })
    };    
    let input = JSON.stringify(inputData);
    console.log(input);    
    return this._http.post(this.API_URL + 'enableProfileNotification', input, httpOptions);         
  }

  enableAutoProfileNotification(inputData:any): Observable<any> {   
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json, text/plain, */*',
        'Content-Type':'application/json'
      })
    };    
    let input = JSON.stringify(inputData);
    console.log(input);    
    return this._http.post(this.API_URL + 'enableAutoProfileNotification', input, httpOptions);         
  }

  profileDets(inputData:any): Observable<any> {   
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json, text/plain, */*',
        'Content-Type':'application/json'
      })
    };    
    let input = JSON.stringify(inputData);
    console.log(input);    
    return this._http.post(this.API_URL + 'profileDets', input, httpOptions);         
  }

  delProfile(inputData:any): Observable<any> {   
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json, text/plain, */*',
        'Content-Type':'application/json'
      })
    };    
    let input = JSON.stringify(inputData);
    console.log(input);    
    return this._http.post(this.API_URL + 'delProfile', input, httpOptions);         
  }

  getAdminProfiles(model:any,lang:any): Observable<any> {   
    const httpOptions = {
      headers: new HttpHeaders({        
        'Accept': 'application/json, text/plain, */*',
			  'Content-Type':'application/json'						  
      })
    };     
    
    let input = JSON.stringify({model:model,lang:lang});
    console.log(input);
    return this._http.post(this.API_URL + 'listAdminProfile', input, httpOptions);        
  }

  addAdminProfile(inputData:any): Observable<any> {              
    const httpOptions = {
      headers: new HttpHeaders({        
        'Accept': 'application/json, text/plain, */*',
			  'Content-Type':'application/json'						  
      })
    };     
    let input:any = JSON.stringify(inputData);  
    console.log(input);  
    return this._http.post<any>(this.API_URL + 'addAdminProfile', input, httpOptions);        
  }

  
  getPendSignals(signal_data:any, token:any): Observable<any> {   
    //alert(profileID);            
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization':token,
			  'Accept': 'application/json, text/plain, */*',
			  'Content-Type':'application/json'			
      })
    };   
    
    //console.log(httpOptions);
    //console.log(signal_data);
    return this._http.post('https://api.analyzzerai.com/swing/signalswaiting', signal_data, httpOptions);        
  }

  getActiveSignals(signal_data:any, token:any): Observable<any> {   
    //alert(profileID);            
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization':token,
			  'Accept': 'application/json, text/plain, */*',
			  'Content-Type':'application/json'			
      })
    };   
    
    //console.log(httpOptions);
    //console.log(signal_data);
    return this._http.post('https://api.analyzzerai.com/swing/signalsactive', signal_data, httpOptions);        
  }

  getCurrentPrice(signal_data:any, token:any): Observable<any> {   
    //alert(robotID);            
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization':token,
			  'Accept': 'application/json, text/plain, */*',
			  'Content-Type':'application/json'			
      })
    };   
    
    //console.log(httpOptions);
    //console.log(signal_data);
    return this._http.post('https://api.analyzzerai.com/data/current', signal_data, httpOptions);        
  }  

  getSignalDets(uid:any, token:any, lang:any): Observable<any> {   
    //alert(robotID);            
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization':token,
			  'Accept': 'application/json, text/plain, */*',
			  'Content-Type':'application/json'			
      })
    };       
    return this._http.get('https://api.analyzzerai.com/swing/signal?uid='+uid+'&lang='+lang, httpOptions);        
  }

  autoProfileDets(inputData:any): Observable<any> {   
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json, text/plain, */*',
        'Content-Type':'application/json'
      })
    };    
    let input = JSON.stringify(inputData);
    console.log(input);    
    return this._http.post(this.API_URL + 'autoProfileDets', input, httpOptions);         
  }

  getHitMapList(): Observable<any> {   
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization':"ga_cli_anlzzr:0b053cc9-5dad-46a8-a3ad-d24e9c09665f",
			  'Accept': 'application/json, text/plain, */*'			  
      })
    };    
    return this._http.get('https://api.analyzzerai.com/cryptoreport/heatmap?limit=18', httpOptions);        
  }

  getMarkCapList(): Observable<any> {   
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization':"ga_cli_anlzzr:0b053cc9-5dad-46a8-a3ad-d24e9c09665f",
			  'Accept': 'application/json, text/plain, */*'			  
      })
    };    
    return this._http.get('https://api.analyzzerai.com/cryptoreport/performance?limit=10&bestPerformers=false', httpOptions);        
  }

  getBestPerformList(): Observable<any> {   
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization':"ga_cli_anlzzr:0b053cc9-5dad-46a8-a3ad-d24e9c09665f",
			  'Accept': 'application/json, text/plain, */*'			  
      })
    };    
    return this._http.get('https://api.analyzzerai.com/cryptoreport/performance?limit=10&bestPerformers=true', httpOptions);        
  }

  getMarkIndList(symbols:any,timeframe:any): Observable<any> {   
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization':"ga_cli_anlzzr:0b053cc9-5dad-46a8-a3ad-d24e9c09665f",
			  'Accept': 'application/json, text/plain, */*'			  
      })
    };    
    return this._http.get('https://api.analyzzerai.com/cryptoreport/indicators?symbols='+symbols+'&timeframe='+timeframe, httpOptions);        
  }

  setLastNoteID(inputData:any): Observable<any> {   
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json, text/plain, */*',
        'Content-Type':'application/json'
      })
    };    
    let input = JSON.stringify(inputData);
    console.log(input);    
    return this._http.post(this.API_URL + 'setLastNoteID', input, httpOptions);         
  }








  mustMatch(controlName: string, matchingControlName: string){
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
          // return if another validator has already found an error on the matchingControl
          return;
      }

      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
          matchingControl.setErrors({ mustMatch: true });
      } else {
          matchingControl.setErrors(null);
      }
    }
  }

  updatePayment(paymentDets:any): Observable<any> {   
    //alert(robotID);        
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':'application/json',				
				'Accept': 'application/json, text/plain, */*',
				'Authorization': 'ga_cli_anlzzr:0b053cc9-5dad-46a8-a3ad-d24e9c09665f'
      })
    };
        
    let input = JSON.stringify(paymentDets);
    console.log(input);
    return this._http.post('https://api.analyzzerai.com/payment/add', input, httpOptions);        
  }

  getUserExpiry(userID:any): Observable<any> {   
    //alert(robotID);        
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':'application/json',				
				'Accept': 'application/json, text/plain, */*',
				'Authorization': 'ga_cli_anlzzr:0b053cc9-5dad-46a8-a3ad-d24e9c09665f'
      })
    };
        
    //let input = JSON.stringify(paymentDets);
    //console.log(input);    
    return this._http.post('https://api.analyzzerai.com/payment/last/'+userID, httpOptions);        
  }

  getUserSignalStatus(inputData:any): Observable<any> {   
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json, text/plain, */*',
        'Content-Type':'application/json'
      })
    };    
    let input = JSON.stringify(inputData);
    console.log(input);    
    return this._http.post(this.API_URL + 'getUserSignalStatus', input, httpOptions);         
  }


}
