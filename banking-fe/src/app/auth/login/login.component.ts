import { environment } from './../../../environments/environment';
import { AuthService } from '../services/auth.service';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import icVisibility from '@iconify/icons-ic/twotone-visibility';
import icVisibilityOff from '@iconify/icons-ic/twotone-visibility-off';
import { fadeInUp400ms } from '../../../@vex/animations/fade-in-up.animation';


@Component({
  selector: 'vex-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    fadeInUp400ms
  ]
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  appName = '';
  errorMessage = 'Veuillez remplir le formulaire correctement';
  inputType = 'password';
  visible = false;

  icVisibility = icVisibility;
  icVisibilityOff = icVisibilityOff;

  constructor(private router: Router,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private snackbar: MatSnackBar,
    private authService: AuthService
  ) {
    this.appName = environment.appName;
    if (this.authService.isLoggedIn == true) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.form = this.fb.group({
      'email': [null, Validators.compose([Validators.required, Validators.email])],
      'password': [null, Validators.compose([Validators.required, Validators.minLength(6)])]
    });
  }

  send() {
    if (this.form.valid) {
      this.authService.signIn(this.form.value).subscribe((res: any) => {
        if (res && res.user) {
          localStorage.setItem('currentUser', JSON.stringify(res.user))
          localStorage.setItem('DGyuj876VBN', res.access_token);
          this.authService.publishUser(res.user);
          localStorage.setItem('abc', '2almpXrtb');
          this.authService.publishRole('2almpXrtb');
          this.router.navigate(['/']);
          this.snackbar.open('connexion avec  succès', 'Merci', {
            duration: 10000
          });
        } else {
          this.snackbar.open('Une erreur s\'est produite lors du traitement de votre demande', 'ok', {
            duration: 10000
          });
        }

      }, (e) => {
        this.snackbar.open('Vous n\'êtes pas autorisé', 'oooops!', {
          duration: 10000
        });
      })
    } else {

      this.snackbar.open('Veuillez remplir le formulaire correctement', 'Merci', {
        duration: 10000
      });
    }





  }

  toggleVisibility() {
    if (this.visible) {
      this.inputType = 'password';
      this.visible = false;
      this.cd.markForCheck();
    } else {
      this.inputType = 'text';
      this.visible = true;
      this.cd.markForCheck();
    }
  }
}
