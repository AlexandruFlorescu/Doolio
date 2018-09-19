import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { FirestorageProvider } from '../../providers/firestorage/firestorage';

/**
 * Generated class for the AddExercisePlanPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-add-exercise-plan',
  templateUrl: 'add-exercise-plan.html',
})
export class AddExercisePlanPage {

  plan: any = {exercises:[]};

  constructor(public navCtrl: NavController, public navParams: NavParams, public fsp: FirestorageProvider, public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddExercisePlanPage');
  }

  addPlan(){

      this.fsp.insertPlan(this.plan);
      this.viewCtrl.dismiss();
  }

}
