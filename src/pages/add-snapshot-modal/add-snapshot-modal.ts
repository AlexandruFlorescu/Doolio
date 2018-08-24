import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { FirestorageProvider } from '../../providers/firestorage/firestorage';

/**
 * Generated class for the AddSnapshotModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-add-snapshot-modal',
  templateUrl: 'add-snapshot-modal.html',
})
export class AddSnapshotModalPage {

  snapshot = {
    text: '',
    rewardedTP: '',
    rewardedFP: '',
    rewardedMoney: '',
  };

  constructor(public navCtrl: NavController, public navParams: NavParams, public fsp: FirestorageProvider, public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddSnapshotModalPage');
  }

  addSnapshot(){
    this.fsp.insertSnapshot(
      {
        'text': this.snapshot.text,
        'TP': this.snapshot.rewardedTP,
        'FP': this.snapshot.rewardedFP,
        'Money': this.snapshot.rewardedMoney,
        'category': 'text'
      }
    );
    this.viewCtrl.dismiss();
  }

}
