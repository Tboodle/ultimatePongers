import { AfterViewChecked, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Match } from 'src/app/shared/models/match';
import { Player } from 'src/app/shared/models/player';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'stat-graph-card',
  templateUrl: './stat-graph-card.component.html',
  styleUrls: ['./stat-graph-card.component.scss'],
})
export class StatGraphCardComponent implements OnChanges, AfterViewChecked {
  @Input() matches: Match[];
  @Input() player: Player;
  @Input() players: Player[];


  filteredMatches: Match[];
  noRatedMatches: boolean = true;
  chart: Chart;
  chartShouldUpdate = false;
  generateTooltipForDataPoint = (data: any) => {
    console.log(data);
    const match = this.filteredMatches[data[0].dataIndex];
    const currentPlayerWon = this.player.id === match.winnerId;
    return match.date.toLocaleString() + 
    '\n' + (currentPlayerWon ? 'Win' : 'Loss') + ' vs ' + 
    this.players.find((matchPlayer) => 
      matchPlayer.id === (currentPlayerWon ? match.loserId : match.winnerId))?.name + 
    '\n' + (currentPlayerWon ? match.winnerScore : match.loserScore) + 
    ' - ' + (currentPlayerWon ? match.loserScore : match.winnerScore)
  }

  constructor() {
    Chart.register(...registerables);
  }

  ngOnChanges(changes: SimpleChanges): void {
    const filteredMatches = this.matches?.filter((match) => match.winnerEndElo);
    if (filteredMatches?.length > 0 && this.player) {
      this.noRatedMatches = false;
    } else {
      this.noRatedMatches = true;
    }

    if (changes['matches']) {
      this.chartShouldUpdate = !this.noRatedMatches;
    }
  }

  ngAfterViewChecked(): void {
    this.filteredMatches = this.matches
      ?.filter((match) => match.winnerEndElo)
      .reverse()
      .slice(-10);
    if (this.chartShouldUpdate) {
      this.populateEloChart();
    }
  }

  private populateEloChart() {
    const canvas = document.getElementById('chart') as HTMLCanvasElement;
    const data = this.generateDataFromFilteredMatches();
    const playerElos = this.filteredMatches.map((match) => this.getPlayerEloForMatch(match) || 99999999);
    const minElo = Math.min(...playerElos);
    const maxElo = Math.max(...playerElos);
    const yScaleMin = Math.floor((minElo * 0.9) / 10) * 10;
    const yScaleMax = Math.floor((maxElo * 1.1) / 10) * 10;
    const options = {
      scales: {
        y: {
          suggestedMin: yScaleMin,
          suggestedMax: yScaleMax,
          title: {
            display: true,
            text: 'Rating',
          },
        },
        x: {
          title: {
            display: true,
            text: 'Games Back',
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            title: this.generateTooltipForDataPoint
          }
        }
      },
    };

    this.chart = new Chart(canvas, {
      type: 'line',
      data,
      options,
    });
    this.chartShouldUpdate = false;
  }

  private generateDataFromFilteredMatches() {
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

    this.filteredMatches.forEach((match, index) => {
      data.labels[index] = this.filteredMatches.length - index - 1;
      data.datasets[0].data[index] = this.getPlayerEloForMatch(match) || 0;
    });
    return data;
  }

  private getPlayerEloForMatch(match: Match): number | undefined {
    return this.player?.id === match.winnerId ? match.winnerEndElo : match.loserEndElo;
  }
}
