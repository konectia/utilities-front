import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmailCampaignsComponent } from './email-campaigns.component';
import { TranslateModule } from '@ngx-translate/core';

const routes: Routes = [
    {
        path: '', component: EmailCampaignsComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes), TranslateModule],
    exports: [RouterModule]
})
export class EmailCampaignsRoutingModule {
}
