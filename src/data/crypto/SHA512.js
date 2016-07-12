/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2016 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 1.0.0 | http://apidev.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
///                                              }|
///                                              }|
///                                              }|     　 へ　　　 ／|    
///      _______     _______         ______      }|      /　│　　 ／ ／
///     /  ___  |   |_   __ \      .' ____ '.    }|     │　Z ＿,＜　／　　 /`ヽ
///    |  (__ \_|     | |__) |     | (____) |    }|     │　　　　　ヽ　　 /　　〉
///     '.___`-.      |  __ /      '_.____. |    }|      Y　　　　　`　 /　　/
///    |`\____) |    _| |  \ \_    | \____| |    }|    ｲ●　､　●　　⊂⊃〈　　/
///    |_______.'   |____| |___|    \______,'    }|    ()　 v　　　　|　＼〈
///    |=========================================\|    　>ｰ ､_　 ィ　 │ ／／
///    |> LESS IS MORE                           ||     / へ　　 /　ﾉ＜|＼＼
///    `=========================================/|    ヽ_ﾉ　　(_／　 │／／
///                                              }|     7　　　　　　  |／
///                                              }|     ＞―r￣￣`ｰ―＿`
///                                              }|
///                                              }|
/// Permission is hereby granted, free of charge, to any person obtaining a copy
/// of this software and associated documentation files (the "Software"), to deal
/// in the Software without restriction, including without limitation the rights
/// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
/// copies of the Software, and to permit persons to whom the Software is
/// furnished to do so, subject to the following conditions:
///
/// The above copyright notice and this permission notice shall be included in all
/// copies or substantial portions of the Software.
///
/// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
/// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
/// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
/// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
/// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
/// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
/// THE SOFTWARE.
import Hash    from "./Hash";
import swap128 from "../utils/swap128";
import { SHA512_PRIME_TABLE } from "../tables/SHA512PrimeTable";

const H = new Uint32Array([
    0x6A09E667, 0xF3BCC908, 0xBB67AE85, 0x84CAA73B, 
    0x3C6EF372, 0xFE94F82B, 0xA54FF53A, 0x5F1D36F1,
    0x510E527F, 0xADE682D1, 0x9B05688C, 0x2B3E6C1F,
    0x1F83D9AB, 0xFB41BD6B, 0x5BE0CD19, 0x137E2179
]);

const P = new Uint32Array(128); P[0] = 0x80;
const A = new Uint32Array(128);
const W = new Uint32Array(160);
const L = new Uint32Array(4);
const C = new Uint32Array(3);
const T = new Uint32Array(2);
const S = new Uint32Array(16);

const ROTR_T1 = new Uint32Array(2);
const ROTR_T2 = new Uint32Array(2);

const SIGMA10_T1 = new Uint32Array(2);
const SIGMA10_T2 = new Uint32Array(2);
const SIGMA10_T3 = new Uint32Array(2);

const SIGMA11_T1 = new Uint32Array(2);
const SIGMA11_T2 = new Uint32Array(2);
const SIGMA11_T3 = new Uint32Array(2);

const SIGMA20_T1 = new Uint32Array(2);
const SIGMA20_T2 = new Uint32Array(2);
const SIGMA20_T3 = new Uint32Array(2);

const SIGMA21_T1 = new Uint32Array(2);
const SIGMA21_T2 = new Uint32Array(2);
const SIGMA21_T3 = new Uint32Array(2);

function AC ( R, s ) { 
    C[0]  = R[1]; C[1] = R[2]; C[2] = s << 3 >>> 0; 
    R[0] += C[2]; R[1] += (s >>> 29) + (R[0] < C[2]); R[2] += R[1] < C[0]; R[3] += R[2] < C[1]; 
}

function CH ( R, x, i, y, j, z, k ) { 
    R[0] = ((x[i] & y[j]) ^ (~x[i] & z[k]));
    R[1] = ((x[i + 1] & y[j + 1]) ^ (~x[i + 1] & z[k + 1]));
}

function MAJ( R, x, i, y, j, z, k ) { 
    R[0] = ((x[i] & y[j]) ^ (x[i] & z[k]) ^ (y[j] & z[k]));
    R[1] = ((x[i + 1] & y[j + 1]) ^ (x[i + 1] & z[k + 1]) ^ (y[j + 1] & z[k + 1]));
}

function SHR( R, bits, w, i ) {
    R[0] = (bits < 32 && bits >= 0) ? w[i] >>> bits : 0;
    R[1] = (bits > 32 ? w[i] >>> (bits - 32) : bits == 32 ? w[i] : bits >= 0 ? (w[i] << (32 - bits)) | (w[i + 1] >>> bits) : 0);
}

function SHL( R, bits, w, i ) {
    R[0] = (bits > 32 ? w[i + 1] << (bits - 32) : bits == 32 ? w[i + 1] : bits >= 0 ? (w[i] << bits) | (w[i + 1] >>> (32 - bits)) : 0);
    R[1] = (bits < 32 && bits >= 0) ? w[i + 1] << bits : 0;
}

function ADD( R, i, y, j ) {
    R[i + 1] += y[j + 1];
    R[i] += y[j] + (R[i + 1] < y[j + 1]);
}

function MOV( R, i, y, j ) {
    R[i] = y[j];
    R[i + 1] = y[j + 1];
}

