import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';

/*
  Generated class for the ProfileProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FirestorageProvider {
  profile: any;
  exercises: any;


  constructor( private afAuth: AngularFireAuth, private afs: AngularFirestore) {
  }

  createProfile(profile){
      this.afs.collection('UserMetadata').doc(this.afAuth.auth.currentUser.uid).set(
        {
          'username': profile.username,
          'firstName': profile.firstName,
          'lastName': profile.lastName,
          'treatPoints': 0,
          'fitnessPoints': 0,
          'money': 0
        }
      )
  }
  async fetchProfile(){
    await this.afs.collection('UserMetadata').doc(this.afAuth.auth.currentUser.uid).ref.get().then( (doc) => {
      this.profile = doc.data()
    }).catch(err=> console.log(err));

  }
  updateProfile(profile){
      this.afs.collection('UserMetadata').doc(this.afAuth.auth.currentUser.uid).update(
        {
          'username': profile.username,
          'firstName': profile.firstName,
          'lastName': profile.lastName,
          'treatPoints': profile.treatPoints || 0,
          'fitnessPoints': profile.fitnessPoints || 0,
          'money': profile.money || 0,
          'image': profile.image || 'https://via.placeholder.com/350x150'
        }
      );

      this.fetchProfile();
  }
  changePicture(url){
    this.afs.collection('UserMetadata').doc(this.afAuth.auth.currentUser.uid).update(
      {
        'image': url
      }
    );

    this.fetchProfile();
  }



//  Rewards
  addTreatPoints(amount){
    this.afs.collection('UserMetadata').doc(this.afAuth.auth.currentUser.uid).update(
      {
        'treatPoints': parseFloat(this.profile.treatPoints) + parseFloat(amount),
      }
    );
  }
  addFitnessPoints(amount){
    this.afs.collection('UserMetadata').doc(this.afAuth.auth.currentUser.uid).update(
      {
        'fitnessPoints': parseFloat(this.profile.fitnessPoints) + parseFloat(amount),
      }
    );
  }
  addMoney(amount){
    this.afs.collection('UserMetadata').doc(this.afAuth.auth.currentUser.uid).update(
      {
        'money': parseFloat(this.profile.money) + parseFloat(amount),
      }
    );
  }
//


// Exercises
  fsExercises = this.afs.collection('UserMetadata').doc(this.afAuth.auth.currentUser.uid).collection('exercises');
  insertExercise(exercise){
    this.fsExercises.doc(exercise.title).set(exercise);
  }
  fetchExercises(){
    return this.fsExercises.valueChanges()
  }
  addReps(exercise, amount){
    this.fsExercises.doc(exercise.title).update({
      'reps': exercise.reps + parseFloat(amount)
    });
  }
  updateExercise(exercise){
    this.fsExercises.doc(exercise.title).update( exercise );
  }
  deleteExercise(exercise){
    this.fsExercises.doc(exercise.title).delete();
  }
//


// Treats
  fsTreats = this.afs.collection('UserMetadata').doc(this.afAuth.auth.currentUser.uid).collection('treats');
  insertTreat(treat){
    this.fsTreats.doc(treat.title).set(treat);
  }
  fetchTreats(){
    return this.fsTreats.valueChanges();
  }
  updateQuantity(treat, amount): any {
    this.fsTreats.doc(treat.title).update({
      'quantity': parseFloat(treat.quantity) + parseFloat(amount)
    });
  }
  canAfford(treat, amount){
    let floatAmount = Math.abs(parseFloat(amount));

    if(parseFloat(treat.quantity) > floatAmount &&
       parseFloat(treat.TP) * floatAmount < parseFloat(this.profile.treatPoints) &&
       parseFloat(treat.FP) * floatAmount < parseFloat(this.profile.fitnessPoints) &&
       parseFloat(treat.Money) * floatAmount < parseFloat(this.profile.money)
     )
      {console.log('true');return true;}
     else return false;
  }
  updateTreat(treat){
    this.fsTreats.doc(treat.title).update( treat )
  }
  deleteTreat(treat){
    this.fsTreats.doc(treat.title).delete();
  }
//

// Todos
  fsTodo = this.afs.collection('UserMetadata').doc(this.afAuth.auth.currentUser.uid).collection('todos');
  insertTodo(todo){
    this.fsTodo.doc(todo.title).set(todo);
  }
  fetchTodos(){
    return this.fsTodo.valueChanges();
  }
  updateTodo(todo){
    this.fsTodo.doc(todo.title).update( todo )
  }
  deleteTodo(todo){
    this.fsTodo.doc(todo.title).delete();
  }
//


// Journal
  fsJournal = this.afs.collection('UserMetadata').doc(this.afAuth.auth.currentUser.uid).collection('snapshots');
  fetchJournal(){
    return this.fsJournal.valueChanges();
  }
  fetchJournalWithFilter(start, end){
    return this.afs.collection('UserMetadata').doc(this.afAuth.auth.currentUser.uid).collection('snapshots', ref => ref
      .where('timestamp', '>', start)
      .where('timestamp', '<', end)

    ).valueChanges();
  }
  insertSnapshot(payload){
    let now = Date.parse(new Date().toISOString());
    let snapshot;
    switch(payload.category){
      case 'text': {
        snapshot = {
          'text': payload.text,
          'rewardedTP': payload.TP,
          'rewardedFP': payload.FP,
          'rewardedMoney': payload.Money,
          'category': payload.category,
          'timestamp': now
        }
        break;
      }
      case 'todo' : {
        snapshot = {
          'text': payload.text,
          'rewardedTP': payload.TP,
          'rewardedFP': payload.FP,
          'rewardedMoney': payload.Money,
          'category': payload.category,
          'timestamp': now
        }
        break;
      }
      case 'fitness' : {
        snapshot = {
          'text': payload.text,
          'rewardedTP': payload.TP,
          'rewardedFP': payload.FP,
          'rewardedMoney': payload.Money,
          'category': payload.category,
          'timestamp': now
        }
        break;
      }
      case 'treats' : {
        snapshot = {
          'text': payload.text,
          'rewardedTP': payload.TP,
          'rewardedFP': payload.FP,
          'rewardedMoney': payload.Money,
          'category': payload.category,
          'timestamp': now
        }
        break;
      }

    }


    this.fsJournal.doc(now.toString()).ref.set(snapshot);
  }

}
