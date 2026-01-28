(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/node_modules/.pnpm/@msgpack+msgpack@3.1.3/node_modules/@msgpack/msgpack/dist.esm/utils/prettyByte.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "prettyByte",
    ()=>prettyByte
]);
function prettyByte(byte) {
    return `${byte < 0 ? "-" : ""}0x${Math.abs(byte).toString(16).padStart(2, "0")}`;
} //# sourceMappingURL=prettyByte.mjs.map
}),
"[project]/node_modules/.pnpm/@msgpack+msgpack@3.1.3/node_modules/@msgpack/msgpack/dist.esm/CachedKeyDecoder.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CachedKeyDecoder",
    ()=>CachedKeyDecoder
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$msgpack$2b$msgpack$40$3$2e$1$2e$3$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$esm$2f$utils$2f$utf8$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@msgpack+msgpack@3.1.3/node_modules/@msgpack/msgpack/dist.esm/utils/utf8.mjs [app-client] (ecmascript)");
;
const DEFAULT_MAX_KEY_LENGTH = 16;
const DEFAULT_MAX_LENGTH_PER_KEY = 16;
class CachedKeyDecoder {
    hit = 0;
    miss = 0;
    caches;
    maxKeyLength;
    maxLengthPerKey;
    constructor(maxKeyLength = DEFAULT_MAX_KEY_LENGTH, maxLengthPerKey = DEFAULT_MAX_LENGTH_PER_KEY){
        this.maxKeyLength = maxKeyLength;
        this.maxLengthPerKey = maxLengthPerKey;
        // avoid `new Array(N)`, which makes a sparse array,
        // because a sparse array is typically slower than a non-sparse array.
        this.caches = [];
        for(let i = 0; i < this.maxKeyLength; i++){
            this.caches.push([]);
        }
    }
    canBeCached(byteLength) {
        return byteLength > 0 && byteLength <= this.maxKeyLength;
    }
    find(bytes, inputOffset, byteLength) {
        const records = this.caches[byteLength - 1];
        FIND_CHUNK: for (const record of records){
            const recordBytes = record.bytes;
            for(let j = 0; j < byteLength; j++){
                if (recordBytes[j] !== bytes[inputOffset + j]) {
                    continue FIND_CHUNK;
                }
            }
            return record.str;
        }
        return null;
    }
    store(bytes, value) {
        const records = this.caches[bytes.length - 1];
        const record = {
            bytes,
            str: value
        };
        if (records.length >= this.maxLengthPerKey) {
            // `records` are full!
            // Set `record` to an arbitrary position.
            records[Math.random() * records.length | 0] = record;
        } else {
            records.push(record);
        }
    }
    decode(bytes, inputOffset, byteLength) {
        const cachedValue = this.find(bytes, inputOffset, byteLength);
        if (cachedValue != null) {
            this.hit++;
            return cachedValue;
        }
        this.miss++;
        const str = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$msgpack$2b$msgpack$40$3$2e$1$2e$3$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$esm$2f$utils$2f$utf8$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["utf8DecodeJs"])(bytes, inputOffset, byteLength);
        // Ensure to copy a slice of bytes because the bytes may be a NodeJS Buffer and Buffer#slice() returns a reference to its internal ArrayBuffer.
        const slicedCopyOfBytes = Uint8Array.prototype.slice.call(bytes, inputOffset, inputOffset + byteLength);
        this.store(slicedCopyOfBytes, str);
        return str;
    }
} //# sourceMappingURL=CachedKeyDecoder.mjs.map
}),
"[project]/node_modules/.pnpm/@msgpack+msgpack@3.1.3/node_modules/@msgpack/msgpack/dist.esm/Decoder.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Decoder",
    ()=>Decoder
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$msgpack$2b$msgpack$40$3$2e$1$2e$3$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$esm$2f$utils$2f$prettyByte$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@msgpack+msgpack@3.1.3/node_modules/@msgpack/msgpack/dist.esm/utils/prettyByte.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$msgpack$2b$msgpack$40$3$2e$1$2e$3$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$esm$2f$ExtensionCodec$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@msgpack+msgpack@3.1.3/node_modules/@msgpack/msgpack/dist.esm/ExtensionCodec.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$msgpack$2b$msgpack$40$3$2e$1$2e$3$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$esm$2f$utils$2f$int$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@msgpack+msgpack@3.1.3/node_modules/@msgpack/msgpack/dist.esm/utils/int.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$msgpack$2b$msgpack$40$3$2e$1$2e$3$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$esm$2f$utils$2f$utf8$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@msgpack+msgpack@3.1.3/node_modules/@msgpack/msgpack/dist.esm/utils/utf8.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$msgpack$2b$msgpack$40$3$2e$1$2e$3$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$esm$2f$utils$2f$typedArrays$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@msgpack+msgpack@3.1.3/node_modules/@msgpack/msgpack/dist.esm/utils/typedArrays.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$msgpack$2b$msgpack$40$3$2e$1$2e$3$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$esm$2f$CachedKeyDecoder$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@msgpack+msgpack@3.1.3/node_modules/@msgpack/msgpack/dist.esm/CachedKeyDecoder.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$msgpack$2b$msgpack$40$3$2e$1$2e$3$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$esm$2f$DecodeError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@msgpack+msgpack@3.1.3/node_modules/@msgpack/msgpack/dist.esm/DecodeError.mjs [app-client] (ecmascript)");
;
;
;
;
;
;
;
const STATE_ARRAY = "array";
const STATE_MAP_KEY = "map_key";
const STATE_MAP_VALUE = "map_value";
const mapKeyConverter = (key)=>{
    if (typeof key === "string" || typeof key === "number") {
        return key;
    }
    throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$msgpack$2b$msgpack$40$3$2e$1$2e$3$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$esm$2f$DecodeError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DecodeError"]("The type of key must be string or number but " + typeof key);
};
class StackPool {
    stack = [];
    stackHeadPosition = -1;
    get length() {
        return this.stackHeadPosition + 1;
    }
    top() {
        return this.stack[this.stackHeadPosition];
    }
    pushArrayState(size) {
        const state = this.getUninitializedStateFromPool();
        state.type = STATE_ARRAY;
        state.position = 0;
        state.size = size;
        state.array = new Array(size);
    }
    pushMapState(size) {
        const state = this.getUninitializedStateFromPool();
        state.type = STATE_MAP_KEY;
        state.readCount = 0;
        state.size = size;
        state.map = {};
    }
    getUninitializedStateFromPool() {
        this.stackHeadPosition++;
        if (this.stackHeadPosition === this.stack.length) {
            const partialState = {
                type: undefined,
                size: 0,
                array: undefined,
                position: 0,
                readCount: 0,
                map: undefined,
                key: null
            };
            this.stack.push(partialState);
        }
        return this.stack[this.stackHeadPosition];
    }
    release(state) {
        const topStackState = this.stack[this.stackHeadPosition];
        if (topStackState !== state) {
            throw new Error("Invalid stack state. Released state is not on top of the stack.");
        }
        if (state.type === STATE_ARRAY) {
            const partialState = state;
            partialState.size = 0;
            partialState.array = undefined;
            partialState.position = 0;
            partialState.type = undefined;
        }
        if (state.type === STATE_MAP_KEY || state.type === STATE_MAP_VALUE) {
            const partialState = state;
            partialState.size = 0;
            partialState.map = undefined;
            partialState.readCount = 0;
            partialState.type = undefined;
        }
        this.stackHeadPosition--;
    }
    reset() {
        this.stack.length = 0;
        this.stackHeadPosition = -1;
    }
}
const HEAD_BYTE_REQUIRED = -1;
const EMPTY_VIEW = new DataView(new ArrayBuffer(0));
const EMPTY_BYTES = new Uint8Array(EMPTY_VIEW.buffer);
try {
    // IE11: The spec says it should throw RangeError,
    // IE11: but in IE11 it throws TypeError.
    EMPTY_VIEW.getInt8(0);
} catch (e) {
    if (!(e instanceof RangeError)) {
        throw new Error("This module is not supported in the current JavaScript engine because DataView does not throw RangeError on out-of-bounds access");
    }
}
const MORE_DATA = new RangeError("Insufficient data");
const sharedCachedKeyDecoder = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$msgpack$2b$msgpack$40$3$2e$1$2e$3$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$esm$2f$CachedKeyDecoder$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CachedKeyDecoder"]();
class Decoder {
    extensionCodec;
    context;
    useBigInt64;
    rawStrings;
    maxStrLength;
    maxBinLength;
    maxArrayLength;
    maxMapLength;
    maxExtLength;
    keyDecoder;
    mapKeyConverter;
    totalPos = 0;
    pos = 0;
    view = EMPTY_VIEW;
    bytes = EMPTY_BYTES;
    headByte = HEAD_BYTE_REQUIRED;
    stack = new StackPool();
    entered = false;
    constructor(options){
        this.extensionCodec = options?.extensionCodec ?? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$msgpack$2b$msgpack$40$3$2e$1$2e$3$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$esm$2f$ExtensionCodec$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ExtensionCodec"].defaultCodec;
        this.context = options?.context; // needs a type assertion because EncoderOptions has no context property when ContextType is undefined
        this.useBigInt64 = options?.useBigInt64 ?? false;
        this.rawStrings = options?.rawStrings ?? false;
        this.maxStrLength = options?.maxStrLength ?? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$msgpack$2b$msgpack$40$3$2e$1$2e$3$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$esm$2f$utils$2f$int$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UINT32_MAX"];
        this.maxBinLength = options?.maxBinLength ?? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$msgpack$2b$msgpack$40$3$2e$1$2e$3$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$esm$2f$utils$2f$int$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UINT32_MAX"];
        this.maxArrayLength = options?.maxArrayLength ?? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$msgpack$2b$msgpack$40$3$2e$1$2e$3$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$esm$2f$utils$2f$int$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UINT32_MAX"];
        this.maxMapLength = options?.maxMapLength ?? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$msgpack$2b$msgpack$40$3$2e$1$2e$3$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$esm$2f$utils$2f$int$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UINT32_MAX"];
        this.maxExtLength = options?.maxExtLength ?? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$msgpack$2b$msgpack$40$3$2e$1$2e$3$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$esm$2f$utils$2f$int$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UINT32_MAX"];
        this.keyDecoder = options?.keyDecoder !== undefined ? options.keyDecoder : sharedCachedKeyDecoder;
        this.mapKeyConverter = options?.mapKeyConverter ?? mapKeyConverter;
    }
    clone() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        return new Decoder({
            extensionCodec: this.extensionCodec,
            context: this.context,
            useBigInt64: this.useBigInt64,
            rawStrings: this.rawStrings,
            maxStrLength: this.maxStrLength,
            maxBinLength: this.maxBinLength,
            maxArrayLength: this.maxArrayLength,
            maxMapLength: this.maxMapLength,
            maxExtLength: this.maxExtLength,
            keyDecoder: this.keyDecoder
        });
    }
    reinitializeState() {
        this.totalPos = 0;
        this.headByte = HEAD_BYTE_REQUIRED;
        this.stack.reset();
    // view, bytes, and pos will be re-initialized in setBuffer()
    }
    setBuffer(buffer) {
        const bytes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$msgpack$2b$msgpack$40$3$2e$1$2e$3$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$esm$2f$utils$2f$typedArrays$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ensureUint8Array"])(buffer);
        this.bytes = bytes;
        this.view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
        this.pos = 0;
    }
    appendBuffer(buffer) {
        if (this.headByte === HEAD_BYTE_REQUIRED && !this.hasRemaining(1)) {
            this.setBuffer(buffer);
        } else {
            const remainingData = this.bytes.subarray(this.pos);
            const newData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$msgpack$2b$msgpack$40$3$2e$1$2e$3$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$esm$2f$utils$2f$typedArrays$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ensureUint8Array"])(buffer);
            // concat remainingData + newData
            const newBuffer = new Uint8Array(remainingData.length + newData.length);
            newBuffer.set(remainingData);
            newBuffer.set(newData, remainingData.length);
            this.setBuffer(newBuffer);
        }
    }
    hasRemaining(size) {
        return this.view.byteLength - this.pos >= size;
    }
    createExtraByteError(posToShow) {
        const { view, pos } = this;
        return new RangeError(`Extra ${view.byteLength - pos} of ${view.byteLength} byte(s) found at buffer[${posToShow}]`);
    }
    /**
     * @throws {@link DecodeError}
     * @throws {@link RangeError}
     */ decode(buffer) {
        if (this.entered) {
            const instance = this.clone();
            return instance.decode(buffer);
        }
        try {
            this.entered = true;
            this.reinitializeState();
            this.setBuffer(buffer);
            const object = this.doDecodeSync();
            if (this.hasRemaining(1)) {
                throw this.createExtraByteError(this.pos);
            }
            return object;
        } finally{
            this.entered = false;
        }
    }
    *decodeMulti(buffer) {
        if (this.entered) {
            const instance = this.clone();
            yield* instance.decodeMulti(buffer);
            return;
        }
        try {
            this.entered = true;
            this.reinitializeState();
            this.setBuffer(buffer);
            while(this.hasRemaining(1)){
                yield this.doDecodeSync();
            }
        } finally{
            this.entered = false;
        }
    }
    async decodeAsync(stream) {
        if (this.entered) {
            const instance = this.clone();
            return instance.decodeAsync(stream);
        }
        try {
            this.entered = true;
            let decoded = false;
            let object;
            for await (const buffer of stream){
                if (decoded) {
                    this.entered = false;
                    throw this.createExtraByteError(this.totalPos);
                }
                this.appendBuffer(buffer);
                try {
                    object = this.doDecodeSync();
                    decoded = true;
                } catch (e) {
                    if (!(e instanceof RangeError)) {
                        throw e; // rethrow
                    }
                // fallthrough
                }
                this.totalPos += this.pos;
            }
            if (decoded) {
                if (this.hasRemaining(1)) {
                    throw this.createExtraByteError(this.totalPos);
                }
                return object;
            }
            const { headByte, pos, totalPos } = this;
            throw new RangeError(`Insufficient data in parsing ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$msgpack$2b$msgpack$40$3$2e$1$2e$3$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$esm$2f$utils$2f$prettyByte$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["prettyByte"])(headByte)} at ${totalPos} (${pos} in the current buffer)`);
        } finally{
            this.entered = false;
        }
    }
    decodeArrayStream(stream) {
        return this.decodeMultiAsync(stream, true);
    }
    decodeStream(stream) {
        return this.decodeMultiAsync(stream, false);
    }
    async *decodeMultiAsync(stream, isArray) {
        if (this.entered) {
            const instance = this.clone();
            yield* instance.decodeMultiAsync(stream, isArray);
            return;
        }
        try {
            this.entered = true;
            let isArrayHeaderRequired = isArray;
            let arrayItemsLeft = -1;
            for await (const buffer of stream){
                if (isArray && arrayItemsLeft === 0) {
                    throw this.createExtraByteError(this.totalPos);
                }
                this.appendBuffer(buffer);
                if (isArrayHeaderRequired) {
                    arrayItemsLeft = this.readArraySize();
                    isArrayHeaderRequired = false;
                    this.complete();
                }
                try {
                    while(true){
                        yield this.doDecodeSync();
                        if (--arrayItemsLeft === 0) {
                            break;
                        }
                    }
                } catch (e) {
                    if (!(e instanceof RangeError)) {
                        throw e; // rethrow
                    }
                // fallthrough
                }
                this.totalPos += this.pos;
            }
        } finally{
            this.entered = false;
        }
    }
    doDecodeSync() {
        DECODE: while(true){
            const headByte = this.readHeadByte();
            let object;
            if (headByte >= 0xe0) {
                // negative fixint (111x xxxx) 0xe0 - 0xff
                object = headByte - 0x100;
            } else if (headByte < 0xc0) {
                if (headByte < 0x80) {
                    // positive fixint (0xxx xxxx) 0x00 - 0x7f
                    object = headByte;
                } else if (headByte < 0x90) {
                    // fixmap (1000 xxxx) 0x80 - 0x8f
                    const size = headByte - 0x80;
                    if (size !== 0) {
                        this.pushMapState(size);
                        this.complete();
                        continue DECODE;
                    } else {
                        object = {};
                    }
                } else if (headByte < 0xa0) {
                    // fixarray (1001 xxxx) 0x90 - 0x9f
                    const size = headByte - 0x90;
                    if (size !== 0) {
                        this.pushArrayState(size);
                        this.complete();
                        continue DECODE;
                    } else {
                        object = [];
                    }
                } else {
                    // fixstr (101x xxxx) 0xa0 - 0xbf
                    const byteLength = headByte - 0xa0;
                    object = this.decodeString(byteLength, 0);
                }
            } else if (headByte === 0xc0) {
                // nil
                object = null;
            } else if (headByte === 0xc2) {
                // false
                object = false;
            } else if (headByte === 0xc3) {
                // true
                object = true;
            } else if (headByte === 0xca) {
                // float 32
                object = this.readF32();
            } else if (headByte === 0xcb) {
                // float 64
                object = this.readF64();
            } else if (headByte === 0xcc) {
                // uint 8
                object = this.readU8();
            } else if (headByte === 0xcd) {
                // uint 16
                object = this.readU16();
            } else if (headByte === 0xce) {
                // uint 32
                object = this.readU32();
            } else if (headByte === 0xcf) {
                // uint 64
                if (this.useBigInt64) {
                    object = this.readU64AsBigInt();
                } else {
                    object = this.readU64();
                }
            } else if (headByte === 0xd0) {
                // int 8
                object = this.readI8();
            } else if (headByte === 0xd1) {
                // int 16
                object = this.readI16();
            } else if (headByte === 0xd2) {
                // int 32
                object = this.readI32();
            } else if (headByte === 0xd3) {
                // int 64
                if (this.useBigInt64) {
                    object = this.readI64AsBigInt();
                } else {
                    object = this.readI64();
                }
            } else if (headByte === 0xd9) {
                // str 8
                const byteLength = this.lookU8();
                object = this.decodeString(byteLength, 1);
            } else if (headByte === 0xda) {
                // str 16
                const byteLength = this.lookU16();
                object = this.decodeString(byteLength, 2);
            } else if (headByte === 0xdb) {
                // str 32
                const byteLength = this.lookU32();
                object = this.decodeString(byteLength, 4);
            } else if (headByte === 0xdc) {
                // array 16
                const size = this.readU16();
                if (size !== 0) {
                    this.pushArrayState(size);
                    this.complete();
                    continue DECODE;
                } else {
                    object = [];
                }
            } else if (headByte === 0xdd) {
                // array 32
                const size = this.readU32();
                if (size !== 0) {
                    this.pushArrayState(size);
                    this.complete();
                    continue DECODE;
                } else {
                    object = [];
                }
            } else if (headByte === 0xde) {
                // map 16
                const size = this.readU16();
                if (size !== 0) {
                    this.pushMapState(size);
                    this.complete();
                    continue DECODE;
                } else {
                    object = {};
                }
            } else if (headByte === 0xdf) {
                // map 32
                const size = this.readU32();
                if (size !== 0) {
                    this.pushMapState(size);
                    this.complete();
                    continue DECODE;
                } else {
                    object = {};
                }
            } else if (headByte === 0xc4) {
                // bin 8
                const size = this.lookU8();
                object = this.decodeBinary(size, 1);
            } else if (headByte === 0xc5) {
                // bin 16
                const size = this.lookU16();
                object = this.decodeBinary(size, 2);
            } else if (headByte === 0xc6) {
                // bin 32
                const size = this.lookU32();
                object = this.decodeBinary(size, 4);
            } else if (headByte === 0xd4) {
                // fixext 1
                object = this.decodeExtension(1, 0);
            } else if (headByte === 0xd5) {
                // fixext 2
                object = this.decodeExtension(2, 0);
            } else if (headByte === 0xd6) {
                // fixext 4
                object = this.decodeExtension(4, 0);
            } else if (headByte === 0xd7) {
                // fixext 8
                object = this.decodeExtension(8, 0);
            } else if (headByte === 0xd8) {
                // fixext 16
                object = this.decodeExtension(16, 0);
            } else if (headByte === 0xc7) {
                // ext 8
                const size = this.lookU8();
                object = this.decodeExtension(size, 1);
            } else if (headByte === 0xc8) {
                // ext 16
                const size = this.lookU16();
                object = this.decodeExtension(size, 2);
            } else if (headByte === 0xc9) {
                // ext 32
                const size = this.lookU32();
                object = this.decodeExtension(size, 4);
            } else {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$msgpack$2b$msgpack$40$3$2e$1$2e$3$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$esm$2f$DecodeError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DecodeError"](`Unrecognized type byte: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$msgpack$2b$msgpack$40$3$2e$1$2e$3$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$esm$2f$utils$2f$prettyByte$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["prettyByte"])(headByte)}`);
            }
            this.complete();
            const stack = this.stack;
            while(stack.length > 0){
                // arrays and maps
                const state = stack.top();
                if (state.type === STATE_ARRAY) {
                    state.array[state.position] = object;
                    state.position++;
                    if (state.position === state.size) {
                        object = state.array;
                        stack.release(state);
                    } else {
                        continue DECODE;
                    }
                } else if (state.type === STATE_MAP_KEY) {
                    if (object === "__proto__") {
                        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$msgpack$2b$msgpack$40$3$2e$1$2e$3$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$esm$2f$DecodeError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DecodeError"]("The key __proto__ is not allowed");
                    }
                    state.key = this.mapKeyConverter(object);
                    state.type = STATE_MAP_VALUE;
                    continue DECODE;
                } else {
                    // it must be `state.type === State.MAP_VALUE` here
                    state.map[state.key] = object;
                    state.readCount++;
                    if (state.readCount === state.size) {
                        object = state.map;
                        stack.release(state);
                    } else {
                        state.key = null;
                        state.type = STATE_MAP_KEY;
                        continue DECODE;
                    }
                }
            }
            return object;
        }
    }
    readHeadByte() {
        if (this.headByte === HEAD_BYTE_REQUIRED) {
            this.headByte = this.readU8();
        // console.log("headByte", prettyByte(this.headByte));
        }
        return this.headByte;
    }
    complete() {
        this.headByte = HEAD_BYTE_REQUIRED;
    }
    readArraySize() {
        const headByte = this.readHeadByte();
        switch(headByte){
            case 0xdc:
                return this.readU16();
            case 0xdd:
                return this.readU32();
            default:
                {
                    if (headByte < 0xa0) {
                        return headByte - 0x90;
                    } else {
                        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$msgpack$2b$msgpack$40$3$2e$1$2e$3$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$esm$2f$DecodeError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DecodeError"](`Unrecognized array type byte: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$msgpack$2b$msgpack$40$3$2e$1$2e$3$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$esm$2f$utils$2f$prettyByte$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["prettyByte"])(headByte)}`);
                    }
                }
        }
    }
    pushMapState(size) {
        if (size > this.maxMapLength) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$msgpack$2b$msgpack$40$3$2e$1$2e$3$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$esm$2f$DecodeError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DecodeError"](`Max length exceeded: map length (${size}) > maxMapLengthLength (${this.maxMapLength})`);
        }
        this.stack.pushMapState(size);
    }
    pushArrayState(size) {
        if (size > this.maxArrayLength) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$msgpack$2b$msgpack$40$3$2e$1$2e$3$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$esm$2f$DecodeError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DecodeError"](`Max length exceeded: array length (${size}) > maxArrayLength (${this.maxArrayLength})`);
        }
        this.stack.pushArrayState(size);
    }
    decodeString(byteLength, headerOffset) {
        if (!this.rawStrings || this.stateIsMapKey()) {
            return this.decodeUtf8String(byteLength, headerOffset);
        }
        return this.decodeBinary(byteLength, headerOffset);
    }
    /**
     * @throws {@link RangeError}
     */ decodeUtf8String(byteLength, headerOffset) {
        if (byteLength > this.maxStrLength) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$msgpack$2b$msgpack$40$3$2e$1$2e$3$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$esm$2f$DecodeError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DecodeError"](`Max length exceeded: UTF-8 byte length (${byteLength}) > maxStrLength (${this.maxStrLength})`);
        }
        if (this.bytes.byteLength < this.pos + headerOffset + byteLength) {
            throw MORE_DATA;
        }
        const offset = this.pos + headerOffset;
        let object;
        if (this.stateIsMapKey() && this.keyDecoder?.canBeCached(byteLength)) {
            object = this.keyDecoder.decode(this.bytes, offset, byteLength);
        } else {
            object = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$msgpack$2b$msgpack$40$3$2e$1$2e$3$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$esm$2f$utils$2f$utf8$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["utf8Decode"])(this.bytes, offset, byteLength);
        }
        this.pos += headerOffset + byteLength;
        return object;
    }
    stateIsMapKey() {
        if (this.stack.length > 0) {
            const state = this.stack.top();
            return state.type === STATE_MAP_KEY;
        }
        return false;
    }
    /**
     * @throws {@link RangeError}
     */ decodeBinary(byteLength, headOffset) {
        if (byteLength > this.maxBinLength) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$msgpack$2b$msgpack$40$3$2e$1$2e$3$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$esm$2f$DecodeError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DecodeError"](`Max length exceeded: bin length (${byteLength}) > maxBinLength (${this.maxBinLength})`);
        }
        if (!this.hasRemaining(byteLength + headOffset)) {
            throw MORE_DATA;
        }
        const offset = this.pos + headOffset;
        const object = this.bytes.subarray(offset, offset + byteLength);
        this.pos += headOffset + byteLength;
        return object;
    }
    decodeExtension(size, headOffset) {
        if (size > this.maxExtLength) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$msgpack$2b$msgpack$40$3$2e$1$2e$3$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$esm$2f$DecodeError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DecodeError"](`Max length exceeded: ext length (${size}) > maxExtLength (${this.maxExtLength})`);
        }
        const extType = this.view.getInt8(this.pos + headOffset);
        const data = this.decodeBinary(size, headOffset + 1 /* extType */ );
        return this.extensionCodec.decode(data, extType, this.context);
    }
    lookU8() {
        return this.view.getUint8(this.pos);
    }
    lookU16() {
        return this.view.getUint16(this.pos);
    }
    lookU32() {
        return this.view.getUint32(this.pos);
    }
    readU8() {
        const value = this.view.getUint8(this.pos);
        this.pos++;
        return value;
    }
    readI8() {
        const value = this.view.getInt8(this.pos);
        this.pos++;
        return value;
    }
    readU16() {
        const value = this.view.getUint16(this.pos);
        this.pos += 2;
        return value;
    }
    readI16() {
        const value = this.view.getInt16(this.pos);
        this.pos += 2;
        return value;
    }
    readU32() {
        const value = this.view.getUint32(this.pos);
        this.pos += 4;
        return value;
    }
    readI32() {
        const value = this.view.getInt32(this.pos);
        this.pos += 4;
        return value;
    }
    readU64() {
        const value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$msgpack$2b$msgpack$40$3$2e$1$2e$3$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$esm$2f$utils$2f$int$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getUint64"])(this.view, this.pos);
        this.pos += 8;
        return value;
    }
    readI64() {
        const value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$msgpack$2b$msgpack$40$3$2e$1$2e$3$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$esm$2f$utils$2f$int$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getInt64"])(this.view, this.pos);
        this.pos += 8;
        return value;
    }
    readU64AsBigInt() {
        const value = this.view.getBigUint64(this.pos);
        this.pos += 8;
        return value;
    }
    readI64AsBigInt() {
        const value = this.view.getBigInt64(this.pos);
        this.pos += 8;
        return value;
    }
    readF32() {
        const value = this.view.getFloat32(this.pos);
        this.pos += 4;
        return value;
    }
    readF64() {
        const value = this.view.getFloat64(this.pos);
        this.pos += 8;
        return value;
    }
} //# sourceMappingURL=Decoder.mjs.map
}),
"[project]/node_modules/.pnpm/@msgpack+msgpack@3.1.3/node_modules/@msgpack/msgpack/dist.esm/decode.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "decode",
    ()=>decode,
    "decodeMulti",
    ()=>decodeMulti
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$msgpack$2b$msgpack$40$3$2e$1$2e$3$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$esm$2f$Decoder$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@msgpack+msgpack@3.1.3/node_modules/@msgpack/msgpack/dist.esm/Decoder.mjs [app-client] (ecmascript)");
;
function decode(buffer, options) {
    const decoder = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$msgpack$2b$msgpack$40$3$2e$1$2e$3$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$esm$2f$Decoder$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Decoder"](options);
    return decoder.decode(buffer);
}
function decodeMulti(buffer, options) {
    const decoder = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$msgpack$2b$msgpack$40$3$2e$1$2e$3$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$esm$2f$Decoder$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Decoder"](options);
    return decoder.decodeMulti(buffer);
} //# sourceMappingURL=decode.mjs.map
}),
"[project]/node_modules/.pnpm/@msgpack+msgpack@3.1.3/node_modules/@msgpack/msgpack/dist.esm/utils/stream.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// utility for whatwg streams
__turbopack_context__.s([
    "asyncIterableFromStream",
    ()=>asyncIterableFromStream,
    "ensureAsyncIterable",
    ()=>ensureAsyncIterable,
    "isAsyncIterable",
    ()=>isAsyncIterable
]);
function isAsyncIterable(object) {
    return object[Symbol.asyncIterator] != null;
}
async function* asyncIterableFromStream(stream) {
    const reader = stream.getReader();
    try {
        while(true){
            const { done, value } = await reader.read();
            if (done) {
                return;
            }
            yield value;
        }
    } finally{
        reader.releaseLock();
    }
}
function ensureAsyncIterable(streamLike) {
    if (isAsyncIterable(streamLike)) {
        return streamLike;
    } else {
        return asyncIterableFromStream(streamLike);
    }
} //# sourceMappingURL=stream.mjs.map
}),
"[project]/node_modules/.pnpm/@msgpack+msgpack@3.1.3/node_modules/@msgpack/msgpack/dist.esm/decodeAsync.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "decodeArrayStream",
    ()=>decodeArrayStream,
    "decodeAsync",
    ()=>decodeAsync,
    "decodeMultiStream",
    ()=>decodeMultiStream
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$msgpack$2b$msgpack$40$3$2e$1$2e$3$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$esm$2f$Decoder$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@msgpack+msgpack@3.1.3/node_modules/@msgpack/msgpack/dist.esm/Decoder.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$msgpack$2b$msgpack$40$3$2e$1$2e$3$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$esm$2f$utils$2f$stream$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@msgpack+msgpack@3.1.3/node_modules/@msgpack/msgpack/dist.esm/utils/stream.mjs [app-client] (ecmascript)");
;
;
async function decodeAsync(streamLike, options) {
    const stream = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$msgpack$2b$msgpack$40$3$2e$1$2e$3$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$esm$2f$utils$2f$stream$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ensureAsyncIterable"])(streamLike);
    const decoder = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$msgpack$2b$msgpack$40$3$2e$1$2e$3$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$esm$2f$Decoder$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Decoder"](options);
    return decoder.decodeAsync(stream);
}
function decodeArrayStream(streamLike, options) {
    const stream = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$msgpack$2b$msgpack$40$3$2e$1$2e$3$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$esm$2f$utils$2f$stream$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ensureAsyncIterable"])(streamLike);
    const decoder = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$msgpack$2b$msgpack$40$3$2e$1$2e$3$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$esm$2f$Decoder$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Decoder"](options);
    return decoder.decodeArrayStream(stream);
}
function decodeMultiStream(streamLike, options) {
    const stream = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$msgpack$2b$msgpack$40$3$2e$1$2e$3$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$esm$2f$utils$2f$stream$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ensureAsyncIterable"])(streamLike);
    const decoder = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$msgpack$2b$msgpack$40$3$2e$1$2e$3$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$esm$2f$Decoder$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Decoder"](options);
    return decoder.decodeStream(stream);
} //# sourceMappingURL=decodeAsync.mjs.map
}),
"[project]/node_modules/.pnpm/@msgpack+msgpack@3.1.3/node_modules/@msgpack/msgpack/dist.esm/index.mjs [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
// Main Functions:
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$msgpack$2b$msgpack$40$3$2e$1$2e$3$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$esm$2f$encode$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@msgpack+msgpack@3.1.3/node_modules/@msgpack/msgpack/dist.esm/encode.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$msgpack$2b$msgpack$40$3$2e$1$2e$3$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$esm$2f$decode$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@msgpack+msgpack@3.1.3/node_modules/@msgpack/msgpack/dist.esm/decode.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$msgpack$2b$msgpack$40$3$2e$1$2e$3$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$esm$2f$decodeAsync$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@msgpack+msgpack@3.1.3/node_modules/@msgpack/msgpack/dist.esm/decodeAsync.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$msgpack$2b$msgpack$40$3$2e$1$2e$3$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$esm$2f$Decoder$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@msgpack+msgpack@3.1.3/node_modules/@msgpack/msgpack/dist.esm/Decoder.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$msgpack$2b$msgpack$40$3$2e$1$2e$3$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$esm$2f$DecodeError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@msgpack+msgpack@3.1.3/node_modules/@msgpack/msgpack/dist.esm/DecodeError.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$msgpack$2b$msgpack$40$3$2e$1$2e$3$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$esm$2f$Encoder$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@msgpack+msgpack@3.1.3/node_modules/@msgpack/msgpack/dist.esm/Encoder.mjs [app-client] (ecmascript)");
// Utilities for Extension Types:
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$msgpack$2b$msgpack$40$3$2e$1$2e$3$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$esm$2f$ExtensionCodec$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@msgpack+msgpack@3.1.3/node_modules/@msgpack/msgpack/dist.esm/ExtensionCodec.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$msgpack$2b$msgpack$40$3$2e$1$2e$3$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$esm$2f$ExtData$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@msgpack+msgpack@3.1.3/node_modules/@msgpack/msgpack/dist.esm/ExtData.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$msgpack$2b$msgpack$40$3$2e$1$2e$3$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$esm$2f$timestamp$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@msgpack+msgpack@3.1.3/node_modules/@msgpack/msgpack/dist.esm/timestamp.mjs [app-client] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
 //# sourceMappingURL=index.mjs.map
}),
"[project]/node_modules/.pnpm/@msgpack+msgpack@3.1.3/node_modules/@msgpack/msgpack/dist.esm/index.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DecodeError",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$msgpack$2b$msgpack$40$3$2e$1$2e$3$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$esm$2f$DecodeError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DecodeError"],
    "Decoder",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$msgpack$2b$msgpack$40$3$2e$1$2e$3$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$esm$2f$Decoder$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Decoder"],
    "EXT_TIMESTAMP",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$msgpack$2b$msgpack$40$3$2e$1$2e$3$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$esm$2f$timestamp$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EXT_TIMESTAMP"],
    "Encoder",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$msgpack$2b$msgpack$40$3$2e$1$2e$3$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$esm$2f$Encoder$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Encoder"],
    "ExtData",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$msgpack$2b$msgpack$40$3$2e$1$2e$3$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$esm$2f$ExtData$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ExtData"],
    "ExtensionCodec",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$msgpack$2b$msgpack$40$3$2e$1$2e$3$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$esm$2f$ExtensionCodec$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ExtensionCodec"],
    "decode",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$msgpack$2b$msgpack$40$3$2e$1$2e$3$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$esm$2f$decode$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["decode"],
    "decodeArrayStream",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$msgpack$2b$msgpack$40$3$2e$1$2e$3$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$esm$2f$decodeAsync$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["decodeArrayStream"],
    "decodeAsync",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$msgpack$2b$msgpack$40$3$2e$1$2e$3$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$esm$2f$decodeAsync$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["decodeAsync"],
    "decodeMulti",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$msgpack$2b$msgpack$40$3$2e$1$2e$3$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$esm$2f$decode$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["decodeMulti"],
    "decodeMultiStream",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$msgpack$2b$msgpack$40$3$2e$1$2e$3$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$esm$2f$decodeAsync$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["decodeMultiStream"],
    "decodeTimestampExtension",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$msgpack$2b$msgpack$40$3$2e$1$2e$3$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$esm$2f$timestamp$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["decodeTimestampExtension"],
    "decodeTimestampToTimeSpec",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$msgpack$2b$msgpack$40$3$2e$1$2e$3$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$esm$2f$timestamp$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["decodeTimestampToTimeSpec"],
    "encode",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$msgpack$2b$msgpack$40$3$2e$1$2e$3$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$esm$2f$encode$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["encode"],
    "encodeDateToTimeSpec",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$msgpack$2b$msgpack$40$3$2e$1$2e$3$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$esm$2f$timestamp$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["encodeDateToTimeSpec"],
    "encodeTimeSpecToTimestamp",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$msgpack$2b$msgpack$40$3$2e$1$2e$3$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$esm$2f$timestamp$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["encodeTimeSpecToTimestamp"],
    "encodeTimestampExtension",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$msgpack$2b$msgpack$40$3$2e$1$2e$3$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$esm$2f$timestamp$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["encodeTimestampExtension"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$msgpack$2b$msgpack$40$3$2e$1$2e$3$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@msgpack+msgpack@3.1.3/node_modules/@msgpack/msgpack/dist.esm/index.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$msgpack$2b$msgpack$40$3$2e$1$2e$3$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$esm$2f$encode$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@msgpack+msgpack@3.1.3/node_modules/@msgpack/msgpack/dist.esm/encode.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$msgpack$2b$msgpack$40$3$2e$1$2e$3$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$esm$2f$decode$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@msgpack+msgpack@3.1.3/node_modules/@msgpack/msgpack/dist.esm/decode.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$msgpack$2b$msgpack$40$3$2e$1$2e$3$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$esm$2f$decodeAsync$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@msgpack+msgpack@3.1.3/node_modules/@msgpack/msgpack/dist.esm/decodeAsync.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$msgpack$2b$msgpack$40$3$2e$1$2e$3$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$esm$2f$Decoder$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@msgpack+msgpack@3.1.3/node_modules/@msgpack/msgpack/dist.esm/Decoder.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$msgpack$2b$msgpack$40$3$2e$1$2e$3$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$esm$2f$DecodeError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@msgpack+msgpack@3.1.3/node_modules/@msgpack/msgpack/dist.esm/DecodeError.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$msgpack$2b$msgpack$40$3$2e$1$2e$3$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$esm$2f$Encoder$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@msgpack+msgpack@3.1.3/node_modules/@msgpack/msgpack/dist.esm/Encoder.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$msgpack$2b$msgpack$40$3$2e$1$2e$3$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$esm$2f$ExtensionCodec$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@msgpack+msgpack@3.1.3/node_modules/@msgpack/msgpack/dist.esm/ExtensionCodec.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$msgpack$2b$msgpack$40$3$2e$1$2e$3$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$esm$2f$ExtData$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@msgpack+msgpack@3.1.3/node_modules/@msgpack/msgpack/dist.esm/ExtData.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$msgpack$2b$msgpack$40$3$2e$1$2e$3$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$esm$2f$timestamp$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@msgpack+msgpack@3.1.3/node_modules/@msgpack/msgpack/dist.esm/timestamp.mjs [app-client] (ecmascript)");
}),
]);

//# sourceMappingURL=83b48_%40msgpack_msgpack_dist_esm_a44ac3b2._.js.map