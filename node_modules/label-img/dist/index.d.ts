declare type Map<T> = {
    [key: string]: T;
};
declare type Point = [number, number];
declare type Points = Point[];
declare type TColor = CSSStyleDeclaration["color"];

declare enum ImagePlacement {
    default = "default",
    center = "center"
}
declare type ImageLoadSource = File | string;
declare class Image extends EventReceiver {
    private origin;
    complate: boolean;
    el: HTMLImageElement | null;
    constructor(origin?: Point);
    /**
     * 加载图片
     * @param source ImageLoadSource 图片对象或图片路径
     */
    load(source: ImageLoadSource): Promise<HTMLImageElement>;
    loadFromImg(img: HTMLImageElement): void;
    /**
     * 获取图片对象
     * @return {HTMLImageElement | null}
     */
    getEl(): HTMLImageElement | null;
    /**
     * 获取图片宽高
     * @param scale number 缩放大小
     * @return [width: number, width: number]
     */
    getSize(scale?: number): number[];
    /**
     * 获取图片原点
     * @return Point
     */
    getOrigin(): number[];
    /**
     * 获取图片中心点
     * @return Point
     */
    getCenter(scale?: number): number[];
    /**
     * 获取图片缩放后的坐标点
     * @param scale number 缩放大小
     */
    getPosition(scale?: number): Point[];
    /**
     * 获取容器点位在图片上的坐标点位
     * @param offset Point 容器的坐标点位
     * @param scale 缩放大小
     * @return Point
     */
    toImagePoint(offset: Point, scale: number): Point;
    /**
     * 获取 shape 坐标点转换成画布的坐标
     * @param positions Points Shape 的坐标点集合
     * @param scale 缩放大小
     * @return Points
     */
    getShape2CanvasPoints(positions: Points, scale: number): Points;
    /**
     * 获取 shape 坐标点转换成画布的坐标
     * @param positions Points Shape 的坐标点集合
     * @param scale 缩放大小
     * @return Points
     */
    getShape2CanvasPoint(position: Point, scale: number): Point;
    /**
     * 设置图片的原点坐标
     * @param origin Point 原点坐标
     */
    moveTo(origin: Point): void;
}

declare enum EAntMouseEvents {
    "mousedown" = "mousedown",
    "mouseenter" = "mouseenter",
    "mouseleave" = "mouseleave",
    "mousemove" = "mousemove",
    "mouseout" = "mouseout",
    "mouseover" = "mouseover",
    "mouseup" = "mouseup",
    "dblclick" = "dblclick",
    "click" = "click",
    "auxclick" = "auxclick",
    "contextmenu" = "contextmenu",
    "wheel" = "wheel"
}
declare type IAntMouseEvent = keyof typeof EAntMouseEvents;
declare const antMouseEvents: ("mousedown" | "mouseenter" | "mouseleave" | "mousemove" | "mouseout" | "mouseover" | "mouseup" | "dblclick" | "click" | "auxclick" | "contextmenu" | "wheel")[];
declare enum AntLv {
    "top" = "top",
    "mid" = "mid",
    "bot" = " bot"
}
declare type IAntLv = keyof typeof AntLv;
declare const antLvs: ("top" | "mid" | "bot")[];
interface IAnte {
    offset: Point;
    stopPropagation: () => void;
    isPropagation: boolean;
    getTargetShape: () => [Shape | null, number];
    currentTarget: Shape | null;
    currentDotIndex: number;
    isOnImage: boolean;
    isOnShape: boolean;
    isOnArc: boolean;
}
interface AntMouseEvent extends MouseEvent, WheelEvent {
    ante: IAnte;
}
declare type ICallback = (e: AntMouseEvent, antEvent: Omit<IAntEvent, "callback">) => void;
interface IAntEvent {
    lv: IAntLv;
    type: IAntMouseEvent;
    callback: ICallback;
    target: null | Image | Shape;
}
declare class EventReceiver {
    getEventList: (type: IAntMouseEvent) => IAntEvent[];
    private addEvent;
    constructor();
    on(type: IAntMouseEvent, level: IAntLv | ICallback, handler?: ICallback): void;
    getEventsByType: (type: IAntMouseEvent, level?: "top" | "mid" | "bot" | undefined) => IAntEvent[];
}

