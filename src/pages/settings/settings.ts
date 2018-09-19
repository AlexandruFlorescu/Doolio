import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FirestorageProvider } from '../../providers/firestorage/firestorage';
import { LoginPage } from '../login/login';
import { AngularFireAuth } from 'angularfire2/auth';

/**
 * Generated class for the SettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  formulas = {
    'Introductory': {
        title: 'Introductory',
        text: ''
    },
    'TimeAndDate': {
        title: 'TimeAndDate',
        text: ''
    },
    'FinishedTodo': {
        title: 'FinishedTodo',
        text: ''
    },
    'DidExercise': {
        title: 'DidExercise',
        text: ''
    },
    'FinishedChore': {
        title: 'FinishedChore',
        text: ''
    },
    'AddedChore': {
        title: 'AddedChore',
        text: ''
    },
    'FinishedGoal': {
        title: 'FinishedGoal',
        text: ''
    },
    'ProgressGoal': {
        title: 'ProgressGoal',
        text: ''
    },
    'GotTreat': {
      title: 'GotTreat',
      text: ''
    },
    'Rewards': {
        title: 'Rewards',
        text: ''
    },
    'Costs': {
        title: 'Costs',
        text: ''
    },
    // 'People'
    'Closing': {
        title: 'Closing',
        text: ''
    },


  };

  constructor(public navCtrl: NavController, public navParams: NavParams, public fsp: FirestorageProvider, public afAuth: AngularFireAuth) {


  }

      ionViewWillLoad(){
          // already logged in guard
          this.afAuth.authState.subscribe(data=> {
          console.log(data);
            if(data == null)
              this.navCtrl.setRoot(LoginPage)
            else
            {
                this.fetchFormulas();

            }
        })
      }
  fetchFormulas(){
    this.fsp.fetchFormulas().subscribe(formulas=>
      formulas.forEach(formula => this.formulas[formula.title] = formula)
    );
  }

  updateFormulas(){
    Object.keys(this.formulas).forEach((key,index)=>{
      console.log(key, this.formulas[key]);
      this.fsp.updateFormula(key, this.formulas[key].text);
    })
  }
}
