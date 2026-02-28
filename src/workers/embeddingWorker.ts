import { pipeline, env } from '@huggingface/transformers';

// Skip local file reading because we are in a browser extension context
env.allowLocalModels = false;

// 1. Disable multithreading to avoid worker spawning issues entirely
// 2. Set the exact base path for WASM
if (env.backends?.onnx?.wasm) {
    env.backends.onnx.wasm.numThreads = 1;
    // VERY IMPORTANT: Construct the base URL safely using self.location
    // In a Web Worker, self.location is guaranteed to exist and point to the worker script
    const extensionRoot = new URL('/', self.location.href).href;
    env.backends.onnx.wasm.wasmPaths = extensionRoot + 'assets/';
}

class PipelineSingleton {
    static task = 'feature-extraction' as const;
    static model = 'Xenova/all-MiniLM-L6-v2';
    static instance: any = null;

    static async getInstance(progress_callback: any) {
        if (this.instance === null) {
            // Catch the Promise so concurrent calls wait for the SAME initialization
            this.instance = pipeline(this.task, this.model, {
                progress_callback,
                // Do not instantiate a separate worker, run it in this thread
                device: 'wasm',
                dtype: 'fp32' // Use fp32 as default for better WASM compatibility without quantized backends
            });
        }
        return this.instance;
    }
}

// Listen for messages from the main thread
self.addEventListener('message', async (event: MessageEvent) => {
    const { id, text } = event.data;

    try {
        // 1. Initialize or get the cached pipeline
        const extractor = await PipelineSingleton.getInstance((x: any) => {
            // Send download progress back to main thread (optional)
            self.postMessage({ id, status: 'progress', progress: x });
        });

        // 2. Compute embeddings
        // Output is a Tensor. pooling: 'mean' and normalize: true are standard for sentence-transformers
        const output = await extractor(text, { pooling: 'mean', normalize: true });

        // Convert Float32Array to standard array of numbers
        const embedding = Array.from(output.data);

        // 3. Send back the computed embedding
        self.postMessage({
            status: 'complete',
            id,
            embedding
        });
    } catch (error: any) {
        self.postMessage({
            status: 'error',
            id,
            error: error.message
        });
    }
});
