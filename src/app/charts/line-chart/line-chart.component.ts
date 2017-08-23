import {AfterViewInit, Component, HostListener, Input, NgZone, OnChanges, ViewEncapsulation} from '@angular/core';

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

  @Input() data: JSON[];
  @Input() chartClassName;
  @Input() interactive: boolean;
  @Input() forecast: boolean;

  constructor(private _titleService: Title,
              private _loadingService: TdLoadingService,
              private ngZone: NgZone) {
  }

  ngAfterViewInit() {
    if (this.data) {
      this.render()
    }

    window.onresize = (e) => {
      this.ngZone.run(() => {
        this.update();
      });
    };
  }

  ngOnChanges(changes: any) {
    this.data = changes.data.currentValue;
    if (this.initExecuted) {
      this.update();
    }
  }


  render() {
    const sprints = this.data;

    this.width = 960;
    this.height = 500;

    const offsetHeight = document.getElementsByClassName(`${this.chartClassName}`)[0].clientHeight;
    const offsetWidth = document.getElementsByClassName(`${this.chartClassName}`)[0].clientWidth;

    this.height = 300;
    this.width = offsetWidth;

    d3.select(`.${this.chartClassName}`).append('svg').attr('width', this.width).attr('height', this.height);

    const svg = d3.select(`.${this.chartClassName}`).select('svg'),
      margin = {top: 20, right: 80, bottom: 30, left: 50},
      width = this.width - margin.left - margin.right,
      height = this.height - margin.top - margin.bottom,
      g = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // this.width = +svg.attr('width');
    // this.height = +svg.attr('height');


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
      .filter((key: string) => key !== <string>'date' && key !== <string>'lastDate');

    const estimates = keys.map(function (id) {
      return {
        id: id,
        values: sprints.map(function (d) {
          return {date: parseTime(d['date']), points: +d[id]};
        }),
        visible: true,
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


    if (this.forecast) {
      const idx = estimates[0].values.length - 2;

      const forecastStartDate = parseTime(sprints[0]['lastDate']);

      console.log(forecastStartDate);

      g.append('line')
        .attr('x1', x(forecastStartDate))
        .attr('y1', 0)
        .attr('x2', x(forecastStartDate))
        .attr('y2', height)
        .style('stroke-width', 1)
        .style('stroke', 'black')
        .style('fill', 'none');
    }

    if (this.interactive) {
      const legendSpace = 450 / keys.length;

      estimate.append('rect')
        .attr('width', 10)
        .attr('height', 10)
        .attr('x', width + (margin.right / 3) - 15)
        .attr('y', function (d, i) {
          return (legendSpace) + i * (legendSpace) - 8;
        })  // spacing
        .attr('fill', function (d) {
          return d.visible ? z(d.id) : '#F1F1F2'; // If array key "visible" = true then color rect, if not then make it grey
        })
        .attr('class', 'legend-box')

        .on('click', function (d) { // On click make d.visible
          d.visible = !d.visible; // If array key for this data selection is "visible" = true then make it false, if false then make it true

          estimate.select('path')
            .transition()
            .attr('d', function (ds) {
              return ds.visible ? line(ds.values) : null; // If d.visible is true then draw line for this d selection
            });
          estimate.select('rect')
            .transition()
            .attr('fill', function (d) {
              const color = d.visible ? z(d.id) : '#F1F1F2';
              return color;
            });
        });

      estimate.append('text')
        .attr('x', width + (margin.right / 3))
        .style('font', '10px sans-serif')
        .attr('y', function (d, i) {
          return (legendSpace) + i * (legendSpace);
        })
        .text(function (d) {
          return d.id;
        });

    } else {
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
    }
    this.initExecuted = true;
  }

  update() {
    const svg = d3.select(`.${this.chartClassName}`).select('svg');
    svg.remove();

    this.render();
  }

  @HostListener('window:resize')
  onWindowResize() {
    this.update();
  }

}
