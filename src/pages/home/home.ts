import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { CognitoServiceProvider } from '../../providers/cognito-service/cognito-service';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { LoginPage } from '../login/login';
import { ToastProvider } from '../../providers/toast/toast';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  email: string;
  password: string;
  registerForm: FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertController: AlertController, public CognitoService: CognitoServiceProvider, private toastController: ToastProvider) {
    this.registerForm = new FormGroup({
      'email': new FormControl('', Validators.required),
      'password': new FormControl('', [Validators.required, Validators.minLength(8)]),
      'verificationcode': new FormControl('')
    })
  }

  register() {
    this.CognitoService.signUp(this.registerForm.value).then(res => {
      this.promptVerificationCode();
    }).catch((error) => {
      this.toastController.errorToast(error.message);
    })
  }

  promptVerificationCode() {
    let alert = this.alertController.create({
      title: "Enter Verfication Code",
      inputs: [
        {
          name: "VerificationCode",
          placeholder: "Verification Code"
        }
      ],
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          handler: () => { }
        },
        {
          text: "Verify",
          handler: data => {
            this.verifyUser(data.VerificationCode, '');
          }
        }
      ]
    });
    alert.present();
  }

  promptVerificationCodeWithEmail() {
    let alert = this.alertController.create({
      title: "Enter Verfication Code",
      inputs: [
        {
          name: "VerificationCode",
          placeholder: "Verification Code"
        },
        {
          name: "VerificationEmail",
          placeholder: "Email"
        }
      ],
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          handler: () => { }
        },
        {
          text: "Verify",
          handler: data => {
            this.verifyUser(data.VerificationCode, data.VerificationEmail);
          }
        }
      ]
    });
    alert.present();
  }

  verifyUser(verificationCode, email) {
    (email) ? this.registerForm.value.email = email : null;
    this.CognitoService.confirmUser(verificationCode, this.registerForm.value.email).then(res => {
      this.toastController.successToast(res);
      this.openPage();
    }).catch((error) => {
      this.toastController.errorToast(error.message);
    })
  }

  openPage() {
    this.navCtrl.setRoot(LoginPage);
  }
}