import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { FirestorageProvider } from '../../providers/firestorage/firestorage';

/**
 * Generated class for the ChangePictureModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-change-picture-modal',
  templateUrl: 'change-picture-modal.html',
})
export class ChangePictureModalPage {

  url:string;
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public fsp: FirestorageProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChangePictureModalPage');
  }


  changePicture(){
    this.fsp.changePicture(this.url);
    this.viewCtrl.dismiss();
  }
}
