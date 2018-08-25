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
  fsExercises: any;
  fsTodo: any;
  fsTreats: any;
  fsJournal: any;
  fsFormulas: any;

  constructor( private afAuth: AngularFireAuth, private afs: AngularFirestore) {
    if(this.afAuth.auth.currentUser){
      this.fsExercises = this.afs.collection('UserMetadata').doc(this.afAuth.auth.currentUser.uid).collection('exercises');
      this.fsTodo = this.afs.collection('UserMetadata').doc(this.afAuth.auth.currentUser.uid).collection('todos');
      this.fsTreats = this.afs.collection('UserMetadata').doc(this.afAuth.auth.currentUser.uid).collection('treats');
      this.fsJournal = this.afs.collection('UserMetadata').doc(this.afAuth.auth.currentUser.uid).collection('snapshots');
      this.fsFormulas = this.afs.collection('UserMetadata').doc(this.afAuth.auth.currentUser.uid).collection('formulas');

    }

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
    let snapshot = {
          'text': payload.text,
          'rewardedTP': payload.TP,
          'rewardedFP': payload.FP,
          'rewardedMoney': payload.Money,
          'category': payload.category,
          'timestamp': now
        }

    this.fsJournal.doc(now.toString()).ref.set(snapshot);
  }
  async wjExercise(exercise, amount){
    let now = Date.parse(new Date().toISOString());
    let time = new Date().getHours() + ":" + new Date().getMinutes();
    let date = new Date().getDate() + "/" + (new Date().getMonth() + 1) + '/' + new Date().getFullYear();

    let introductoryFormula = '';
    await this.fsFormulas.doc('Introductory').ref.get().then( doc =>
      introductoryFormula = doc.data().text)

    let timeAndDateFormula = '';
    await this.fsFormulas.doc('TimeAndDate').ref.get().then( doc =>
      timeAndDateFormula = doc.data().text)
    timeAndDateFormula = timeAndDateFormula.replace('<time>', "<span class='timeStyle'>" + time + "</span>").replace('<date>', "<span class='dateStyle'>" + date + "</span>");

    let exerciseFormula;
    await this.fsFormulas.doc('DidExercise').ref.get().then( doc =>
      exerciseFormula = doc.data().text)
    if (parseInt(amount) == 1)
      exerciseFormula = exerciseFormula.replace('<amount>', "<span class='exerciseStyle'>" + amount).replace('<exercise>', exercise.unit + "</span>")
    else
      exerciseFormula = exerciseFormula.replace('<amount>', "<span class='exerciseStyle'>" + amount).replace('<exercise>', exercise.units + "</span>")

    let rewardsFormula;
    await this.fsFormulas.doc('Rewards').ref.get().then( doc =>
      rewardsFormula = doc.data().text)
    rewardsFormula = rewardsFormula.replace('<rewards>', "<span class='rewardsStyle'>" + exercise.TP*parseInt(amount) + " TP " + exercise.FP*parseInt(amount) + " FP " + exercise.Money*parseInt(amount) + " Money </span>")

    let closingFormula = '';
    await this.fsFormulas.doc('Closing').ref.get().then( doc =>
      closingFormula = doc.data().text)

    let snapshotText = '<p class="pStyle">' + introductoryFormula + " " + timeAndDateFormula + " " + exerciseFormula + " " + rewardsFormula + " " + closingFormula + '</p>';
    console.log(snapshotText);
    let snapshot = {
      'text': snapshotText,
      'category': 'exercise',
      'timestamp': now,
    }
    this.fsJournal.doc(now.toString()).ref.set(snapshot);

  }

  async wjTodo(todo){
    let now = Date.parse(new Date().toISOString());
    let time = new Date().getHours() + ":" + new Date().getMinutes();
    let date = new Date().getDate() + "/" + (new Date().getMonth() + 1) + '/' + new Date().getFullYear();

    let introductoryFormula = '';
    await this.fsFormulas.doc('Introductory').ref.get().then( doc =>
      introductoryFormula = doc.data().text)

    let timeAndDateFormula = '';
    await this.fsFormulas.doc('TimeAndDate').ref.get().then( doc =>
      timeAndDateFormula = doc.data().text)
    timeAndDateFormula = timeAndDateFormula.replace('<time>', "<span class='timeStyle'>" + time + "</span>").replace('<date>', "<span class='dateStyle'>" + date + "</span>");


    let todoFormula;
    await this.fsFormulas.doc('FinishedTodo').ref.get().then( doc =>
      todoFormula = doc.data().text)
    todoFormula = todoFormula.replace('<todo>', "<span class='todosStyle'>" + todo.title + "</span>")


    let rewardsFormula;
    await this.fsFormulas.doc('Rewards').ref.get().then( doc =>
      rewardsFormula = doc.data().text)
    rewardsFormula = rewardsFormula.replace('<rewards>', "<span class='rewardsStyle'>" + todo.TP + " TP " + todo.FP + " FP " + todo.Money + " Money </span>")

    let closingFormula = '';
    await this.fsFormulas.doc('Closing').ref.get().then( doc =>
      closingFormula = doc.data().text)

    let snapshotText = '<p class="pStyle">' + introductoryFormula + " " + timeAndDateFormula + " " + todoFormula + " " + rewardsFormula + " " + closingFormula + '</p>';
    console.log(snapshotText);
    let snapshot = {
      'text': snapshotText,
      'category': 'todo',
      'timestamp': now,
    }
    this.fsJournal.doc(now.toString()).ref.set(snapshot);

  }

  async wjTreat(treat, amount){
    let now = Date.parse(new Date().toISOString());
    let time = new Date().getHours() + ":" + new Date().getMinutes();
    let date = new Date().getDate() + "/" + (new Date().getMonth() + 1) + '/' + new Date().getFullYear();

    let introductoryFormula = '';
    await this.fsFormulas.doc('Introductory').ref.get().then( doc =>
      introductoryFormula = doc.data().text)

    let timeAndDateFormula = '';
    await this.fsFormulas.doc('TimeAndDate').ref.get().then( doc =>
      timeAndDateFormula = doc.data().text)
    timeAndDateFormula = timeAndDateFormula.replace('<time>', "<span class='timeStyle'>" + time + "</span>").replace('<date>', "<span class='dateStyle'>" + date + "</span>");

    let treatFormula;
    await this.fsFormulas.doc('GotTreat').ref.get().then( doc =>
      treatFormula = doc.data().text)
    if (parseInt(amount) == 1)
      treatFormula = treatFormula.replace('<amount>', "<span class='treatStyle'>" + amount).replace('<treat>', treat.unit + "</span>")
    else
      treatFormula = treatFormula.replace('<amount>', "<span class='treatStyle'>" + amount).replace('<treat>', treat.units + "</span>")

    let rewardsFormula;
    await this.fsFormulas.doc('Rewards').ref.get().then( doc =>
      rewardsFormula = doc.data().text)
    rewardsFormula = rewardsFormula.replace('<rewards>', "<span class='costsStyle'>" + treat.TP*parseInt(amount) + " TP " + treat.FP*parseInt(amount) + " FP " + treat.Money*parseInt(amount) + " Money </span>")

    let closingFormula = '';
    await this.fsFormulas.doc('Closing').ref.get().then( doc =>
      closingFormula = doc.data().text)

    let snapshotText = '<p class="pStyle">' + introductoryFormula + " " + timeAndDateFormula + " " + treatFormula + " " + rewardsFormula + " " + closingFormula + '</p>';
    console.log(snapshotText);
    let snapshot = {
      'text': snapshotText,
      'category': 'exercise',
      'timestamp': now,
    }
    this.fsJournal.doc(now.toString()).ref.set(snapshot);

  }
//

// Formulas
  fetchFormulas(){
    return this.fsFormulas.valueChanges();
  }

  updateFormula(title, formula){
    this.fsFormulas.doc(title).set({
      title: title,
      text: formula,
    })
  }

  initializeSettings(){

  }
//
}
