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
import assert from "../src/core/assert";
import CRC1 from "../src/data/crypto/CRC1";
import CRC8 from "../src/data/crypto/CRC8";
import CRC8Dallas1Wire from "../src/data/crypto/CRC8Dallas1Wire";
import CRC16 from "../src/data/crypto/CRC16";
import CRC16CCITT from "../src/data/crypto/CRC16CCITT";
import CRC16Kermit from "../src/data/crypto/CRC16Kermit";
import CRC16ModBus from "../src/data/crypto/CRC16ModBus";
import CRC16XModem from "../src/data/crypto/CRC16XModem";
import CRC24 from "../src/data/crypto/CRC24";
import CRC32 from "../src/data/crypto/CRC32";
import ascii from "../src/data/utils/ascii";
import strof from "../src/data/utils/strof";
import passlog from "./helper/passlog";

export default function () {
    console.log("[Start 'CRC1,CRC8,CRC16,CRC24,CRC32' Test Suite]:");
    
    test_crc1("", 0);
    test_crc1("0123456789", 13);
    test_crc1("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", 11);
    
    test_crc8("", 0);
    test_crc8("0123456789", 69);
    test_crc8("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", 38);
    
    test_crc8_dallas_1_wire("", 0);
    test_crc8_dallas_1_wire("0123456789", 117);
    test_crc8_dallas_1_wire("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", 97);
    
    test_crc16("", 0);
    test_crc16("0123456789", 17469);
    test_crc16("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", 22452);
    
    test_crc16_ccitt("", 65535);
    test_crc16_ccitt("0123456789", 32097);
    test_crc16_ccitt("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", 46187);
    
    test_crc16_kermit("", 0);
    test_crc16_kermit("0123456789", 24430);
    test_crc16_kermit("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", 55253);
    
    test_crc16_modbus("", 65535);
    test_crc16_modbus("0123456789", 17229);
    test_crc16_modbus("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", 64693);
    
    test_crc16_xmodem("", 0);
    test_crc16_xmodem("0123456789", 40024);
    test_crc16_xmodem("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", 32176);
    
    test_crc24("", 11994318);
    test_crc24("0123456789", 13668003);
    test_crc24("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", 4612813);
    
    test_crc32("", 0);
    test_crc32("0123456789", 2793719750);
    test_crc32("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", 532866770);
}

function test_crc1( input, expect ) {
    var crcapi = new CRC1();
    
    crcapi.update( ascii(input) );
    var result = crcapi.final();
    
    assert(result === expect, "CRC1 does not match." + ` { input="${input}", expect=${expect}, result=${result} }`);
    passlog(`"${input}"`, `${result}(0x${result.toString(16)}) [crc1]`);
}

function test_crc8( input, expect ) {
    var crcapi = new CRC8();
    
    crcapi.update( ascii(input) );
    var result = crcapi.final();
    
    assert(result === expect, "CRC8 does not match." + ` { input="${input}", expect=${expect}, result=${result} }`);
    passlog(`"${input}"`, `${result}(0x${result.toString(16)}) [crc8]`);
}

function test_crc8_dallas_1_wire( input, expect ) {
    var crcapi = new CRC8Dallas1Wire();
    
    crcapi.update( ascii(input) );
    var result = crcapi.final();
    
    assert(result === expect, "CRC8_dallas_1_wire does not match." + ` { input="${input}", expect=${expect}, result=${result} }`);
    passlog(`"${input}"`, `${result}(0x${result.toString(16)}) [crc8-dallas-1-wire]`);
}

function test_crc16( input, expect ) {
    var crcapi = new CRC16();
    
    crcapi.update( ascii(input) );
    var result = crcapi.final();
    
    assert(result === expect, "CRC16 does not match." + ` { input="${input}", expect=${expect}, result=${result} }`);
    passlog(`"${input}"`, `${result}(0x${result.toString(16)}) [crc16]`);
}

function test_crc16_ccitt( input, expect ) {
    var crcapi = new CRC16CCITT();
    
    crcapi.update( ascii(input) );
    var result = crcapi.final();
    
    assert(result === expect, "CRC16_ccitt does not match." + ` { input="${input}", expect=${expect}, result=${result} }`);
    passlog(`"${input}"`, `${result}(0x${result.toString(16)}) [crc16-ccitt]`);
}

function test_crc16_kermit( input, expect ) {
    var crcapi = new CRC16Kermit();
    
    crcapi.update( ascii(input) );
    var result = crcapi.final();
    
    assert(result === expect, "CRC16_kermit does not match." + ` { input="${input}", expect=${expect}, result=${result} }`);
    passlog(`"${input}"`, `${result}(0x${result.toString(16)}) [crc16-kermit]`);
}

function test_crc16_modbus( input, expect ) {
    var crcapi = new CRC16ModBus();
    
    crcapi.update( ascii(input) );
    var result = crcapi.final();
    
    assert(result === expect, "CRC16_modbus does not match." + ` { input="${input}", expect=${expect}, result=${result} }`);
    passlog(`"${input}"`, `${result}(0x${result.toString(16)}) [crc16-modbus]`);
}

function test_crc16_xmodem( input, expect ) {
    var crcapi = new CRC16XModem();
    
    crcapi.update( ascii(input) );
    var result = crcapi.final();
    
    assert(result === expect, "CRC16_xmodem does not match." + ` { input="${input}", expect=${expect}, result=${result} }`);
    passlog(`"${input}"`, `${result}(0x${result.toString(16)}) [crc16-xmodem]`);
}

function test_crc24( input, expect ) {
    var crcapi = new CRC24();
    
    crcapi.update( ascii(input) );
    var result = crcapi.final();
    
    assert(result === expect, "CRC24 does not match." + ` { input="${input}", expect=${expect}, result=${result} }`);
    passlog(`"${input}"`, `${result}(0x${result.toString(16)}) [crc24]`);
}

function test_crc32( input, expect ) {
    var crcapi = new CRC32();
    
    crcapi.update( ascii(input) );
    var result = crcapi.final();
    
    assert(result === expect, "CRC32 does not match." + ` { input="${input}", expect=${expect}, result=${result} }`);
    passlog(`"${input}"`, `${result}(0x${result.toString(16)}) [crc32]`);
}
