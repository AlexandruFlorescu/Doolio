import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { Calendar } from '@ionic-native/calendar';

/**
 * Generated class for the CalendarDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-calendar-details',
  templateUrl: 'calendar-details.html',
})
export class CalendarDetailsPage {
  calName = '';
   events = [];

   constructor(public navCtrl: NavController, public navParams: NavParams, private calendar: Calendar, private plt: Platform) {
     this.calName = navParams.get('name');

     if (this.plt.is('ios')) {
       this.calendar.findAllEventsInNamedCalendar(this.calName).then(data => {
         this.events = data;
       });
     } else if (this.plt.is('android')) {
       let start = new Date();
       let end = new Date();
       end.setDate(end.getDate() + 31);

       this.calendar.listEventsInRange(start, end).then(data => {
         this.events = data;
       });
     }
   }
}
