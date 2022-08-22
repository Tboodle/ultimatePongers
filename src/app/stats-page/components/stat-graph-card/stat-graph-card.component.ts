import { Component, ElementRef, Input, OnChanges } from '@angular/core';
import { Match } from 'src/app/shared/models/match';
import { Player } from 'src/app/shared/models/player';
import { Chart, ChartItem } from 'chart.js';

@Component({
  selector: 'stat-graph-card',
  templateUrl: './stat-graph-card.component.html',
  styleUrls: ['./stat-graph-card.component.scss'],
})
export class StatGraphCardComponent implements OnChanges {
  @Input() matches: Match[];
  @Input() player: Player;

  noRatedMatches: boolean = true;
  constructor(private el: ElementRef) {}

  ngOnChanges(): void {
    const filteredMatches = this.matches
      ?.filter((match) => match.winnerEndElo)
      .sort((match1, match2) => match2.date.valueOf() - match1.date.valueOf())
      .slice(-10);

    if (filteredMatches) {
      const canvas = document.getElementById('line-chart');
      let speedData = {
        labels: ['0s', '10s', '20s', '30s', '40s', '50s', '60s'],
        datasets: [
          {
            label: 'Car Speed (mph)',
            data: [0, 59, 75, 20, 20, 55, 40],
          },
        ],
      };
      let lineChart = new Chart((canvas as HTMLCanvasElement) || ({} as HTMLCanvasElement), {
        type: 'line',
        data: speedData,
      });
    } else {
      this.noRatedMatches = true;
    }
  }
}
