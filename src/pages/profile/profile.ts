import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { FirestorageProvider } from '../../providers/firestorage/firestorage';
import { ChangePictureModalPage } from '../change-picture-modal/change-picture-modal';

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

  myProfile: any = {  username: '',  firstName: '',  lastName: ''};
  exercises: any;

  constructor(  public navCtrl: NavController, public navParams: NavParams, public fsp: FirestorageProvider, public modalCtrl: ModalController) {

    this.fetchProfile();
  }

  roundNumber(nr) {
    return Math.round(nr * 100)/100;
  }

  fetchProfile(){
    this.fsp.fetchProfile().then(()=>{
      this.myProfile = this.fsp.profile;
    });
  }




  // Profile

  createProfile(){
    console.log('createProfile');
    this.fsp.createProfile(this.myProfile);
  }

  updateProfile(){
    console.log('updateProfile');
    this.fsp.updateProfile(this.myProfile);
  }

  logoutUser(){
    // this.afAuth.auth.signOut();
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
