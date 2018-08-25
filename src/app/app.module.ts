import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { ProfilePage } from '../pages/profile/profile';
import { TreatsPage } from '../pages/treats/treats';
import { FitnessPage } from '../pages/fitness/fitness';
import { TodosPage } from '../pages/todos/todos';
import { JournalPage } from '../pages/journal/journal';
import { SettingsPage } from '../pages/settings/settings';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { FIREBASE_CONFIG } from './app.firebase.config';
import { FirestorageProvider } from '../providers/firestorage/firestorage';


import { AddExerciseModalPage } from '../pages/add-exercise-modal/add-exercise-modal';
import { AddTreatModalPage } from '../pages/add-treat-modal/add-treat-modal';
import { ChangePictureModalPage } from '../pages/change-picture-modal/change-picture-modal';
import { AddTodoModalPage } from '../pages/add-todo-modal/add-todo-modal';
import { AddSnapshotModalPage } from '../pages/add-snapshot-modal/add-snapshot-modal';



@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    RegisterPage,
    ProfilePage,
    FitnessPage,
    AddExerciseModalPage,
    TreatsPage,
    AddTreatModalPage,
    ChangePictureModalPage,
    TodosPage,
    AddTodoModalPage,
    JournalPage,
    AddSnapshotModalPage,
    SettingsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFireAuthModule,
    AngularFirestoreModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    RegisterPage,
    ProfilePage,
    FitnessPage,
    AddExerciseModalPage,
    TreatsPage,
    AddTreatModalPage,
    ChangePictureModalPage,
    TodosPage,
    AddTodoModalPage,
    JournalPage,
    AddSnapshotModalPage,
    SettingsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    FirestorageProvider
  ]
})
export class AppModule {}