interface IPopoverStyleMap {
    width: number;
    offset: number;
    padding: CSSStyleDeclaration["padding"];
    color: TColor;
    bgColor: TColor;
    scale: number;
}
declare type PopoverContent = string | HTMLElement;
interface IPopoverOptions {
    center: Point;
    content: PopoverContent;
    style: Partial<IPopoverStyleMap>;
}
declare class Popover {
    private center;
    content: PopoverContent;
    private container;
    private body;
    private parent;
    private style;
    constructor(props: Partial<IPopoverOptions>);
    move(positon: Point, scale: number): void;
    css(style: Partial<IPopoverStyleMap>): void;
    render(): void;
    addTo(ele?: HTMLDivElement): void;
    remove(): void;
}

declare enum ShapeType {
    "Polygon" = "Polygon",
    "Rect" = "Rect"
}
declare type TShapeType = keyof typeof ShapeType;
declare enum ShapeStatus {
    "normal" = "normal",
    "active" = "active",
    "disabled" = "disabled"
}
declare type TShapeStatus = keyof typeof ShapeStatus;
interface IShapeStyle {
    dotColor: TColor;
    dotRadius: number;
    lineColor: TColor;
    lineWidth: number;
    fillColor: TColor;
    opacity: number;
}
declare type IShapeOptionsStyle = Record<TShapeStatus, IShapeStyle>;
declare type TShapeStyle = Partial<IShapeStyle>;
declare const normal: IShapeStyle;
declare const active: IShapeStyle;
declare const disabled: IShapeStyle;
declare type ShapeID = string;
declare type QueryShapeInput = Shape | ShapeID;
interface IShapeOptions {
    id?: ShapeID;
    type: TShapeType;
    registerID: string;
    name: string;
    positions: Points;
    data?: any;
    tag?: PopoverContent;
    showTag?: boolean;
    closed?: boolean;
    visible?: boolean;
    visible2?: boolean;
    active?: boolean;
    disabled?: boolean;
    insert?: boolean;
    max?: number;
    style?: Partial<IShapeOptionsStyle>;
}
declare class Shape extends EventReceiver {
    readonly id: ShapeID;
    readonly type: TShapeType;
    readonly name: string;
    readonly registerID: string;
    positions: Points;
    style: IShapeOptionsStyle;
    status: TShapeStatus;
    private closed;
    visible: boolean;
    private insert;
    private showTag;
    tagContent: string;
    tagger: Popover;
    max: number | undefined;
    data: any;
    constructor(options: IShapeOptions);
    getPositions(): Points;
    /**
     * 判断是否在点上
     * @param offset 相对图片的位置
     */
    isOnArc(offset: Point, scale?: number): number;
    /**
     * 判断是否在图形上
     * @param offset 相对图片的位置
     */
    isOnShape(offset: Point): boolean;
    /**
     * 判断是否在边上
     * @param offset 相对图片的位置
     */
    isOnLine(offset: Point): false | {
        idx: number;
        position: Point;
        distance: number;
    };
    getStyle(): IShapeStyle;
    setActive(status: boolean): this;
    isActive(): boolean;
    close(): this;
    isClose(): boolean;
    disabled(): this;
    isDisabled(): boolean;
    normal(): this;
    hidden: () => this;
    show(): this;
    isHidden(): boolean;
    isInsert(): boolean;
    isEnable(): boolean;
    isShowTag(): boolean;
    tagShow(status?: boolean): void;
    setTag(tag: PopoverContent): void;
    updatePositions(positions: Points): this;
    addPoint: Function;
    rmDot: (index: number) => void;
}

