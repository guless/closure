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
import UTF8Spec from "../test/UTF8Spec";
import Base16Spec from "../test/Base16Spec";
import Base32Spec from "../test/Base32Spec";
import Base64Spec from "../test/Base64Spec";
import MD2Spec from "../test/MD2Spec";
import MD4Spec from "../test/MD4Spec";
import MD5Spec from "../test/MD5Spec";
import SHA1Spec from "../test/SHA1Spec";
import SHA0Spec from "../test/SHA0Spec";
import SHA224Spec from "../test/SHA224Spec";
import SHA256Spec from "../test/SHA256Spec";
import SHA512Spec from "../test/SHA512Spec";
import SHA384Spec from "../test/SHA384Spec";
import CRCSpec from "../test/CRCSpec";

var clc = require("cli-color");
var testSuite = [];
var errorCount = 0;

testSuite.push( 
    UTF8Spec,
    Base16Spec,
    Base32Spec,
    Base64Spec,
    MD2Spec,
    MD4Spec,
    MD5Spec,
    SHA0Spec,
    SHA1Spec,
    SHA224Spec,
    SHA256Spec,
    SHA384Spec,
    SHA512Spec,
    CRCSpec
);

for ( var i = 0; i < testSuite.length; ++i ) {
    try {
        testSuite[i]();
    }
    catch( e ) {
        ++errorCount;
        console.log(clc.red("\n" + e.stack));
    }
    
    console.log("");
}

console.log(`Total: ${clc.cyan("(" + testSuite.length + ")")}, Error: ${clc.red("(" + errorCount + ")")}, Passed: ${clc.green("(" + (testSuite.length - errorCount) + ")")}`);

if ( errorCount > 0 ) {
    throw new Error("One or more error occurs, See more detail from the error log above.");
}