import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { UsuarioModel } from '../../models/usuario.model';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  usuario: UsuarioModel = new UsuarioModel();
  recordarUsuario = false;

  constructor( private auth: AuthService,
               private router: Router) { }

  ngOnInit() {

    if(localStorage.getItem('email')){
      this.usuario.email = localStorage.getItem('email');
      this.recordarUsuario = true;
    }

  }

  login(data: NgForm){

    if(data.invalid) { return; }
    
    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Espere por favor...'
    })
    Swal.showLoading();

    this.auth.loging(this.usuario)
      .subscribe( res => {
        
        Swal.close();
        Swal.fire({
          icon: 'success',
          title: 'Sesion iniciada',
          showConfirmButton: false,
          timer: 1500
        })

        if(this.recordarUsuario){
          localStorage.setItem('email', this.usuario.email)
        }

        this.router.navigateByUrl('/home');

      }, (err) => {

        Swal.fire({
          icon: 'error',
          title: 'Error al autenticar',
          text: 'Datos invalidos'
        })

      } )
  
    }

}
