class IQLogger {
    private _enabled: boolean = true;
    private static _instance: IQLogger;
    private constructor() {
        this._enabled = process.env.NODE_ENV !== 'production';
    }

    public static getInstance(): IQLogger {
        if (!this._instance) {
            this._instance = new IQLogger();
        }
        return this._instance;
    }

    public error(message: any, ...optionalParams: any[]): void {
        if (this._enabled) {
            console.error(message, optionalParams);
        }
    }

    public info(message: any, ...optionalParams: any[]): void {
        if (this._enabled) {
            console.info(message, optionalParams);
        }
    }

    public log(message: any, ...optionalParams: any[]): void {
        if (this._enabled) {
            console.log(message, optionalParams);
        }
    }

    public debug(message: any, ...optionalParams: any[]): void {
        if (this._enabled) {
            console.debug(message, optionalParams);
        }
    }

    public warn(message: any, ...optionalParams: any[]): void {
        if (this._enabled) {
            console.warn(message, optionalParams);
        }
    }

    public trace(message: any, ...optionalParams: any[]): void {
        if (this._enabled) {
            console.trace(message, optionalParams);
        }
    }
}

export const Logger = IQLogger.getInstance();