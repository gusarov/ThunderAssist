import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bulb',
  templateUrl: './bulb.component.html',
  styleUrls: ['./bulb.component.css']
})
export class BulbComponent implements OnInit {
  state = '_red';
  name = '_bulb';

  constructor() { }

  ngOnInit() {
  }

}
