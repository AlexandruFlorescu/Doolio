import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { FirestorageProvider } from '../../providers/firestorage/firestorage';

/**
 * Generated class for the AddChoresModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-add-chores-modal',
  templateUrl: 'add-chores-modal.html',
})
export class AddChoresModalPage {

  chore: any = {daysShould:[], daysDid:[0,0,0,0,0,0,0], lastDate:new Date().getDate() + "/" + new Date().getMonth() + "/" + new Date().getFullYear()};

  constructor(public navCtrl: NavController, public navParams: NavParams, public fsp: FirestorageProvider, public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddChoresModalPage');
  }

  addChore(){
    this.fsp.insertChore(this.chore);
    this.viewCtrl.dismiss();
  }

}
