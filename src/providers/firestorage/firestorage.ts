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
  fsExercises: any = {};
  fsTodo: any = {};
  fsTreats: any = {};
  fsJournal: any = {};
  fsFormulas: any = {};
  fsGoals: any = {};
  fsChores: any = {};
  fsPlans: any = {};

  constructor( private afAuth: AngularFireAuth, private afs: AngularFirestore) {

    this.afAuth.authState.subscribe(data=> {
      if(data != null)
    {
      this.fsExercises = this.afs.collection('UserMetadata').doc(this.afAuth.auth.currentUser.uid).collection('exercises');
      this.fsTodo = this.afs.collection('UserMetadata').doc(this.afAuth.auth.currentUser.uid).collection('todos');
      this.fsTreats = this.afs.collection('UserMetadata').doc(this.afAuth.auth.currentUser.uid).collection('treats');
      this.fsJournal = this.afs.collection('UserMetadata').doc(this.afAuth.auth.currentUser.uid).collection('snapshots');
      this.fsFormulas = this.afs.collection('UserMetadata').doc(this.afAuth.auth.currentUser.uid).collection('formulas');
      this.fsGoals = this.afs.collection('UserMetadata').doc(this.afAuth.auth.currentUser.uid).collection('goals');
      this.fsChores = this.afs.collection('UserMetadata').doc(this.afAuth.auth.currentUser.uid).collection('chores');
      this.fsPlans = this.afs.collection('UserMetadata').doc(this.afAuth.auth.currentUser.uid).collection('exercisePlans');
    }});

  }
  // Profile related methods
  // Rewards related methods
  // Plans related methods
  // Todos  related methods
  // Treats related methods
  // Goals related methods
  // Chores related methods
  // Journal related methods
  // Formulas related methods

  createProfile(profile){
      return this.afs.collection('UserMetadata').doc(this.afAuth.auth.currentUser.uid).set(
        {
          'username': profile.username || "",
          'firstName': profile.firstName || "",
          'lastName': profile.lastName || "",
          'treatPoints': 0,
          'fitnessPoints': 0,
          'money': 0,
          'image': profile.image || 'https://via.placeholder.com/350x150',
          'currency': profile.currency || '$',
        }
      )
  } // creeaza profilul
  async fetchProfile(){
    await this.afs.collection('UserMetadata').doc(this.afAuth.auth.currentUser.uid).ref.get().then( (doc) => {

      this.profile = doc.data()
    }).catch(err=> console.log(err));

  } // furnizeaza profilul
  updateProfile(profile){
      this.afs.collection('UserMetadata').doc(this.afAuth.auth.currentUser.uid).update(
        {
          'username': profile.username,
          'firstName': profile.firstName,
          'lastName': profile.lastName,
          'treatPoints': profile.treatPoints || 0,
          'fitnessPoints': profile.fitnessPoints || 0,
          'money': profile.money || 0,
          'image': profile.image || 'https://via.placeholder.com/350x150',
          'currency': profile.currency || '$'
        }
      );

      this.fetchProfile();
  } // actualizeaza profilul
  changePicture(url){
    this.afs.collection('UserMetadata').doc(this.afAuth.auth.currentUser.uid).update(
      {
        'image': url
      }
    );

    this.fetchProfile();
  } // schimba imaginea // schimba poza de profil

//  Rewards => adauga puncte de rasplata
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
  } // adauga exercitii
  fetchExercises(){
    return this.fsExercises.valueChanges()
  } // furnizeaza exercitiile
  addReps(exercise, amount){
    this.fsExercises.doc(exercise.title).update({
      'reps': exercise.reps + parseFloat(amount)
    });
  } // adauga repetari
  updateExercise(exercise){
    this.fsExercises.doc(exercise.title).update( exercise );
  } // actualizeaza exercitiul
  deleteExercise(exercise){
    this.fsExercises.doc(exercise.title).delete();
  } // sterge exercitiul
// Plans
  insertPlan(plan){
    this.fsPlans.doc(plan.title).set(plan);
  } // adauga plan de exercitii
  fetchPlans(){
    return this.fsPlans.valueChanges()
  } // furnizeaza planuri de exercitii
  updatePlan(plan){
    return this.fsPlans.doc(plan.title).update( plan );
  } // actualizeaza plan de exercitii
  deletePlan(plan){
    this.fsPlans.doc(plan.title).delete();
  } // sterge planul de exercitii