declare type ShapeEvent = (shape: Shape) => void;
declare type NotifyEvent = (props: any) => void;
interface EmitEventMap {
    "select": ShapeEvent;
    "create": ShapeEvent;
    "delete": ShapeEvent;
    "update": NotifyEvent;
    "labelType": NotifyEvent;
    "init": NotifyEvent;
    "imageReady": NotifyEvent;
    "shapeRegister": NotifyEvent;
    "beforeRender": NotifyEvent;
    "afterRender": NotifyEvent;
    "beforeClear": NotifyEvent;
    "afterClear": NotifyEvent;
    "beforeRenderBackground": NotifyEvent;
    "afterRenderBackground": NotifyEvent;
    "beforeRenderImage": NotifyEvent;
    "afterRenderImage": NotifyEvent;
    "beforeRenderShape": NotifyEvent;
    "afterRenderShape": NotifyEvent;
    "beforeRenderDrawing": NotifyEvent;
    "afterRenderDrawing": NotifyEvent;
}
declare type EmitEventKey = keyof EmitEventMap;
/**
 * 事件监听器
 */
declare class EventEmitter {
    private getEvents;
    private createEvent;
    constructor();
    emit(type: EmitEventKey, data?: any): void;
    on<K extends keyof EmitEventMap>(type: K, cb: EmitEventMap[K]): () => void;
    once<K extends keyof EmitEventMap>(type: K, cb: EmitEventMap[K]): void;
}

declare type IShapeCfg = Omit<IShapeOptions, "data" | "positions">;
declare type IShapeContent = Partial<Omit<IShapeOptions, "type">>;
declare type RegisterID = string;
/**
 * 图形样式注册
 */
declare class ShapeRegister {
    add: (rid: RegisterID, shapeCfg: Omit<IShapeCfg, "registerID">) => void;
    get: (rid: RegisterID) => any;
    is: (rid: RegisterID) => boolean;
    getMap: () => Map<any>;
    constructor();
}

declare type StrokeStyle = string | CanvasPattern | CanvasGradient;
declare type FillStyle = string | CanvasGradient | CanvasPattern;
interface IBasePoint {
    dotColor: FillStyle;
    dotRadius: number;
}
interface ILineStyle {
    lineColor: StrokeStyle;
    lineWidth: number;
    lineDash: number[];
}
interface IFillStyle {
    fillColor: FillStyle;
    opacity: number;
}
interface IPolygonStyle {
    lineWidth: number;
    lineColor: StrokeStyle;
    dotRadius: number;
    dotColor: FillStyle;
    fillColor: FillStyle;
    opacity: number;
}
interface ITextStyle {
    fontSize: number;
    color: FillStyle;
    bgColor: FillStyle;
    offset: Point;
    padding: Point;
}
declare class Canvas {
    el: () => HTMLCanvasElement;
    ctx: () => CanvasRenderingContext2D;
    constructor();
    setPoints: (points: Points) => void;
    line: (points: Points, lineStyle: Partial<ILineStyle>) => this;
    fill: (points: Points, style: Partial<IFillStyle>) => void;
    fillReact: (start: Point, end: Point, style: Partial<IFillStyle>) => this;
    polygon: (points: Points, style: Partial<IPolygonStyle>) => this;
    dot: (point: Point, pointStyle: Partial<IBasePoint>) => this;
    dots: (points: Points, pointStyle: Partial<IBasePoint>) => this;
    text: (content: string, point: Point, style?: Partial<ITextStyle> | undefined) => this;
    opacity: (alpha: number) => void;
    size: (width: number, height: number) => void;
    getSize: () => number[];
    cursor: (cursor: string) => this;
    clear: () => this;
}

