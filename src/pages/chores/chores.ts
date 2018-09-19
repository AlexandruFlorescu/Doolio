import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, AlertController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { FirestorageProvider } from '../../providers/firestorage/firestorage';
import { LoginPage } from '../login/login';
import { AddChoresModalPage } from '../add-chores-modal/add-chores-modal';

/**
 * Generated class for the ChoresPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-chores',
  templateUrl: 'chores.html',
})
export class ChoresPage {
  chores: any = [];
  myProfile: any = {};
  currentDay: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alrtCtrl: AlertController, public modalCtrl: ModalController, public afAuth: AngularFireAuth, public fsp: FirestorageProvider) {
    this.currentDay = new Date().getDay();
  }

  ionViewWillLoad(){
      // already logged in guard
      this.afAuth.authState.subscribe(data=> {
        if(data == null)
          this.navCtrl.setRoot(LoginPage)
        else
        {
            this.fetchProfile();
            this.fetchChores()
            this.fsp.checkResetWeek();
        }
    })

  }
  roundNumber(nr) {
    return Math.round(nr * 100)/100;
  }

  fetchProfile(){
    this.fsp.fetchProfile().then(()=>{
      this.myProfile = this.fsp.profile;
    });
  }

  fetchChores(){
    this.fsp.fetchChores().subscribe( chores =>{
      this.chores = chores;
    });
  }

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

  // Handle chores
  addChores(){
    let addChoresModal = this.modalCtrl.create(AddChoresModalPage);
    addChoresModal.present();
  }
  deleteChore(chore){
    this.fsp.deleteChore(chore);
  }
  updateChore(chore){
    this.fsp.updateChore(chore);
  }


  // done(chore){
  //   this.fsp.markDone(chore);
  //   this.fsp.wjChore(chore);
  //   this.addTreatPoints(chore.TP);
  //   this.addFitnessPoints(chore.FP);
  //   this.addMoney(chore.Money);
  // }

  canP1(chore, i){
    if(chore.daysShould[i] > chore.daysDid[i])
      return true;
    else
    {
      this.alrtCtrl.create({
        title:'You already finished this chore for the day',
        buttons: ['Dismiss']
      }).present();
      return false;
    }
  }

  mark1(chore, i){
    if(this.canP1(chore, i)){
      chore.daysDid[i] += 1;
      this.fsp.updateChore(chore);

      this.fsp.wjChore(chore, i);
      this.addTreatPoints(chore.TP);
      this.addFitnessPoints(chore.FP);
      this.addMoney(chore.Money);
    }

  }

  refreshWeek(){
    this.chores.forEach(ch=> {ch.daysDid = [0,0,0,0,0,0,0]; this.fsp.updateChore(ch) })
  }
}
