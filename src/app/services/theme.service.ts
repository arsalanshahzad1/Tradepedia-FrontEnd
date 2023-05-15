import {BehaviorSubject, Observable} from 'rxjs';
import {Injectable} from '@angular/core';


@Injectable()

export class ThemeService {
  
  get theme(): any {
    return document.documentElement.getAttribute('theme');
  }

  set theme(name: any) {
    document.documentElement.setAttribute('theme', name);
  }
    
}
