import {Component, OnInit, ViewEncapsulation} from '@angular/core';

import * as d3 from 'd3';
import {SprintDetailsService} from './sprint-details-service';
import {Title} from '@angular/platform-browser';
import {TdLoadingService} from '@covalent/core';

@Component({
  selector: 'qs-diff-chart',
  templateUrl: './diff-chart.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./diff-chart.component.scss']
})

export class DiffChartComponent implements OnInit {
  title = 'app';
  sprints: JSON[];
  width = 960;
  height = 500;

  constructor(private sprintDetailsService: SprintDetailsService,
              private _titleService: Title,
              private _loadingService: TdLoadingService) {
  }

  ngOnInit() {
    this.load();
  }

  async load(): Promise<void> {
    try {
      this._loadingService.register('diff-chart.list');
      this.sprints = await this.sprintDetailsService.search('491', '365');
    } finally {
      console.log(this.sprints);
      this.render();
      this._loadingService.resolve('diff-chart.list');
    }
  }


  draw() {
    this.sprintDetailsService.search('491', '365').then(data => {
      this.sprints = data;
      this.render();
    }).catch((ex) => {
      console.error('Error fetching users', ex);
    });
  }

  render() {
    const sprints = this.sprints;

    const svg = d3.select('.diff-chart-1'),
      margin = {top: 20, right: 80, bottom: 30, left: 50},
      width = this.width - margin.left - margin.right,
      height = this.height - margin.top - margin.bottom,
      g = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    const parseTime = d3.timeParse('%Y%m%d');

    const x = d3.scaleTime().range([0, width]),
      y = d3.scaleLinear().range([height, 0]),
      z = d3.scaleOrdinal(d3.schemeCategory10);

    const line = d3.line<any>()
      .curve(d3.curveBasis)
      .x(function (d) {
        return x(d['date']);
      })
      .y(function (d) {
        return y(d['points']);
      });

    const keys = ['completed_estimate', 'not_completed_estimate'];

    const estimates = keys.map(function (id) {
      return {
        id: id,
        values: sprints.map(function (d) {
          return {date: parseTime(d['date']), points: +d[id]};
        })
      };
    });


    x.domain(d3.extent(sprints, function (d) {
      return parseTime(d['date']);
    }));

    y.domain([
      d3.min(estimates, function (c) {
        return d3.min(c.values, function (d) {
          return d.points;
        });
      }),
      d3.max(estimates, function (c) {
        return d3.max(c.values, function (d) {
          return d.points;
        });
      })
    ]);

    z.domain(estimates.map(function (c) {
      return c.id;
    }));

    g.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(x));

    g.append('g')
      .attr('class', 'axis axis--y')
      .call(d3.axisLeft(y))
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '0.71em')
      .attr('fill', '#000')
      .text('Story Points');

    const estimate = g.selectAll('.estimate')
      .data(estimates)
      .enter().append('g')
      .attr('class', 'estimate');

    estimate.append('path')
      .attr('class', 'line')
      .attr('d', function (d) {
        const d2 = d['values'];
        return line(d2);
      })
      .style('stroke', function (d) {
        return z(d.id);
      });

    estimate.append('text')
      .datum(function (d) {
        return {
          id: d.id, value: d.values[d.values.length - 1]
        };
      })
      .attr('transform', function (d) {
        return 'translate(' + x(d.value.date) + ',' + y(d.value.points) + ')';
      })
      .attr('x', 3)
      .attr('dy', '0.35em')
      .style('font', '10px sans-serif')
      .text(function (d) {
        return d.id;
      });
  }

}
