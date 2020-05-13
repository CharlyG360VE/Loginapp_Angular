import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioModel } from '../models/usuario.model';
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url: string = 'url_firebase_connect';
  private api_key: string = 'api_key_firebase';
  userToken: string;

  root(User: UsuarioModel, data:string){

    const URL_API: string = `${this.url}${data}`;
    const AUTH_DATA = {
      ...User,
      returnSecureToken: true
    }

    return this.http.post(URL_API, AUTH_DATA);

  }
  
  constructor( private http: HttpClient ) {
    this.readToken();
  }

  loging(user: UsuarioModel){
    return this.root(user, `signInWithPassword?key=${this.api_key}`)
    .pipe( 
      map( resp => {
        this.saveToken(resp['idToken'])
        return resp['idToken']
      } ) 
    )
  }

  nuevoUsuario(user: UsuarioModel){
    return this.root(user, `signUp?key=${this.api_key}`)
      .pipe( 
        map( resp => {
          this.saveToken(resp['idToken'])
          return resp['idToken']
        } ) 
      )
  }

  logout(){
    localStorage.removeItem('token');
  }

  private saveToken( idToken: string ){

    this.userToken = idToken
    localStorage.setItem('token', idToken);

    let hoy = new Date();
    
    hoy.setSeconds(3600);
    localStorage.setItem('expira', hoy.getTime().toString());
  
  }

  readToken(){
    if( localStorage.getItem('token') ){
      this.userToken = localStorage.getItem('token');
    } else {
      this.userToken = '';
    }

    return this.userToken;
  }

  Authenticated(): boolean{

    const expira = Number(localStorage.getItem('expira'));
    const expiraDate = new Date();
    expiraDate.setTime(expira);

    if(this.userToken.length < 2){
      return false;
    }

    if( expiraDate > new Date() ){
      return true;
    } else {
      return false;
    }

  }

}
