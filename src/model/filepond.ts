export type ProcessServerConfigFunction = (
    /** The name of the input field */
    fieldName: string,
    /** The actual file object to send */
    file: ActualFileObject,
    metadata: {[key: string]: any},
    /**
     * Should call the load method when done and pass the returned server file id.
     * This server file id is then used later on when reverting or restoring a file
     * so that your server knows which file to return without exposing that info
     * to the client.
     */
    load: (p: string | {[key: string]: any}) => void,
    /** Can call the error method is something went wrong, should exit after */
    error: (errorText: string) => void,
    /**
     * Should call the progress method to update the progress to 100% before calling load()
     * Setting computable to false switches the loading indicator to infinite mode
     */
    progress: ProgressServerConfigFunction,
    /** Let FilePond know the request has been cancelled */
    abort: () => void
) => void;

export type RevertServerConfigFunction = (
    /** Server file id of the file to restore */
    uniqueFieldId: any,
    /** Should call the load method when done */
    load: () => void,
    /** Can call the error method is something went wrong, should exit after */
    error: (errorText: string) => void,
) => void;

type ProgressServerConfigFunction = (
    /**
     * Flag indicating if the resource has a length that can be calculated.
     * If not, the totalDataAmount has no significant value.  Setting this to
     * false switches the FilePond loading indicator to infinite mode.
     */
    isLengthComputable: boolean,
    /** The amount of data currently transferred */
    loadedDataAmount: number,
    /** The total amount of data to be transferred */
    totalDataAmount: number,
) => void;

type ActualFileObject = Blob & {readonly lastModified: number; readonly name: string};
