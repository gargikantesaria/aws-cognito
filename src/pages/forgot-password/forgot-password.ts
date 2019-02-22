import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { CognitoServiceProvider } from '../../providers/cognito-service/cognito-service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoginPage } from '../login/login';
import { ToastProvider } from '../../providers/toast/toast';

@IonicPage()
@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html',
})
export class ForgotPasswordPage {

  forgotPasswordForm: FormGroup;
  constructor(public navCtrl: NavController, public navParams: NavParams, public CognitoSerive: CognitoServiceProvider,
    public alertController: AlertController, private toastController: ToastProvider) {
    this.forgotPasswordForm = new FormGroup({
      'email': new FormControl('', Validators.required)
    })
  }

  sendEmail() {
    this.CognitoSerive.forgotPassword(this.forgotPasswordForm.value).then(() => {
      this.promptVerificationCode(this.forgotPasswordForm.value.email)
    }).catch((err) => {
      this.toastController.errorToast(err.message);
    })
  }

  promptVerificationCode(email) {
    let alert = this.alertController.create({
      title: "Enter Verfication Code",
      inputs: [
        {
          name: "VerificationCode",
          placeholder: "Verification Code"
        }, {
          name: "changePassword",
          placeholder: "changePassword",
          type: 'password'
        }
      ],
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          handler: () => {
            this.toastController.successToast("Cancel clicked");
          }
        },
        {
          text: "Verify",
          handler: data => {
            this.verifyUser(data.VerificationCode, data.changePassword, email);
          }
        }
      ]
    });
    alert.present();
  }

  verifyUser(verificationCode, password, email) {
    this.CognitoSerive.confirmPassword(verificationCode, password, email).then(() => {
      this.toastController.successToast("Your password has been changed successfully.");
      this.openPage();
    }).catch((error) => {
      this.toastController.errorToast(error.message);
    })
  }

  openPage() {
    this.navCtrl.setRoot(LoginPage);
  }
}
