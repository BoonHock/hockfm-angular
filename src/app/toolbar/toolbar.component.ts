import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'hfm-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {
  @Input() displayToolbarMenu: boolean = false;
  @Output() toggleClicked: EventEmitter<string> = new EventEmitter<string>();

  constructor() {}

  ngOnInit(): void {}
}
