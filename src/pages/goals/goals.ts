import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { FirestorageProvider } from '../../providers/firestorage/firestorage';
import { AngularFireAuth } from 'angularfire2/auth';
import { LoginPage } from '../login/login';
import { AddGoalModalPage } from '../add-goal-modal/add-goal-modal';
import { AddNewMilestoneModalPage } from '../add-new-milestone-modal/add-new-milestone-modal';

/**
 * Generated class for the GoalsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-goals',
  templateUrl: 'goals.html',
})
export class GoalsPage {
  myProfile: any = {};
  goals: any;
  progress: any = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams, public fsp: FirestorageProvider, public modalCtrl: ModalController, public afAuth: AngularFireAuth) {
  }
  ionViewWillLoad(){
      // already logged in guard
      this.afAuth.authState.subscribe(data=> {
        if(data == null)
          this.navCtrl.setRoot(LoginPage)
        else
        {
          this.fetchProfile();
          this.fetchGoals();
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


  fetchGoals(){
    this.fsp.fetchGoals().subscribe( goals =>{
      this.goals = goals;
    });
  }

  addGoal(){
    let AddGoalModal = this.modalCtrl.create(AddGoalModalPage);
    AddGoalModal.present();
  }

  deleteGoal(goal){
    this.fsp.deleteGoal(goal);
  }
  updateGoal(goal){
    this.fsp.updateGoal(goal);
  }

  async addProgress(goal){

      if(parseInt(this.progress) + parseInt(goal.progress) >= 100)
        this.complete(goal);
      else
        {
         this.fsp.addProgress(goal, this.progress);
         this.progress = 0;
         await this.fsp.wjGoalProgress(goal, this.progress);
        }
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

  async complete(goal){
    await this.fsp.wjGoalComplete(goal);
    this.fsp.deleteGoal(goal);
    this.addTreatPoints( parseFloat(goal.TP) )
    this.addFitnessPoints( parseFloat(goal.FP) )
    this.addMoney( parseFloat(goal.Money) )

  }

  addNewMilestone(goal){
    let AddNewMilestoneModal = this.modalCtrl.create(AddNewMilestoneModalPage, {'goal': goal});
    AddNewMilestoneModal.present();
  }

  editMilestone(goal, i){
    console.log(i);
    let EditMilestoneModal = this.modalCtrl.create(AddNewMilestoneModalPage, {'goal': goal, 'i': i});
    EditMilestoneModal.present();
  }

  checkMilestone(goal, i){
    this.progress = goal.milestones[i].progress - goal.progress;
    this.addProgress(goal);
  }


  deleteMilestone(goal, i){
    goal.milestones.splice(i,1);
    this.fsp.updateGoal(goal);
  }
}