// Treats
  insertTreat(treat){
    this.fsTreats.doc(treat.title).set(treat);
  } // include rasplata
  fetchTreats(){
    return this.fsTreats.valueChanges();
  } // furnizeaza lista cu rasplati
  updateQuantity(treat, amount): any {
    if(parseFloat(treat.quantity) + parseFloat(amount) == 0)
      this.deleteTreat(treat);
    else
      this.fsTreats.doc(treat.title).update({
        'quantity': parseFloat(treat.quantity) + parseFloat(amount)
      });

  } // actualizeaza cantitatile
  canAfford(treat, amount){
    let floatAmount = Math.abs(parseFloat(amount));
    console.log('qnt', parseFloat(treat.quantity) , floatAmount)
    console.log('tp',parseFloat(treat.TP) * floatAmount , parseFloat(this.profile.treatPoints))
    console.log('fp',parseFloat(treat.FP) * floatAmount < parseFloat(this.profile.fitnessPoints))
    console.log('money',parseFloat(treat.Money) * floatAmount < parseFloat(this.profile.money))
    if(parseFloat(treat.quantity) >= floatAmount &&
       parseFloat(treat.TP) * floatAmount <= parseFloat(this.profile.treatPoints) &&
       parseFloat(treat.FP) * floatAmount <= parseFloat(this.profile.fitnessPoints) &&
       parseFloat(treat.Money) * floatAmount <= parseFloat(this.profile.money)
     )
      {console.log('true');return true;}
     else return false;
  } // verifica daca se permite aceasta rasplata
  updateTreat(treat){
    this.fsTreats.doc(treat.title).update( treat )
  } // actualizeaza o rasplata
  deleteTreat(treat){
    this.fsTreats.doc(treat.title).delete();
  }   // sterge o rasplata
// Todos
  insertTodo(todo){
    this.fsTodo.doc(todo.title).set(todo);
  } // insereaza o activitate
  fetchTodos(){
    return this.fsTodo.valueChanges();
  } // furnizeaza lista de activitati
  updateTodo(todo){
    this.fsTodo.doc(todo.title).update( todo )
  } // actualizeaza o activitate
  deleteTodo(todo){
    this.fsTodo.doc(todo.title).delete();
  } // sterge o activitate
// Goals
  insertGoal(goal){
    this.fsGoals.doc(goal.title).set(goal);
  } // insereaza un obiectiv
  fetchGoals(){
    return this.fsGoals.valueChanges();
  } // furnizeaza obiective
  updateGoal(goal){
    this.fsGoals.doc(goal.title).update( goal )
  } // actualizeaza un obiectiv
  deleteGoal(goal){
    this.fsGoals.doc(goal.title).delete();
  } // sterge un obiectiv
  addProgress(goal, amount){
    this.fsGoals.doc(goal.title).update(
      {
        'progress': parseInt(goal.progress) + parseInt(amount)
      }
    )
  } // adauga progress unui obiectiv
// Chores
  insertChore(chore){
    this.fsChores.doc(chore.title).set(chore);
  } // insereaza o munca
  fetchChores(){
    return this.fsChores.valueChanges();
  } // furnizeaza muncile
  updateChore(chore){
    this.fsChores.doc(chore.title).update(chore);
  } // actualizeaza muncile
  deleteChore(chore){
    this.fsChores.doc(chore.title).delete();
  } // sterge o munca
  checkResetWeek(){
    let today = new Date().getDate() + "/" + new Date().getMonth() + "/" + new Date().getFullYear();
    this.fsChores.valueChanges().subscribe( chores => {
      // console.log(new Date().getDay(), new Date().getDay() == 2, chores[0].lastDate != today);
      if(chores.length > 0)
      if(new Date().getDay() == 3 && chores[0].lastDate != today){
        chores.forEach( chore => {
          chore.daysDid = [0, 0, 0, 0, 0, 0, 0]
          chore.lastDate = today.toString();
          this.fsChores.doc(chore.title).update(chore);
        })
      }
    });
  } // verifica schimbarea saptamanii
