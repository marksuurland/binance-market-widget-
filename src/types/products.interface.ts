export interface IProduct {
    an: string;
    as: number;
    b: string;
    ba: string;
    c: number;
    cs: number;
    etf: boolean;
    h: number;
    i: number;
    l: number;
    o: number;
    pm: string;
    pn: string;
    pom: boolean;
    pomt?: any;
    q: string;
    qa: string;
    qn: string;
    qv: number;
    s: string;
    st: string;
    tags: string[];
    ts: number;
    v: number;
    y: number;
    trend?: string;
}

export interface IProductMessage {
    e: string;
    E: number;
    s: string;
    c: string;
    o: string;
    h: string;
    l: string;
    v: string;
    q: string;
}

export interface IGetProducts {
    code: string;
    message?: any;
    messageDetail?: any;
    success: boolean;
    data: IProduct[];
}

export enum CategoriesALTS {
    ETH = 'ETH',
    TRX = 'TRX',
    XRP = 'XRP'
}

export enum categoriesFIAT {
    USDT = 'USDT',
    BKRW = 'BKRW',
    BUSD = 'BUSD',
    EUR = 'EUR',
    TUSD = 'TUSD',
    USDC = 'USDC',
    TRY = 'TRY',
    PAX = 'PAX',
    AUD = 'AUD',
    BIDR = 'BIDR',
    BRL = 'BRL',
    DAI = 'DAI',
    GBP = 'GBP',
    IDRT = 'IDRT',
    NGN = 'NGN',
    RUB = 'RUB',
    ZAR = 'ZAR',
    UAH = 'UAH'
}

export enum ParentMarkets {
    BTC = 'BTC',
    BNB = 'BNB',
    ALTS = 'ALTS',
    FAIT = 'FAIT'
}

export enum Trend {
    UP = 'up',
    DOWN = 'down',
    NEUTRAL = 'neutral'
}


