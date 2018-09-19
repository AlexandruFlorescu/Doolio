import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { FirestorageProvider } from '../../providers/firestorage/firestorage';

/**
 * Generated class for the AddNewMilestoneModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-add-new-milestone-modal',
  templateUrl: 'add-new-milestone-modal.html',
})
export class AddNewMilestoneModalPage {

  milestone: any = {};
  i: any;
  goal: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public fsp: FirestorageProvider, public viewCtrl: ViewController) {
    }

  ionViewDidLoad() {
    console.log(this.navParams.get('i'));
    if(this.navParams.get('i') != undefined){
      this.i = this.navParams.get('i');
    this.milestone = this.goal.milestones[this.navParams.get('i')]
    }
    if(this.navParams.get('goal') != undefined){
      this.goal = this.navParams.get('goal');
    }

  }

  addMilestone(){
    this.milestone.progress = parseInt(this.milestone.progress);
    this.goal.milestones.push(this.milestone);
    this.fsp.updateGoal(this.goal);
    this.viewCtrl.dismiss();
  }

}
