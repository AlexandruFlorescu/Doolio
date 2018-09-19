import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, ToastController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { FirestorageProvider } from '../../providers/firestorage/firestorage';
import { ChangePictureModalPage } from '../change-picture-modal/change-picture-modal';
import { AngularFireAuth } from 'angularfire2/auth';
import { LoginPage } from '../login/login';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  // profile = { } as Profile;
  // profile: any;

  myProfile = {image:"https://via.placeholder.com/350x150", fitnessPoints:0, money:0, treatPoints: 0};
  new = true;
  constructor(  public navCtrl: NavController, public navParams: NavParams, public fsp: FirestorageProvider, public modalCtrl: ModalController, public afAuth: AngularFireAuth, public toastCtrl: ToastController) {
  }


    ionViewWillLoad(){
        // already logged in guard
        this.afAuth.authState.subscribe(data=> {
          if(data == null)
            this.navCtrl.setRoot(LoginPage)
          else
          {
              this.fetchProfile();
              // if(this.new == true && this.myProfile.username == null)

          }
      })
    }

  roundNumber(nr) {
    return Math.round(nr * 100)/100;
  }

  fetchProfile(){
    this.fsp.fetchProfile().then(()=>{
      console.log('fetched');

      if(this.fsp.profile)
      {
        this.myProfile = this.fsp.profile;
        this.new = false;

      }
      else
      this.createProfile();
    });
  }




  // Profile

  createProfile(){
    this.fsp.initializeFormulas();
    this.fsp.createProfile(this.myProfile).then(() => this.toastCtrl.create(
      {
        message: 'Profile created',
        duration: 3000,
        position: 'top',
        }
      ).present()
    )
  }

  updateProfile(){
    console.log('updateProfile');
    this.fsp.updateProfile(this.myProfile);
  }

  logoutUser(){
    this.afAuth.auth.signOut();
    this.navCtrl.setRoot(HomePage);
  }

  changePicture(){
    let changePictureModal = this.modalCtrl.create(ChangePictureModalPage);
    changePictureModal.present();
    changePictureModal.onDidDismiss(()=>this.fetchProfile());
  }

  //


  // Update Reward Points
  addTreatPoints(amount: number){
    this.fsp.addTreatPoints(amount);
        this.fetchProfile();
  }

  addFitnessPoints(amount: number){
    this.fsp.addFitnessPoints(amount);
        this.fetchProfile();
  }

  addMoney(amount: number){
    this.fsp.addMoney(amount);
        this.fetchProfile();
  }
  //



}
