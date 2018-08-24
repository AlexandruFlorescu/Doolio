import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { FirestorageProvider } from '../../providers/firestorage/firestorage';
import { AddTodoModalPage } from '../add-todo-modal/add-todo-modal';

/**
 * Generated class for the TodosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-todos',
  templateUrl: 'todos.html',
})
export class TodosPage {

  todos: any[] = [{}];

  myProfile: any = {};

  constructor(public navCtrl: NavController, public navParams: NavParams, public fsp: FirestorageProvider, public modalCtrl: ModalController) {
    this.fetchProfile();
    this.fetchTodos();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TodosPage');
  }

    roundNumber(nr) {
      return Math.round(nr * 100)/100;
    }

    fetchProfile(){
      this.fsp.fetchProfile().then(()=>{
        this.myProfile = this.fsp.profile;
      });
    }

    fetchTodos(){
      this.fsp.fetchTodos().subscribe( todos =>{
        this.todos = todos;
      });
    }

    addTodo(){
      let addTodoModal = this.modalCtrl.create(AddTodoModalPage);
      addTodoModal.present();
    }
    deleteTodo(todo){
      this.fsp.deleteTodo(todo);
    }
    updateTodo(todo){
      this.fsp.updateTodo(todo);
    }

    // Update Reward Points
    addTreatPoints(amount: number){
      this.fsp.addTreatPoints(amount);
          this.fetchProfile();
    }

    addFitnessPoints(amount: number){
      this.fsp.addFitnessPoints(amount);
          this.fetchProfile();
    }

    addMoney(amount: number){
      this.fsp.addMoney(amount);
          this.fetchProfile();
    }
    //

    complete(todo){
      this.fsp.deleteTodo(todo);
      this.addTreatPoints( parseFloat(todo.TP) )
      this.addFitnessPoints( parseFloat(todo.FP) )
      this.addMoney( parseFloat(todo.Money) )

    }

}
