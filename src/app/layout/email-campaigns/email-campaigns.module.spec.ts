import { EmailCampaignsModule } from './email-campaigns.module';

describe('EmailCampaignsModule', () => {
  let emailCampaignsModule: EmailCampaignsModule;

  beforeEach(() => {
    emailCampaignsModule = new EmailCampaignsModule();
  });

  it('should create an instance', () => {
    expect(emailCampaignsModule).toBeTruthy();
  });
});
