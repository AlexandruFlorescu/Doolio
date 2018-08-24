import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { FirestorageProvider } from '../../providers/firestorage/firestorage';

/**
 * Generated class for the AddExerciseModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-add-exercise-modal',
  templateUrl: 'add-exercise-modal.html',
})
export class AddExerciseModalPage {

  exercise: any = {
    title: '',
    TP: 0,
    FP: 0,
    Money: 0,
    reps: 0,
    unit: '',
    units: ''
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, public fsp: FirestorageProvider, public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddExerciseModalPage');
  }

  addExercise(){
    this.fsp.insertExercise(this.exercise);
    this.viewCtrl.dismiss();
  }
}
