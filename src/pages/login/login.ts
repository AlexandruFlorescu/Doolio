import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { User } from '../../models/user';
import { RegisterPage } from '../register/register';
import { AngularFireAuth } from 'angularfire2/auth';
import { ProfilePage } from '../profile/profile';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  user = {} as User;

  constructor(private afAuth:AngularFireAuth, public navCtrl: NavController, public navParams: NavParams, private toast: ToastController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  ionViewWillLoad(){
    // already logged in guard
    this.afAuth.authState.subscribe(data=> {
      if(data && data.email && data.uid)
        {
          this.toast.create({
            message: `Welcome Back, ${data.email}!`,
            duration: 2000,
            position: 'top'
          }).present();
          this.navCtrl.setRoot(ProfilePage);

        }

    })
  }

  async loginUser(){
    try {
      const result = this.afAuth.auth.signInWithEmailAndPassword(this.user.email, this.user.password);
      this.navCtrl.setRoot(ProfilePage);
    }
    catch ( e ) {
      console.error(e);
    }
  }

  goToRegister(){
    this.navCtrl.push(RegisterPage);
  }

}
