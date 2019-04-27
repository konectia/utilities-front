import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EmailCampaignsModule } from './email-campaigns.module';
import { EmailCampaignsComponent } from './email-campaigns.component';

describe('EmailCampaignsComponent', () => {
  let component: EmailCampaignsComponent;
  let fixture: ComponentFixture<EmailCampaignsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        EmailCampaignsModule,
        RouterTestingModule,
        BrowserAnimationsModule,
       ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailCampaignsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
