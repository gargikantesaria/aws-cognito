import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CognitoServiceProvider } from '../../providers/cognito-service/cognito-service';
import { HomePage } from '../home/home';
import { ToastProvider } from '../../providers/toast/toast';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  loginForm: FormGroup;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public CognitoSerive: CognitoServiceProvider, public alertController: AlertController,
    private toastController: ToastProvider) {
    this.loginForm = new FormGroup({
      'email': new FormControl('', Validators.required),
      'password': new FormControl('', Validators.required)
    })
  }

  login() {
    this.CognitoSerive.authenticate(this.loginForm.value).then((res: any) => {
      console.log("Response is", res.idToken.jwtToken);
      (res.idToken.jwtToken) ? this.toastController.successToast("You are successfully logged in.") : null;
    }).catch((err) => {
      this.toastController.errorToast(err.message);
    })
  }

  openPage() {
    this.navCtrl.setRoot(HomePage);
  }

  forgotPassword() {
    this.navCtrl.setRoot('ForgotPasswordPage');
  }
}
