import {AfterViewInit, Component, Input, OnChanges, ViewEncapsulation} from '@angular/core';

import * as d3 from 'd3';
import {Title} from '@angular/platform-browser';
import {TdLoadingService} from '@covalent/core';

@Component({
  selector: 'qs-line-chart',
  templateUrl: './line-chart.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./line-chart.component.scss']
})

export class LineChartComponent implements OnChanges, AfterViewInit {
  initExecuted = false;
  title = 'app';

  width;
  height;
  @Input() yAxisTile;

  @Input() sprints: JSON[];
  @Input() chartClassName;

  constructor(private _titleService: Title,
              private _loadingService: TdLoadingService) {
  }

  ngAfterViewInit() {
    if (this.sprints) {
      this.render()
    }
  }

  ngOnChanges(changes: any) {
    this.sprints = changes.sprints.currentValue;
    if (this.initExecuted) {
      this.update();
    }
  }


  render() {
    const sprints = this.sprints;

    const svg = d3.select(`.${this.chartClassName}`).select('svg'),
      margin = {top: 20, right: 80, bottom: 30, left: 50},
      width = +svg.attr('width') - margin.left - margin.right,
      height = +svg.attr('height') - margin.top - margin.bottom,
      g = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    this.width = +svg.attr('width');
    this.height = +svg.attr('height');


    const parseTime = d3.timeParse('%Y%m%d');

    const x = d3.scaleTime().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);
    const z = d3.scaleOrdinal(d3.schemeCategory10);

    const line = d3.line<any>()
      .curve(d3.curveBasis)
      .x(function (d) {
        return x(d['date']);
      })
      .y(function (d) {
        return y(d['points']);
      });

    const keys = d3.keys(sprints[0])
      .filter((key: string) => key !== <string>'Committed'
      && key !== <string>'date' && key !== <string>'Completed' && key !== <string>'name');

    const estimates = keys.map(function (id) {
      return {
        id: id,
        values: sprints.map(function (d) {
          return {date: parseTime(d['date']), points: +d[id]};
        })
      };
    });


    //noinspection TypeScriptUnresolvedFunction
    x.domain(d3.extent(sprints, function (d) {
      return parseTime(d['date']);
    }));

    const min = d3.min(estimates, function (c) {
      return d3.min(c.values, function (d) {
        return d.points;
      });
    });

    const max = d3.max(estimates, function (c) {
      return d3.max(c.values, function (d) {
        return d.points;
      });
    });


    //noinspection TypeScriptUnresolvedFunction
    y.domain([min, max]);

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
      .text(this.yAxisTile);

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
        //noinspection TypeScriptValidateTypes
        return 'translate(' + x(d.value.date) + ',' + y(d.value.points) + ')';
      })
      .attr('x', 3)
      .attr('dy', '0.35em')
      .style('font', '10px sans-serif')
      .text(function (d) {
        return d.id;
      });

    this.initExecuted = true;
  }

  update() {
    const svg = d3.select(`.${this.chartClassName}`).select('svg');
    svg.remove();

    d3.select(`.${this.chartClassName}`).append('svg').attr('width', this.width).attr('height', this.height);
    this.render();
  }

}
