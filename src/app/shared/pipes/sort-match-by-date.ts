import { Pipe, PipeTransform } from '@angular/core';
import { Observable, map } from 'rxjs';
import { LiveMatch } from '../models/liveMatch';
import { Match } from '../models/match';

@Pipe({ name: 'sortMatchesByDate' })
export class SortMatchesByDatePipe implements PipeTransform {
  transform(matches$: Observable<LiveMatch[]>): Observable<LiveMatch[]> {
    return matches$.pipe(
      map((matches: LiveMatch[]) =>
        [...matches]
          .sort((match1, match2) => match1.date.getTime() - match2.date.getTime())
      ),
    );
  }
}
