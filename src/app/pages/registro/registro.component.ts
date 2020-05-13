import { Component, OnInit } from '@angular/core';
import { UsuarioModel } from '../../models/usuario.model';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  usuario: UsuarioModel = new UsuarioModel();
  recordarUsuario = false;

  constructor( private auth: AuthService,
               private router: Router) { }

  ngOnInit() { }

  onSubmit(data: NgForm){

    if(data.invalid){ return; }

    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Espere por favor...'
    })
    Swal.showLoading();

    this.auth.nuevoUsuario(this.usuario)
      .subscribe( resp => {
        
        Swal.close();
        Swal.fire({
          icon: 'success',
          title: 'Te has registrado satisfactoriamente.',
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
