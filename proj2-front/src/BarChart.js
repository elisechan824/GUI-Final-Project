/*
 * Project 1
 * BarChart component JavaScript source code
 *
 * Author: Elise Chan (elisechan824)
 * Version: 2.0
 */

import './BarChart.css';
import React, {useEffect} from 'react';
import { Box, createTheme } from '@mui/system';
import * as d3 from 'd3';

let svg = null;

let didMount = true;

const settings = {
    viewBox: {
        x: 0,
        y: 0,
        width: 100,
        height: 100
    },
    title: {
        x: 0,
        y: 0,
        width: 100,
        height: 10,
        baseline: 5
    },
    labels: {
        x: 5,
        y: 95,
        width: 95,
        height: 5,
        baseline: 2
    },
    values: {
        x: 0,
        y: 10,
        width: 5,
        height: 90,
        baseline: 4.5,
        min: 0,
        max: 7,
        step: 0.5
    },
    lines: {
        margin: 1.5
    },
    bars: {
        x: 5,
        y: 10,
        width: 95,
        height: 85,
        ratio: 0.7
    }
};

const BarChart = (props) => {
    let myReference = React.createRef();
    let dataset = props.dataset;
    if (dataset) {
    	settings.values.max = Math.max(...dataset.data.map(x => Object.values(x)[1]));
    }
    const init = () => {
        let container = d3.select(myReference.current);
        container
            .selectAll("*")
            .remove();
        svg = container
            .append("svg")
            .attr("viewBox", settings.viewBox.x + " " + settings.viewBox.y + " " + settings.viewBox.width + " " + settings.viewBox.height)
            .attr("preserveAspectRatio", "none")
            .style("width", "100%")
            .style("height", "100%")
            .style("border", "none");
    }

    const paint = () => {
    	if (!dataset) {
    		return;
    	}
        svg
            .selectAll("*")
            .remove();
        svg
            .append("g")
            .attr("id", "lines")
            .selectAll("line")
            .data(d3.range((settings.values.max - settings.values.min) / settings.values.step))
            .enter()
            .append("line")
            .attr("x1", settings.values.x + settings.values.width)
            .attr("x2", settings.values.x + settings.values.width + settings.bars.width - settings.lines.margin )
            .attr("y1", (item, index) => {
                return settings.labels.y - index * settings.bars.height / ((settings.values.max - settings.values.min) / settings.values.step);
            })
            .attr("y2", (item, index) => {
                return settings.labels.y - index * settings.bars.height / ((settings.values.max - settings.values.min) / settings.values.step);
            });

        svg
            .append("g")
            .attr("id", "bars")
            .selectAll("rect")
            .data(dataset.data)
            .enter()
            .append("rect")
            .attr("x", (item , index) => {
                return settings.bars.x + (1 - settings.bars.ratio + index) * settings.bars.width / (dataset.data.length + 1 - settings.bars.ratio);
            })
            .attr("y", (item , index) => {
                return settings.labels.y - Object.values(item)[1] * settings.bars.height / (settings.values.max - settings.values.min);
            })
            .attr("width", settings.bars.ratio * settings.bars.width / (dataset.data.length + 1 - settings.bars.ratio))
            .attr("height", (item , index) => {
                return Object.values(item)[1] * settings.bars.height / (settings.values.max - settings.values.min);
            })
            .style("fill", (item, index) =>
                props.selected.includes(index) ?"red" : "dodgerblue"
            )
            .on("click", (item, index) => {
                let dataObj = -1;
                for( let i = 0; i < props.value.data.length; i++) {
                    if(props.value.data[i] == index) {
                        dataObj = i;
                        break;
                    }
                }
                const isSelected = props.selected.includes(dataObj)
                
                if (isSelected) {
                    props.selectHandler({target: {checked: false}}, dataObj);
                }
                else {
                    props.selectHandler({target: {checked: true}}, dataObj);
                }
            });


        svg
            .append("g")
            .attr("id", "title")
            .append("text")
            .attr("x", (settings.title.x + settings.title.width) / 2)
            .attr("y", settings.title.y + settings.title.height - settings.title.baseline)
            .text(dataset.title);

        svg
            .append("g")
            .attr("id", "labels")
            .selectAll("text")
            .data(dataset.data)
            .enter()
            .append("text")
            .attr("x", (item , index) => {
                return settings.labels.x + (1 - settings.bars.ratio + index + settings.bars.ratio / 2) * settings.bars.width / (dataset.data.length + 1 - settings.bars.ratio);
            })
            .attr("y", settings.labels.y + settings.labels.height - settings.labels.baseline)
            .text((item, index) => {
                return Object.values(item)[0];
            });

        svg
            .append("g")
            .attr("id", "values")
            .selectAll("text")
            .data(d3.range((settings.values.max - settings.values.min) / settings.values.step))
            .enter()
            .append("text")
            .attr("x", settings.values.x + settings.values.width / 2)
            .attr("y", (item, index) => {
                return settings.values.y + settings.values.height - settings.values.baseline - index * settings.bars.height / ((settings.values.max - settings.values.min) / settings.values.step);
            })
            .text((item, index) => {
                return (item / 2.0).toFixed(1);
            });

    }


    useEffect(() => {
        if (didMount) {
            didMount = false;
            init();
            window.addEventListener('resize', () => {
                paint();
            })
        }
        paint();
    });

    return(
            <Box ref={myReference} sx={props.sx} >
            </Box>
    );

}

export default BarChart;
