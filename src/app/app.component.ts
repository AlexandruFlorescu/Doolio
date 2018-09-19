import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, NavController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { TreatsPage } from '../pages/treats/treats';
import { LoginPage } from '../pages/login/login';
import { FitnessPage } from '../pages/fitness/fitness';
import { TodosPage } from '../pages/todos/todos';
import { JournalPage } from '../pages/journal/journal';
import { SettingsPage } from '../pages/settings/settings';
import { GoalsPage } from '../pages/goals/goals';
import { FirestorageProvider } from '../providers/firestorage/firestorage';
import { AngularFireAuth } from 'angularfire2/auth';
import { ChoresPage } from '../pages/chores/chores';
import { SchedulePage } from '../pages/schedule/schedule';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;
  myProfile: any = {'image':'https://via.placeholder.com/350x150'};

  pages: Array<{title: string, component: any, icon: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public fsp: FirestorageProvider, public afAuth: AngularFireAuth) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage, icon:'home' },
      { title: 'Treats and Wishlist', component: TreatsPage, icon:'trophy' },
      { title: 'Fitness assistant', component: FitnessPage, icon:'tennisball'},
      { title: 'Goals', component: GoalsPage, icon:'checkbox-outline'},
      { title: 'Todos', component: TodosPage, icon:'done-all'},
      { title: 'Chores', component: ChoresPage, icon:'switch'},
      { title: 'Journal', component: JournalPage, icon:'create' },
      { title: 'Settings', component: SettingsPage, icon:'cog' },
      { title: 'Login', component: LoginPage, icon:'person-add' },
    ];

        this.afAuth.authState.subscribe(data=> {
        console.log(data);
          if(data != null)
          {
            this.fetchProfile();
            console.log('profile:', this.myProfile);
          }
        })
  }

  ionViewWillLoad(){
      // already logged in guard

  }

  fetchProfile(){
      this.fsp.fetchProfile().then(()=>{
        if(this.fsp.profile == undefined)
          this.myProfile = {'image':'https://via.placeholder.com/350x150'}
        this.myProfile = this.fsp.profile
      });
    }


  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();

    });
  }

  checkActive(p){
    return false;
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.push(page.component);
  }
}
