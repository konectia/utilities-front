import { TestBed } from '@angular/core/testing';

import { EmailCampaignsService } from './email-campaigns.service';

describe('EmailCampaignsServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EmailCampaignsService = TestBed.get(EmailCampaignsService);
    expect(service).toBeTruthy();
  });
});
