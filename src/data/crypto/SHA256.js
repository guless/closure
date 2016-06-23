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
import { SHA256_PRIME_TABLE } from "../tables/SHA256PrimeTable";
import copy       from "../utils/copy";
import swap32     from "../utils/swap32";

const H1 = 0x6A09E667;
const H2 = 0xBB67AE85;
const H3 = 0x3C6EF372;
const H4 = 0xA54FF53A;
const H5 = 0x510E527F;
const H6 = 0x9B05688C;
const H7 = 0x1F83D9AB;
const H8 = 0x5BE0CD19;

const PADDING = new Uint8Array([
    0x80, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
]);

const APPENDIX = new Uint8Array([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
]);

const W = new Uint32Array(80);

function ADDTOLENGTH( R, H, L ) { R[1] += L; R[0] += H + (R[1] < L); }

function CH ( x, y, z ) { return ((x & y) ^ (~x & z)); }
function MAJ( x, y, z ) { return ((x & y) ^ (x & z) ^ (y & z)); }

function SIGMA10( n ) { return ((n >>>  7 | n << 25) ^ (n >>> 18 | n << 14) ^ (n >>>  3)); }
function SIGMA11( n ) { return ((n >>> 17 | n << 15) ^ (n >>> 19 | n << 13) ^ (n >>> 10)); }
function SIGMA20( n ) { return ((n >>>  2 | n << 30) ^ (n >>> 13 | n << 19) ^ (n >>> 22 | n << 10)); }
function SIGMA21( n ) { return ((n >>>  6 | n << 26) ^ (n >>> 11 | n << 21) ^ (n >>> 25 | n <<  7)); }

export default class SHA256 extends Streamable {
    // bash: arr=([0]="a" [1]="abc" [2]="Secure Hash Algorithm")
    // for item in ${arr[*]}; do echo -n $item | openssl dgst -hex -sha256; done;
    constructor() {
        super(new Uint8Array(64));
        
        this._length = new Uint32Array(2);
        this._digest = new Uint32Array([ H1, H2, H3, H4, H5, H6, H7, H8 ]);
    }
    
    reset() {
        super.reset();
        
        this._length[0] = this._length[1] = 0;
        this._digest[0] = H1;
        this._digest[1] = H2;
        this._digest[2] = H3;
        this._digest[3] = H4;
        this._digest[4] = H5;
        this._digest[5] = H6;
        this._digest[6] = H7;
        this._digest[7] = H8;
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
        
        if ( offset < 56 ) {
            copy(new Uint8Array(this._length.buffer), buffer, 56);
            
            this._transfrom(buffer);
        }
        
        else {
            copy(new Uint8Array(this._length.buffer), APPENDIX, 56);

            this._transfrom(buffer);
            this._transfrom(APPENDIX);
        }
        
        for ( var i = 0; i < this._digest.length; ++i ) {
            this._digest[i] = swap32(this._digest[i]);
        }

        return this._digest;
    }
    
    _transfrom( bytes ) {
        for ( var start = 0, dataview = new DataView(bytes.buffer, bytes.byteOffset); start + 64 <= bytes.length; start += 64 ) {
            for ( var t = 0; t < 16; ++t ) {
                W[t] = dataview.getUint32(start + 4 * t, false);
            }
            
            for ( var t = 16; t < 80; ++t ) {
                W[t] = SIGMA11(W[t - 2]) + W[t - 7] + SIGMA10(W[t - 15]) + W[t - 16];
            }
            
            var T1 = 0;
            var T2 = 0;
            
            var A = this._digest[0];
            var B = this._digest[1];
            var C = this._digest[2];
            var D = this._digest[3];
            var E = this._digest[4];
            var F = this._digest[5];
            var G = this._digest[6];
            var H = this._digest[7];
            
            for ( var t = 0; t < 64; ++t ) {
                T1 = H + SIGMA21(E) + CH(E, F, G) + SHA256_PRIME_TABLE[t] + W[t];
                T2 = SIGMA20(A) + MAJ(A, B, C);
                H = G;
                G = F;
                F = E;
                E = D + T1;
                D = C;
                C = B;
                B = A;
                A = T1 + T2;
            }
            
            this._digest[0] += A;
            this._digest[1] += B;
            this._digest[2] += C;
            this._digest[3] += D;
            this._digest[4] += E;
            this._digest[5] += F;
            this._digest[6] += G;
            this._digest[7] += H;
        }
    }
}