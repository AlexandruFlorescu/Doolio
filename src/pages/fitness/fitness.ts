import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { FirestorageProvider } from '../../providers/firestorage/firestorage';
import { AddExerciseModalPage } from '../add-exercise-modal/add-exercise-modal';
import { LoginPage } from '../login/login';
import { AngularFireAuth } from 'angularfire2/auth';

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
  myProfile: any = {};

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
            this.fetchExercises();
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





}
