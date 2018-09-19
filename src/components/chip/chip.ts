import { Component, Input } from '@angular/core';

/**
 * Generated class for the ChipComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'chip',
  templateUrl: 'chip.html'
})
export class ChipComponent {

  @Input() amount: string;
  @Input() typeText: string;
  @Input() typeIcon: string;
  @Input() color: string;

  constructor() {

  }

}
