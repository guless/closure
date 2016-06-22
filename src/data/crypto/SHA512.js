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
        this._digest[2 ] = H2_0;
        this._digest[3 ] = H2_1;
        this._digest[4 ] = H3_0;
        this._digest[5 ] = H3_1;
        this._digest[6 ] = H4_0;
        this._digest[7 ] = H4_1;
        this._digest[8 ] = H5_0;
        this._digest[9 ] = H5_1;
        this._digest[10] = H6_0;
        this._digest[11] = H6_1;
        this._digest[12] = H7_0;
        this._digest[13] = H7_1;
        this._digest[14] = H8_0;
        this._digest[15] = H8_1;
    }
    
    update( bytes ) {
        var L = bytes.length << 3 >>> 0;
        var H = bytes.length >>> 29;
        var U = this._length[0];
        var V = this._length[1];
        
        this._length[0] += L;
        this._length[1] += H + (this._length[0] < U); U = this._length[2];
        this._length[2] += (this._length[1] < V);
        this._length[3] += (this._length[2] < U);
        
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
        
        this._length[0] ^= this._length[3];
        this._length[3] ^= this._length[0];
        this._length[0] ^= this._length[3];
        
        this._length[1] ^= this._length[2];
        this._length[2] ^= this._length[1];
        this._length[1] ^= this._length[2];
        
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
        var dataview = new DataView(bytes.buffer, bytes.byteOffset);
        
        for ( var start = 0; start + 128 <= bytes.length; start += 128 ) {
            for ( var t = 0; t < 32; ++t ) {
                W[t] = dataview.getUint32(start + 4 * t, false);
            }
            
            // for (t = 16; t < 80; t++)
            //     W[t] = SHA512_sigma1(W[t-2]) + W[t-7] +
            //         SHA512_sigma0(W[t-15]) + W[t-16];

            // A = context->Intermediate_Hash[0];
            // B = context->Intermediate_Hash[1];
            // C = context->Intermediate_Hash[2];
            // D = context->Intermediate_Hash[3];
            // E = context->Intermediate_Hash[4];
            // F = context->Intermediate_Hash[5];
            // G = context->Intermediate_Hash[6];
            // H = context->Intermediate_Hash[7];

            // for (t = 0; t < 80; t++) {
            //     temp1 = H + SHA512_SIGMA1(E) + SHA_Ch(E,F,G) + K[t] + W[t];
            //     temp2 = SHA512_SIGMA0(A) + SHA_Maj(A,B,C);
            //     H = G;
            //     G = F;
            //     F = E;
            //     E = D + temp1;
            //     D = C;
            //     C = B;
            //     B = A;
            //     A = temp1 + temp2;
            // }

            // context->Intermediate_Hash[0] += A;
            // context->Intermediate_Hash[1] += B;
            // context->Intermediate_Hash[2] += C;
            // context->Intermediate_Hash[3] += D;
            // context->Intermediate_Hash[4] += E;
            // context->Intermediate_Hash[5] += F;
            // context->Intermediate_Hash[6] += G;
            // context->Intermediate_Hash[7] += H;
        }
    }
}