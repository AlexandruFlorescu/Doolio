import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, AlertController } from 'ionic-angular';
import { FirestorageProvider } from '../../providers/firestorage/firestorage';
import { AddExerciseModalPage } from '../add-exercise-modal/add-exercise-modal';
import { LoginPage } from '../login/login';
import { AngularFireAuth } from 'angularfire2/auth';
import { AddExercisePlanPage } from '../add-exercise-plan/add-exercise-plan';
import { AddExerciseToPlanPage } from '../add-exercise-to-plan/add-exercise-to-plan';

/**
 * Generated class for the FitnessPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-fitness',
  templateUrl: 'fitness.html',
})
export class FitnessPage {
  exercises: any;
  plans: any;
  myProfile: any = {};

  constructor(public navCtrl: NavController, public navParams: NavParams, public fsp: FirestorageProvider, public alertCtrl: AlertController, public modalCtrl: ModalController, public afAuth: AngularFireAuth) {

  }
  ionViewWillLoad(){
      // already logged in guard
      this.afAuth.authState.subscribe(data=> {
        if(data == null)
          this.navCtrl.setRoot(LoginPage)
        else
        {
            this.fetchProfile();
            this.fetchExercises();
            this.fetchPlans();
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

  fetchExercises(){
    this.fsp.fetchExercises().subscribe( exercises =>{
      this.exercises = exercises;
    });
  }

  fetchPlans() {
    this.fsp.fetchPlans().subscribe( plans=>{
      this.plans = plans;
    });
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

    // Handle exercises
    addExercise(){
      let addExerciseModal = this.modalCtrl.create(AddExerciseModalPage);
      addExerciseModal.present();
    }

    deleteExercise(exercise){
      this.fsp.deleteExercise(exercise);
    }
    updateExercise(exercise){
      this.fsp.updateExercise(exercise);
    }


    addReps(exercise, amount){
      console.log(exercise, amount);
      this.fsp.addReps(exercise, amount);
      this.fsp.wjExercise(exercise, amount);
      this.addTreatPoints( parseFloat(exercise.TP) * amount )
      this.addFitnessPoints( parseFloat(exercise.FP) * amount )
      this.addMoney( parseFloat(exercise.Money) * amount )
    }

    addPlan(){
      let addPlanModal = this.modalCtrl.create(AddExercisePlanPage);
      addPlanModal.present();
    }

    addPExercise(plan){
      let addPExerciseModal = this.modalCtrl.create(AddExerciseToPlanPage,  {plan: plan});
      addPExerciseModal.present();
    }

    deletePlan(plan){
      this.fsp.deletePlan(plan);
    }

    addPReps(plan, i, amount){
      if(plan.exercises[i].repsDid + parseInt(amount) <= plan.exercises[i].repsShould){
         plan.exercises[i].repsDid += parseInt(amount)
         this.fsp.updatePlan(plan).then(()=>this.checkPlanFinished(plan));
       }
      else{
        this.alertCtrl.create({
          title:'You already finished this',
          buttons:['Dismiss']
        }).present();
      }
    }
  checkPlanFinished(plan){
    let unfinished = plan.exercises.filter(ex=> ex.repsDid < ex.repsShould)
    if(unfinished.length == 0)
    {
      this.addTreatPoints(plan.TP)
      this.addFitnessPoints(plan.FP)
      this.addMoney(plan.Money)
    }
  }

  refreshPlan(plan){
    plan.exercises.forEach(ex=> ex.repsDid = 0)
    this.fsp.updatePlan(plan);
  }

    deletePExercise(plan, i){
      plan.exercises.splice(i,1);
      this.fsp.updatePlan(plan);
    }

}
