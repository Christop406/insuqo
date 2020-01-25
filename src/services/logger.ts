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

    public error(message: any, ...optionalParams: any): void {
        if (this._enabled) {
            if (optionalParams && optionalParams.length > 0) {
                console.error(message, optionalParams);
            } else {
                console.error(message);
            }
        }
    }

    public info(message: any, ...optionalParams: any): void {
        if (this._enabled) {
            if (optionalParams && optionalParams.length > 0) {
                console.info(message, optionalParams);
            } else {
                console.info(message);
            }
        }
    }

    public log(message: any, ...optionalParams: any): void {
        if (this._enabled) {
            if (optionalParams && optionalParams.length > 0) {
                console.log(message, optionalParams);
            } else {
                console.log(message);
            }
        }
    }

    public debug(message: any, ...optionalParams: any): void {
        if (this._enabled) {
            if (optionalParams && optionalParams.length > 0) {
                console.debug(message, optionalParams);
            } else {
                console.debug(message);
            }
        }
    }

    public warn(message: any, ...optionalParams: any): void {
        if (this._enabled) {
            if (optionalParams && optionalParams.length > 0) {
                console.warn(message, optionalParams);
            } else {
                console.warn(message);
            }
        }
    }

    public trace(message: any, ...optionalParams: any[]): void {
        if (this._enabled) {
            if (optionalParams && optionalParams.length > 0) {
                console.trace(message, optionalParams);
            } else {
                console.trace(message);
            }
        }
    }
}

export const Logger = IQLogger.getInstance();