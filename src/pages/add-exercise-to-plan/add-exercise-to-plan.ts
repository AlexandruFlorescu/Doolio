import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { FirestorageProvider } from '../../providers/firestorage/firestorage';

/**
 * Generated class for the AddExerciseToPlanPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-add-exercise-to-plan',
  templateUrl: 'add-exercise-to-plan.html',
})
export class AddExerciseToPlanPage {

  exercise: any = {repsDid: 0};

  constructor(public navCtrl: NavController, public navParams: NavParams, public fsp: FirestorageProvider, public viewCtrl: ViewController) {
  }

  addExercise()
  {
    let plan = this.navParams.get('plan')
    this.exercise.repsShould = parseInt(this.exercise.repsShould);
    plan.exercises.push(this.exercise);

    this.fsp.updatePlan(plan);
    this.viewCtrl.dismiss();
  }
}
