import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { AddSnapshotModalPage } from '../add-snapshot-modal/add-snapshot-modal';
import { FirestorageProvider } from '../../providers/firestorage/firestorage';
import { AngularFireAuth } from 'angularfire2/auth';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-journal',
  templateUrl: 'journal.html',
})
export class JournalPage {

  // dateStart : any = new Date().toISOString();
  timeStart: any = new Date().toISOString();
  // dateEnd: any = new Date().toISOString();
  timeEnd: any = new Date().toISOString();
  snapshots: any;

  myProfile: any = {};
  allCategories = [
    {'title':'goal', 'allowed':true},
    {'title':'chore', 'allowed':true},
    {'title':'treat', 'allowed':true},
    {'title':'exercise', 'allowed':true},
    {'title':'todo', 'allowed':true},
    {'title':'plan', 'allowed':true},
  ]

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl:ModalController, public fsp: FirestorageProvider,  public afAuth: AngularFireAuth) {

  }

    ionViewWillLoad(){
        // already logged in guard
        this.afAuth.authState.subscribe(data=> {
        console.log(data);
          if(data == null)
            this.navCtrl.setRoot(LoginPage)
          else
          {
            this.fetchJournal();
            this.fetchProfile();

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


  convertDate(input){
    var weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    let fud = new Date(input);
    let date = weekday[fud.getDay()] + ' ' + fud.getDate() + "/" + (fud.getMonth() + 1) + "/" + fud.getFullYear() + '|' + fud.getHours() + ":" + fud.getMinutes();
    return date;
  }

  fetchJournal(){
    this.fsp.fetchJournal().subscribe( snapshots => {
      this.snapshots = snapshots;

    })
  }

  fetchJournalWithFilter(start, end){
    let allowedCategories = this.allCategories.filter(cat=>cat.allowed == true).map(cat=>cat.title);
    console.log(allowedCategories);
    this.fsp.fetchJournalWithFilter(start, end).subscribe( snapshots => {
      this.snapshots = snapshots.filter(snp =>{
        // console.log(snp.category, allowedCategories.findIndex( x=> x.title != snp.category ))
        // console.log(snp.category, allowedCategories, allowedCategories.findIndex( x=> x.toString() == snp.category.toString() ),  allowedCategories.findIndex( x=> x.toString() = snp.category.toString() ) > -1);
        allowedCategories.findIndex( x=> x.toString() == snp.category.toString() ) < 0
        });
      console.log(snapshots.length);
      console.log(this.snapshots.length);
    })
    // console.log(this.snapshots.length);
  }

   changedFilter(){
     // console.log(Date.parse(this.timeStart), Date.parse(this.timeEnd));
     // this.fetchJournal();
     // if (Date.parse(this.timeStart) < Date.parse(this.timeEnd) )/
      this.fetchJournalWithFilter(Date.parse(this.timeStart), Date.parse(this.timeEnd));
   }

   deleteSnapshot(snapshot){
     this.fsp.deleteSnapshot(snapshot);
   }

  addSnapshot(){
    let addSnapshotModal = this.modalCtrl.create(AddSnapshotModalPage);
    addSnapshotModal.present();
  }
}