declare const defaulOptions: {
    width: number;
    height: number;
    bgColor: string;
    tagShow: boolean;
    guideLine: boolean;
    shouldShapeStyleScale: boolean;
    shouldTagScale: boolean;
    imagePlacement: ImagePlacement;
};
declare type LabelImgOptions = typeof defaulOptions;
declare class Platform extends EventReceiver {
    private container;
    private tagContainer;
    private _scale;
    private _options;
    private shapeRegister;
    private drawing;
    private cache;
    private activeShape;
    private shapeList;
    canvas: Canvas;
    Image: Image;
    emitter: EventEmitter;
    private continuity;
    private _isInit;
    private _isMouseDown;
    private _isShapeMoving;
    private _guideLineOrigin;
    isExport?: boolean;
    constructor(container: HTMLDivElement, LabelImgOptions?: Partial<LabelImgOptions>);
    options: () => {
        width: number;
        height: number;
        bgColor: string;
        tagShow: boolean;
        guideLine: boolean;
        shouldShapeStyleScale: boolean;
        shouldTagScale: boolean;
        imagePlacement: ImagePlacement;
    };
    setOptions: (options: Partial<LabelImgOptions>) => void;
    reset: () => void;
    /**
     * 重置图片大小与坐标点
     */
    resize: () => void;
    /**
     * 初始化
     */
    private _init;
    /**
     * 加载图片
     * @param source ImageLoadSource 图片对象或图片路径
     */
    load: (source: ImageLoadSource) => Promise<unknown>;
    loadFormImg: (img: HTMLImageElement) => void;
    /**
     * 注册图形
     * @param rid RegisterID 图形注册 ID
     * @param options IShapeCfg 图形配置
     */
    register: (rid: RegisterID, options: Omit<IShapeCfg, "registerID">) => void;
    /**
     * 获取已注册图形 map
     */
    getRegisterMap: () => Map<any>;
    /**
     * 以注册的图形模版创建图形
     * @param rid RegisterID 图形注册 ID
     * @param options IShapeCfg 图形配置
     * @returns Shape
     */
    createShape: (rid: RegisterID, options?: Partial<Pick<IShapeOptions, "data" | "style" | "active" | "disabled" | "closed" | "visible" | "insert" | "showTag" | "id" | "registerID" | "name" | "positions" | "max" | "tag" | "visible2">> | undefined) => Shape; /**
     * 判断图形是否注册
     * @param rid RegisterID 图形注册 ID
     * @returns boolean
     */
    isRegister: (rid: RegisterID) => boolean;
    /**
     * 设置标注图形
     * @param rid RegisterID 图形注册 ID
     * @param continuity boolean 是否连续标注
     */
    label: (rid: RegisterID, continuity?: boolean | undefined) => void;
    /**
     * 获取当前标注的图形配置
     * @returns IShapeOptions
     */
    getDrawing: () => Pick<IShapeOptions, "style" | "type" | "active" | "disabled" | "closed" | "visible" | "insert" | "showTag" | "id" | "registerID" | "name" | "max" | "tag" | "visible2"> | null;
    /**
     * 添加图形
     * @param shape Shape 待添加的图形
     * @param idx number 待插入的位置
     */
    addShape: (shape: Shape, idx?: number | undefined) => void;
    /**
       * 删除图形
       * @param input QueryShapeInput 待删除的图形或 ID
       */
    remove: (input: QueryShapeInput) => void;
    getTargetShape: (offset: Point) => [Shape | null, number];
    /**
     * 设置选中的图形
     * @param shape Shape 选中的图形
     */
    setActive: (shape: Shape) => void;
    /**
     * 取消标注状态
     */
    labelOff: () => void;
    /**
     * 改变图形排序
     * @param input QueryShapeInput 图形对象或 ID
     * @param flag boolean true: 添加到列表最前 false: 添加到列表最后
     */
    orderShape: (input: QueryShapeInput, flag?: boolean | undefined) => void;
    /**
     * 查询 index 与 Shape 对象
     * @param input QueryShapeInput 图形对象或 ID
     * @returns [number | null, Shape | null]
     */
    private findShapeIndex;
    /**
     * 获取图形列表
     * @returns Shape[] 图形列表
     */
    getShapeList: () => Shape[];
    getShapeByName: (name: string) => Shape[];
    /**
     * 取消所有图形高亮状态
     */
    private loseActive;
    /**
     * 设置辅助线显示
     * @param status boolean
     */
    setGuideLine: (status?: boolean | undefined) => void;
    /**
     * 获取是否允许标签显示
     * @return boolean
     */
    isTagShow: () => boolean;
    /**
     * 设置标签显示
     * @param status boolean 标签是否显示
     */
    setTagShow: (status?: boolean | undefined) => void;
    /**
     * 设置是否连续标注
     * @param status boolean
     */
    setContinuity: (status: boolean) => void;
    /**
     * 设置手势
     * @param cursor ICursor
     */
    cursor: Function;
    scale: (direction?: 1 | -1 | undefined, point?: Point | undefined) => number | undefined;
    scaleTo: (scale: number, point?: Point | undefined) => void;
    private getShapeStyleScale;
    moveTo: (origin: Point) => void;
    toDataURL: () => string | undefined;
    private _clearCanvas;
    private _renderBackground;
    private _renderImage;
    private _renderGuideLine;
    private _renderShape;
    private _renderCache;
    private _renderShapeList;
    forceRender: () => void;
    render: Function;
}

