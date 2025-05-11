import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { IUser } from '../interfaces/user.interface';
import { environment } from 'src/environments/environment';

const SMALL_WIDTH_BREAKPOINT = 992;

@Component({
  selector: 'hfm-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent implements OnInit {
  @ViewChild('drawer') matDrawer!: MatDrawer;

  isSmallScreen: boolean = false;
  isLoggedIn: boolean = false;
  user?: IUser;
  googleClientId = environment.googleClientId;
  googleDataLoginUrl = `${environment.serverUrl}/auth/login`;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {
    // get token from url param if available
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('token');
    // set token in session storage if available
    if (accessToken) {
      this.userService.getUser(accessToken).subscribe((user) => {
        this.authService.setUser(user);
        window.location.replace('/');
      });
    }
  }

  ngOnInit(): void {
    this.breakpointObserver
      .observe([`(max-width: ${SMALL_WIDTH_BREAKPOINT}px)`])
      .subscribe((state: BreakpointState) => {
        this.isSmallScreen = state.matches;
      });

    this.isLoggedIn = this.authService.isAuthenticated();
    this.user = this.authService.getUser() ?? undefined;
  }

  onLinkClick(): void {
    if (this.isSmallScreen) {
      this.matDrawer.close();
    }
  }

  onSignOutClick() {
    this.authService.logOut();
  }
}
