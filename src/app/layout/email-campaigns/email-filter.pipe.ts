
import { EmailList } from 'src/app/model/email-list';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'emailFilter'
})
export class EmailFilterPipe implements PipeTransform {

  transform(items: EmailList[], searchText: string): any {

    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }
    searchText = searchText.toLocaleLowerCase();
    return items.filter(it => {
      return it.name.toLocaleLowerCase().includes(searchText)
        || it.subscribedEmails.some(email => email.toLocaleLowerCase().includes(searchText))
        || it.unSubscribedEmails.some(email => email.toLocaleLowerCase().includes(searchText));
    });
  }

}
