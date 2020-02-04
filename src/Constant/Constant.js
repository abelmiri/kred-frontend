export default {
    COMPRESSION: {
        maxSizeMB: 2,          // (default: Number.POSITIVE_INFINITY)
        maxWidthOrHeight: 1920,   // compressedFile will scale down by ratio to a point that width or height is smaller than maxWidthOrHeight (default: undefined)
        useWebWorker: true,      // optional, use multi-thread web worker, fallback to run in main-thread (default: true)
        maxIteration: 10,        // optional, max number of iteration to compress the image (default: 10)
    },
}