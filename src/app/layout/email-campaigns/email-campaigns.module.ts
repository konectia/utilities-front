import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbCarouselModule, NgbAlertModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { EmailCampaignsRoutingModule } from './email-campaigns.routing.module';
import { StatModule } from '../../shared';
import { EmailCampaignsComponent } from './email-campaigns.component';
import { DropDownComponent } from '../components/drop-down/drop-down.component';
import { EmailListInfoComponent } from '../email-list-info/email-list-info.component';
import { NewFileComponent } from '../new-file/new-file.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    imports: [
        CommonModule,
        NgbCarouselModule,
        NgbAlertModule,
        EmailCampaignsRoutingModule,
        StatModule,
        NgbModule,
        TranslateModule
    ],
    declarations: [
        EmailCampaignsComponent,
        DropDownComponent,
        EmailListInfoComponent,
        NewFileComponent
    ],
    entryComponents: [ EmailListInfoComponent, NewFileComponent ]
})
export class EmailCampaignsModule {}
