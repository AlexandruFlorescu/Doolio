import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { ProfilePage } from '../profile/profile';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, private afAuth: AngularFireAuth, private toast: ToastController) {

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

}
