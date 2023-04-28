import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let mockPodcastService;
  let mockElementRef;
  let mockScrollDispatcher;
  let mockCdRef;
  let mockSnackbar;

  beforeEach(async () => {
    // await TestBed.configureTestingModule({
    //   declarations: [HomeComponent],
    // }).compileComponents();

    // fixture = TestBed.createComponent(HomeComponent);
    // component = fixture.componentInstance;
    // fixture.detectChanges();

    mockPodcastService = jasmine.createSpyObj([
      'updatePodcastStatus',
      'getPodcastsToListen',
    ]);
    mockElementRef = jasmine.createSpyObj(['nativeElement']);
    mockScrollDispatcher = jasmine.createSpyObj(['scrolled']);
    mockCdRef = jasmine.createSpyObj(['detectChanges']);
    mockSnackbar = jasmine.createSpyObj(['open']);
    
    component = new HomeComponent(
      mockPodcastService,
      mockElementRef,
      mockScrollDispatcher,
      mockCdRef,
      mockSnackbar
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
