import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { Calendar } from '@ionic-native/calendar';

/**
 * Generated class for the SchedulePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-schedule',
  templateUrl: 'schedule.html',
})
export class SchedulePage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public calendar: Calendar, private plt: Platform) {

    this.plt.ready().then(() => {
      this.calendar.listCalendars().then(data=>{
        this.calendar = data;
      })
    });
  }

  addEvent(cal){
    let date = new Date();
    let options = { calendarId: cal.id, calendarName: cal.name }

    this.calendar.createEventInteractivelyWithOptions('my event', 'Bucharest', 'notes', date, date, options). then(()=>{
      
    })
  }

  openCal(cal){
    this.navCtrl.push('CalDetailsPage', {name: cal.name})
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SchedulePage');
  }

}
