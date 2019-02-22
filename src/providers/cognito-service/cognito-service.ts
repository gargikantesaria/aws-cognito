import { Injectable } from '@angular/core';
import * as AWSCognito from "amazon-cognito-identity-js";

@Injectable()
export class CognitoServiceProvider {

  POOL_DATA = {
    UserPoolId: "YOUR_COGNITO_USER_POOL_ID",
    ClientId: "YOUR_COGNITO_CLIENT_ID"
  };

  signUp(userData) {
    return new Promise((resolved, reject) => {
      const userPoolData = new AWSCognito.CognitoUserPool(this.POOL_DATA);

      let userAttribute = [];
      userAttribute.push(
        new AWSCognito.CognitoUserAttribute({ Name: "email", Value: userData.email })
      );

      userPoolData.signUp(userData.email, userData.password, userAttribute, null, function (err, result) {
        if (err) {
          reject(err);
        } else {
          resolved(result);
        }
      });
    });
  }

  confirmUser(verificationCode, userName) {
    return new Promise((resolved, reject) => {
      const userPoolData = new AWSCognito.CognitoUserPool(this.POOL_DATA);

      const cognitoUser = new AWSCognito.CognitoUser({
        Username: userName,
        Pool: userPoolData
      });

      cognitoUser.confirmRegistration(verificationCode, true, function (err, result) {
        if (err) {
          reject(err);
        } else {
          resolved(result);
        }
      });
    });
  }

  authenticate(userData) {
    return new Promise((resolved, reject) => {
      const userPoolData = new AWSCognito.CognitoUserPool(this.POOL_DATA);

      const authDetails = new AWSCognito.AuthenticationDetails({
        Username: userData.email,
        Password: userData.password
      });

      const cognitoUser = new AWSCognito.CognitoUser({
        Username: userData.email,
        Pool: userPoolData
      });

      cognitoUser.authenticateUser(authDetails, {
        onSuccess: result => {
          resolved(result);
        },
        onFailure: err => {
          reject(err);
        },
        newPasswordRequired: userAttributes => {
          userAttributes.email = userData.email;
          delete userAttributes.email_verified;

          cognitoUser.completeNewPasswordChallenge(userData.password, userAttributes, {
            onSuccess: function (result) { },
            onFailure: function (error) {
              reject(error);
            }
          });
        }
      });
    });
  }

  forgotPassword(userData) {
    return new Promise((resolve, reject) => {
      const userPoolData = new AWSCognito.CognitoUserPool(this.POOL_DATA);

      const cognitoUser = new AWSCognito.CognitoUser({
        Username: userData.email,
        Pool: userPoolData
      });

      cognitoUser.forgotPassword({
        onSuccess: result => {
          resolve(result);
        },
        onFailure: err => {
          reject(err);
        }
      })
    })
  }

  confirmPassword(verificationCode, password, email) {
    return new Promise((resolve, reject) => {
      const userPoolData = new AWSCognito.CognitoUserPool(this.POOL_DATA);

      const cognitoUser = new AWSCognito.CognitoUser({
        Username: email,
        Pool: userPoolData
      });

      cognitoUser.confirmPassword(verificationCode, password, {
        onSuccess: function (result) {
          resolve(result);
        },
        onFailure: err => {
          reject(err);
        }
      })
    })
  }
}