// Journal
  fetchJournal(){
    return this.fsJournal.valueChanges();
  } // furnizeaza jurnalul
  fetchJournalWithFilter(start, end){
    return this.afs.collection('UserMetadata').doc(this.afAuth.auth.currentUser.uid).collection('snapshots', ref => ref
      .where('timestamp', '>', start)
      .where('timestamp', '<', end)
    ).valueChanges();
  } // furnizeaza jurnalul cu filtre
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
  } // introduce fragment
  deleteSnapshot(snapshot){
    this.fsJournal.doc(snapshot.timestamp.toString()).delete();
  } // sterge fragment
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

  } // scrie exercitiu in jurnal
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

  } // scrie activitate in jurnal
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

    let costsFormula;
    await this.fsFormulas.doc('Costs').ref.get().then( doc =>
      costsFormula = doc.data().text)
    costsFormula = costsFormula.replace('<costs>', "<span class='costsStyle'>" + treat.TP*parseInt(amount) + " TP " + treat.FP*parseInt(amount) + " FP " + treat.Money*parseInt(amount) + " Money </span>")

    let closingFormula = '';
    await this.fsFormulas.doc('Closing').ref.get().then( doc =>
      closingFormula = doc.data().text)

    let snapshotText = '<p class="pStyle">' + introductoryFormula + " " + timeAndDateFormula + " " + treatFormula + " " + costsFormula + " " + closingFormula + '</p>';
    console.log(snapshotText);
    let snapshot = {
      'text': snapshotText,
      'category': 'treat',
      'timestamp': now,
    }
    this.fsJournal.doc(now.toString()).ref.set(snapshot);

  } // scrie rasplata in jurnal
  async wjGoalProgress(goal, amount){
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

    let progressFormula;
    await this.fsFormulas.doc('ProgressGoal').ref.get().then( doc =>
      progressFormula = doc.data().text)
    // if (parseInt(amount) == 1)
    progressFormula = progressFormula.replace('<progress>', "<span class='progressStyle'>" + amount + "%</span>").replace('<goal>', "<span class='goalStyle'>" + goal.title + "</span>").replace('<left>', "<span class='leftStyle'>" + (100 - goal.progress) + "%</span>")
    // else
      // progressFormula = progressFormula.replace('<progress>', "<span class='progressStyle'>" + amount + "%</spa").replace('<goal>', goal.title + "</span>")

      // MAYBE ADD RemainingProgress formula
    // let rewardsFormula;
    // await this.fsFormulas.doc('Rewards').ref.get().then( doc =>
    //   rewardsFormula = doc.data().text)
    // rewardsFormula = rewardsFormula.replace('<rewards>', "<span class='rewardsStyle'>" + goal.TP*parseInt(amount) + " TP " + goal.FP*parseInt(amount) + " FP " + goal.Money*parseInt(amount) + " Money </span>")

    let closingFormula = '';
    await this.fsFormulas.doc('Closing').ref.get().then( doc =>
      closingFormula = doc.data().text)

    let snapshotText = '<p class="pStyle">' + introductoryFormula + " " + timeAndDateFormula + " " + progressFormula + " " + closingFormula + '</p>';
    console.log(snapshotText);
    let snapshot = {
      'text': snapshotText,
      'category': 'goal',
      'timestamp': now,
    }
    this.fsJournal.doc(now.toString()).ref.set(snapshot);

  } // scrie progres in jurnal
  async wjGoalComplete(goal){
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

    let completeFormula;
    await this.fsFormulas.doc('FinishedGoal').ref.get().then( doc =>
      completeFormula = doc.data().text)
    completeFormula = completeFormula.replace('<goal>', "<span class='goalStyle'>" + goal.title + "</span>")

    let rewardsFormula;
    await this.fsFormulas.doc('Rewards').ref.get().then( doc =>
      rewardsFormula = doc.data().text)
    rewardsFormula = rewardsFormula.replace('<rewards>', "<span class='rewardsStyle'>" + goal.TP + " TP " + goal.FP + " FP " + goal.Money + " Money </span>")

    let closingFormula = '';
    await this.fsFormulas.doc('Closing').ref.get().then( doc =>
      closingFormula = doc.data().text)

    let snapshotText = '<p class="pStyle">' + introductoryFormula + " " + timeAndDateFormula + " " + completeFormula + " " + rewardsFormula + " " + closingFormula + '</p>';
    let snapshot = {
      'text': snapshotText,
      'category': 'goal',
      'timestamp': now,
    }
    this.fsJournal.doc(now.toString()).ref.set(snapshot);

  } // scrie obiectiv in jurnal
  async wjChore(chore, i){
    let now = Date.parse(new Date().toISOString());
    let day = new Date().getDay();
    let time = new Date().getHours() + ":" + new Date().getMinutes();
    let date = new Date().getDate() + "/" + (new Date().getMonth() + 1) + '/' + new Date().getFullYear();

    let introductoryFormula = '';
    await this.fsFormulas.doc('Introductory').ref.get().then( doc =>
      introductoryFormula = doc.data().text)

    let timeAndDateFormula = '';
    await this.fsFormulas.doc('TimeAndDate').ref.get().then( doc =>
      timeAndDateFormula = doc.data().text)
    timeAndDateFormula = timeAndDateFormula.replace('<time>', "<span class='timeStyle'>" + time + "</span>").replace('<date>', "<span class='dateStyle'>" + date + "</span>");

    let choreFormula;
    await this.fsFormulas.doc('AddedChore').ref.get().then( doc =>
      choreFormula = doc.data().text)

    let choreClass;
    if(chore.daysDid[i]==chore.daysShould[i])
      choreClass = 'done'
      else if(chore.daysDid[i]==0)
        choreClass = 'undone'
        else
          choreClass = 'incomplete'
    choreFormula = choreFormula.replace('<title>', "<span class='choreTitleStyle'>" + chore.title + "</span>")
          .replace('<status>', "<span class='" + choreClass + "'>" + chore.daysDid[i]+ '/' + chore.daysShould[i] + '</span>')

    let rewardsFormula;
    await this.fsFormulas.doc('Rewards').ref.get().then( doc =>
      rewardsFormula = doc.data().text)
    rewardsFormula = rewardsFormula.replace('<rewards>', "<span class='rewardsStyle'>" + chore.TP + " TP " + chore.FP + " FP " + chore.Money + " Money </span>")

    let closingFormula = '';
    await this.fsFormulas.doc('Closing').ref.get().then( doc =>
      closingFormula = doc.data().text)

    let snapshotText = '<p class="pStyle">' + introductoryFormula + " " + timeAndDateFormula + " " + choreFormula + " " + rewardsFormula + " " + closingFormula + '</p>';
    let snapshot = {
      'text': snapshotText,
      'category': 'chore',
      'timestamp': now,
    }
    this.fsJournal.doc(now.toString()).ref.set(snapshot);

  } // scrie munca in jurnal
