import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';

const SMALL_WIDTH_BREAKPOINT = 992;

@Component({
  selector: 'hfm-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent implements OnInit {
  @ViewChild('drawer') matDrawer!: MatDrawer;

  isSmallScreen: boolean = false;

  constructor(private breakpointObserver: BreakpointObserver) {}

  ngOnInit(): void {
    this.breakpointObserver
      .observe([`(max-width: ${SMALL_WIDTH_BREAKPOINT}px)`])
      .subscribe((state: BreakpointState) => {
        this.isSmallScreen = state.matches;
      });
  }

  onLinkClick(): void {
    if (this.isSmallScreen) {
      this.matDrawer.close();
    }
  }
}
