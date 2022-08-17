import { Component, ElementRef, Input, OnChanges } from '@angular/core';
import { Match } from 'src/app/shared/models/match';
import * as d3 from 'd3';
import { Player } from 'src/app/shared/models/player';

@Component({
  selector: 'stat-graph-card',
  templateUrl: './stat-graph-card.component.html',
  styleUrls: ['./stat-graph-card.component.scss'],
})
export class StatGraphCardComponent implements OnChanges {
  @Input() matches: Match[];
  @Input() player: Player;

  noRatedMatches = false;
  constructor(private el: ElementRef) {}

  ngOnChanges(): void {
    const filteredMatches = this.matches
      ?.filter((match) => match.winnerEndElo)
      .sort((match1, match2) => match2.date.valueOf() - match1.date.valueOf())
      .slice(-10);
    if (filteredMatches) {
      // set the dimensions and margins of the graph
      var margin = { top: 10, right: 30, bottom: 30, left: 20 };

      // append the svg object to the body of the page
      var svg = d3
        .select('#elo-graph')
        .append('svg')
        .attr('viewBox', '0 0 ' + 1000 + ' ' + 450)
        .attr('preserveAspectRatio', 'xMinYMin')
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

      const data = this.formatGraphData();
      var x = d3
        .scaleTime()
        .domain([data[0].date, data[data.length - 1].date])
        .range([0, this.el.nativeElement.offsetWidth]);
      svg
        .append('g')
        .attr('transform', 'translate(0,' + this.el.nativeElement.offsetHeight + ')')
        .call(d3.axisBottom(x));

      // Add Y axis
      var y = d3
        .scaleLinear()
        .domain([
          Math.min.apply(
            Math,
            data.map((point) => point.value),
          ),
          Math.max.apply(
            Math,
            data.map((point) => point.value),
          ),
        ])
        .range([this.el.nativeElement.offsetHeight, 0]);
      svg.append('g').call(d3.axisLeft(y));

      // Add the line
      svg
        .append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', 'steelblue')
        .attr('stroke-width', 1.5);
      // .attr(
      //   'd',
      //   d3
      //     .line()
      //     .x((point) => x(point.date))
      //     .y((point) => y(point.value)),
      // );
    } else {
      this.noRatedMatches = true;
    }
  }

  private formatGraphData(): { date: any; value: number }[] {
    return this.matches.map((match: any) => {
      return {
        date: d3.timeParse('%Y-%m-%d')(
          new Date(match.date?.seconds * 1000).toISOString().split('T')[0],
        ),
        value:
          this.player.id === match.winnerId ? match?.winnerEndElo ?? 0 : match?.loserEndElo ?? 0,
      };
    });
  }
}
