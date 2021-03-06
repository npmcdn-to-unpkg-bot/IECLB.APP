import { DragGesture } from './drag-gesture';
export declare class SlideGesture extends DragGesture {
    slide: SlideData;
    constructor(element: any, opts?: {});
    getSlideBoundaries(slide: SlideData, ev: any): {
        min: number;
        max: number;
    };
    getElementStartPos(slide: SlideData, ev: any): number;
    canStart(ev: any): boolean;
    onDragStart(ev: any): boolean;
    onDrag(ev: any): boolean;
    onDragEnd(ev: any): void;
    onSlideBeforeStart(slide?: SlideData, ev?: any): void;
    onSlideStart(slide?: SlideData, ev?: any): void;
    onSlide(slide?: SlideData, ev?: any): void;
    onSlideEnd(slide?: SlideData, ev?: any): void;
}
export interface SlideData {
    min?: number;
    max?: number;
    distance?: number;
    delta?: number;
    started?: boolean;
    pos?: any;
    pointerStartPos?: number;
    elementStartPos?: number;
}