function ROTR( R, bits, w, i ) {
    SHR(ROTR_T1, bits, w, i);
    SHL(ROTR_T2, 64 - bits, w, i);
    
    R[0] = ROTR_T1[0] | ROTR_T2[0];
    R[1] = ROTR_T1[1] | ROTR_T2[1];
}

function SIGMA10( R, w, i ) {
    ROTR(SIGMA10_T1, 1, w, i);
    ROTR(SIGMA10_T2, 8, w, i);
    SHR (SIGMA10_T3, 7, w, i);
    
    R[0] = SIGMA10_T1[0] ^ SIGMA10_T2[0] ^ SIGMA10_T3[0];
    R[1] = SIGMA10_T1[1] ^ SIGMA10_T2[1] ^ SIGMA10_T3[1];
}

function SIGMA11( R, w, i ) {
    ROTR(SIGMA11_T1, 19, w, i);
    ROTR(SIGMA11_T2, 61, w, i);
    SHR (SIGMA11_T3,  6, w, i);
    
    R[0] = SIGMA11_T1[0] ^ SIGMA11_T2[0] ^ SIGMA11_T3[0];
    R[1] = SIGMA11_T1[1] ^ SIGMA11_T2[1] ^ SIGMA11_T3[1];
}

function SIGMA20( R, w, i ) {
    ROTR(SIGMA20_T1, 28, w, i);
    ROTR(SIGMA20_T2, 34, w, i);
    ROTR(SIGMA20_T3, 39, w, i);
    
    R[0] = SIGMA20_T1[0] ^ SIGMA20_T2[0] ^ SIGMA20_T3[0];
    R[1] = SIGMA20_T1[1] ^ SIGMA20_T2[1] ^ SIGMA20_T3[1];
}

function SIGMA21( R, w, i ) {
    ROTR(SIGMA21_T1, 14, w, i);
    ROTR(SIGMA21_T2, 18, w, i);
    ROTR(SIGMA21_T3, 41, w, i);
    
    R[0] = SIGMA21_T1[0] ^ SIGMA21_T2[0] ^ SIGMA21_T3[0];
    R[1] = SIGMA21_T1[1] ^ SIGMA21_T2[1] ^ SIGMA21_T3[1];
}

export default class SHA512 extends Hash {
    constructor( initValues = H ) {
        super(new Uint8Array(128));
        this._values = initValues;
        this._digest = new Uint32Array(this._values);
        this._length = new Uint32Array(L);
    }
    
    reset() {
        super.reset();
        this._digest.set(this._values);
        this._length.set(L);
    }
    
    update( bytes ) {
        super.update(bytes);
        AC(this._length, bytes.length);
    }
    
    final() {
        this.buffer.set(P.subarray(0, this.remain), this.offset);
        
        if ( this.offset < 112 ) {
            this.buffer.set(new Uint8Array(swap128(this._length).buffer), 112);
            this._transfrom(this.buffer);
        }
        
        else {
            A.set(new Uint8Array(swap128(this._length).buffer), 112);
            this._transfrom(this.buffer);
            this._transfrom(A);
        }
        
        return this._digest;
    }
    
    _transfrom( bytes ) {
        for ( var start = 0; start + 128 <= bytes.length; start += 128 ) {
            for ( var t = 0, k = start; t < 32; ++t, k += 4 ) {
                W[t] = (bytes[k] << 24) | (bytes[k + 1] << 16) | (bytes[k + 2] << 8) | (bytes[k + 3]);
            }
            
            for ( var t = 32; t < 160; t += 2 ) { 
                W[t] = W[t - 14];
                W[t + 1] = W[t - 13];
                
                ADD(W, t, W, t - 32);
                
                SIGMA11(T, W, t -  4); 
                ADD(W, t, T, 0);
                
                SIGMA10(T, W, t - 30); 
                ADD(W, t, T, 0);
            }
            
            S.set(this._digest);
            
            for ( var t = 0; t < 160; t += 2 ) {
                ADD(W, t, S, 14);
                ADD(W, t, SHA512_PRIME_TABLE, t);
                
                SIGMA21(T, S, 8); 
                ADD(W, t, T, 0);
                
                CH(T, S, 8, S, 10, S, 12);
                ADD(W, t, T, 0);
                
                ADD(S, 6, W, t);
                
                SIGMA20(T, S, 0);
                ADD(W, t, T, 0);
                
                MAJ(T, S, 0, S, 2, S, 4);
                ADD(W, t, T, 0);
                
                S[14] = S[12];
                S[15] = S[13];
                S[12] = S[10];
                S[13] = S[11];
                S[10] = S[ 8];
                S[11] = S[ 9];
                S[ 8] = S[ 6];
                S[ 9] = S[ 7];
                S[ 6] = S[ 4];
                S[ 7] = S[ 5];
                S[ 4] = S[ 2];
                S[ 5] = S[ 3];
                S[ 2] = S[ 0];
                S[ 3] = S[ 1];
                S[ 0] = W[t ];
                S[ 1] = W[t + 1];
            }
            
            ADD(this._digest,  0, S,  0);
            ADD(this._digest,  2, S,  2);
            ADD(this._digest,  4, S,  4);
            ADD(this._digest,  6, S,  6);
            ADD(this._digest,  8, S,  8);
            ADD(this._digest, 10, S, 10);
            ADD(this._digest, 12, S, 12);
            ADD(this._digest, 14, S, 14);
        }
    }
}