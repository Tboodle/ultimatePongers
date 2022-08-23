import { Component, ElementRef, Input, OnChanges } from '@angular/core';
import { Match } from 'src/app/shared/models/match';
import { Player } from 'src/app/shared/models/player';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'stat-graph-card',
  templateUrl: './stat-graph-card.component.html',
  styleUrls: ['./stat-graph-card.component.scss'],
})
export class StatGraphCardComponent implements OnChanges {
  @Input() matches: Match[];
  @Input() player: Player;

  noRatedMatches: boolean = true;
  constructor() {
    Chart.register(...registerables);
  }

  ngOnChanges(): void {
    console.log(this.matches);
    const filteredMatches = this.matches
      ?.filter((match) => match.winnerEndElo)
      .sort((match1, match2) => match2.date.valueOf() - match1.date.valueOf())
      .slice(-10);

    console.log(filteredMatches);

    if (filteredMatches?.length > 0 && this.player) {
      this.populateEloChart(filteredMatches);
    } else {
      this.noRatedMatches = true;
    }
  }

  private populateEloChart(filteredMatches: Match[]) {
    const canvas = document.getElementById('chart') as HTMLCanvasElement;
    const data = this.generateDataFromMatches(filteredMatches);
    const playerElos = filteredMatches.map((match) => this.getPlayerEloForMatch(match) || 99999999);
    const minElo = Math.min(...playerElos);
    const maxElo = Math.max(...playerElos);
    const yScaleMin = Math.round((minElo * 0.9) / 50) * 50;
    const yScaleMax = Math.round((maxElo * 1.1) / 50) * 50;

    new Chart(canvas, {
      type: 'line',
      data: data,
      options: {
        scales: {
          y: {
            min: yScaleMin,
            max: yScaleMax,
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });
  }

  private generateDataFromMatches(filteredMatches: Match[]) {
    const btiOrange = '#FE7839';
    const data = {
      labels: [0],
      datasets: [
        {
          label: 'Rating',
          data: [0],
          borderColor: btiOrange,
          backgroundColor: btiOrange,
          fill: false,
        },
      ],
    };

    filteredMatches.forEach((match, index) => {
      data.labels[index] = filteredMatches.length - index;
      data.datasets[0].data[index] = this.getPlayerEloForMatch(match) || 0;
    });
    return data;
  }

  private getPlayerEloForMatch(match: Match): number | undefined {
    return this.player?.id === match.winnerId ? match.winnerEndElo : match.loserEndElo;
  }
}
