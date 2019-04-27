import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ZipEntry } from '../../../model/zip-entry.interface';
import { ZipTask } from '../../../model/zip-task.interface';
import { ZipTaskProgress } from '../../../model/zip-task-progress.interface';
declare const zip: any;
@Injectable({
    providedIn: 'root'
  })
export class ZipService {
  constructor() {
    zip.workerScriptsPath = 'scripts/';
  }

  getEntries(file): Observable<Array<ZipEntry>> {
    console.log('file: ' + file);
    return new Observable(subscriber => {
      const reader = new zip.BlobReader(file);
      zip.createReader(reader, zipReader => {
        zipReader.getEntries(entries => {
          subscriber.next(entries);
          subscriber.complete();
        });
      }, message => {
        subscriber.error({ message });
      });
    });
  }

  getData(entry: ZipEntry): ZipTask {
    const progress = new Subject<ZipTaskProgress>();
    const data = new Observable<Blob>(subscriber => {
      const writer = new zip.BlobWriter();

      // Using `as any` because we don't want to expose this
      // method in the interface
      (entry as any).getData(writer, blob => {
        subscriber.next(blob);
        subscriber.complete();
        progress.next(null);
      }, (current, total) => {
        progress.next({ active: true, current, total });
      });
    });
    return { progress, data };
  }
}
