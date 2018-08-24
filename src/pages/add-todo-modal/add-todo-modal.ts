import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { FirestorageProvider } from '../../providers/firestorage/firestorage';

/**
 * Generated class for the AddTodoModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-add-todo-modal',
  templateUrl: 'add-todo-modal.html',
})
export class AddTodoModalPage {

  todo = {}

  constructor(public navCtrl: NavController, public navParams: NavParams, public fsp: FirestorageProvider, public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddTodoModalPage');
  }
  addTodo(){
    this.fsp.insertTodo(this.todo);
    this.viewCtrl.dismiss();
  }
}
