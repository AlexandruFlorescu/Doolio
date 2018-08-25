import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { User } from '../../models/user';
import { AngularFireAuth } from 'angularfire2/auth';
import { ProfilePage } from '../profile/profile';

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  user = {} as User;

  constructor(private afAuth: AngularFireAuth, public navCtrl: NavController, public navParams: NavParams, private toast: ToastController) {
  }

  ionViewWillLoad(){
    // already logged in guard
    this.afAuth.authState.subscribe(data=> {
      if(data)
        {

          this.navCtrl.setRoot(ProfilePage);
          // this.toast.create({
          //   message: `Welcome Back, ${data.email}!`,
          //   duration: 2000,
          //   position: 'top'
          // }).present();
        }
    })
  }
  async registerUser(){
    try{
      const result = await this.afAuth.auth.createUserWithEmailAndPassword(this.user.email, this.user.password);
      console.log(result);
    }
    catch ( e ) {
      console.error(e);
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

}