declare enum Cursor {
    "draggable" = "grab",
    "default" = "",
    "label" = "copy",
    "drag" = "grabbing",
    "pointer" = "pointer",
    "disabled" = "disabled"
}
declare type ICursor = keyof typeof Cursor;
declare const displayCursor: (cursor: ICursor) => Cursor;

interface IIDGProps {
    len?: number;
    start?: number;
}
declare class IDGenerator {
    private len;
    private count;
    constructor(props?: IIDGProps);
    getID(): string;
}
declare const IDG: IDGenerator;

/**
 * 判断点位是否在图形内部
 * @param point Point 待检测点位
 * @param vs Points 图形点位集合
 * @return boolean
 */
declare const isInSide: (point: Point, vs: Point[]) => boolean;
/**
 * 获取矩形完整的4个点位
 * @param start Point 矩形起始点位
 * @param end Point 矩形结束点位
 * @return ps Points 矩形完整的4个点位
 */
declare const getRectPoints: (start: Point, end: Point) => Points;
/**
 * 获取两点之间的距离
 * @param p1 Point 点位坐标
 * @param p2 Point 点位坐标
 * @return distance number 距离长度
 */
declare const getDistance: (p1: Point, p2: Point) => number;
/**
 * 判断点是否在圆内
 * @param origin Point 圆心坐标
 * @param r number 圆的半径
 * @param target 待检测坐标点
 * @return boolean
 */
declare const isInCircle: (origin: Point, r: number, target: Point) => boolean;
/**
 * 获取图像适应容器的缩放大小
 * @param img HTMLImageElement 图片节点对象
 * @param options {width: number, height: number} 容器宽高
 * @reutrn scale number 适应容器的缩放大小
 */
declare const getAdaptImgScale: (img: HTMLImageElement, options: {
    width: number;
    height: number;
}) => number;
/**
 * 颜色值16进制转rgba
 * @param {String} hex 16进制
 * @param {Float} opacity 透明度(16进制有效)
 */
declare const hexToRgba: (hex: string, opacity?: number) => string;

declare const utils_isInSide: typeof isInSide;
declare const utils_getRectPoints: typeof getRectPoints;
declare const utils_getDistance: typeof getDistance;
declare const utils_isInCircle: typeof isInCircle;
declare const utils_getAdaptImgScale: typeof getAdaptImgScale;
declare const utils_hexToRgba: typeof hexToRgba;
declare namespace utils {
  export {
    utils_isInSide as isInSide,
    utils_getRectPoints as getRectPoints,
    utils_getDistance as getDistance,
    utils_isInCircle as isInCircle,
    utils_getAdaptImgScale as getAdaptImgScale,
    utils_hexToRgba as hexToRgba,
  };
}

declare class LabelImg extends Platform {
    constructor(container: HTMLDivElement, options?: Partial<LabelImgOptions>);
    static Shape: typeof Shape;
    static IDGenerator: typeof IDGenerator;
    static utils: typeof utils;
}

export default LabelImg;
export { AntLv, AntMouseEvent, Canvas, EAntMouseEvents, EventEmitter, EventReceiver, IAntEvent, IAntLv, IAntMouseEvent, IAnte, ICursor, IDG, IDGenerator, IShapeCfg, IShapeContent, IShapeOptions, IShapeOptionsStyle, IShapeStyle, LabelImgOptions, Map, Platform, Point, Points, QueryShapeInput, RegisterID, Shape, ShapeRegister, ShapeType, TColor, TShapeStyle, TShapeType, active, antLvs, antMouseEvents, disabled, displayCursor, normal, utils };
