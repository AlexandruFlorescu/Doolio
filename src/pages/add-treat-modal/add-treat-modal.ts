import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { FirestorageProvider } from '../../providers/firestorage/firestorage';

/**
 * Generated class for the AddTreatModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-add-treat-modal',
  templateUrl: 'add-treat-modal.html',
})
export class AddTreatModalPage {

    treat: any = {
      title: '',
      TP: 0,
      FP: 0,
      Money: 0,
      quantity: 0,
      unit: '',
      units: '',
    }

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public fsp: FirestorageProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddTreatModalPage');
  }


  addTreat(){
    this.fsp.insertTreat(this.treat);
    this.viewCtrl.dismiss();
  }
}
