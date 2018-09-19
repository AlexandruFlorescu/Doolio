import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { FirestorageProvider } from '../../providers/firestorage/firestorage';

/**
 * Generated class for the AddGoalModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-add-goal-modal',
  templateUrl: 'add-goal-modal.html',
})
export class AddGoalModalPage {

  goal: any = {};

  constructor(public navCtrl: NavController, public navParams: NavParams, public fsp: FirestorageProvider, public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddGoalModalPage');
  }

    addGoal(){
      console.log(this.goal);
      this.fsp.insertGoal(
        {
          'title': this.goal.title,
          'TP': this.goal.TP,
          'FP': this.goal.FP,
          'Money': this.goal.Money,
          'description': this.goal.description,
          'progress': 0,
          'milestones': []
        }
      );
      this.viewCtrl.dismiss();
    }

}
