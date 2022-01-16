import { Component, Inject, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import icClose from '@iconify/icons-ic/twotone-close';
import { NgxSpinnerService } from 'ngx-spinner';
import icBaselineNotInterested from '@iconify/icons-ic/baseline-not-interested';

@Component({
  selector: 'vex-caution-create-update',
  templateUrl: './caution-create-update.component.html',
  styleUrls: ['./caution-create-update.component.scss']
})
export class CautionCreateUpdateComponent implements OnInit {

  editorConfig: any ;
  static id = 100;
  files: File[] = [];
  image: any;
  formFournisseur: FormGroup;
  formCaution: FormGroup;
  mode: 'create' | 'update' = 'create';
  icClose = icClose;
  imageUrl: any;
  icBaselineNotInterested = icBaselineNotInterested;
  active: any = false;
  restaurants: any = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public defaults: any,
    private dialogRef: MatDialogRef<CautionCreateUpdateComponent>,
    private fb: FormBuilder,
    private snackbar: MatSnackBar,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.formFournisseur = this.fb.group({
      nbrTuneps: '',
      nbrCmpt: '',
      denomination:'',
      demandeur:'',
      raison:'',
      gerant:'',
      code:'',
      telephone:'',
      address:'',


      guaranteeNumber: '',
      guaranteeType: '',
      liabilityRatio: '',
      liabilityAmountCurrencyID: '',
      liabilityAmountFullTxt: '',
      deliveryCondition: '',
      receiptNumber: '',
      receiptDate: '',
      postalRelationAddress: '',
      chargePersonName: '',
      description: '',
      startDate: '',
      endDate: '',
      validity: '',
    });

    this.formCaution = this.fb.group({
      nc: '',
      typeCaution: '',
      image: '',
      percent: '',
      montant: '',
      montantLettre: '',
      typeReception: '',
      nbrBanque: '',
      dateRecu: '',
      adresse: '',
      responsable: '',
      description: '',
      telephone: '',
      startDate: '',
      endDate: '',
      validity: '',
    });
  }


  save(){}
}