// Formulas
  fetchFormulas(){
    return this.fsFormulas.valueChanges();
  } // furnizeaza formulele
  updateFormula(title, formula){
    this.fsFormulas.doc(title).set({
      title: title,
      text: formula,
    })
  } // actualizeaza formulele
  initializeFormulas(){

    let formulas = {
        'Introductory': {
            title: 'Introductory',
            text: 'Hey Journal'
        },
        'TimeAndDate': {
            title: 'TimeAndDate',
            text: "It's <time> on <date> and"
        },
        'FinishedTodo': {
            title: 'FinishedTodo',
            text: 'I just finished my todo: <todo>.'
        },
        'DidExercise': {
            title: 'DidExercise',
            text: 'I just did <amount> <exercise>.'
        },
        'FinishedChore': {
            title: 'FinishedChore',
            text: 'I just finished my chore.'
        },
        'FinishedGoal': {
            title: 'FinishedGoal',
            text: 'I just finished my goal: <goal>.'
        },
        'ProgressGoal': {
            title: 'ProgressGoal',
            text: 'I just made <progress> towards <goal>. All i got is <left> left.'
        },
        'GotTreat': {
          title: 'GotTreat',
          text: 'I just enjoyed <amount> <treat>. Yummy!'
        },
        'AddedChore':{
          title: 'AddedChore',
          text: 'I just marked my daily chore: <title>. That makes it <status>.'
        },
        'Rewards': {
            title: 'Rewards',
            text: 'I netted <rewards> in this.'
        },
        'Costs': {
            title: 'Costs',
            text: 'It has costed me <costs>.'
        },
        // 'People'
        'Closing': {
            title: 'Closing',
            text: 'Later, journal!'
        }
      }

      Object.keys(formulas).forEach(key=>{

        this.fsFormulas.doc(formulas[key].title).set({
          'title': formulas[key].title,
          'text': formulas[key].text,
        })
      });
    }

  } // initializeaza formulele
//
