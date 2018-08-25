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

          }
      })
    }

  convertDate(input){
    var weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    let fud = new Date(input);
    let date = weekday[fud.getDay()] + ' ' + fud.getDate() + "/" + (fud.getMonth() + 1) + "/" + fud.getFullYear() + '|' + fud.getHours() + ":" + fud.getMinutes();
    return date;
  }

  fetchJournal(){
    this.fsp.fetchJournal().subscribe( snapshots => {
      console.log(snapshots);
      this.snapshots = snapshots;

    })
  }

  fetchJournalWithFilter(start, end){
    this.fsp.fetchJournalWithFilter(start, end).subscribe( snapshots => {
      this.snapshots = snapshots;

    })
  }

   changedFilter(){
     console.log('CHANGED');
     console.log(Date.parse(this.timeStart), Date.parse(this.timeEnd));
     this.fetchJournal();
     // if (Date.parse(this.timeStart) < Date.parse(this.timeEnd) )/
      this.fetchJournalWithFilter(Date.parse(this.timeStart), Date.parse(this.timeEnd));
   }



  addSnapshot(){
    let addSnapshotModal = this.modalCtrl.create(AddSnapshotModalPage);
    addSnapshotModal.present();
  }
}
