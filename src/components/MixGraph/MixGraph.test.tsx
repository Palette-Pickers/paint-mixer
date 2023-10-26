import React from 'react';
import { render } from '@testing-library/react';
import MixGraph from './MixGraph';
import '@testing-library/jest-dom/extend-expect';
import styles from './MixGraph.module.scss';

describe('MixGraph', () => {
    const palette = [
        {label: "Red", partsInMix: 2, rgbString: "rgb(255,0,0)"},
        {label: "Green", partsInMix: 3, rgbString: "rgb(0,255,0)"},
        {label: "Blue", partsInMix: 0, rgbString: "rgb(0,0,255)"},
    ];

    it('renders without crashing', () => {
        render(<MixGraph palette={palette} totalParts={5} />);
    });

    it('renders the correct number of color segments', () => {
        const {container} = render(<MixGraph palette={palette} totalParts={5} />);
        const segments = container.getElementsByClassName(styles.segment);
        expect(segments.length).toBe(2); // only two have non-zero partsInMix
    });

    it('does not render segments with zero parts', () => {
        const {container} = render(<MixGraph palette={palette} totalParts={5} />);
        const blueSegment = [...container.getElementsByClassName(styles.segment)].find(div => (div as HTMLElement).style.backgroundColor === "rgb(0,0,255)");
        expect(blueSegment).toBeUndefined(); // should not find the blue segment
    });

    it('renders color segments with the correct width', () => {
        const {container} = render(<MixGraph palette={palette} totalParts={5} />);
        const redSegment = [...container.getElementsByClassName(styles.segment)].find(div => (div as HTMLElement).style.backgroundColor === "rgb(255,0,0)");
        const greenSegment = [...container.getElementsByClassName(styles.segment)].find(div => (div as HTMLElement).style.backgroundColor === "rgb(0,255,0)");

        expect((redSegment as HTMLElement).style.width).toBe('40%');
        expect((greenSegment as HTMLElement).style.width).toBe('60%');
    });
});
