import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, AlertController } from 'ionic-angular';
import { FirestorageProvider } from '../../providers/firestorage/firestorage';
import { AddTreatModalPage } from '../add-treat-modal/add-treat-modal';
import { AngularFireAuth } from 'angularfire2/auth';
import { LoginPage } from '../login/login';

/**
 * Generated class for the TreatsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-treats',
  templateUrl: 'treats.html',
})
export class TreatsPage {

  myProfile: any = {  username: '',  firstName: '',  lastName: ''};
  treats: any;


  constructor(public navCtrl: NavController, public navParams: NavParams, public fsp: FirestorageProvider, public modalCtrl: ModalController, public alertCtrl: AlertController,  public afAuth: AngularFireAuth) {

  }

  ionViewWillLoad(){
      // already logged in guard
      this.afAuth.authState.subscribe(data=> {
      console.log(data);
        if(data == null)
          this.navCtrl.setRoot(LoginPage)
        else
        {
            this.fetchProfile();
            this.fetchTreats();
        }
    })
  } //login guard
  fetchProfile(){
    this.fsp.fetchProfile().then(()=>{
      this.myProfile = this.fsp.profile;
    });
  } // provides the profile
  fetchTreats(){
    this.fsp.fetchTreats().subscribe( treats =>{
      this.treats = treats;
    });
  } // provides the treats
  supplement(treat, amount){
    this.fsp.updateQuantity(treat, parseFloat(amount));
  } // supplements treats quantity
  grab(treat, amount){
    console.log(treat, amount);
    if(this.fsp.canAfford(treat, amount)){
      this.addTreatPoints(parseFloat(amount) * treat.TP)
      this.addFitnessPoints(parseFloat(amount) * treat.FP)
      this.addMoney(parseFloat(amount) * treat.Money)
      this.fsp.wjTreat(treat, amount);
      this.fsp.updateQuantity(treat, parseFloat(amount));
    }
    else
    {
      let alert = this.alertCtrl.create({
        title: "You can't afford this",
        subTitle: 'You lack reward points or quantity',
        buttons: ['Dismiss']
      });
      alert.present();
    }
  } // take a treat
  addTreat(){
    let addTreatModal = this.modalCtrl.create(AddTreatModalPage);
    addTreatModal.present();
  } // add a new treat
  deleteTreat(treat){
    this.fsp.deleteTreat(treat);
  } // delete a treat
  updateTreat(treat){
    // let addTreatModal = this.modalCtrl.create(AddTreatModalPage, {'treat': treat});
    // addTreatModal.present();
    this.fsp.updateTreat(treat);
  } // update a treat

  roundNumber(nr) {
    return Math.round(nr * 100)/100;
  } //

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
