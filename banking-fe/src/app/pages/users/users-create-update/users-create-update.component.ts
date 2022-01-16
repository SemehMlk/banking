import { Component, Inject, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import icClose from '@iconify/icons-ic/twotone-close';
import { NgxSpinnerService } from 'ngx-spinner';
import icBaselineNotInterested from '@iconify/icons-ic/baseline-not-interested';

@Component({
  selector: 'vex-users-create-update',
  templateUrl: './users-create-update.component.html',
  styleUrls: ['./users-create-update.component.scss']
})
export class UsersCreateUpdateComponent implements OnInit {

  editorConfig: any ;
  static id = 100;
  files: File[] = [];
  image: any;
  form: FormGroup;
  mode: 'create' | 'update' = 'create';
  icClose = icClose;
  imageUrl: any;
  icBaselineNotInterested = icBaselineNotInterested;
  active: any = false;
  restaurants: any = [];

  constructor( @Inject(MAT_DIALOG_DATA) public defaults: any,
  private dialogRef: MatDialogRef<UsersCreateUpdateComponent>,
  private fb: FormBuilder,
  // public service: ApiService,
  private spinner: NgxSpinnerService,
  private snackbar: MatSnackBar) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      masterCode: '',
      firstName: '',
      secondName: '',
      email:'',
      telephone:'',
      password:'',
      passwordConfirm:'',
      role:''
    });
  }

  save(){}
}
