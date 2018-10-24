import React, { Component } from 'react';
import Snap from 'snapsvg-cjs';

class Modal extends Component {
    sectors = [
        "#f44336",
        "#3F51B5",
        "#9C27B0",
        "#4CAF50",
        "#00BCD4",
        "#E91E63"
    ]

    componentDidMount() {
        let svg = Snap("#modal");

        let group = svg.g();

        for (let index in this.sectors) {
            let sector = svg.path(this.describeSector(100, 100, 90, 70, 360/this.sectors.length*(index-1), 360/this.sectors.length*index - 2))
                .attr({
                    stroke : "transparent",
                    strokeWidth : 2,
                    fill : this.sectors[index]
                })

            group.add(sector);
        }

        svg.text(100, 100, "Loading")
            .attr({
                'text-anchor' : 'middle',
                fill : '#fff'
            })

        setInterval(() => {
            let date = new Date();

            let ss = date.getSeconds();
            let ms = date.getMilliseconds();
            let angleSeconds = ss * 6 + ms / (500 / 3);

            group.transform(`r${ angleSeconds }, 100, 100`);
        }, 1)
    }

    polarToCortasian(cx, cy, r, angle) {
        angle = (angle - 90) * Math.PI / 180;

        return {
            x : cx + r * Math.cos(angle),
            y : cy + r * Math.sin(angle)
        };
    }

    describeArc(x, y, r, startAngle, endAngle, continueLine) {
        let start = this.polarToCortasian(x, y, r, startAngle);
        let end = this.polarToCortasian(x, y, r, endAngle);
        let large = Math.abs(endAngle - startAngle) >= 180;

        return `
            ${continueLine?"L":"M"}${start.x},${start.y}
            A${r},${r},0
            ${large?1:0}
            ${endAngle > startAngle?1:0},${end.x},${end.y}
        `;
    }

    describeSector(x, y, r1, r2, startAngle, endAngle) {
        return `
            ${this.describeArc(x, y, r1, startAngle, endAngle)}
            ${this.describeArc(x, y, r2, endAngle, startAngle, true)}Z
        `;
    }


    render() {
        return (
            <svg id="modal"></svg>
        );
    }
}

export default Modal;