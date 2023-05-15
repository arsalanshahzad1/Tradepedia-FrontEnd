import { AbstractControl, ValidationErrors } from "@angular/forms"

export const PasswordStrengthValidator = function (control: AbstractControl): ValidationErrors | null {

  let value: string = control.value || '';

  if (!value) {
    return null
  }
  let valArr:any=[];
  let chk:any=0;

  let upperCaseCharacters = /[A-Z]+/g
  if (upperCaseCharacters.test(value) === false) {
    //return { passwordStrength: `text has to contine Upper case characters,current value ${value}` };
    //return { passwordStrength: `Upper case characters missing` };
    //return { passwordStrength: 'Upper' };
    valArr.push('Upper');
  } else {
    chk++;
    valArr.push('');
  }

  let lowerCaseCharacters = /[a-z]+/g
  if (lowerCaseCharacters.test(value) === false) {
    //return { passwordStrength: `text has to contine lower case characters,current value ${value}` };
    //return { passwordStrength: `Lower case characters missing` };
    //return { passwordStrength: 'Lower' };
    valArr.push('Lower');
  } else {
    chk++;
    valArr.push('');
  }


  let numberCharacters = /[0-9]+/g
  if (numberCharacters.test(value) === false) {
    //return { passwordStrength: `text has to contine number characters,current value ${value}` };
    //return { passwordStrength: `Number characters missing` };
    //return { passwordStrength: 'Number' };
    valArr.push('Number');
  } else {
    chk++;
    valArr.push('');
  }

  let specialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/
  if (specialCharacters.test(value) === false) {
    //return { passwordStrength: `text has to contine special character,current value ${value}` };
    //return { passwordStrength: `Special characters missing` };
    //return { passwordStrength: 'Special' };
    valArr.push('Special');
  } else {
    chk++;
    valArr.push('');
  }
  //return null;
  if(chk==4){
    return null;
  } else {
    return { passwordStrength: valArr };
  }
  
}