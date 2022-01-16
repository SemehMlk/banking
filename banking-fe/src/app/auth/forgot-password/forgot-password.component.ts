import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { fadeInUp400ms } from '../../../@vex/animations/fade-in-up.animation';
import icMail from '@iconify/icons-ic/twotone-mail';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'vex-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  animations: [fadeInUp400ms]
})
export class ForgotPasswordComponent implements OnInit {

  form = this.fb.group({
    email: [null, Validators.compose([Validators.required, Validators.email])],
  });

  icMail = icMail;

  constructor(
    private router: Router,
    private authService: AuthService,
    private snackbar: MatSnackBar,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
  }

  send() {
    this.form.valid?
    this.authService.forggotPassword(this.form.value).subscribe(res=>{
      this.router.navigate(['/login']);
      this.snackbar.open('demande envoyé avec  succès', 'Merci', {
        duration: 10000
      });
    }):    this.snackbar.open('Veuillez verifier votre email', 'Merci', {
      duration: 10000
    });;
  
  }
}
