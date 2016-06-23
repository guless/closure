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
import Streamable from "../core/Streamable";
import { SHA512_PRIME_TABLE } from "../tables/SHA512PrimeTable";
import copy       from "../utils/copy";
import swap32     from "../utils/swap32";

const H1_0 = 0x6A09E667;
const H1_1 = 0xF3BCC908;
const H2_0 = 0xBB67AE85;
const H2_1 = 0x84CAA73B;
const H3_0 = 0x3C6EF372;
const H3_1 = 0xFE94F82B;
const H4_0 = 0xA54FF53A;
const H4_1 = 0x5F1D36F1;
const H5_0 = 0x510E527F;
const H5_1 = 0xADE682D1;
const H6_0 = 0x9B05688C;
const H6_1 = 0x2B3E6C1F;
const H7_0 = 0x1F83D9AB;
const H7_1 = 0xFB41BD6B;
const H8_0 = 0x5BE0CD19;
const H8_1 = 0x137E2179;

const PADDING = new Uint8Array([
    0x80, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
]);

const APPENDIX = new Uint8Array([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
]);

const W = new Uint32Array(160);
const S = new Uint32Array(16);
const T = new Uint32Array(4);
const U = new Uint32Array(2);
const V = new Uint32Array(2);

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

const ATL = new Uint32Array(2);

function ADDTOLENGTH( R, H, L ) {
    ATL[0] = R[2];
    ATL[1] = R[1];
    
    R[3] += L;
    R[2] += H + (R[3] < L);
    R[1] += R[2] < ATL[0];
    R[0] += R[1] < ATL[1];
}

function CH( R, x, i, y, j, z, k ) { 
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

function ADDTO( x, i, y, j ) {
    x[i + 1] += y[j + 1];
    x[i] += y[j] + (x[i + 1] < y[j + 1]);
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

export default class SHA512 extends Streamable {
    // bash: arr=([0]="a" [1]="abc" [2]="Secure Hash Algorithm")
    // for item in ${arr[*]}; do echo -n $item | openssl dgst -hex -sha512; done;
    constructor() {
        super(new Uint8Array(128));
        
        this._length = new Uint32Array(4);
        this._digest = new Uint32Array([ H1_0, H1_1, H2_0, H2_1, H3_0, H3_1, H4_0, H4_1, H5_0, H5_1, H6_0, H6_1, H7_0, H7_1, H8_0, H8_1 ]);
    }
    
    reset() {
        super.reset();
        
        this._length[0]  = this._length[1] = 0;
        this._length[2]  = this._length[3] = 0;
        this._digest[ 0] = H1_0;
        this._digest[ 1] = H1_1;
        this._digest[ 2] = H2_0;
        this._digest[ 3] = H2_1;
        this._digest[ 4] = H3_0;
        this._digest[ 5] = H3_1;
        this._digest[ 6] = H4_0;
        this._digest[ 7] = H4_1;
        this._digest[ 8] = H5_0;
        this._digest[ 9] = H5_1;
        this._digest[10] = H6_0;
        this._digest[11] = H6_1;
        this._digest[12] = H7_0;
        this._digest[13] = H7_1;
        this._digest[14] = H8_0;
        this._digest[15] = H8_1;
    }
    
    update( bytes ) {
        ADDTOLENGTH(this._length, bytes.length >>> 29, bytes.length << 3 >>> 0);
        super.update(bytes);
    }
    
    final() {
        var buffer = this._buffer.buffer;
        var offset = this._buffer.offset;

        copy(PADDING, buffer, offset);
        
        this._length[0] = swap32(this._length[0]);
        this._length[1] = swap32(this._length[1]);
        this._length[2] = swap32(this._length[2]);
        this._length[3] = swap32(this._length[3]);
        
        if ( offset < 112 ) {
            copy(new Uint8Array(this._length.buffer), buffer, 112);
            
            this._transfrom(buffer);
        }
        
        else {
            copy(new Uint8Array(this._length.buffer), APPENDIX, 112);

            this._transfrom(buffer);
            this._transfrom(APPENDIX);
        }
        
        for ( var i = 0; i < this._digest.length; ++i ) {
            this._digest[i] = swap32(this._digest[i]);
        }

        return this._digest;
    }
    
    _transfrom( bytes ) {
        for ( var start = 0, dataview = new DataView(bytes.buffer, bytes.byteOffset); start + 128 <= bytes.length; start += 128 ) {
            for ( var t = 0; t < 32; ++t ) {
                W[t] = dataview.getUint32(start + 4 * t, false);
            }
            
            for ( var t = 32; t < 160; t += 2 ) {
                SIGMA11(U, W, t - 4);
                SIGMA10(V, W, t - 30);
                
                ADDTO(U, 0, V, 0);
                ADDTO(U, 0, W, t - 14);
                ADDTO(U, 0, W, t - 32);
                
                W[t] = U[0];
                W[t + 1] = U[1];
            }
            
            copy(this._digest, S);
            
            for ( var t = 0; t < 160; t += 2 ) {
                T[0] = T[1] = T[2] = T[3] = 0;
                
                SIGMA21(U, S, 8);
                CH(V, S, 8, S, 10, S, 12);
                
                ADDTO(T, 0, S, 14);
                ADDTO(T, 0, U, 0);
                ADDTO(T, 0, V, 0);
                ADDTO(T, 0, SHA512_PRIME_TABLE, t);
                ADDTO(T, 0, W, t);
                
                SIGMA20(U, S, 0);
                MAJ(V, S, 0, S, 2, S, 4);
                
                ADDTO(T, 2, U, 0);
                ADDTO(T, 2, V, 0);
                
                S[14] = S[12];
                S[15] = S[13];
                S[12] = S[10];
                S[13] = S[11];
                S[10] = S[ 8];
                S[11] = S[ 9];
                
                ADDTO(S, 6, T, 0);
                
                S[ 8] = S[ 6];
                S[ 9] = S[ 7];
                S[ 6] = S[ 4];
                S[ 7] = S[ 5];
                S[ 4] = S[ 2];
                S[ 5] = S[ 3];
                S[ 2] = S[ 0];
                S[ 3] = S[ 1];
                
                ADDTO(T, 0, T, 2);
                
                S[ 0] = T[ 0];
                S[ 1] = T[ 1];
            }
            
            ADDTO(this._digest,  0, S,  0);
            ADDTO(this._digest,  2, S,  2);
            ADDTO(this._digest,  4, S,  4);
            ADDTO(this._digest,  6, S,  6);
            ADDTO(this._digest,  8, S,  8);
            ADDTO(this._digest, 10, S, 10);
            ADDTO(this._digest, 12, S, 12);
            ADDTO(this._digest, 14, S, 14);
        }
    }
}